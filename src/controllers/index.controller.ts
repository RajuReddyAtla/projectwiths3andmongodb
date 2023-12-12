import { AWS_BUCKET_NAME } from '@/config';
import AWS from 'aws-sdk';// Import necessary types from Express
import { NextFunction, Request, Response } from 'express';
// Define a simple home route handler
export const home = (req: Request, res: Response, next: NextFunction) => {
  try {
   
    return res.status(200).json({
      success: true,
      message: 'Hello second cicd',
    });
  } catch (error) {
   
    next(error);
  }
};
 