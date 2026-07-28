export const CurrentUser = async (req, res) => {
  try {
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }
    
   
    return res.status(200).json({
      userId: req.user.userId,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar
    });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User error"
    });
  }
};