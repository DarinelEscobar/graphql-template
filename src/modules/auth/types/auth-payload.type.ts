import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthPayload {
  @Field()
  accessToken: string;

  @Field(() => Int)
  userId: number;

  @Field()
  rol: string;

  @Field()
  refreshToken: string;
}