import jwt from 'jsonwebtoken';
import express from 'express';
require('dotenv/config');
let secret: string;
if (process.env.SECRET) {
  secret = process.env.SECRET;
} else {
  console.log('environment variable secret not set');
  process.exit(1);
}
function adminAuth(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  const token: any = req.header('authorization');
  if (!token) return res.status(401).json('Access denied only admin');

  try {
    let bearerToken = token.split(' ')[1];
    const decoded: any = jwt.verify(bearerToken, secret);

    if (decoded.isAdmin) {
      res.locals.admin = decoded;
      return next();
    } else {
      return res.status(403).json('only admin allowed');
    }
  } catch (error) {
    return res.status(400).json('invalid token');
  }
}
export default adminAuth;
