import { InputType, Field } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty } from 'class-validator'

@InputType()
export class CreateAccountInput {
  @Field()
  @IsNotEmpty()
  name: string

  @Field()
  @IsEmail()
  email: string

  @Field()
  @IsNotEmpty()
  password: string
}
