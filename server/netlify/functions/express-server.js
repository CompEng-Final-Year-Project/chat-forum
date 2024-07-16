import express from 'express'
import serverless from 'serverless-http'

const app = express();
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});

app.use('/.netlify/functions/server', router); // path must route to lambda

module.exports.handler = serverless(app);
