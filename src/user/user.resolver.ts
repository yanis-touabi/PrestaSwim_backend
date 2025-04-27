import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
  Int,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import {
  UpdateProfessionalDto,
  UpdateServiceProviderDto,
  UpdateUserDto,
} from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './models/user.model';
import { BooleanResponse } from '../auth/models/boolean-response.model';
import { ServiceProviderUserDetails } from './models/service-provider-details.model';
import { ProfessionalUserDetails } from './models/professional-details.model';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { Address } from '../auth/models/address.model';
import { Professional } from './models/professional.model';
import { ServiceProvider } from './models/service-provider.model';

@Resolver()
@UseGuards(GqlAuthGuard)
export class UserAdminResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  @Roles(Role.ADMIN)
  async getUserById(@Args('userId') userId: string) {
    return this.userService.getUserById(parseInt(userId));
  }

  @Query(() => ServiceProviderUserDetails)
  @Roles(Role.ADMIN)
  async getServiceProviderUserDetailsById(
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    return this.userService.getServiceProviderUserDetailsById(userId);
  }

  @Query(() => ProfessionalUserDetails)
  @Roles(Role.ADMIN)
  async getProfessionalUserDetailsById(
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    return this.userService.getProfessionalUserDetailsById(userId);
  }

  @Query(() => [User])
  @Roles(Role.ADMIN)
  async getAllUser() {
    return this.userService.getAllUsers();
  }

  @Query(() => [User])
  @Roles(Role.ADMIN)
  async getAllServiceProviders() {
    return this.userService.getAllServiceProviders();
  }

  @Query(() => [User])
  @Roles(Role.ADMIN)
  async getAllProfessionals() {
    return this.userService.getAllProfessionals();
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

  @Mutation(() => User)
  async updateUserAddress(
    @Context() context,
    @Args('addressData') addressData: Address,
  ) {
    const userId = context.req.user.sub;
    return this.userService.updateUserAddress(userId, addressData);
  }

  @Query(() => [ServiceProviderUserDetails], { nullable: true })
  async getMyServiceProviderAccountDetails(@Context() context) {
    const userId = context.req.user.sub;
    return this.userService.getMyServiceProviderAccountDetails(
      userId,
    );
  }

  @Query(() => [ProfessionalUserDetails], { nullable: true })
  async getMyProfessionalAccountDetails(@Context() context) {
    const userId = context.req.user.sub;
    return this.userService.getMyProfessionalAccountDetails(userId);
  }

  @Query(() => User)
  async getMe(@Context() context) {
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

  @Mutation(() => Professional)
  async updateProfessionalInfo(
    @Args('updateUserInput')
    updateProfessionalDto: UpdateProfessionalDto,
    @Context() context,
  ) {
    const userId = context.req.user.sub;
    return this.userService.updateProfessionalInfo(
      userId,
      updateProfessionalDto,
    );
  }

  @Mutation(() => ServiceProvider)
  async updateServiceProviderInfo(
    @Args('updateUserInput')
    updateServiceProviderDto: UpdateServiceProviderDto,
    @Context() context,
  ) {
    const userId = context.req.user.sub;
    return this.userService.updateServiceProviderInfo(
      userId,
      updateServiceProviderDto,
    );
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
