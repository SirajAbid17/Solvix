
import axios from "axios";
import redis from "../../shared/redis/redis.js";


export const checkCredits = async (req, res, next) => {
  try {
   
    if (req.creditsAlreadyDeducted) {
      return next();
    }

    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const currentCredits = Number(user.credits || 0);

    if (currentCredits < 2) {
      return res.status(402).json({
        success: false,
        message: "Insufficient credits. Please purchase more credits.",
        credits: currentCredits,
        required: 2,
      });
    }

    const newCredits = currentCredits - 2;

   
    try {
      await axios.post(
        `${process.env.Auth_Services}/deduct-credits`,
        {
          userId: user.userId || user._id,
          credits: newCredits,
          deducted: 2,
          service: req.path.split("/")[1] || "unknown",
        },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 5000,
        }
      );
    } catch (updateError) {
      console.error(" Credit update failed:", updateError.message);
      return res.status(500).json({
        success: false,
        message: "Failed to process credits. Please try again.",
      });
    }

    
    try {
      const sessionKey = `session-${req.cookies?.sessionid}`;
      const sessionData = await redis.get(sessionKey);

      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        parsed.credits = newCredits;

        await redis.set(
          sessionKey,
          JSON.stringify(parsed),
          "EX",
          7 * 24 * 60 * 60
        );
      }
    } catch (redisError) {
      console.error("Redis update failed:", redisError.message);
    }


    req.creditsAlreadyDeducted = true;
    req.remainingCredits = newCredits;
    req.creditsDeducted = 2;

    console.log(`Credits deducted: 2 | Remaining: ${newCredits}`);

    next();
  } catch (error) {
    console.error(" Credits middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Credit processing error. Please try again.",
    });
  }
};


export const skipCredits = (req, res, next) => {
  next();
};