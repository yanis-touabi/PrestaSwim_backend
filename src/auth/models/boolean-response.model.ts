// boolean-response.model.ts
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class BooleanResponse {
  @Field()
  status: number;

  @Field()
  message: string;

  @Field()
  success: boolean;

  @Field({ nullable: true })
  expireToken?: string;
}
