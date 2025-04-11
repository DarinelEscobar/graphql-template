// src/modules/product/adapters/graphql/product.type.ts
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProductType {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field(() => Int)
  userId: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
