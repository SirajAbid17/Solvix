export const portfolioUser = (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"];
    const email = req.headers["x-user-email"];
    const name = req.headers["x-user-name"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID missing",
      });
    }

    req.user = {
      userId: String(userId),
      email: email || "",
      name: name || "",
    };

    next();
  } catch (error) {
    console.error("Portfolio User Middleware:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};