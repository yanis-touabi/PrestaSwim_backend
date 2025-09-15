import { PartialType } from '@nestjs/graphql';
import { CreatePoolDto } from './create-pool.dto';
import { InputType } from '@nestjs/graphql';

@InputType()
export class UpdatePoolDto extends PartialType(CreatePoolDto) {}
