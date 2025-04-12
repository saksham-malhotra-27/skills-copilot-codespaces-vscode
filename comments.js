// Create web server
const express = require('express');
const app = express();
const cors = require('cors');                                                                                   
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Comment = require('./models/Comment'); // Import the Comment model
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/comments', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
// Define the Comment schema
const commentSchema = new mongoose.Schema({
  name: String,
  email: String,
  comment: String,
});
// Create the Comment model
const Comment = mongoose.model('Comment', commentSchema);
// Define the API routes
app.post('/api/comments', async (req, res) => {
  try {
    const newComment = new Comment(req.body);
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: 'Error saving comment' });
  }
});
app.get('/api/comments', async (req, res) => {
  try {
    const comments = await Comment.find();
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching comments' });
  }
});
app.delete('/api/comments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Comment.findByIdAndDelete(id);
    res.status(200).json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting comment' });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});