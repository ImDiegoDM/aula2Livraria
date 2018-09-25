const deliverStatusController = require('../controllers/deliverStatus');
const deliverStatusModel = require('../model/deliverStatus');

module.exports=function(app,db){
  let prefix="/v1/deliver-status";

  app.get(prefix,async(req,res)=>{
    let page = req.query.page ? req.query.page : 1;
    let itensPerPage = req.query.itensPerPage ? req.query.itensPerPage : 40;
  
    let adresses = await deliverStatusController.getDeliverStatus(
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
      fields = deliverStatusController.validate(req.body);
    }catch(err){
      res.status(400).send(err);
      return;
    }

    try{
      res.status(201).send(await deliverStatusController.save(db,fields));
      return;
    }
    catch(err){
      res.status(500).send(err);
      return;
    }
  });

  app.get(prefix+'/:deliverStatusId',async(req,res)=>{

    deliverStatus = await deliverStatusController.getSingleDeliverStatus(db,req.params.deliverStatusId);
    if(deliverStatus){
        res.send(deliverStatus);
        return;
    }

    res.status(404).send({message:'Deliver status of id '+req.params.deliverStatusId+' not found'});
  });

  app.put(prefix+'/:deliverStatusId',async(req,res)=>{
    let fields;
    try{
      fields = deliverStatusController.validate(req.body);
    }catch(err){
      res.status(400).send(err);
      return;
    }

    try{
      res.send(await deliverStatusController.update(db,fields,req.params.deliverStatusId));
      return;
    }catch(err){
      res.status(404).send(err);
    }
  });

  app.delete(prefix+'/:deliverStatusId',async(req,res)=>{
    await deliverStatusModel.delete(db,req.params.deliverStatusId);
    res.status(204).send();
  });

}