require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const advocateRoutes = require('./routes/advocate');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const swaggerDoc = YAML.load('./swagger.yaml');

const app = express();
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/digit');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use('/advocate', advocateRoutes);

app.listen(3000, () => console.log('Server running'));