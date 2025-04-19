import {
  Resolver,
  Mutation,
  Args,
  Query,
  Context,
} from '@nestjs/graphql';
import { AuthService } from './auth.service';
import {
  ResetPasswordDto,
  SignInDto,
  SignUpDto,
  VerifyCodeDto,
} from './dto/auth.dto';
import { AuthResponse } from './models/auth-response.model';
import { User } from '../user/models/user.model';
import { BooleanResponse } from './models/boolean-response.model';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { join } from 'path';
import { createWriteStream } from 'fs';
import { FileUploadService } from 'src/common/services/file-upload.service';
import { Injectable } from '@nestjs/common';

@Resolver()
@Injectable()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Query(() => String, { nullable: true })
  emptyQuery(): string {
    return 'Query is not yet implemented.';
  }

  @Mutation(() => User)
  async signUp(
    @Args('signUpInput') signUpDto: SignUpDto,
    @Args('avatar', { type: () => GraphQLUpload, nullable: true })
    avatar: FileUpload,
  ): Promise<User> {
    console.log('avatar', avatar);
    return await this.authService.signup(signUpDto, avatar);
  }

  @Mutation(() => AuthResponse)
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
  resetPassword(
    @Args('resetPasswordInput') resetPasswordDto: ResetPasswordDto,
  ): Promise<BooleanResponse> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  // @Mutation(() => AuthResponse)
  // verifyCode(
  //   @Args('verifyCodeInput') verifyCodeDto: VerifyCodeDto,
  // ): Promise<AuthResponse> {
  //   return this.authService.verifyCode(verifyCodeDto);
  // }

  // @Mutation(() => BooleanResponse)
  // changePassword(
  //   @Args('changePasswordInput') changePasswordDto: SignInDto,
  // ): Promise<BooleanResponse> {
  //   return this.authService.changePassword(changePasswordDto);
  // }
}
