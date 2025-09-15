import { Module } from '@nestjs/common';
import { PoolService } from './pool.service';
import { PoolResolver } from './pool.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [PoolResolver, PoolService],
  exports: [PoolService],
})
export class PoolModule {}
