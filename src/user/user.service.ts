import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  UpdateProfessionalDto,
  UpdateServiceProviderDto,
  UpdateUserDto,
} from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { AccountStatus } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { AuthService } from '../auth/auth.service';
import { FileUpload } from 'graphql-upload';
import { FileUploadService } from '../common/services/file-upload.service';
import * as bcrypt from 'bcrypt';
import { AddressDto } from 'src/auth/dto/auth.dto';
const saltOrRounds = 10;

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
    private fileUploadService: FileUploadService,
  ) {}

  //************************* FUNCTION FOR ADMIN **************************** */
  async getUserById(userId: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return new GraphQLError('User not found', {
          extensions: {
            code: 'NOT_FOUND',
            http: { status: 404 },
          },
        });
      }

      return user;
    } catch (error) {
      console.error('Error in getUserById:', error);
      if (error instanceof GraphQLError) {
        throw error;
      }
      throw new GraphQLError('Failed to fetch user', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
          http: { status: 500 },
        },
      });
    }
  }

  async getServiceProviderUserDetailsById(userId: number) {
    try {
      const user =
        await this.prisma.serviceProviderUserDetails.findUnique({
          where: { userId },
        });

      if (!user) {
        throw new GraphQLError('Service provider user not found', {
          extensions: {
            code: 'NOT_FOUND',
            http: { status: 404 },
          },
        });
      }
      return user;
    } catch (error) {
      console.error(
        'Error in getServiceProviderUserDetailsById:',
        error,
      );
      if (error instanceof GraphQLError) {
        throw error;
      }
      throw new GraphQLError(
        'Failed to fetch service provider user',
        {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
            http: { status: 500 },
          },
        },
      );
    }
  }

  async getProfessionalUserDetailsById(userId: number) {
    try {
      const user =
        await this.prisma.professionalUserDetails.findUnique({
          where: { userId },
        });

      if (!user) {
        throw new GraphQLError('Professional user not found', {
          extensions: {
            code: 'NOT_FOUND',
            http: { status: 404 },
          },
        });
      }
      return user;
    } catch (error) {
      console.error(
        'Error in getProfessionalUserDetailsById:',
        error,
      );
      if (error instanceof GraphQLError) {
        throw error;
      }
      throw new GraphQLError('Failed to fetch professional user', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
          http: { status: 500 },
        },
      });
    }
  }

  async getAllUsers() {
    try {
      return await this.prisma.user.findMany({
        include: {
          address: true,
        },
      });
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      throw new GraphQLError('Failed to fetch users', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
          http: { status: 500 },
        },
      });
    }
  }

  async getAllServiceProviders() {
    try {
      return await this.prisma.user.findMany({
        where: { role: 'PROVIDER' },
        include: {
          address: true,
          serviceProvider: true,
        },
      });
    } catch (error) {
      console.error('Error in getAllServiceProviders:', error);
      throw new GraphQLError('Failed to fetch service providers', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
          http: { status: 500 },
        },
      });
    }
  }

  async getAllProfessionals() {
    try {
      return await this.prisma.user.findMany({
        where: { role: 'PROFESSIONAL' },
        include: {
          address: true,
          professional: true,
        },
      });
    } catch (error) {
      console.error('Error in getAllProfessionals:', error);
      throw new GraphQLError('Failed to fetch professionals', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
          http: { status: 500 },
        },
      });
    }
  }

  async banUser(userId: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return new GraphQLError('User not found', {
          extensions: {
            code: 'NOT_FOUND',
            http: { status: 404 },
          },
        });
      }
      // delete all the tokens of the user
      await this.prisma.token.deleteMany({
        where: {
          userId: userId,
        },
      });

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          accountStatus: 'SUSPENDED',
          login: false,
          isLoggedIn: false,
        },
      });

      return {
        status: 200,
        success: true,
        message: 'User banned successfully',
      };
    } catch (error) {
      console.error('Error in banUser:', error);
      if (error.code === 'P2025') {
        throw new GraphQLError('User not found', {
          extensions: {
            code: 'NOT_FOUND',
            http: { status: 404 },
          },
        });
      }
      throw new GraphQLError('Failed to ban user', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
          http: { status: 500 },
        },
      });
    }
  }

  //************************* FUNCTION FOR USER ***************************** */
  async getUserInfo(userId: number, role: any) {
    try {
      let user;
      if (role === 'PROFESSIONAL') {
        user = await this.prisma.user.findUnique({
          where: { id: userId, role: role },
          include: {
            address: true,
            professional: true,
          },
        });
      } else if (role === 'PROVIDER') {
        user = await this.prisma.user.findUnique({
          where: { id: userId, role: role },
          include: {
            address: true,
            serviceProvider: true,
          },
        });
      }

      if (!user) {
        throw new GraphQLError('User not found', {
          extensions: {
            code: 'NOT_FOUND',
            http: { status: 404 },
          },
        });
      }

      return user;
    } catch (error) {
      console.error('Error in getUserInfo:', error);
      if (error instanceof GraphQLError) {
        throw error;
      }
      throw new GraphQLError('Failed to fetch user info', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
          http: { status: 500 },
        },
      });
    }
  }

  async updateAvatar(userId: number, avatar: FileUpload) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { avatar: true },
      });

      if (!user) {
        throw new GraphQLError('User not found', {
          extensions: {
            code: 'NOT_FOUND',
            http: { status: 404 },
          },
        });
      }

      console.log("User's avatar:", user.avatar);

      // Delete old avatar if exists
      if (user.avatar) {
        try {
          await this.fileUploadService.deleteFile(user.avatar);
        } catch (error) {
          console.error('Error deleting old avatar:', error);
          // Continue with upload even if deletion fails
        }
      }

      // Upload new avatar
      const filename = `avatar-${userId}-${Date.now()}-${avatar.filename}`;
      const avatarPath = await this.fileUploadService.uploadFile(
        avatar,
        'user',
        filename,
      );

      // Update user with new avatar
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: { avatar: avatarPath },
      });

      return updatedUser;
    } catch (error) {
      console.error('Error in updateAvatar:', error);
      if (error instanceof GraphQLError) {
        throw error;
      }
      throw new GraphQLError('Failed to update avatar', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
          http: { status: 500 },
        },
      });
    }
  }

  async updatePassword(
    userId: number,
    updatePasswordDto: UpdatePasswordDto,
  ) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { password: true },
      });

      if (!user) {
        return new GraphQLError('User not found', {
          extensions: {
            code: 'NOT_FOUND',
            http: { status: 404 },
          },
        });
      }

      // Verify current password
      const isMatch = await bcrypt.compare(
        updatePasswordDto.currentPassword,
        user.password,
      );

      if (!isMatch) {
        throw new GraphQLError('Current password is incorrect', {
          extensions: {
            code: 'UNAUTHORIZED',
            http: { status: 401 },
          },
        });
      }

      // Hash and update new password
      const newPassword = await bcrypt.hash(
        updatePasswordDto.newPassword,
        saltOrRounds,
      );

      await this.prisma.user.update({
        where: { id: userId },
        data: { password: newPassword },
      });

      return {
        status: 200,
        success: true,
        message: 'Password updated successfully',
      };
    } catch (error) {
      console.error('Error in updatePassword:', error);
      if (error instanceof GraphQLError) {
        throw error;
      }
      throw new GraphQLError('Failed to update password', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
          http: { status: 500 },
        },
      });
    }
  }
  async updateUserAddress(userId: number, addressData: AddressDto) {
    try {
      // First get the user with their address
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { address: true },
      });

      if (!user || !user.address) {
        throw new GraphQLError('User or address not found', {
          extensions: {
            code: 'NOT_FOUND',
            http: { status: 404 },
          },
        });
      }

      // Update the existing address
      await this.prisma.address.update({
        where: { id: user.address.id },
        data: addressData,
      });

      // Return updated user info
      return this.prisma.user.findUnique({
        where: { id: userId },
        include: { address: true },
      });
    } catch (error) {
      console.error('Error in updateUserAddress:', error);
      if (error.code === 'P2025') {
        throw new GraphQLError('User or address not found', {
          extensions: {
            code: 'NOT_FOUND',
            http: { status: 404 },
          },
        });
      }
      throw new GraphQLError('Failed to update address', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
          http: { status: 500 },
        },
      });
    }
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto) {
    try {
      // Check if email is being updated and if it already exists
      if (updateUserDto.email) {
        const existingUser = await this.prisma.user.findFirst({
          where: {
            email: updateUserDto.email,
            NOT: {
              id: userId,
            },
          },
        });

        if (existingUser) {
          return new GraphQLError('Email already in use', {
            extensions: {
              code: 'CONFLICT',
              http: { status: 409 },
            },
          });
        }
      }

      const user = await this.prisma.user.update({
        where: { id: userId },
        data: updateUserDto,
      });

      return user;
    } catch (error) {
      console.error('Error in updateUser:', error);
      if (error.code === 'P2025') {
        throw new GraphQLError('User not found', {
          extensions: {
            code: 'NOT_FOUND',
            http: { status: 404 },
          },
        });
      }
      throw new GraphQLError('Failed to update user', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
          http: { status: 500 },
        },
      });
    }
  }

  async deactivateAccount(userId: number, tokenId?: string) {
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: { accountStatus: AccountStatus.INACTIVE },
      });

      // Logout the user after deactivation
      await this.authService.logout(userId, tokenId);

      return {
        status: 200,
        success: true,
        message: 'Account deactivated successfully',
      };
    } catch (error) {
      console.error('Error in deactivateAccount:', error);
      if (error.code === 'P2025') {
        throw new GraphQLError('User not found', {
          extensions: {
            code: 'NOT_FOUND',
            http: { status: 404 },
          },
        });
      }
      throw new GraphQLError('Failed to deactivate account', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
          http: { status: 500 },
        },
      });
    }
  }

  //************************* FUNCTION FOR PROFESSIONAL ********************************* */

  async getMyProfessionalAccountDetails(userId?: number) {
    try {
      if (userId) {
        const user =
          await this.prisma.professionalUserDetails.findUnique({
            where: { userId },
          });

        if (!user) {
          throw new GraphQLError('Professional user not found', {
            extensions: {
              code: 'NOT_FOUND',
              http: { status: 404 },
            },
          });
        }
        return user;
      }
      return await this.prisma.professionalUserDetails.findMany();
    } catch (error) {
      console.error('Error in getProfessionalUserDetails:', error);
      if (error instanceof GraphQLError) {
        throw error;
      }
      throw new GraphQLError('Failed to fetch professional users', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
          http: { status: 500 },
        },
      });
    }
  }

  async updateProfessionalInfo(
    userId: number,
    professionalData: UpdateProfessionalDto,
  ) {
    try {
      const professional = await this.prisma.professional.findUnique({
        where: { userId: userId },
      });

      if (!professional) {
        return new GraphQLError(
          'Your professional account not found',
          {
            extensions: {
              code: 'NOT_FOUND',
              http: { status: 404 },
            },
          },
        );
      }

      // Update the existing professional
      return await this.prisma.professional.update({
        where: { id: professional.id },
        data: professionalData,
      });
    } catch (error) {
      console.error('Error in updateProfessionalInfo:', error);
      if (error.code === 'P2025') {
        throw new GraphQLError('User not found', {
          extensions: {
            code: 'NOT_FOUND',
            http: { status: 404 },
          },
        });
      }
      throw new GraphQLError(
        'Failed to update updateProfessionalInfo',
        {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
            http: { status: 500 },
          },
        },
      );
    }
  }

  //************************* FUNCTION FOR SERVICE PROVIDER ***************************** */
  async getMyServiceProviderAccountDetails(userId?: number) {
    try {
      const user =
        await this.prisma.serviceProviderUserDetails.findUnique({
          where: { userId },
        });

      if (!user) {
        throw new GraphQLError('Service provider user not found', {
          extensions: {
            code: 'NOT_FOUND',
            http: { status: 404 },
          },
        });
      }
      return user;
    } catch (error) {
      console.error('Error in getServiceProviderUserDetails:', error);
      if (error instanceof GraphQLError) {
        throw error;
      }
      throw new GraphQLError(
        'Failed to fetch service provider users',
        {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
            http: { status: 500 },
          },
        },
      );
    }
  }

  async updateServiceProviderInfo(
    userId: number,
    serviceProviderData: UpdateServiceProviderDto,
  ) {
    try {
      const serviceProvider =
        await this.prisma.serviceProvider.findUnique({
          where: { userId: userId },
        });

      if (!serviceProvider) {
        return new GraphQLError(
          'Your serviceProvider account is not found',
          {
            extensions: {
              code: 'NOT_FOUND',
              http: { status: 404 },
            },
          },
        );
      }

      // Update the existing serviceProvider
      return await this.prisma.serviceProvider.update({
        where: { id: serviceProvider.id },
        data: serviceProviderData,
      });
    } catch (error) {
      console.error('Error in updateServiceProviderInfo:', error);
      if (error.code === 'P2025') {
        throw new GraphQLError('User not found', {
          extensions: {
            code: 'NOT_FOUND',
            http: { status: 404 },
          },
        });
      }
      throw new GraphQLError(
        'Failed to update updateServiceProviderInfo',
        {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
            http: { status: 500 },
          },
        },
      );
    }
  }
}
