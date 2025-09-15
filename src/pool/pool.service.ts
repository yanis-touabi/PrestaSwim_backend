import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePoolDto } from './dto/create-pool.dto';
import { UpdatePoolDto } from './dto/update-pool.dto';
import { Pool } from './models/pool.model';
import { GraphQLError } from 'graphql';

@Injectable()
export class PoolService {
  constructor(private prisma: PrismaService) {}

  async create(
    professionalId: number,
    input: CreatePoolDto,
  ): Promise<Pool> {
    try {
      return await this.prisma.pool.create({
        data: {
          professionalId,
          ...input,
        },
        include: {
          professional: true,
          poolAddress: true,
        },
      });
    } catch (error) {
      throw new GraphQLError(
        `Failed to create pool: ${error.message}`,
      );
    }
  }

  async findAll(): Promise<Pool[]> {
    try {
      return await this.prisma.pool.findMany({
        include: {
          professional: true,
          poolAddress: true,
        },
      });
    } catch (error) {
      throw new GraphQLError(
        `Failed to fetch pools: ${error.message}`,
      );
    }
  }

  async findOne(id: number): Promise<Pool | null> {
    try {
      return await this.prisma.pool.findUnique({
        where: { id },
        include: {
          professional: true,
          poolAddress: true,
        },
      });
    } catch (error) {
      throw new GraphQLError(
        `Failed to fetch pool with id ${id}: ${error.message}`,
      );
    }
  }

  async update(id: number, input: UpdatePoolDto): Promise<Pool> {
    try {
      return await this.prisma.pool.update({
        where: { id },
        data: input,
        include: {
          professional: true,
          poolAddress: true,
        },
      });
    } catch (error) {
      throw new GraphQLError(
        `Failed to update pool with id ${id}: ${error.message}`,
      );
    }
  }

  async remove(id: number): Promise<Pool> {
    try {
      return await this.prisma.pool.delete({
        where: { id },
        include: {
          professional: true,
          poolAddress: true,
        },
      });
    } catch (error) {
      throw new GraphQLError(
        `Failed to delete pool with id ${id}: ${error.message}`,
      );
    }
  }

  async getProfessionalPools(
    professionalId: number,
  ): Promise<Pool[]> {
    try {
      return await this.prisma.pool.findMany({
        where: { professionalId },
        include: {
          professional: true,
          poolAddress: true,
        },
      });
    } catch (error) {
      throw new GraphQLError(
        `Failed to fetch pools for professional ${professionalId}: ${error.message}`,
      );
    }
  }
}
