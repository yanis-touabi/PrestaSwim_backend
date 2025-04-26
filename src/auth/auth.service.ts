import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ChangePasswordDto,
  ResetPasswordDto,
  SignInDto,
  SignUpDto,
  SignUpServiceProviderDto,
  SignUpProfessionalDto,
  AddressDto,
} from './dto/auth.dto';
import { getTokens } from './utils/index';
import { FileUpload } from 'graphql-upload';
import { AccountStatus } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { FileUploadService } from 'src/common/services/file-upload.service';
import { GraphQLError } from 'graphql';
const saltOrRounds = 10;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
    private fileUploadService: FileUploadService,
  ) {}

  private async createUserAndAddress(
    userDetails: SignUpDto,
    addressDetails: AddressDto,
    avatar?: FileUpload,
  ) {
    try {
      // Check if user exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email: userDetails.email },
      });
      if (existingUser) {
        throw new GraphQLError('User already exists', {
          extensions: { code: 'CONFLICT', http: { status: 409 } },
        });
      }

      // Hash password
      const password = await bcrypt.hash(
        userDetails.password,
        saltOrRounds,
      );

      // Upload avatar if provided
      let avatarPath: string | null = null;
      if (avatar) {
        const filename = `avatar-${Date.now()}-${avatar.filename}`;
        avatarPath = await this.fileUploadService.uploadFile(
          avatar,
          'user',
          filename,
        );
      }

      // Create address first
      const address = await this.prisma.address.create({
        data: addressDetails,
      });

      if (!address) {
        throw new GraphQLError('Failed to create address', {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
            http: { status: 500 },
          },
        });
      }

      // Create user with address reference
      const user = await this.prisma.user.create({
        data: {
          ...userDetails,
          password,
          accountStatus: AccountStatus.ACTIVE,
          addressId: address.id,
          ...(avatarPath && { avatar: avatarPath }),
        },
      });

      if (!user) {
        throw new GraphQLError('Failed to create user', {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
            http: { status: 500 },
          },
        });
      }

      return { user, address };
    } catch (error) {
      console.error('Error in createUserAndAddress:', error);
      throw error instanceof GraphQLError
        ? error
        : new GraphQLError('Failed to create user and address', {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
              http: { status: 500 },
            },
          });
    }
  }

  async signup(signUpDto: SignUpDto, avatar: FileUpload) {
    const addressDto = {
      addressLine1: '',
      city: '',
      commune: '',
      country: '',
    } as AddressDto;

    const { user } = await this.createUserAndAddress(
      signUpDto,
      addressDto,
      avatar,
    );
    return user;
  }

  async signUpServiceProvider(
    signUpDto: SignUpServiceProviderDto,
    avatar?: FileUpload,
  ) {
    return this.prisma.$transaction(async (prisma) => {
      const { user, address } = await this.createUserAndAddress(
        signUpDto.userDetails,
        signUpDto.addressDetails,
        avatar,
      );

      const serviceProvider = await prisma.serviceProvider.create({
        data: {
          userId: user.id,
          ...signUpDto.serviceProviderDetails,
        },
      });

      if (!serviceProvider) {
        throw new GraphQLError('Failed to create service provider', {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
            http: { status: 500 },
          },
        });
      }

      return {
        user,
        address,
        serviceProvider,
      };
    });
  }

  async signUpProfessional(
    signUpDto: SignUpProfessionalDto,
    avatar?: FileUpload,
  ) {
    return this.prisma.$transaction(async (prisma) => {
      const { user, address } = await this.createUserAndAddress(
        signUpDto.userDetails,
        signUpDto.addressDetails,
        avatar,
      );

      const professional = await prisma.professional.create({
        data: {
          userId: user.id,
          ...signUpDto.professionalDetails,
        },
      });

      return {
        user,
        address,
        professional,
      };
    });
  }

  async signIn(signInDto: SignInDto) {
    try {
      // email, password
      const user = await this.prisma.user.findUnique({
        where: {
          email: signInDto.email,
        },
      });

      if (!user) {
        throw new GraphQLError('User Not Found');
      }

      if (user.accountStatus !== 'ACTIVE') {
        return new GraphQLError(
          'Account is not active or suspended',
          {
            extensions: {
              code: 'FORBIDDEN',
              http: { status: 403 },
            },
          },
        );
      }

      const isMatch = await bcrypt.compare(
        signInDto.password,
        user.password,
      );

      if (!isMatch) {
        return new GraphQLError("email or password doesn't match");
      }

      const { password, ...userWithoutPassword } = user;

      // hna t3ayet la function ta3ek
      const value = await getTokens(
        userWithoutPassword,
        this.prisma,
        this.jwtService,
      );

      return value;
    } catch (error) {
      console.error('Error in signIn:', error);
      throw error;
    }
  }

  async logout(userId: number, tokenId?: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user) {
        throw new GraphQLError('User Not Found');
      }
      await this.prisma.token.deleteMany({
        where: {
          id: tokenId,
        },
      });
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          isLoggedIn: false,
          login: false,
        },
      });
      return {
        status: 200,
        message: 'Logout Successfully',
        success: true,
      };
    } catch (error) {
      console.error('Error in logout:', error);
      throw error;
    }
  }

  async resetPassword({ email }: ResetPasswordDto) {
    try {
      // Find user by email
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new GraphQLError('User Not Found');
      }

      // Generate 6-digit verification code
      const code = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, '0');

      // Update the verificationCode field in the database
      await this.prisma.user.update({
        where: { email },
        data: { verificationCode: code },
      });

      // Send reset password email
      await this.mailService.sendResetPasswordEmail(
        email,
        'Reset your password',
        'reset-password',
        { code: code },
      );

      return {
        status: 200,
        message: `Code sent successfully to your email (${email})`,
        success: true,
      };
    } catch (error) {
      console.error('Error in logout:', error);
      throw error;
    }
  }

  async verifyCode({ email, code }: { email: string; code: string }) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
        select: {
          verificationCode: true,
        },
      });

      if (!user) {
        throw new GraphQLError('User Not Found');
      }

      if (user.verificationCode !== code) {
        throw new GraphQLError('Invalid code');
      }

      await this.prisma.user.update({
        where: {
          email,
        },
        data: {
          verificationCode: null,
        },
      });

      const payload = { email };

      // generate a experiment token
      const accessToken = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '5m',
      });

      return {
        status: 200,
        message:
          'Code verified successfully, proceed to change your password',
        success: true,
        expireToken: accessToken,
      };
    } catch (error) {
      console.error('Error in logout:', error);
      throw error;
    }
  }

  async changePassword(
    changePasswordData: ChangePasswordDto,
    email: string,
  ) {
    try {
      if (!email) {
        throw new GraphQLError(
          'time is down, please repeat the process',
        );
      }
      const user = await this.prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (!user) {
        throw new GraphQLError('User Not Found');
      }

      const password = await bcrypt.hash(
        changePasswordData.password,
        saltOrRounds,
      );

      await this.prisma.user.update({
        where: {
          email: email,
        },
        data: {
          password,
        },
      });

      return {
        status: 200,
        message: 'Password changed successfully, go to login',
        success: true,
      };
    } catch (error) {
      console.error('Error in logout:', error);
      throw error;
    }
  }
}
