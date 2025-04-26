import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType({ description: 'ServiceProvider' })
export class ServiceProvider {
  @Field(() => Number)
  id: number;

  @Field(() => String, { nullable: true })
  specialty?: string | null;

  @Field(() => String, { nullable: true })
  bio?: string | null;

  @Field(() => Float, { nullable: true })
  hourlyRate?: number | null;

  @Field(() => String, { nullable: true })
  notes?: string | null;

  @Field()
  availability: boolean;

  @Field(() => Number)
  userId: number;
}
