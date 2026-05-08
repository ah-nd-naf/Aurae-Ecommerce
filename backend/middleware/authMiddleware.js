import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  // 1. Get the token from the Authorization header (e.g., "Bearer eyJhb...")
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 2. Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Attach the decoded user payload (userId, email) to the request object
    req.user = decoded;
    
    // 4. Move to the next middleware or route handler
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
};
