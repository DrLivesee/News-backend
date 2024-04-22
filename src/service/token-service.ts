import * as jwt from 'jsonwebtoken';
import tokenModel, {IToken} from '@src/models/tokenModel';
import { DeleteResult } from 'mongodb';

interface ITokenPayload {
  email: string;
  _id: string;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

function generateTokens(payload: ITokenPayload) {
  const accessToken: string = jwt.sign(
    payload,
    process.env.JWT_ACCESS_SECRET as string,
    { expiresIn: "1h" }
  );
  const refreshToken: string = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: "1d" }
  );
  return {
    accessToken,
    refreshToken,
  };
}

function validateAccessToken(token: string) {
  try {
    const userData: string | jwt.JwtPayload  = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);
    return userData;
  } catch (e) {
    return null;
  }
}

function validateRefreshToken(token: string) {
  try {
    const userData: string | jwt.JwtPayload = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET as string
    );
    return userData;
  } catch (e) {
    return null;
  }
}

async function saveToken(userId: string, refreshToken: string) {
  const tokenData: IToken = await tokenModel.findOne({ user: userId });
  if (tokenData) {
    tokenData.refreshToken = refreshToken as string;
    return tokenData.save();
  }
  const token: IToken = await tokenModel.create({ user: userId, refreshToken });
  return token;
}

async function removeToken(refreshToken: string) {
  const tokenData: DeleteResult = await tokenModel.deleteOne({ refreshToken });
  return tokenData;
}

async function findToken(refreshToken: string) {
  const tokenData: IToken = await tokenModel.findOne({ refreshToken });
  return tokenData;
}

export {
  generateTokens,
  validateAccessToken,
  validateRefreshToken,
  saveToken,
  removeToken,
  findToken,
};
