import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { Pool } from './models/pool.model';
import { PoolService } from './pool.service';
import { CreatePoolDto } from './dto/create-pool.dto';
import { UpdatePoolDto } from './dto/update-pool.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Resolver(() => Pool)
export class PoolResolver {
  constructor(private readonly poolService: PoolService) {}

  @Query(() => [Pool])
  @UseGuards(GqlAuthGuard)
  @Roles(Role.ADMIN)
  async getAllPools(): Promise<Pool[]> {
    return this.poolService.findAll();
  }

  @Query(() => Pool, { nullable: true })
  @UseGuards(GqlAuthGuard)
  @Roles(Role.ADMIN || Role.PROFESSIONAL)
  async getPoolById(@Args('id') id: number): Promise<Pool | null> {
    return this.poolService.findOne(id);
  }

  @Query(() => [Pool])
  @UseGuards(GqlAuthGuard)
  @Roles(Role.PROFESSIONAL)
  async getProfessionalPools(@Context() context): Promise<Pool[]> {
    const professionalId = context.req.user.sub;
    return this.poolService.getProfessionalPools(professionalId);
  }

  @Mutation(() => Pool)
  @UseGuards(GqlAuthGuard)
  @Roles(Role.PROFESSIONAL)
  async createPool(
    @Args('input') input: CreatePoolDto,
    @Context() context,
  ): Promise<Pool> {
    const professionalId = context.req.user.sub;
    return this.poolService.create(professionalId, input);
  }

  @Mutation(() => Pool)
  @UseGuards(GqlAuthGuard)
  @Roles(Role.PROFESSIONAL)
  async updatePool(
    @Args('id') id: number,
    @Args('input') input: UpdatePoolDto,
  ): Promise<Pool> {
    return this.poolService.update(id, input);
  }

  @Mutation(() => Pool)
  @UseGuards(GqlAuthGuard)
  @Roles(Role.PROFESSIONAL)
  async deletePool(@Args('id') id: number): Promise<Pool> {
    return this.poolService.remove(id);
  }
}
