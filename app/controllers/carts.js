const dbHelper = require('../helper/db');
var env = require('../../env');
const cartsModel = require('../model/carts');

module.exports={
  getCarts:(db,options)=>{
    let inserts = [
      options.itensPerPage*(options.page-1),
      options.itensPerPage
    ];
    return new Promise((res,rej)=>{
      cartsModel.getCarts(db,'','LIMIT ?,?',inserts,true).then(async (response)=>{
        res(
          dbHelper.paginateResponse(
            response,
            env.url+'carts',
            options.page,
            options.itensPerPage,
            await dbHelper.countRows('carts',db)
          )
        );
      }).catch((err)=>{
        rej(err);
      })
    });
  }
}