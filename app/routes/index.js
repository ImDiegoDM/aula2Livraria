const bookRoutes = require('./book_routes');

module.exports = function(app,db){
    bookRoutes(app,db);
}