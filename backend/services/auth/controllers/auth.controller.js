import { getAuth } from "firebase-admin/auth"
import app from "../config/firebase.js"
import User from "../models/user.models.js"
import jwt from "jsonwebtoken"
import redis from "../../../shared/redis/redis.js"
export const Login=async(req,res)=>{
try {
    const {token}=req.body
    const decoded=await getAuth(app).verifyIdToken(token)
    let user=await User.findOne({firebaseId:decoded.uid})
   if (!user) {
    user = await User.create({
        firebaseId: decoded.uid,
        name: decoded.name,
        email: decoded.email,
        avatar: decoded.picture
    });
}
     const sessionid = jwt.sign(
      {
        userId: user._id,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

  await redis.set(
      `session-${sessionid}`,
      JSON.stringify({
        userId: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }),
      "EX",
      7 * 24 * 60 * 60
    );

   res.cookie("sessionid", sessionid, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
        path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

     res.status(200).json({
      success: true,
      message: "Login successful",
      user
    });

} catch (error) {
     console.log(error);

    res.status(401).json({
      success: false,
      message: "Authentication failed"
    });
}
}

export const Logout = async (req, res) => {
  try {
    const sessionid = req.cookies?.sessionid;

    console.log("Session ID:", sessionid);

    if (sessionid) {
      // Redis session delete
      await redis.del(`session-${sessionid}`);

      // Cookie delete
      res.clearCookie("sessionid", {
        httpOnly: true,
       secure: false,
        sameSite: "strict",
        path: "/"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Logout successful"
    });

  } catch (error) {
    console.log("Logout Error:", error);

    return res.status(500).json({
      success: false,
      message: "Logout failed"
    });
  }
};