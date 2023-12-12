import mongoose from 'mongoose';
import { logger } from '@/utils/logger';
import { DB_NAME, MONGODB_URI } from '@/config';
const mongodb = require("mongodb");
import { MongoClient } from "mongodb";

const client = new MongoClient(MONGODB_URI);
const db = client.db(DB_NAME);


const connectDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info(`Connected To Database`);
  } catch (error) {
    logger.error(error);
  }
};

export default connectDatabase;
