import * as mongoose from 'mongoose';
const url = 'mongodb://mongo:27017/time-tracker'
export async function connect() {
  await mongoose.connect(url, { useNewUrlParser: true });
  console.log("Connected to database " + url);
}