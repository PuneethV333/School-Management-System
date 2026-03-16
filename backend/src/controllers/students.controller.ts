import { Request,Response } from "express"
import { getError } from "../utils/error.utils"
import { AuthToken } from "../middleware/auth.middleware"

export const getStudentsByClass = (req:Request,res:Response) => {
    try{
        const reqUser = req.user as AuthToken;
        if(!reqUser){
            return res.status(404).json({
                message:"Unauthorized"
            });
        }
        
        
        
    }catch(err){
        return res.status(400).json(getError(err))
    }
}
