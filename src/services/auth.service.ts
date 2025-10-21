import userModel from "../model/user.model.js";
import bcrypt from "bcrypt";
import { APIError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

const register = async (name: string, email: string, password: string) => {
  //check if email already exists
  const userExists = await userModel.findByEmail(email);

  if (userExists) {
    throw new APIError("User already exists", 409);
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const userData = await userModel.createUser(name, email, hashedPassword);
  
  const tokenData = {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    isAdmin: userData.isAdmin,
  }
  const token = await jwt.sign(tokenData, config.jwtSecret, {
    expiresIn: "7d",
  });

  if (userData) {
    return {
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        isAdmin: userData.isAdmin
      },
      token: token
    };
  } else {
    throw new APIError("User registration failed", 500);
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
    isAdmin: user.isAdmin,
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
