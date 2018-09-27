const categoriesController = require('../controllers/categories');
const categorieModel = require('../model/categories');

module.exports=function(app,db){
  let prefix="/v1/categories";

  app.get(prefix,async(req,res)=>{
    let page = req.query.page ? req.query.page : 1;
    let itensPerPage = req.query.itensPerPage ? req.query.itensPerPage : 40;
  
    let adresses = await categoriesController.getCategories(
      db,
      {
        page:parseInt(page),
        itensPerPage:parseInt(itensPerPage)
      }
    );
        
    res.send(adresses);
  });

  app.post(prefix,async(req,res)=>{
    let fields;
    try{
      fields = categoriesController.validate(req.body);
    }catch(err){
      res.status(400).send(err);
      return;
    }

    try{
      res.status(201).send(await categoriesController.save(db,fields));
      return;
    }
    catch(err){
      res.status(500).send(err);
      return;
    }
  });

  app.get(prefix+'/:categoryId',async(req,res)=>{

    address = await categoriesController.getSingleCategorie(db,req.params.categoryId);
    if(address){
        res.send(address);
        return;
    }

    res.status(404).send({message:'Category of id '+req.params.categoryId+' not found'});
  });

  app.put(prefix+'/:categoryId',async(req,res)=>{
    let fields;
    try{
      fields = categoriesController.validate(req.body);
    }catch(err){
      res.status(400).send(err);
      return;
    }

    try{
      res.send(await categoriesController.update(db,fields,req.params.categoryId));
      return;
    }catch(err){
      res.status(404).send(err);
    }
  });

  app.delete(prefix+'/:categoryId',async(req,res)=>{
    await categorieModel.delete(db,req.params.categoryId);
    res.status(204).send();
  });

  app.get(prefix+'/:categoryId/books',async(req,res)=>{
    let page = req.query.page ? req.query.page : 1;
    let itensPerPage = req.query.itensPerPage ? req.query.itensPerPage : 40;

    res.send(
      await categoriesController.getBooks(
        db,
        req.params.categoryId,
        {
          page:parseInt(page),
          itensPerPage:parseInt(itensPerPage)
        }
      )
    );
  });

}