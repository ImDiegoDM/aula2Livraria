const dbHelper = require('../helper/db');
var env = require('../../env');
var validate = require('../helper/validate');
const ordersModel = require('../model/order');
const booksModel = require('../model/books');

module.exports={
  getOrders:(db,options)=>{
    let inserts = [
      options.itensPerPage*(options.page-1),
      options.itensPerPage
    ];
    return new Promise((res,rej)=>{
      ordersModel.getOrders(db,'','LIMIT ?,?',inserts,true).then(async (response)=>{
        res(
          dbHelper.paginateResponse(
            response,
            env.url+'orders',
            options.page,
            options.itensPerPage,
            await dbHelper.countRows('orders',db)
          )
        );
      }).catch((err)=>{
        rej(err);
      })
    });
  },
  getSingleOrder:function(db,orderId){
    return new Promise((res,rej)=>{
      ordersModel.getOrders(db,'WHERE id = ?','',[orderId]).then((response)=>{
        res(response[0]);
      }).catch((err)=>{
        rej(err);
      })
    });
  },
}