import { Request, Response } from "express";
import { compare, hash } from "bcrypt-ts";
import { redisClient } from "../config/redis";

import { findUser } from "../services/findUser.services";
import { getUserData } from "../services/getUserData.services";

import { getError } from "../utils/error.utils";
import { createToken } from "../utils/jwt.utils";

import { AuthToken } from "../middleware/auth.middleware";

export interface loginBody {
  authId: string;
  password: string;
}

export interface changePasswordReqBody {
  oldPass: string;
  newPass: string;
}

export const login = async (req: Request, res: Response) => {
  try {
    const input: loginBody = req.body;

    if (!input.authId || !input.password) {
      return res.status(400).json({
        message: "authId and password are required",
      });
    }

    const user = await findUser(input);

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const data = await getUserData({
      authId: user.authId,
      role: user.role,
    });

    const payload: AuthToken = {
      authId: user.authId,
      role: user.role,
    };

    const token = createToken(payload);

    await redisClient.set(`session:${token}`, JSON.stringify(data), {
      EX: 3600,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      data,
    });
  } catch (err) {
    return res.status(400).json(getError(err));
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.token;

    if (token) {
      await redisClient.del(`session:${token}`);
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (err) {
    return res.status(400).json(getError(err));
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const session = await redisClient.get(`session:${token}`);

    if (!session) {
      return res.status(401).json({
        message: "Session expired",
      });
    }

    const data = JSON.parse(session);

    return res.status(200).json({
      message: "Fetched data",
      data,
    });
  } catch (err) {
    return res.status(400).json(getError(err));
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const reqUser = req.user as AuthToken;

    if (!reqUser) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { oldPass, newPass }: changePasswordReqBody = req.body;

    if (!oldPass || !newPass) {
      return res.status(400).json({
        message: "Provide all inputs",
      });
    }

    const payload: loginBody = {
      authId: reqUser.authId,
      password: oldPass,
    };

    const user = await findUser(payload);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await compare(oldPass, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Old password incorrect",
      });
    }

    user.password = await hash(newPass, 10);

    await user.save();

    const token = req.cookies?.token;

    if (token) {
      await redisClient.del(`session:${token}`);
    }

    const data = await getUserData({
      authId: user.authId,
      role: user.role,
    });

    return res.status(200).json({
      message: "Password changed successfully",
      data,
    });
  } catch (err) {
    return res.status(400).json(getError(err));
  }
};
