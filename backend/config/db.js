const mongoose = require('mongoose');

let isConnected = false;
let isFallbackMode = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/email_assistant';

  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500, // Quick timeout if MongoDB is not running locally
    });
    isConnected = true;
    isFallbackMode = false;
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ Local MongoDB server not reachable (${error.message}).`);
    console.log(`🚀 Activating Built-in High Performance File Store for seamless local execution.`);
    isConnected = false;
    isFallbackMode = true;
    return false;
  }
};

const getDbStatus = () => {
  return {
    connected: isConnected,
    mode: isFallbackMode ? 'Embedded Local Store' : 'MongoDB / Mongoose',
    uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/email_assistant'
  };
};

module.exports = { connectDB, getDbStatus, isFallbackMode: () => isFallbackMode };
