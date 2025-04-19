import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { FileUploadService } from 'src/common/services/file-upload.service';

@Module({
  providers: [AuthService, AuthResolver, FileUploadService],
})
export class AuthModule {}
