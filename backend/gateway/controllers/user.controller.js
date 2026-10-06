import redis from "../../shared/redis/redis.js";


export const CurrentUser = async (req, res) => {
  try {
    // ✅ Redis se direct user fetch karo (protect middleware ke bina)
    const sessionid = req.cookies?.sessionid;

    if (!sessionid) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const session = await redis.get(`session-${sessionid}`);

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Session expired",
      });
    }

    const user = JSON.parse(session);

    return res.status(200).json({
      success: true,
      userId: user._id || user.userId,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      plan: user.plan || "free",
      credits: Number(user.credits ?? 0),
      totalcredits: Number(user.totalcredits ?? 0),
      isAdmin: user.isAdmin || false, // ✅ Admin flag in response
    });

  } catch (error) {
    console.error("CurrentUser Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get current user",
    });
  }
};