export const generateToken = (user, statusCode, message, res) => {
  const token = user.generateToken();

  const cookieExpireDays = Number(process.env.COOKIE_EXPIRE) || 7; // Default to 7 days if missing
  // Determine if we are in a production-like environment
  // Check NODE_ENV or if the frontend URL is a deployed one
  const isProduction = process.env.NODE_ENV === 'production' || (process.env.FRONTEND_URL && process.env.FRONTEND_URL.includes('vercel.app'));

  const cookieOptions = {
    expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: isProduction ? "None" : "Lax",
    secure: isProduction, // Must be true for SameSite=None
  };

  res.status(statusCode).cookie("token", token, cookieOptions).json({
    success: true,
    message,
    user,
    token
  });
}