const publishersController = require('../controllers/publishers');
const pubModel = require('../model/publishers');

module.exports=function(app,db){
  let prefix='/v1/publishers';

  app.get(prefix,async(req,res)=>{
    let page = req.query.page ? req.query.page : 1;
    let itensPerPage = req.query.itensPerPage ? req.query.itensPerPage : 40;

    let publishers = await publishersController.getPublishers(
      db,
      {
        page:parseInt(page),
        itensPerPage:parseInt(itensPerPage)
      }
    );
        
    res.send(publishers);
  });

  app.post(prefix,async(req,res)=>{
    let fields;
    try{
      fields = publishersController.validate(req.body);
    }catch(err){
      res.status(400).send(err);
      return;
    }

    res.status(201).send(await pubModel.save(db,fields));
  });

  app.get(prefix+'/:pubId',async(req,res)=>{
    publisher = await publishersController.getSinglePublisher(db,req.params.pubId);
    if(publisher){
        res.send(publisher);
        return;
    }

    res.status(404).send({message:'Publisher of id '+req.params.pubId+' not found'});
  });

  app.put(prefix+'/:pubId',async(req,res)=>{
    let fields;
    try{
      fields = publishersController.validate(req.body);
    }catch(err){
      res.status(400).send(err);
      return;
    }
    let response = await pubModel.update(db,fields,req.params.pubId);
    if(response==undefined) res.status(404).send({message:'Publisher of id '+req.params.pubId+' not found'});
    else res.send(response);
  });

  app.delete(prefix+'/:pubId',async(req,res)=>{
    await pubModel.delete(db,req.params.pubId);
    res.status(204).send();
  });

  app.get(prefix+'/:pubId/books',async(req,res)=>{
    let page = req.query.page ? req.query.page : 1;
    let itensPerPage = req.query.itensPerPage ? req.query.itensPerPage : 40;

    res.send(
      await publishersController.getPublishersBooks(
        db,
        req.params.pubId,
        {
          page:parseInt(page),
          itensPerPage:parseInt(itensPerPage)
        }
      )
    );
  });
}