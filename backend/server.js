require('dotenv').config();

const dbConfig = require('./config/dbConfig');

const app = require('./app');

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});