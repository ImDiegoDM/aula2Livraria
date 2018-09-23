const authorsController = require('../controllers/authors');
const authorsModel = require('../model/authors');

module.exports=function(app,db){
  let prefix='/v1/authors';

  app.get(prefix,async(req,res)=>{
    let page = req.query.page ? req.query.page : 1;
    let itensPerPage = req.query.itensPerPage ? req.query.itensPerPage : 40;
  
    let atuhors = await authorsController.getAuthors(
      db,
      {
        page:parseInt(page),
        itensPerPage:parseInt(itensPerPage)
      }
    );
        
    res.send(atuhors);
  });

  app.post(prefix,async(req,res)=>{
    let fields;
    try{
      fields = authorsController.validate(req.body);
    }catch(err){
      res.status(400).send(err);
      return;
    }

    try{
      res.status(201).send(await authorsController.save(db,fields));
      return;
    }
    catch(err){
      res.status(500).send(err);
      return;
    }
  });

  app.get(prefix+'/:authorId',async(req,res)=>{

    author = await authorsController.getSingleAuthor(db,req.params.authorId);
    if(author){
        res.send(author);
        return;
    }

    res.status(404).send({message:'Author of id '+req.params.authorId+' not found'});
  });

  app.put(prefix+'/:authorId',async(req,res)=>{
    let fields;
    try{
      fields = authorsController.validate(req.body);
    }catch(err){
      res.status(400).send(err);
      return;
    }

    try{
      res.send(await authorsController.update(db,fields,req.params.authorId));
      return;
    }catch(err){
      res.status(404).send(err);
    }
  });

  app.delete(prefix+'/:authorId',async(req,res)=>{
    await authorsModel.delete(db,req.params.authorId);
    res.status(204).send();
  });

  app.get(prefix+'/:authorId/books',async(req,res)=>{
    let page = req.query.page ? req.query.page : 1;
    let itensPerPage = req.query.itensPerPage ? req.query.itensPerPage : 40;

    res.send(
      await authorsController.getBooks(
        db,
        req.params.authorId,
        {
          page:parseInt(page),
          itensPerPage:parseInt(itensPerPage)
        }
      )
    );
  });
}