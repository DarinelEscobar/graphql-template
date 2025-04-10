import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserType } from './user.type'; // definimos un objeto de tipo GraphQL

@Resolver(() => UserType)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => UserType, { name: 'user' })
  async getUser(@Args('id', { type: () => Int }) id: number) {
    return this.userService.getUser(id);
  }

  @Query(() => [UserType], { name: 'users' })
  async getAllUsers() {
    return this.userService.getAllUsers();
  }
}
