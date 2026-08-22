import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;
let dbTelemetry = {
  isConnected: false,
  mode: 'Disconnected',
  uri: '',
  dbName: 'orthomorph_db',
  connectedAt: null,
  clientHost: '',
};

export const connectDB = async () => {
  const customUri = process.env.MONGODB_URI;

  // Try connecting to configured MongoDB URI first (Local daemon or MongoDB Atlas)
  if (customUri) {
    try {
      console.log(`📡 Connecting to MongoDB URI: ${customUri}...`);
      await mongoose.connect(customUri, {
        serverSelectionTimeoutMS: 3000, // Quick timeout to fallback if no daemon is running
      });

      dbTelemetry = {
        isConnected: true,
        mode: customUri.includes('mongodb+srv://') ? 'MongoDB Atlas (Cloud)' : 'MongoDB Standalone (Local)',
        uri: customUri.replace(/:([^:@]+)@/, ':****@'), // Obfuscate password
        dbName: mongoose.connection.name || 'orthomorph_db',
        connectedAt: new Date().toISOString(),
        clientHost: mongoose.connection.host || '127.0.0.1',
      };

      console.log(`✅ [MongoDB Connected] Mode: ${dbTelemetry.mode} | Database: ${dbTelemetry.dbName} (${mongoose.connection.host})`);
      return dbTelemetry;
    } catch (err) {
      console.warn(`⚠️ Could not connect to external MongoDB daemon (${err.message}). Starting High-Performance Embedded MongoDB...`);
    }
  }

  // Fallback: Start embedded MongoMemoryServer for instant zero-configuration local database
  try {
    mongoMemoryServer = await MongoMemoryServer.create({
      instance: {
        dbName: 'orthomorph_db',
      },
    });

    const memoryUri = mongoMemoryServer.getUri();
    await mongoose.connect(memoryUri);

    dbTelemetry = {
      isConnected: true,
      mode: 'Embedded MongoDB Engine (Zero-Config Active)',
      uri: memoryUri,
      dbName: 'orthomorph_db',
      connectedAt: new Date().toISOString(),
      clientHost: 'Embedded In-Memory Host',
    };

    console.log(`✅ [Embedded MongoDB Started] Full Mongoose ODM active at: ${memoryUri}`);
    return dbTelemetry;
  } catch (embeddedErr) {
    console.error('❌ Failed to initialize MongoDB engine:', embeddedErr.message);
    dbTelemetry.isConnected = false;
    dbTelemetry.mode = 'Connection Error';
    throw embeddedErr;
  }
};

export const getDbStatus = () => {
  return {
    ...dbTelemetry,
    readyState: mongoose.connection.readyState,
    readyStateText: ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'][mongoose.connection.readyState] || 'Unknown',
  };
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
  dbTelemetry.isConnected = false;
};
