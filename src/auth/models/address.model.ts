import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType({ description: 'Address' })
export class Address {
  @Field(() => Number)
  id: number;

  @Field()
  addressLine1: string;

  @Field(() => String, { nullable: true })
  addressLine2?: string | null;

  @Field(() => String)
  city: string;

  @Field(() => String)
  commune: string;

  @Field(() => String)
  country: string;

  @Field(() => String, { nullable: true })
  postalCode?: string | null;

  @Field(() => Float, { nullable: true })
  latitude?: number | null;

  @Field(() => Float, { nullable: true })
  longitude?: number | null;
}
