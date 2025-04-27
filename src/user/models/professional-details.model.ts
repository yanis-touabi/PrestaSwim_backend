import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType({ description: 'Professional User Details' })
export class ProfessionalUserDetails {
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
  professionalId: number;

  @Field(() => String)
  currentPosition: string;

  @Field(() => String)
  contactEmail: string;

  @Field(() => String)
  contactPhone: string;

  @Field(() => String)
  workingAt: string;

  @Field(() => Float, { nullable: true })
  experienceYears?: number;

  @Field(() => String, { nullable: true })
  industry?: string;

  @Field(() => String, { nullable: true })
  linkedinProfile?: string;

  @Field(() => String)
  accountantEmail: string;

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
