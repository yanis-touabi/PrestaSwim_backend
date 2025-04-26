import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './models/user.model';
import { BooleanResponse } from '../auth/models/boolean-response.model';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver()
@UseGuards(GqlAuthGuard)
export class UserAdminResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  @Roles(Role.ADMIN)
  async getUserById(@Args('userId') userId: string) {
    return this.userService.getUserById(parseInt(userId));
  }

  @Query(() => [User])
  @Roles(Role.ADMIN)
  async getAllUser() {
    return this.userService.getAllUsers();
  }

  @Mutation(() => BooleanResponse)
  @Roles(Role.ADMIN)
  async banUser(@Args('userId') userId: string) {
    return this.userService.banUser(parseInt(userId));
  }
}

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  async getUser(@Context() context) {
    const userId = context.req.user.sub;
    return this.userService.getUserInfo(userId);
  }

  @Mutation(() => User)
  async updateUser(
    @Args('updateUserInput') updateUserDto: UpdateUserDto,
    @Context() context,
  ) {
    const userId = context.req.user.sub;
    return this.userService.updateUser(userId, updateUserDto);
  }

  @Mutation(() => BooleanResponse)
  async deactivateAccount(@Context() context) {
    const userId = context.req.user.sub;
    const tokenId = context.req.headers['token-id'] as string;
    return this.userService.deactivateAccount(userId, tokenId);
  }

  @Mutation(() => User)
  async updateAvatar(
    @Args('avatar', { type: () => GraphQLUpload, nullable: true })
    avatar: FileUpload,
    @Context() context,
  ) {
    const userId = context.req.user.sub;
    return this.userService.updateAvatar(userId, avatar);
  }

  @Mutation(() => BooleanResponse)
  async updatePassword(
    @Args('updatePasswordInput') updatePasswordDto: UpdatePasswordDto,
    @Context() context,
  ) {
    const userId = context.req.user.sub;
    return this.userService.updatePassword(userId, updatePasswordDto);
  }
}
