import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { FileUploadService } from 'src/common/services/file-upload.service';
import { JwtService } from '@nestjs/jwt';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { Reflector } from '@nestjs/core';

@Module({
  providers: [
    AuthService,
    AuthResolver,
    FileUploadService,
    JwtService,
    {
      provide: 'APP_GUARD',
      useClass: GqlAuthGuard,
    },
    Reflector,
  ],
})
export class AuthModule {}
