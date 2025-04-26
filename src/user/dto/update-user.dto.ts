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
