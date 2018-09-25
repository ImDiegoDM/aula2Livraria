const cartsController = require('../controllers/carts');

module.exports=function(app,db){
  let prefix="/v1/carts";
  app.get(prefix,async(req,res)=>{
    let page = req.query.page ? req.query.page : 1;
    let itensPerPage = req.query.itensPerPage ? req.query.itensPerPage : 40;
  
    let carts = await cartsController.getCarts(db,{
        page:parseInt(page),
        itensPerPage:parseInt(itensPerPage)});
        
    res.send(carts);
  });
}