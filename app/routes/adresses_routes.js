const addressControler = require('../controllers/adresses');
const adressesModel = require('../model/adresses');

module.exports=function(app,db){
  let prefix="/v1/adresses";

  app.get(prefix,async(req,res)=>{
    let page = req.query.page ? req.query.page : 1;
    let itensPerPage = req.query.itensPerPage ? req.query.itensPerPage : 40;
  
    let adresses = await addressControler.getAdresses(
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
      fields = addressControler.validate(req.body);
    }catch(err){
      res.status(400).send(err);
      return;
    }

    try{
      res.status(201).send(await addressControler.save(db,fields));
      return;
    }
    catch(err){
      res.status(500).send(err);
      return;
    }
  });

  app.get(prefix+'/:addressId',async(req,res)=>{

    address = await addressControler.getSingleAdresses(db,req.params.addressId);
    if(address){
        res.send(address);
        return;
    }

    res.status(404).send({message:'Address of id '+req.params.addressId+' not found'});
  });

  app.put(prefix+'/:addressId',async(req,res)=>{
    let fields;
    try{
      fields = addressControler.validate(req.body);
    }catch(err){
      res.status(400).send(err);
      return;
    }

    try{
      res.send(await addressControler.update(db,fields,req.params.addressId));
      return;
    }catch(err){
      res.status(404).send(err);
    }
  });

  app.delete(prefix+'/:addressId',async(req,res)=>{
    await adressesModel.delete(db,req.params.addressId);
    res.status(204).send();
  });

}