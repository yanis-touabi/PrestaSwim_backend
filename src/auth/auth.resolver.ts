import {
  Resolver,
  Mutation,
  Args,
  Query,
  Context,
} from '@nestjs/graphql';
import { AuthService } from './auth.service';
import {
  ChangePasswordDto,
  ResetPasswordDto,
  SignInDto,
  SignUpDto,
  VerifyCodeDto,
  SignUpServiceProviderDto,
  SignUpProfessionalDto,
} from './dto/auth.dto';
import { AuthResponse } from './models/auth-response.model';
import { User } from '../user/models/user.model';
import { UserWithRelations } from './models/user-with-relations.model';
import { BooleanResponse } from './models/boolean-response.model';
import { ServiceProvider } from '@prisma/client';
import { Professional } from '@prisma/client';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { FileUploadService } from 'src/common/services/file-upload.service';
import { Injectable } from '@nestjs/common';
import { Public } from './decorators/public.decorator';

@Resolver()
@Injectable()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Query(() => String, { nullable: true })
  @Public()
  emptyQuery(): string {
    return 'Query is not yet implemented.';
  }

  @Mutation(() => User)
  @Public()
  async signUp(
    @Args('signUpInput') signUpDto: SignUpDto,
    @Args('avatar', { type: () => GraphQLUpload, nullable: true })
    avatar: FileUpload,
  ): Promise<User> {
    return await this.authService.signup(signUpDto, avatar);
  }

  @Mutation(() => UserWithRelations)
  @Public()
  async signUpServiceProvider(
    @Args('signUpInput') signUpDto: SignUpServiceProviderDto,
    @Args('avatar', { type: () => GraphQLUpload, nullable: true })
    avatar: FileUpload,
  ): Promise<UserWithRelations> {
    return this.authService.signUpServiceProvider(signUpDto, avatar);
  }

  @Mutation(() => UserWithRelations)
  @Public()
  async signUpProfessional(
    @Args('signUpInput') signUpDto: SignUpProfessionalDto,
    @Args('avatar', { type: () => GraphQLUpload, nullable: true })
    avatar: FileUpload,
  ): Promise<UserWithRelations> {
    return this.authService.signUpProfessional(signUpDto, avatar);
  }

  @Mutation(() => AuthResponse)
  @Public()
  signIn(@Args('signInInput') signInDto: SignInDto): Promise<any> {
    return this.authService.signIn(signInDto);
  }

  @Mutation(() => BooleanResponse)
  logout(
    @Args('userId') userId: number,
    @Context() context: Context,
  ): Promise<BooleanResponse> {
    // get the token-id from the header
    const tokenId = context.req.headers['token-id'] as string;
    return this.authService.logout(userId, tokenId);
  }

  @Mutation(() => BooleanResponse)
  @Public()
  resetPassword(
    @Args('resetPasswordInput') resetPasswordDto: ResetPasswordDto,
  ): Promise<BooleanResponse> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Mutation(() => BooleanResponse)
  @Public()
  verifyCode(
    @Args('verifyCodeInput') verifyCodeDto: VerifyCodeDto,
  ): Promise<BooleanResponse> {
    return this.authService.verifyCode(verifyCodeDto);
  }

  @Mutation(() => BooleanResponse)
  changePassword(
    @Args('changePasswordInput') changePasswordDto: ChangePasswordDto,
    @Context() context,
  ): Promise<BooleanResponse> {
    return this.authService.changePassword(
      changePasswordDto,
      context.req.user.email,
    );
  }
}
