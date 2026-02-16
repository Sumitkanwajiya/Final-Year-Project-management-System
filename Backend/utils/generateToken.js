export const generateToken = (user, statusCode, message, res) => {
  const token = user.generateToken();

  const cookieExpireDays = Number(process.env.COOKIE_EXPIRE) || 7; // Default to 7 days if missing
  const cookieOptions = {
    expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    secure: process.env.NODE_ENV === "production", // Only secure in production
  };

  res.status(statusCode).cookie("token", token, cookieOptions).json({
    success: true,
    message,
    user,
    token
  });
}