const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
// const mailService = require('./mail-service');
const tokenService = require("./token-service");
const UserDto = require("../dtos/user-dto");
const ApiError = require("../exceptions/api-error");

async function registration(email, password, firstName, lastName, avatar='', isAdmin=false) {
  const candidate = await UserModel.findOne({ email });
  if (candidate) {
    throw ApiError.BadRequest(
      `Пользователь с почтовым адресом ${email} уже существует`
    );
  }
  const hashPassword = await bcrypt.hash(password, 3);
  const activationLink = uuid.v4();

  let role = 'user'; 

  if (isAdmin) {
    role = 'admin'; 
  }

  const user = await UserModel.create({
    email,
    password: hashPassword,
    firstName,
    lastName,
    activationLink,
    avatar,
    role,
  });
  // await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

  const userDto = new UserDto(user); // id, email, isActivated
  const tokens = tokenService.generateTokens({ ...userDto });
  await tokenService.saveToken(userDto.id, tokens.refreshToken);

  return { ...tokens, user: userDto };
}

// async function updateUserData(id, email, password, firstName, lastName, avatar) {
//   const candidate = await UserModel.findOne({ email });
//   if (candidate && candidate.email !== email) {
//     throw ApiError.BadRequest(
//       `Пользователь с почтовым адресом ${email} уже существует`
//     );
//   }
//   const hashPassword = await bcrypt.hash(password, 3);
//   // const activationLink = uuid.v4();

//   const user = await UserModel.findByIdAndUpdate(id, {
//     email,
//     password: hashPassword,
//     firstName,
//     lastName,
//     avatar,
//   });
//   // await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

//   const userDto = new UserDto(user); // id, email, isActivated
//   const tokens = tokenService.generateTokens({ ...userDto });
//   await tokenService.saveToken(userDto.id, tokens.refreshToken);

//   return { ...tokens, user: userDto };
// }

async function validateRegistration(email, password, firstName, lastName) {
  const errors = {};
  const candidate = await UserModel.findOne({ email });
  if (candidate) {
    errors.email = `Пользователь с почтовым адресом ${email} уже существует`;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  const isValid = Object.keys(errors).length === 0;

  return { isValid, errors };
}

async function activate(activationLink) {
  const user = await UserModel.findOne({ activationLink });
  if (!user) {
    throw ApiError.BadRequest("Неккоректная ссылка активации");
  }
  user.isActivated = true;
  await user.save();
}

async function login(email, password) {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw ApiError.BadRequest("Пользователь с таким email не найден");
  }
  const isPassEquals = await bcrypt.compare(password, user.password);
  if (!isPassEquals) {
    throw ApiError.BadRequest("Неверный пароль");
  }
  const userDto = new UserDto(user);
  const tokens = tokenService.generateTokens({ ...userDto });

  await tokenService.saveToken(userDto.id, tokens.refreshToken);
  return { ...tokens, user: userDto };
}

async function logout(refreshToken) {
  const token = await tokenService.removeToken(refreshToken);
  return token;
}

async function refresh(refreshToken) {
  if (!refreshToken) {
    throw ApiError.UnauthorizedError();
  }
  const userData = tokenService.validateRefreshToken(refreshToken);
  const tokenFromDb = await tokenService.findToken(refreshToken);
  if (!userData || !tokenFromDb) {
    throw ApiError.UnauthorizedError();
  }
  const user = await UserModel.findById(userData.id);
  const userDto = new UserDto(user);
  const tokens = tokenService.generateTokens({ ...userDto });

  await tokenService.saveToken(userDto.id, tokens.refreshToken);
  return { ...tokens, user: userDto };
}

async function getAllUsers() {
  const users = await UserModel.find();
  return users;
}

module.exports = {
  registration,
  validateRegistration,
  login,
  logout,
  activate,
  refresh,
  getAllUsers,
};
