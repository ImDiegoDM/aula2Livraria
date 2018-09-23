const booksController = require('../controllers/books');
var validate = require('../helper/validate');
const commentsController = require('../controllers/comments');

module.exports = function(app,db){
    let prefix='/v1/books';
    
    app.get(prefix,async (req,res)=>{
        let page = req.query.page ? req.query.page : 1;
        let itensPerPage = req.query.itensPerPage ? req.query.itensPerPage : 40;
        let books;

        books = await booksController.getBooks(db,{page:parseInt(page),itensPerPage:parseInt(itensPerPage)});
        
        res.send(books);
    });

    app.post(prefix,async(req,res)=>{
        let fields
        try{
            fields = booksController.validate(req.body);
        }catch(err){
            res.status(400).send(err);
            return;
        }

        try{
            res.status(201).send(await booksController.save(db,fields));
            return;
        }
        catch(err){
            res.status(500).send(err);
            return;
        }
    });

    app.get(prefix+'/:bookId',async (req,res)=>{
        book = await booksController.getSingleBook(db,req.params.bookId);
        if(book){
            res.send(book);
            return;
        }

        res.status(404).send({message:'Book of id '+req.params.bookId+' not found'});
    });

    app.put(prefix+'/:bookId',async (req,res)=>{
        let fields;
        try{
            fields = booksController.validate(req.body);
        }catch(err){
            res.status(400).send(err);
            return;
        }

        booksController.update(db,fields,req.params.bookId).then(async(response)=>{
            console.log(response.affectedRows);
            if(response.affectedRows>0){
                res.send(await booksController.getSingleBook(db,req.params.bookId));
            }else{
                res.status(404).send({message:'Book of id '+req.params.bookId+' not found'});
            }
        }).catch((err)=>{
            res.status(500).send(err);
            return;
        });
    });

    app.delete(prefix+'/:bookId',async (req,res)=>{
        await booksController.delete(db,req.params.bookId)
        res.status(204).send();
    });

    app.get(prefix+'/:bookId/comments',async (req,res)=>{
        let page = req.query.page ? req.query.page : 1;
        let itensPerPage = req.query.itensPerPage ? req.query.itensPerPage : 40;

        res.send(await booksController.getComments(
            db,
            req.params.bookId,
            {page:parseInt(page),itensPerPage:parseInt(itensPerPage)}
        ));
    });

    app.put(prefix+'/:bookId/comments',async (req,res)=>{
        let fields
        try{
            fields = commentsController.validate(req.body);
        }catch(err){
            res.status(400).send(err);
            return;
        }

        res.send(await commentsController.saveComment(db,fields,req.params.bookId));
    });

    console.log("books endpoints registered");
}