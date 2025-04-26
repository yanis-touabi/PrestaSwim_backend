import { Field, InputType } from '@nestjs/graphql';
import {
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType()
export class UpdatePasswordDto {
  @Field()
  @IsString()
  currentPassword: string;

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
  newPassword: string;
}
