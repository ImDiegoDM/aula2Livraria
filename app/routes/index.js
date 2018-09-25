const bookRoutes = require('./book_routes');
const authorsRoutes = require('./authors_routes');
const publishersRoutes = require('./publishers_routes');
const usersRoutes = require('./user_routes');
const cartRoutes = require('./carts_routes');
const orderRoutes = require('./orders_routes');
const adressesRoutes = require('./adresses_routes');
const deliverStatusRoutues = require('./deliver_status_routes');

module.exports = function(app,db){
    bookRoutes(app,db);
    authorsRoutes(app,db);
    publishersRoutes(app,db);
    usersRoutes(app,db);
    cartRoutes(app,db);
    orderRoutes(app,db);
    adressesRoutes(app,db);
    deliverStatusRoutues(app,db);
}