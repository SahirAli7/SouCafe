import jwt from "jsonwebtoken";

// Fail-fast if secret is missing
// if (!process.env.JWT_SECRET) {
//   console.error("FATAL: JWT_SECRET is not defined");
//   process.exit(1);
// } else {
//   console.log("JWT_SECRET loaded:", process.env.JWT_SECRET); // Debugging log to verify if secret is loaded
// }

const auth = (req, res, next) => {
  // 1. Extract Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Missing Authorization header" });
  }

  // 2. Validate header format: "Bearer <token>"
  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Malformed Authorization header" });
  }

  try {
    // 3. Verify JWT signature and expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach decoded payload (e.g. user id, role) to request
    req.user = decoded;
    return next();
  } catch (err) {
    // 4. Handle token expiration vs. other errors
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ error: "Token expired. Please log in again." });
    }
    console.warn("JWT verification failed:", err);
    return res.status(403).json({ error: "Invalid authentication token" });
  }
};

export default auth;
