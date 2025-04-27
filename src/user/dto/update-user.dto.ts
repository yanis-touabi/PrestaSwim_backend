import {
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
} from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { Gender } from '@prisma/client';

@InputType()
export class UpdateUserDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'firstName must be a string' })
  @MinLength(3, {
    message: 'firstName must be at least 3 characters',
  })
  @MaxLength(30, {
    message: 'firstName must be at most 30 characters',
  })
  firstName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'lastName must be a string' })
  @MinLength(3, { message: 'lastName must be at least 3 characters' })
  @MaxLength(30, {
    message: 'lastName must be at most 30 characters',
  })
  lastName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'phoneNumber must be a string' })
  phoneNumber?: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  birthDate?: Date;

  @Field(() => Gender, { nullable: true })
  @IsOptional()
  gender?: Gender;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail({}, { message: 'Email is not valid' })
  email?: string;
}

@InputType()
export class UpdateProfessionalDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'currentPosition must be a string' })
  currentPosition?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail({}, { message: 'contactEmail must be a valid email' })
  contactEmail?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'contactPhone must be a string' })
  contactPhone?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'workingAt must be a string' })
  workingAt?: string;

  @Field({ nullable: true })
  @IsOptional()
  experienceYears?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'industry must be a string' })
  industry?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'linkedinProfile must be a string' })
  linkedinProfile?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail({}, { message: 'accountantEmail must be a valid email' })
  accountantEmail?: string;
}

@InputType()
export class UpdateServiceProviderDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'specialty must be a string' })
  specialty?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'bio must be a string' })
  bio?: string;

  @Field({ nullable: true })
  @IsOptional()
  hourlyRate?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'notes must be a string' })
  notes?: string;

  @Field({ nullable: true })
  @IsOptional()
  availability?: boolean;
}
