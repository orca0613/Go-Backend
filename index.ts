import mongoose from 'mongoose';
import App from './app';
import 'dotenv/config'

// Mongoose setup
mongoose.set('strictQuery', false);
const PORT = 3001;

mongoose.connect(process.env.MONGO_URL ?? "").then(() => {
  App.listen(PORT, () => console.log(`Listening at server port: ${PORT}`));

  // Insert Test Data in development if needed
  // WARNING: Comment out line immediately after creation!
  // Invoice.insertMany(invoiceData);
}).catch(console.error);
