import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AccountStatus, Gender, Role } from '@prisma/client';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SignUpDto {
  @Field()
  @IsString({ message: 'firstName must be a string' })
  @MinLength(3, {
    message: 'firstName must be at least 3 characters',
  })
  @MaxLength(30, {
    message: 'firstName must be at most 30 characters',
  })
  firstName: string;

  @Field()
  @IsString({ message: 'lastName must be a string' })
  @MinLength(3, { message: 'lastName must be at least 3 characters' })
  @MaxLength(30, {
    message: 'lastName must be at most 30 characters',
  })
  lastName: string;

  // @Field({ nullable: true })
  // @IsString({ message: 'avatar must be a string' })
  // avatar?: string;

  @Field(() => Date, { nullable: true })
  birthDate?: Date | null;

  @Field((type) => Gender)
  gender: Gender;

  @Field((type) => Role) // Use the @Field decorator and specify the Role enum type
  role: Role;

  @Field((type) => AccountStatus)
  accountStatus: AccountStatus;

  @Field({ nullable: true })
  @IsString({ message: 'phoneNumber must be a string' })
  phoneNumber?: string;

  @Field()
  @IsEmail({}, { message: 'Email is not valid' })
  @IsString({ message: 'Email must be a string' })
  email: string;

  @Field()
  @IsString({ message: 'Password must be a string' })
  @MinLength(3, { message: 'password must be at least 3 characters' })
  @MaxLength(20, {
    message: 'password must be at most 20 characters',
  })
  password: string;
}
@InputType()
export class SignInDto {
  @Field()
  @IsString({ message: 'Email must be a string' })
  @MinLength(1, { message: 'Email is required' })
  @IsEmail({}, { message: 'Email is not valid' })
  email: string;

  @Field()
  @IsString({ message: 'Password must be a string' })
  @MinLength(3, { message: 'password must be at least 3 characters' })
  @MaxLength(20, {
    message: 'password must be at most 20 characters',
  })
  password: string;
}
@InputType()
export class ResetPasswordDto {
  @Field()
  @IsString({ message: 'Email must be a string' })
  @MinLength(1, { message: 'Email is required' })
  @IsEmail({}, { message: 'Email is not valid' })
  email: string;
}
@InputType()
export class VerifyCodeDto {
  @Field()
  @IsString({ message: 'Email must be a string' })
  @MinLength(1, { message: 'Email is required' })
  @IsEmail({}, { message: 'Email is not valid' })
  email: string;

  @Field()
  @IsString({ message: 'Code must be a string' })
  @MinLength(6, { message: 'Code must be at least 6 characters' })
  @MaxLength(6, { message: 'Code must be at most 6 characters' })
  code: string;
}
