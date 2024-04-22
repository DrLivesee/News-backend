import { IUser } from "@src/models/userModel";

export default class UserDto {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  role: string;
  registrationDate: Date
  

  constructor(model: IUser) {
    this._id = model._id;
    this.email = model.email;
    this.avatar = model.avatar;
    this.firstName = model.firstName;
    this.lastName = model.lastName;
    this.role = model.role;
    this.registrationDate = model.registrationDate
  }
}
