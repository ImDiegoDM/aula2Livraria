const ordersController = require('../controllers/orders');
const ordersModel = require('../model/order');
const validate = require('../helper/validate');

module.exports=function(app,db){

  let prefix='/v1/orders';
  
  app.get(prefix,async(req,res)=>{
    let page = req.query.page ? req.query.page : 1;
    let itensPerPage = req.query.itensPerPage ? req.query.itensPerPage : 40;
  
    let orders = await ordersController.getOrders(db,{
        page:parseInt(page),
        itensPerPage:parseInt(itensPerPage)});
        
    res.send(orders);
  });

  app.get(prefix+'/:orderId',async(req,res)=>{
    order = await ordersController.getSingleOrder(db,req.params.orderId);
    if(order){
        res.send(order);
        return;
    }

    res.status(404).send({message:'Order of id '+req.params.orderId+' not found'});
  });

  app.delete(prefix+'/:orderId',async(req,res)=>{
    await ordersModel.delete(db,req.params.orderId);
    res.status(204).send();
  });

  app.put(prefix+'/:orderId/adresses',async(req,res)=>{
    let fields;
    try{
      fields = validate([
        "adresses_id|required"
      ],req.body);
    }catch(err){
      res.status(400).send(err);
      return;
    }

    res.send(await ordersModel.updateAddress(db,req.params.orderId,fields.adresses_id));
  });

  app.put(prefix+'/:orderId/deliver-status',async(req,res)=>{
    let fields;
    try{
      fields = validate([
        "deliver_status_id|required"
      ],req.body);
    }catch(err){
      res.status(400).send(err);
      return;
    }

    res.send(await ordersModel.updateDeliverStatus(db,req.params.orderId,fields.deliver_status_id));
  });
}