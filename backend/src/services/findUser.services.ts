import Auth,{IAuth} from '../models/Auth.module'
import {compare} from 'bcrypt-ts' 
import { loginBody } from "../controllers/auth.controller";



export const findUser = async ({authId , password} : loginBody) => { 
    try{
        if(!authId || !password){
            throw new Error("AuthId and password are required");
        }
        
        const user = await Auth.findOne({authId:authId});
        if(!user){
            throw new Error("Invalid credentials")
        }
        
        const isMatch = await compare(password,user.password);
        
        if(!isMatch){
            throw new Error("Invalid credentials")
        }
        
        return user;
    }catch(err:any){
        throw err
    }
}