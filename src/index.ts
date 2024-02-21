import mongoose from 'mongoose';
import app from './app';
import 'dotenv/config'

// Mongoose setup
mongoose.set('strictQuery', false);
const PORT = process.env.PORT || 8080;

mongoose.connect(process.env.MONGO_URL ?? "").then(() => {
  app.listen(PORT, () => console.log(`Listening at server port: ${PORT}`));
}).catch(console.error);
