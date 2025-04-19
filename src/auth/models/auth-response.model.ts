import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../../user/models/user.model'; // Or wherever your User object is defined

@ObjectType()
export class AuthResponse {
  @Field(() => User)
  data: User;

  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field()
  tokenId: string;

  @Field()
  accessTokenExpires: string;
}
