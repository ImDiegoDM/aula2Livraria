const bookRoutes = require('./book_routes');
const authorsRoutes = require('./authors_routes');
const publishersRoutes = require('./publishers_routes');
const usersRoutes = require('./user_routes');

module.exports = function(app,db){
    bookRoutes(app,db);
    authorsRoutes(app,db);
    publishersRoutes(app,db);
    usersRoutes(app,db);
}