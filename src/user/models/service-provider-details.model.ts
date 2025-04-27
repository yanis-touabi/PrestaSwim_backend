import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType({ description: 'Service Provider User Details' })
export class ServiceProviderUserDetails {
  @Field(() => Number)
  userId: number;

  @Field(() => String)
  email: string;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String, { nullable: true })
  avatar?: string;

  @Field(() => Boolean)
  isLoggedIn: boolean;

  @Field(() => Boolean)
  login: boolean;

  @Field(() => String, { nullable: true })
  birthDate?: string;

  @Field(() => String)
  role: string;

  @Field(() => String, { nullable: true })
  gender?: string;

  @Field(() => String, { nullable: true })
  phoneNumber?: string;

  @Field(() => String)
  accountStatus: string;

  @Field(() => String, { nullable: true })
  verificationCode?: string;

  @Field(() => Boolean)
  isVerified: boolean;

  @Field(() => String)
  createdAt: string;

  @Field(() => String)
  updatedAt: string;

  @Field(() => Number)
  serviceProviderId: number;

  @Field(() => String, { nullable: true })
  specialty?: string;

  @Field(() => String, { nullable: true })
  bio?: string;

  @Field(() => Float, { nullable: true })
  hourlyRate?: number;

  @Field(() => String, { nullable: true })
  notes?: string;

  @Field(() => Boolean)
  availability: boolean;

  @Field(() => Number, { nullable: true })
  addressId?: number;

  @Field(() => String, { nullable: true })
  addressLine1?: string;

  @Field(() => String, { nullable: true })
  addressLine2?: string;

  @Field(() => String, { nullable: true })
  city?: string;

  @Field(() => String, { nullable: true })
  commune?: string;

  @Field(() => String, { nullable: true })
  postalCode?: string;

  @Field(() => String, { nullable: true })
  country?: string;

  @Field(() => Float, { nullable: true })
  latitude?: number;

  @Field(() => Float, { nullable: true })
  longitude?: number;
}
