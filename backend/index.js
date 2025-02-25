const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const multer = require('multer');
const { exec } = require('child_process');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const connectDB = require('./config/db');

require('dotenv').config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

app.post('/process', upload.single('image'), (req, res) => {
  exec(`python3 scripts/ocr_processor.py ${req.file.path}`, (error, stdout) => {
    if (error) return res.status(500).send({ error: 'OCR Failed' });
    res.json(JSON.parse(stdout));
  });
});

const server = new ApolloServer({ typeDefs, resolvers });
server.start().then(() => {
  server.applyMiddleware({ app });
  app.listen(5000, () => console.log('Server running on port 5000'));
});
