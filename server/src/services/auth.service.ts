import bcrypt from "bcrypt";
import { userModel } from "../model/index.js";
import { APIError } from "../utils/index.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const register = async (
  name: string,
  email: string,
  password: string,
  role: string = "user",
) => {
  email = email.toLowerCase();
  //check if email already exists
  const hashedPassword = await bcrypt.hash(password, 10);
  const userData = await userModel.createUser(
    name,
    email,
    hashedPassword,
    role,
  );

  const tokenData = {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    role: userData.role,
  };
  const token = await jwt.sign(tokenData, config.jwtSecret, {
    expiresIn: "7d",
  });

  return {
    user: {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    },
    token: token,
  };
};

export const login = async (email: string, password: string) => {
  // check if the user exists and password matches
  email = email.toLowerCase();
  const user = await userModel.findByEmail(email);

  if (!user) {
    throw new APIError("User not found", 404);
  }

  if (!user.password) {
    throw new APIError("Password not set", 400);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new APIError("Invalid username / password", 401);
  }
  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(userData, config.jwtSecret, {
    expiresIn: "7d",
  });

  return {
    user: userData,
    token,
  };
};
