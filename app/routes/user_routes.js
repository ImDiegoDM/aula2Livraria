const userController = require('../controllers/user');
const userModel = require('../model/users');
const cartsModel = require('../model/carts');
const ordersModel = require('../model/order');
var validate = require('../helper/validate');

module.exports = function(app,db){
  let prefix='/v1/users';

  app.get(prefix,async(req,res)=>{
    let page = req.query.page ? req.query.page : 1;
    let itensPerPage = req.query.itensPerPage ? req.query.itensPerPage : 40;

    let users = await userController.getUsers(
      db,
      {
        page:parseInt(page),
        itensPerPage:parseInt(itensPerPage)
      }
    );
        
    res.send(users);
  });

  app.post(prefix,async(req,res)=>{
    let fields;
    try{
      fields = userController.validate(req.body);
    }catch(err){
      res.status(400).send(err);
      return;
    }
    try{
      res.status(201).send(await userModel.save(db,fields));
    }catch(err){
      res.status(400).send({message:err.sqlMessage});
    }
  });

  app.get(prefix+'/:userId',async(req,res)=>{
    user = await userController.getSingleUser(db,req.params.userId);
    if(user){
        res.send(user);
        return;
    }

    res.status(404).send({message:'User of id '+req.params.userId+' not found'});
  });

  app.put(prefix+'/:userId',async(req,res)=>{
    let fields;
    try{
      fields = userController.validate(req.body);
    }catch(err){
      res.status(400).send(err);
      return;
    }

    let response = await userModel.update(db,fields,req.params.userId);
    if(response==undefined) res.status(404).send({message:'User of id '+req.params.userId+' not found'});
    else res.send(response);
  });

  app.delete(prefix+'/:userId',async(req,res)=>{
    await userModel.delete(db,req.params.userId);
    res.status(204).send();
  });

  app.get(prefix+'/:userId/carts',async(req,res)=>{
    let carts;
    try{
      carts = await cartsModel.getCarts(db,'WHERE users_id = ?','',[req.params.userId]);
    }catch(err){
      if(err="cart not finded"){
        await cartsModel.save(db,req.params.userId);
        carts = await cartsModel.getCarts(db,'WHERE users_id = ?','',[req.params.userId]);
      }else{
        res.send(err);
        return;
      }
    }
    res.send(carts);
  });

  app.put(prefix+'/:userId/carts',async(req,res)=>{
    let fields;
    try{
      fields = validate([
        "books|required"
      ],req.body);
    }catch(err){
      res.status(400).send(err);
      return;
    }
    

    await cartsModel.updateBooks(db,req.params.userId,JSON.parse(fields.books));
    let carts = await cartsModel.getCarts(db,'WHERE users_id = ?','',[req.params.userId]);
    res.send(carts);
  });

  app.get(prefix+'/:userId/orders',async(req,res)=>{
    let page = req.query.page ? req.query.page : 1;
    let itensPerPage = req.query.itensPerPage ? req.query.itensPerPage : 40;

    let orders = await userController.getOrders(
      db,
      req.params.userId,
      {
        page:parseInt(page),
        itensPerPage:parseInt(itensPerPage)
      }
    );
        
    res.send(orders);
  });

  app.post(prefix+'/:userId/orders',async(req,res)=>{
    let fields;
    try{
      fields = validate([
        "status|required",
        "adresses_id",
        "address"
      ],req.body);
    }catch(err){
      res.status(400).send(err);
      return;
    }

    if(!fields.adresses_id&&!fields.address){
      res.status(400).send({message:"adresses_id or address must be sended"});
      return;
    }
    else if(fields.address){
      try{
        fields.address = JSON.parse(fields.address);
      }catch(error){
        if(error.message=="Unexpected end of JSON input"){
          res.status(400).send({message:'address field have a json error'});
          return;
        }
        res.status(400).send({message:error.message});
        return;
      }
      try{
        fields = validate([
          "cep|required",
          "street|required",
          "neighborhood|required",
          "city|required",
          "state|required"
        ],fields.address);
      }catch(err){
        err.message+=' in address field';
        res.status(400).send(err);
        return;
      }
    }


    let page = req.query.page ? req.query.page : 1;
    let itensPerPage = req.query.itensPerPage ? req.query.itensPerPage : 40;

    let orders = await ordersModel.createOrder(
      db,
      fields,
      req.params.userId
    );
        
    res.send(orders);
  });

  app.get(prefix+'/:userId/comments',async(req,res)=>{
    let page = req.query.page ? req.query.page : 1;
    let itensPerPage = req.query.itensPerPage ? req.query.itensPerPage : 40;

    let comments = await userController.getComments(
      db,
      req.params.userId,
      {
        page:parseInt(page),
        itensPerPage:parseInt(itensPerPage)
      }
    );
        
    res.send(comments);
  });
}