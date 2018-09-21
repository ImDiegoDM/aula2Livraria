const express = require('express');
const mongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
const port=4200;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

require('./app/routes/index')(app,{});

app.listen(port,()=>{
    console.log('We are live on ' + port);
});