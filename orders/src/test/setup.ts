import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[];
    }
  }
}

jest.mock('../nats-wrapper');

let mongo: MongoMemoryServer;
beforeAll(async () => {
  process.env.JWT_KEY = 'asdf';
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  collections.forEach(async (coll: any) => await coll.deleteMany({}));
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
  jest.clearAllMocks();
});

global.signin = () => {
  // build a JWT payload
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };

  //Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  //Build session object
  const session = { jwt: token };

  //Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and decode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string thats the cookie with the encoded data
  return [`express:sess=${base64}`];
};
