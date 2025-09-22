import userModel from "../model/user.model.js";
import bcrypt from "bcrypt";
import { APIError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

const register = async (name: string, email: string, password: string) => {
  //check if email already exists
  const userExists = await userModel.findByEmail(email);
  if (userExists) {
    throw new Error("User already exists");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await userModel.createUser(name, email, hashedPassword);
  if (user) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  } else {
    throw new Error("User registration failed");
  }
};

const login = async (email: string, password: string) => {
  console.log("Login attempt for email:", email, "password : ", password);
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
  };

  const token = jwt.sign(userData, config.jwtSecret, {
    expiresIn: "7d",
  });

  return {
    user: userData,
    token,
  };
};

const authServices = {
  register,
  login,
};

export default authServices;
