import { Role, Gender, AccountStatus } from '@prisma/client';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateUserDto {
  // FirstName
  @IsString({ message: 'FirstName must be a string' })
  @MinLength(3, {
    message: 'FirstName must be at least 3 characters',
  })
  @MaxLength(30, {
    message: 'FirstName must be at most 30 characters',
  })
  firstName: string;

  // LastName
  @IsString({ message: 'LastName must be a string' })
  @MinLength(3, {
    message: 'LastName must be at least 3 characters',
  })
  @MaxLength(30, {
    message: 'LastName must be at most 30 characters',
  })
  lastName: string;

  // Email
  @IsString({ message: 'Email must be a string' })
  @MinLength(0, {
    message: 'The Email Must be Required',
  })
  @IsEmail({}, { message: 'Email is not valid' })
  email: string;

  // Password
  @IsString({
    message: 'Password must be a string',
  })
  @MinLength(3, {
    message: 'password must be at least 3 characters',
  })
  @MaxLength(20, {
    message: 'password must be at most 20 characters',
  })
  password: string;

  // Role
  @IsEnum(['PROVIDER', 'PROFESSIONAL', 'ADMIN'], {
    message: 'role must be PROVIDER, PROFESSIONAL, or ADMIN',
  })
  @IsOptional()
  role?: Role;

  // Avatar
  @IsString({ message: 'avatar must be a string' })
  @IsUrl({}, { message: 'avatar must be a valid URL' })
  @IsOptional()
  avatar?: string;

  // birthDate
  @IsOptional()
  @Type(() => Date)
  birthDate?: Date | null;

  // PhoneNumber
  @IsString({ message: 'phoneNumber must be a string' })
  @IsOptional()
  phoneNumber?: string;

  // addressId
  @IsNumber({}, { message: 'addressId must be a number' })
  @IsOptional()
  addressId?: number;

  // accountStatus
  @IsEnum(['ACTIVE', 'INACTIVE', 'SUSPENDED'], {
    message: 'accountStatus must be ACTIVE, INACTIVE, or SUSPENDED',
  })
  @IsOptional()
  accountStatus?: AccountStatus;

  // verificationCode
  @IsString({ message: 'verificationCode must be a string' })
  @IsOptional()
  @Length(6, 6, { message: 'verificationCode must be 6 characters' })
  verificationCode?: string;

  // isVerified
  @IsBoolean({ message: 'isVerified must be a boolean' })
  @IsOptional()
  isVerified?: boolean;

  // Gender
  @IsEnum(['MALE', 'FEMALE', 'OTHER'], {
    message: 'gender must be MALE, FEMALE, or OTHER',
  })
  @IsOptional()
  gender?: Gender;
}
