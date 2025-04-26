import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType({ description: 'Professional' })
export class Professional {
  @Field(() => Number)
  id: number;

  @Field(() => String)
  currentPosition: string;

  @Field(() => String)
  contactEmail: string;

  @Field(() => String)
  contactPhone: string;

  @Field(() => String)
  workingAt: string;

  @Field(() => Float, { nullable: true })
  experienceYears?: number | null;

  @Field(() => String, { nullable: true })
  industry?: string | null;

  @Field(() => String, { nullable: true })
  linkedinProfile?: string | null;

  @Field(() => String)
  accountantEmail: string;

  @Field(() => Number)
  userId: number;
}
