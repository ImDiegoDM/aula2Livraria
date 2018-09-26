const express = require('express');
const bodyParser = require('body-parser');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

var mysql = require('mysql');
var env = require('./env');
var connection = mysql.createConnection(env.db);

const app = express();
const port=3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('*', (req, res, next) => {
    if (req.headers['x-forwarded-proto'] != 'https') {
        
// checa se o header é HTTP ou HTTPS

        res.redirect("https://" + req.headers.host + req.url);
        
// faz o redirect para HTTPS

    } else {
        next();
        
// segue com a sequência das rotas

    }
});

require('./app/routes/index')(app,connection);

app.listen(port,()=>{
    console.log('We are live on ' + port);
});
