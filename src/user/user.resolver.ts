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
import { AddressDto } from 'src/auth/dto/auth.dto';

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
@UseGuards(GqlAuthGuard)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  async getMe(@Context() context) {
    const userId = context.req.user.sub;
    const role = context.req.user.role;
    return this.userService.getUserInfo(userId, role);
  }

  @Mutation(() => User)
  async updateUser(
    @Args('updateUserInput') updateUserDto: UpdateUserDto,
    @Context() context,
  ) {
    const userId = context.req.user.sub;
    return this.userService.updateUser(userId, updateUserDto);
  }

  @Mutation(() => User)
  async updateUserAddress(
    @Context() context,
    @Args('addressData') addressData: AddressDto,
  ) {
    const userId = context.req.user.sub;
    return this.userService.updateUserAddress(userId, addressData);
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

@Resolver()
@UseGuards(GqlAuthGuard)
export class ProfessionalResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [ProfessionalUserDetails], { nullable: true })
  @Roles(Role.PROFESSIONAL)
  async getMyProfessionalAccountDetails(@Context() context) {
    const userId = context.req.user.sub;
    return this.userService.getMyProfessionalAccountDetails(userId);
  }

  @Mutation(() => Professional)
  @Roles(Role.PROFESSIONAL)
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
}

@Resolver()
@UseGuards(GqlAuthGuard)
export class ServiceProviderResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [ServiceProviderUserDetails], { nullable: true })
  @Roles(Role.PROVIDER)
  async getMyServiceProviderAccountDetails(@Context() context) {
    const userId = context.req.user.sub;
    return this.userService.getMyServiceProviderAccountDetails(
      userId,
    );
  }

  @Mutation(() => ServiceProvider)
  @Roles(Role.PROVIDER)
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
}
