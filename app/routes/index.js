const bookRoutes = require('./book_routes');
const authorsRoutes = require('./authors_routes');

module.exports = function(app,db){
    bookRoutes(app,db);
    authorsRoutes(app,db);
}