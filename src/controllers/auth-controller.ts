import { Request, Response, NextFunction } from "express";
// const userService = require("../service/user-service");
import { Result, ValidationError, validationResult } from "express-validator";
import { BadRequestError } from "@src/exceptions/api-error";
import {
  registration as register,
  validateRegistration as validateReg,
  validateSignIn as validateSign,
  login as signIn,
  logout as signOut,
  deleteUser as deleteCurrentUser,
  refresh as refreshTok,
  getAllUsers,
} from "@src/service/user-service";
import {
  IUser,
  IUserRegistration,
  IUserValidate,
  IUserSignIn,
  IUserWithTokens,
  IValidateResponse,
} from "@src/models/userModel";
import { DeleteResult } from "mongodb";

async function registration(req: Request, res: Response, next: NextFunction) {
  try {
    const errors: Result<ValidationError> = validationResult(req);
    if (!errors.isEmpty()) {
      return next(BadRequestError("Ошибка при валидации", errors.array()));
    }
    const user: IUserRegistration = req.body;
    const userData: IUserWithTokens = await register(user);

    res.cookie("refreshToken", userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res.json(userData);
  } catch (e) {
    next(e);
  }
}

async function validateRegistration(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user: IUserValidate = req.body;
    const response: IValidateResponse = await validateReg(user);

    return res.json(response);
  } catch (e) {
    next(e);
  }
}

async function validateLogin(req: Request, res: Response, next: NextFunction) {
  try {
    const user: IUserValidate = req.body;
    const response: IValidateResponse = await validateSign(user);

    return res.json(response);
  } catch (e) {
    next(e);
  }
}

async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const user: IUserSignIn = req.body;
    const userData: IUserWithTokens = await signIn(user);
    res.cookie("refreshToken", userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res.json(userData);
  } catch (e) {
    next(e);
  }
}

async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.cookies as { refreshToken: string };
    const token: DeleteResult = await signOut(refreshToken);
    res.clearCookie("refreshToken");
    return res.json(token);
  } catch (e) {
    next(e);
  }
}

async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    const id: string = req.params.id;
    await deleteCurrentUser(id);

    const { refreshToken } = req.cookies as { refreshToken: string };
    await signOut(refreshToken);
    res.clearCookie("refreshToken");
    res.send(`User with ID ${id} has been deleted.` as string);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.cookies as { refreshToken: string };
    const userData: IUserWithTokens = await refreshTok(refreshToken);
    res.cookie("refreshToken", userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res.json(userData);
  } catch (e) {
    next(e);
  }
}

async function getUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const users: IUser[] = await getAllUsers();
    return res.json(users);
  } catch (e) {
    next(e);
  }
}

export {
  registration,
  validateRegistration,
  validateLogin,
  login,
  logout,
  deleteUser,
  refresh,
  getUsers,
};
