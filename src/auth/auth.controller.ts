import { Request, Response } from "express";
import { LoginInput, RegisterInput } from "./auth.schema";
import { loginUser, logoutUser, refreshAccessToken, registerUser, } from "./auth.service";

// Extend Express Request interface to include 'user'
// declare global {
//   namespace Express {
//     interface Request {
//       user?: {
//         id: number;
//         email: string;
//         role: Role
//       };
//     }
//   }
// }


export const registerHandler= async (
    req:Request<{},{},RegisterInput>,
    res:Response
)=>{
    try {
        const {username,email,password,}=req.body;
          // Validate required fields
        if (!email || !password ||! username) {
        res.status(400).json({ message: "Username, Email and password are required" });
        return;
    }
        const user=await registerUser(email, password, username);
        res.status(201).json({user:user,message:"Registered"});
    } catch (error:any) {
        res.status(400).json({message:error.message})
    }
};

export const loginHandler=async(
    req:Request<{},{},LoginInput>,
    res:Response
)=>{
    try {
        const {email,password}=req.body;
        const result= await loginUser(email,password);

        if(!result?.success){
            res.status(result.statusCode ?? 400).json({ message: result.message });
            return;
        }

        const {user, tokens} = result;
        if (!tokens) {
            res.status(500).json({ message: "Token generation failed" });
            return;
        }
        res.cookie("accessToken", tokens.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 1000, //1 hr
        });

        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000, // 1day
        });

        res.status(200).json({ user, accessToken: tokens.accessToken });
    } catch (error:any) {
        res.status(401).json({message:error.message})
    }
};

export const refreshTokenHandler = async (req: Request, res: Response) => {
  try {
    // console.log("token refreshToken: "+req.cookies.refreshToken +"token accessToken: "+ req.cookies.accessToken)
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
       res.status(401).json({ message: "Refresh token required" });
       return;
    }

    const tokens = await refreshAccessToken(refreshToken);

    if (typeof tokens === "string" || !('accessToken' in tokens) || !('refreshToken' in tokens)) {
       res.status(401).json({ message: typeof tokens === "string" ? tokens : (tokens as any).message || "Invalid refresh token" });
       return;
    }

    // Update cookies
    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000, // 1 hour
      sameSite: "strict"
    });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "strict"
    });

     res.status(200).json({ accessToken: tokens.accessToken });
     return;
  } catch (error: any) {
     res.status(401).json({ message: error.message });
     return
  }
};

export const logoutHandler=async(
    req:Request,
    res:Response
)=>{
    try {
        if(!req.user){
            res.status(404).json({message:"Not authenticated"});
            return;
        }

        await logoutUser(req.user.id);

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error:any) {
        res.status(500).json({message:error.message});
    }
};