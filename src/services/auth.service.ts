import * as userModel from "../model/user.model.js";
import bcrypt from "bcrypt";
import { APIError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const register = async (
  name: string,
  email: string,
  password: string,
) => {
  //check if email already exists
  const hashedPassword = await bcrypt.hash(password, 10);
  const userData = await userModel.createUser(name, email, hashedPassword);

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
  const user = await userModel.findByEmail(email);

  if (!user) {
    throw new APIError("User not found", 404);
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
