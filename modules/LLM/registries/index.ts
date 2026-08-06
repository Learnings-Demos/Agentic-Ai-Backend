import { DatabaseServices } from "../../../utils/enums";
import InvoicesModel from "../../Invoice/invoice.model";
import UsersModel from "../../User/user.model";
import UserServiceRegistry from "./user.registry";

export const serviceRegistry = {
  [DatabaseServices.USER_SERVICE]: UserServiceRegistry,
};

export const databaseModels = [UsersModel, InvoicesModel];
