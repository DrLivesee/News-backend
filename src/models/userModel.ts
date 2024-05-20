import UserDto from '@src/dtos/user-dto';
import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar: IAvatar;
  registrationDate: Date;
  role: string;
}

export interface IAvatar {
  avatarUrl: string;
  public_id: string;
}

export interface IUserRegistration {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar?: IAvatar;
  isAdmin?: boolean;
}

export interface IUserSignIn {
  email: string;
  password: string;
}

export interface IUserValidate {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface IUserWithTokens {
  user: UserDto;
  accessToken: string;
  refreshToken: string;
}

export interface IValidateResponse {
  isValid: boolean;
  errors: {
      [key: string]: string;
  };
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  avatar: {
    type: {avatarUrl: String, public_id: String},
    default: {},
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
});

export default model<IUser>('User', userSchema);
