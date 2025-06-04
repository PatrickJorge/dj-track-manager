import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection (use MongoDB Atlas or local)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dj-track-manager';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define schemas
const trackSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  bpm: { type: Number, required: true },
  key: { type: String, required: true },
  genre: { type: String, required: true },
  subgenre: { type: String },
  duration: { type: String, required: true },
  links: {
    spotify: { type: String },
    soundcloud: { type: String },
    beatport: { type: String },
    youtube: { type: String },
  },
  notes: { type: String },
}, { timestamps: true });

const setSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  tracks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Track' }],
}, { timestamps: true });

// Create models
const Track = mongoose.model('Track', trackSchema);
const Set = mongoose.model('Set', setSchema);

// Track routes
app.get('/api/tracks', async (req, res) => {
  try {
    const { search, bpmMin, bpmMax, key, genre } = req.query;
    
    const query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { artist: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (bpmMin || bpmMax) {
      query.bpm = {};
      if (bpmMin) query.bpm.$gte = parseInt(bpmMin);
      if (bpmMax) query.bpm.$lte = parseInt(bpmMax);
    }
    
    if (key) query.key = key;
    if (genre) query.genre = genre;
    
    const tracks = await Track.find(query).sort({ createdAt: -1 });
    res.send(tracks);
  } catch (error) {
    console.error('Get tracks error:', error);
    res.status(500).send({ message: 'Server error' });
  }
});

app.get('/api/tracks/:id', async (req, res) => {
  try {
    const track = await Track.findById(req.params.id);
    if (!track) {
      return res.status(404).send({ message: 'Track not found' });
    }
    res.send(track);
  } catch (error) {
    console.error('Get track error:', error);
    res.status(500).send({ message: 'Server error' });
  }
});

app.post('/api/tracks', async (req, res) => {
  try {
    const track = new Track(req.body);
    await track.save();
    res.status(201).send(track);
  } catch (error) {
    console.error('Create track error:', error);
    res.status(500).send({ message: 'Server error' });
  }
});

app.put('/api/tracks/:id', async (req, res) => {
  try {
    const track = await Track.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!track) {
      return res.status(404).send({ message: 'Track not found' });
    }
    
    res.send(track);
  } catch (error) {
    console.error('Update track error:', error);
    res.status(500).send({ message: 'Server error' });
  }
});

app.delete('/api/tracks/:id', async (req, res) => {
  try {
    const track = await Track.findByIdAndDelete(req.params.id);
    
    if (!track) {
      return res.status(404).send({ message: 'Track not found' });
    }
    
    // Remove track from any sets
    await Set.updateMany(
      {},
      { $pull: { tracks: req.params.id } }
    );
    
    res.send({ message: 'Track deleted' });
  } catch (error) {
    console.error('Delete track error:', error);
    res.status(500).send({ message: 'Server error' });
  }
});

// Set routes
app.get('/api/sets', async (req, res) => {
  try {
    const sets = await Set.find().sort({ createdAt: -1 });
    res.send(sets);
  } catch (error) {
    console.error('Get sets error:', error);
    res.status(500).send({ message: 'Server error' });
  }
});

app.get('/api/sets/:id', async (req, res) => {
  try {
    const set = await Set.findById(req.params.id).populate('tracks');
    
    if (!set) {
      return res.status(404).send({ message: 'Set not found' });
    }
    
    res.send(set);
  } catch (error) {
    console.error('Get set error:', error);
    res.status(500).send({ message: 'Server error' });
  }
});

app.post('/api/sets', async (req, res) => {
  try {
    const set = new Set(req.body);
    await set.save();
    res.status(201).send(set);
  } catch (error) {
    console.error('Create set error:', error);
    res.status(500).send({ message: 'Server error' });
  }
});

app.put('/api/sets/:id', async (req, res) => {
  try {
    const set = await Set.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('tracks');
    
    if (!set) {
      return res.status(404).send({ message: 'Set not found' });
    }
    
    res.send(set);
  } catch (error) {
    console.error('Update set error:', error);
    res.status(500).send({ message: 'Server error' });
  }
});

app.delete('/api/sets/:id', async (req, res) => {
  try {
    const set = await Set.findByIdAndDelete(req.params.id);
    
    if (!set) {
      return res.status(404).send({ message: 'Set not found' });
    }
    
    res.send({ message: 'Set deleted' });
  } catch (error) {
    console.error('Delete set error:', error);
    res.status(500).send({ message: 'Server error' });
  }
});

// Track management in sets
app.post('/api/sets/:id/tracks', async (req, res) => {
  try {
    const { trackId } = req.body;
    
    // Check if track exists
    const track = await Track.findById(trackId);
    if (!track) {
      return res.status(404).send({ message: 'Track not found' });
    }
    
    const set = await Set.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { tracks: trackId } },
      { new: true }
    ).populate('tracks');
    
    if (!set) {
      return res.status(404).send({ message: 'Set not found' });
    }
    
    res.send(set);
  } catch (error) {
    console.error('Add track to set error:', error);
    res.status(500).send({ message: 'Server error' });
  }
});

app.delete('/api/sets/:id/tracks/:trackId', async (req, res) => {
  try {
    const set = await Set.findByIdAndUpdate(
      req.params.id,
      { $pull: { tracks: req.params.trackId } },
      { new: true }
    ).populate('tracks');
    
    if (!set) {
      return res.status(404).send({ message: 'Set not found' });
    }
    
    res.send(set);
  } catch (error) {
    console.error('Remove track from set error:', error);
    res.status(500).send({ message: 'Server error' });
  }
});

app.put('/api/sets/:id/reorder', async (req, res) => {
  try {
    const { trackIds } = req.body;
    
    const set = await Set.findById(req.params.id);
    
    if (!set) {
      return res.status(404).send({ message: 'Set not found' });
    }
    
    set.tracks = trackIds;
    await set.save();
    
    const populatedSet = await Set.findById(set._id).populate('tracks');
    res.send(populatedSet);
  } catch (error) {
    console.error('Reorder tracks error:', error);
    res.status(500).send({ message: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});