import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreatePoolDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  poolName: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  companyName?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  poolDescription?: string;

  @Field()
  @IsNotEmpty()
  poolAddressId: number;
}
