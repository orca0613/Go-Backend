import mongoose from 'mongoose';
import App from './app';
import { ID, PASSWORD } from './util/constants';

// // Mongoose setup
mongoose.set('strictQuery', false);
const mongoUrl = `mongodb+srv://${ID}:${PASSWORD}@cluster1.74es69a.mongodb.net/GO_PROBLEM`;
const PORT = 3001;

mongoose.connect(mongoUrl).then(() => {
  App.listen(PORT, () => console.log(`Listening at server port: ${PORT}`));

  // Insert Test Data in development if needed
  // WARNING: Comment out line immediately after creation!
  // Invoice.insertMany(invoiceData);
}).catch(console.error);
