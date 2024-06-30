const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/moneyTrackerDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Define transaction schema and model
const transactionSchema = new mongoose.Schema({
    description: String,
    amount: Number,
    type: String,
    date: { type: Date, default: Date.now },
});
const Transaction = mongoose.model('Transaction', transactionSchema);

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/transactions', (req, res) => {
    Transaction.find({}, (err, transactions) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(transactions);
        }
    });
});

app.post('/transactions', (req, res) => {
    const newTransaction = new Transaction({
        description: req.body.description,
        amount: req.body.amount,
        type: req.body.type,
    });
    newTransaction.save((err) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send('Transaction added successfully');
        }
    });
});

// Start server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});