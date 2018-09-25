const dbHelper = require('../helper/db');
var env = require('../../env');
var validate = require('../helper/validate');
const deliverStatusModel = require('../model/deliverStatus');

module.exports={
  getDeliverStatus:(db,options)=>{
    let inserts = [
      options.itensPerPage*(options.page-1),
      options.itensPerPage
    ];
    return new Promise((res,rej)=>{
      deliverStatusModel.getDeliverStatus(db,'','LIMIT ?,?',inserts,true).then(async (response)=>{
        res(
          dbHelper.paginateResponse(
            response,
            env.url+'deliver-status',
            options.page,
            options.itensPerPage,
            await dbHelper.countRows('deliver_satus',db)
          )
        );
      }).catch((err)=>{
        rej(err);
      })
    });
  },
  getSingleDeliverStatus:function(db,deliverStatusId){
    return new Promise((res,rej)=>{
      deliverStatusModel.getDeliverStatus(db,'WHERE id = ?','',[deliverStatusId]).then((response)=>{
        res(response[0]);
      }).catch((err)=>{
        rej(err);
      })
    });
  },
  save:function(db,body){
    return new Promise((res,rej)=>{
      deliverStatusModel.save(db,body).then((response)=>{
        res(response);
      }).catch((err)=>{
        rej(err);
      })
    });
  },
  update:function(db,body,deliverStatusId){
    return new Promise((res,rej)=>{
      deliverStatusModel.update(db,body,deliverStatusId).then((response)=>{
        if(response==undefined) throw {message:'Deliver status of id '+deliverStatusId+' not found'};
        res(response);
      }).catch((err)=>{
        rej(err);
      })
    });
  },
  validate:function(body){
    return validate([
      "status|required"
    ],body);
  }
}