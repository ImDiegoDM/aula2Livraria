
module.exports = function(app,db){
    app.post('/books',(req,res)=>{
        res.send('Hello');
    });
}