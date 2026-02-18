const mongoose = require('mongoose');

// connection logic
mongoose.connect(process.env.MONGO_DB_STRING);

// connection stage
const db = mongoose.connection;

// check DB connection
db.on('connected', () => {
    console.log('Database connected successfully');
});

db.on('error', (err) => {
    console.log('Database connection error: ', err);
});

module.exports = db;