import redis from "../../shared/redis/redis.js";

const protect = async (req, res, next) => {
  try {
    const sessionid = req.cookies?.sessionid;

    if (!sessionid) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    const session = await redis.get(`session-${sessionid}`);

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Session expired"
      });
    }

    req.user = JSON.parse(session);

    next();

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Auth middleware error"
    });
  }
};

export default protect;