export const isAdmin = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Please login",
      });
    }

    const isAdminUser = user.isAdmin === true;

    if (!isAdminUser) {
      return res.status(403).json({
        success: false,
        message: "Forbidden - Admin access required",
      });
    }

    next();
  } catch (error) {
    console.error("Admin Middleware Error:", error);
    return res.status(500).json({
      success: false,
      message: "Admin verification failed",
    });
  }
};