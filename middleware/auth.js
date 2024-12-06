import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../constants.js';
import JWTWhitelist from '../models/jwtWhitelist.js';

export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send('No token provided');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const isWhitelisted = await JWTWhitelist.findOne({ token });

    if (!isWhitelisted) {
      return res.status(401).send('Token not authorized');
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).send('Invalid or expired token');
  }
};

export const authorize = (roles) => (req, res, next) => {
  const { user } = req;

  if (!roles.includes(user.role)) {
    return res.status(403).send('Access denied');
  }

  next();
};
