import * as UserService from "../../User/user.service";

const UserServiceRegistry = {
  entity: "Users",

  operations: {
    createUser: UserService.createUser,
    getAllUsers: UserService.getAllUsers,
    getUserById: ({ id }: { id: string }) => UserService.getUserById(id),
    getUserByEmail: ({ email }: { email: string }) =>
      UserService.getUserByEmail(email),
    updateUser: ({ id, data }: { id: string; data: any }) =>
      UserService.updateUser(id, data),
    deleteUser: ({ id }: { id: string }) => UserService.deleteUser(id),
  },
};

export default UserServiceRegistry;
