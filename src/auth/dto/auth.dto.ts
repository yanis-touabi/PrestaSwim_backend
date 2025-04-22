import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
  Matches,
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
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(20, {
    message: 'Password must be at most 20 characters',
  })
  @Matches(/(?=.*[a-z])/, {
    message: 'Password must contain at least one lowercase letter',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(/(?=.*\d)/, {
    message: 'Password must contain at least one number',
  })
  @Matches(/(?=.*[!@#$%^&_*])/, {
    message: 'Password must contain at least one special character',
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

@InputType()
export class ChangePasswordDto {
  @Field()
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(20, {
    message: 'Password must be at most 20 characters',
  })
  @Matches(/(?=.*[a-z])/, {
    message: 'Password must contain at least one lowercase letter',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(/(?=.*\d)/, {
    message: 'Password must contain at least one number',
  })
  @Matches(/(?=.*[!@#$%^&*])/, {
    message: 'Password must contain at least one special character',
  })
  password: string;
}
