import jwt from "jsonwebtoken";

export const authenticateUserCookie = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      tokenError: true,
      message: "Please Login First",
    });
  }

  jwt.verify(token, process.env.TOKEN, (err, data) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ tokenError: true, message: "Session has expired. Please log in again." });
      }
      console.error(err);
      return res.status(403).json({ tokenError: true, message: "Access verification failed. Please log in again." });
    }

    req.userId = data.userId;
    req.role = data.role;

    next();
  });
};
