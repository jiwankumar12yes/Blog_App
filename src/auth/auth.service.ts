import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/token';
import { verifyToken } from './../utils/token';
import { JwtPayload } from "./auth.types";


const prisma=new PrismaClient();
const JWT_SECRET=process.env.JWT_SECRET;

export const registerUser=async(
    email:string,
    password:string,
    username:string,
)=>{
    try {
        const hashedPassword= await bcrypt.hash(password,10);
        return prisma.user.create({
            data:{
                email,
                password: hashedPassword,
                username
            },
            select:{
                id: true,
                email: true,
                username: true,
                role: true,
                createdAt: true,
            }
        })
    } catch (error:any) {
    console.log("Failed to register",error)
    }
};

export const loginUser=async(email:string,password:string)=>{
    try {
        const userWithPassword=await prisma.user.findUnique({
            where:{email},
            select: {
                id: true,
                email: true,
                username: true,
                role: true,
                password: true, // needed for comparison
                createdAt: true,
            },
        });
        if (!userWithPassword){
            return { success: false, statusCode: 401, message: "User not found" };
        }

        const isPasswordValid = await bcrypt.compare(password,userWithPassword.password);
        if (!isPasswordValid) {
            return { success: false, statusCode: 401, message: "Invalid password" };
        }

            // Destructure and exclude password
        const { password: _removed, ...user } = userWithPassword;


        const tokens=generateToken(user);

        // await prisma.user.update({
        //     where:{id:user.id},
        //     data:{refreshToken: tokens.refreshToken},
        // });

        return {success:true,user:user,tokens};
    } catch (error:any) {
        console.log("failed to login",error)
        return {success:false,statusCode:500,message: "Internal server error" };
    }
};

export const logoutUser=async(userId:number)=>{
    return prisma.user.update({
        where:{id:userId},
        data:{refreshToken:null},
    });
};

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const payload = verifyToken(refreshToken) as JwtPayload ;

    // console.log(payload)
    const user = await prisma.user.findUnique({
      where: { 
        id: payload.id,
        // refreshToken: refreshToken
      }
    });

    if (!user) {
      return ("Invalid refresh token");
    }

    const tokens = generateToken(user);

    // Update refresh token in database
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken }
    });

    return tokens;
  } catch (error:any) {
   return ({ message: error.message });
  }
  }
;

