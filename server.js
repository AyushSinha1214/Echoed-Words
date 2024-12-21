import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define Quote Schema
const quoteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  category: { type: String, required: false, default: 'General' },
  createdAt: { type: Date, default: Date.now },
});

const Quote = mongoose.model('Quote', quoteSchema);

// API Routes
app.post('/api/quotes', async (req, res) => {
  const { text, category } = req.body;
  if (!text) return res.status(400).send('Quote text is required.');
  
  try {
    const newQuote = new Quote({ text, category });
    await newQuote.save();
    res.status(201).json(newQuote);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/api/quotes', async (req, res) => {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 });
    res.status(200).json(quotes);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
