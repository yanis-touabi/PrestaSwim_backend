import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Professional } from '../../user/models/professional.model';
import { Address } from '../../auth/models/address.model';

@ObjectType()
export class Pool {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  professionalId: number;

  @Field(() => String, { nullable: true })
  companyName: string | null;

  @Field(() => String)
  poolName: string;

  @Field(() => String, { nullable: true })
  poolDescription: string | null;

  @Field(() => Int)
  poolAddressId: number;

  @Field(() => Professional)
  professional: Professional;

  @Field(() => Address)
  poolAddress: Address;
}
