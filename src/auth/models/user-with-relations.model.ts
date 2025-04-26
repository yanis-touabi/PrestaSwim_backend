import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../../user/models/user.model';
import { Address } from './address.model';
import { ServiceProvider } from '../../user/models/service-provider.model';
import { Professional } from '../../user/models/professional.model';

@ObjectType({ description: 'User with relations' })
export class UserWithRelations {
  @Field(() => User)
  user: User;

  @Field(() => Address, { nullable: true })
  address?: Address | null;

  @Field(() => ServiceProvider, { nullable: true })
  serviceProvider?: ServiceProvider | null;

  @Field(() => Professional, { nullable: true })
  professional?: Professional | null;
}
