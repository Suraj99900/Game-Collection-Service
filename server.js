const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');
const cronWinParity = require('./src/cron/cron-win-parity');
const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// Body parser middleware
app.use(bodyParser.json());
app.use(fileUpload());
// MongoDB connection
mongoose.connect('mongodb://localhost:27017/gpm', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});
// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
const routes = require('./src/routes');
app.use('/api', routes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
