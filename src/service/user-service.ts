import UserModel, {
  IUser,
  IUserRegistration,
  IUserValidate,
  IUserSignIn
} from "@src/models/userModel";
import { JwtPayload } from "jsonwebtoken";
import * as bcrypt from "bcrypt";

import {
  generateTokens,
  saveToken,
  validateRefreshToken,
  findToken,
  removeToken,
  ITokens,
} from "@src/service/token-service";
import UserDto from "@src/dtos/user-dto";
import { UnauthorizedError, BadRequestError } from "@src/exceptions/api-error";
import { DeleteResult } from "mongodb";
import { IToken } from "@src/models/tokenModel";

async function registration(user: IUserRegistration) {
  const {
    email,
    password,
    firstName,
    lastName,
    avatar = "",
    isAdmin = false,
  } = user;

  const candidate: IUser = await UserModel.findOne({ email });
  if (candidate) {
    throw BadRequestError(
      `Пользователь с почтовым адресом ${email} уже существует`
    );
  }
  const hashPassword: string = await bcrypt.hash(password, 3);

  let role: string = "user";

  if (isAdmin) {
    role = "admin";
  }

  const currentUser: IUser = await UserModel.create({
    email,
    password: hashPassword,
    firstName,
    lastName,
    avatar,
    registrationDate: Date.now(),
    role,
  });

  const userDto: UserDto = new UserDto(currentUser);
  const tokens: ITokens = generateTokens({ ...userDto });
  await saveToken(userDto._id, tokens.refreshToken);

  return { ...tokens, user: userDto };
}

async function validateRegistration(user: IUserValidate) {
  const { email, password, firstName, lastName } = user;

  const errors: { [key: string]: string } = {};
  const candidate: IUser = await UserModel.findOne({ email });
  if (candidate) {
    errors.email = `Пользователь с почтовым адресом ${email} уже существует`;
  }

  const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    errors.formatEmail = "Неверный формат email";
  }

  if (password.split("").length < 6 || password.split("").length > 32) {
    errors.formatPassword =
      "Пароль должен содержать не менее 6 и не более 32 символов";
  }

  if (!firstName) {
    errors.formatFirstName = "Введите ваше имя";
  }

  if (!lastName) {
    errors.formatLastName = "Введите вашу фамилию";
  }

  const isValid: boolean = Object.keys(errors).length === 0;

  return { isValid, errors };
}

async function login(user: IUserSignIn) {
  const { email, password } = user;

  const currentUser: IUser = await UserModel.findOne({ email });
  if (!currentUser) {
    throw BadRequestError("Пользователь с таким email не найден");
  }
  const isPassEquals: boolean = await bcrypt.compare(password, currentUser.password);
  if (!isPassEquals) {
    throw BadRequestError("Неверный пароль");
  }
  const userDto: UserDto = new UserDto(currentUser);
  const tokens: ITokens = generateTokens({ ...userDto });

  await saveToken(userDto._id, tokens.refreshToken);
  return { ...tokens, user: userDto };
}

async function logout(refreshToken: string) {
  const token: DeleteResult = await removeToken(refreshToken);
  return token;
}

async function refresh(refreshToken: string) {
  if (!refreshToken) {
    throw UnauthorizedError();
  }
  const userData: JwtPayload = validateRefreshToken(refreshToken) as JwtPayload;
  const tokenFromDb: IToken = await findToken(refreshToken);
  if (!userData || !tokenFromDb) {
    throw UnauthorizedError();
  }
  const user: IUser = await UserModel.findById(userData._id);
  const userDto: UserDto = new UserDto(user);
  const tokens: ITokens = generateTokens({ ...userDto });

  await saveToken(userDto._id, tokens.refreshToken);
  return { ...tokens, user: userDto };
}

async function getAllUsers() {
  const users: IUser[] = await UserModel.find();
  return users;
}

export {
  registration,
  validateRegistration,
  login,
  logout,
  refresh,
  getAllUsers,
};
