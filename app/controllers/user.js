const dbHelper = require('../helper/db');
var env = require('../../env');
var validate = require('../helper/validate');
const usersModel = require('../model/users');
const commentsModel = require('../model/commnets');
const ordersModel = require('../model/order');

module.exports ={
  getUsers(db,options){
    let inserts = [
      options.itensPerPage*(options.page-1),
      options.itensPerPage
    ];
    return new Promise((res,rej)=>{
      usersModel.getUsers(db,'','LIMIT ?,?',inserts,true).then(async (response)=>{
        res(
          dbHelper.paginateResponse(
            response,
            env.url+'users',
            options.page,
            options.itensPerPage,
            await dbHelper.countRows('users',db)
          )
        );
      }).catch((err)=>{
        rej(err);
      })
    });
  },
  getSingleUser(db,userId){
    return new Promise((res,rej)=>{
      usersModel.getUsers(db,'WHERE id = ?','',[userId]).then((response)=>{
        res(response[0]);
      }).catch((err)=>{
        rej(err);
      })
    });
  },
  getComments(db,userId,options){
    return new Promise((res,rej)=>{
      let inserts = [
        userId,
        options.itensPerPage*(options.page-1),
        options.itensPerPage
      ];
      commentsModel.getComments(db,'WHERE users_id = ?','LIMIT ?,?',inserts,true).then(async (response)=>{
        res(
          dbHelper.paginateResponse(
            response,
            env.url+'users/'+userId+'/comments',
            options.page,
            options.itensPerPage,
            await dbHelper.countRows('comments',db,'WHERE users_id = ?',[userId])
          )
        );
      }).catch((err)=>{
        rej(err);
      })
    });
  },
  getOrders(db,userId,options){
    return new Promise((res,rej)=>{
      let inserts = [
        userId,
        options.itensPerPage*(options.page-1),
        options.itensPerPage
      ];
      ordersModel.getOrders(db,'WHERE users_id = ?','LIMIT ?,?',inserts,true).then(async (response)=>{
        res(
          dbHelper.paginateResponse(
            response,
            env.url+'users/'+userId+'/orders',
            options.page,
            options.itensPerPage,
            await dbHelper.countRows('orders',db,'WHERE users_id = ?',[userId])
          )
        );
      }).catch((err)=>{
        rej(err);
      })
    });
  },
  validate:function(body){
    return validate([
      "name|required",
      "cpf|required"
    ],body);
  }
}