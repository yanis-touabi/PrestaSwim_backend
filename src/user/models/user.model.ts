import { ObjectType, Field, ID } from '@nestjs/graphql';
import { AccountStatus, Gender, Role } from '@prisma/client';

@ObjectType({ description: 'User' })
export class User {
  @Field(() => ID)
  id: number;

  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field(() => String, { nullable: true })
  avatar?: string | null;

  @Field()
  isLoggedIn: boolean;

  @Field()
  login: boolean;

  @Field(() => Date, { nullable: true })
  birthDate?: Date | null;

  @Field(() => Role)
  role: Role;

  @Field(() => Gender, { nullable: true })
  gender?: Gender | null;

  @Field(() => String, { nullable: true })
  phoneNumber?: string | null;

  @Field(() => Number, { nullable: true }) // Explicitly define type for addressId
  addressId?: number | null;

  @Field(() => AccountStatus)
  accountStatus: AccountStatus;

  @Field(() => String, { nullable: true })
  verificationCode?: string | null;

  @Field()
  isVerified: boolean;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date | null; // Make nullable if the field can be null
}
