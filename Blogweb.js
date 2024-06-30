const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/blogDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Define post schema and model
const postSchema = new mongoose.Schema({
    title: String,
    content: String,
});
const Post = mongoose.model('Post', postSchema);

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/create.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'create.html'));
});

app.get('/posts', (req, res) => {
    Post.find({}, (err, posts) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(posts);
        }
    });
});

app.post('/posts', (req, res) => {
    const newPost = new Post({
        title: req.body.title,
        content: req.body.content,
    });
    newPost.save((err) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send('Post created successfully');
        }
    });
});

// Start server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});