import jwt,{Secret,JwtPayload} from "jsonwebtoken";

import AuthModule from "../models/Auth.module";
import { findUser } from "../services/findUser.services";
import { getError } from "../utils/error.utils";

import { Request, Response } from "express";

export interface loginBody {
    authId:string;
    password:string
}

const login = async (req: Request, res: Response) => {
    try {
        const input:loginBody = req.body;
        const user = await findUser(input);
        
        
        
    } catch (err: any) {
        return res.status(500).send(getError(err));
    }
}
