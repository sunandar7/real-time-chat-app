require('dotenv').config();

const dbConfig = require('./config/dbConfig');

const server = require('./app');

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});