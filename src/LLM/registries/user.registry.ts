import * as UserService from "../../../modules/User/user.service";

const UserServiceRegistry = {
  entity: "Users",

  operations: {
    getAllUsers: UserService.getAllUsers,
    getUserById: ({ id }: { id: string }) => UserService.getUserById(id),
    getUserByEmail: ({ email }: { email: string }) =>
      UserService.getUserByEmail(email),
  },
};

export default UserServiceRegistry;
