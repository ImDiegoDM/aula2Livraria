const dbHelper = require('../helper/db');
var env = require('../../env');
var validate = require('../helper/validate');
const addressModel = require('../model/adresses');

module.exports={
  getAdresses:(db,options)=>{
    let inserts = [
      options.itensPerPage*(options.page-1),
      options.itensPerPage
    ];
    return new Promise((res,rej)=>{
      addressModel.getAddress(db,'','LIMIT ?,?',inserts,true).then(async (response)=>{
        res(
          dbHelper.paginateResponse(
            response,
            env.url+'adresses',
            options.page,
            options.itensPerPage,
            await dbHelper.countRows('adresses',db)
          )
        );
      }).catch((err)=>{
        rej(err);
      })
    });
  },
  getSingleAdresses:function(db,addressId){
    return new Promise((res,rej)=>{
      addressModel.getAddress(db,'WHERE id = ?','',[addressId]).then((response)=>{
        res(response[0]);
      }).catch((err)=>{
        rej(err);
      })
    });
  },
  save:function(db,body){
    return new Promise((res,rej)=>{
      addressModel.save(db,body).then((response)=>{
        res(response);
      }).catch((err)=>{
        rej(err);
      })
    });
  },
  update:function(db,body,addressId){
    return new Promise((res,rej)=>{
      addressModel.update(db,body,addressId).then((response)=>{
        if(response==undefined) throw {message:'Address of id '+addressId+' not found'};
        res(response);
      }).catch((err)=>{
        rej(err);
      })
    });
  },
  validate:function(body){
    return validate([
      "cep|required",
      "street|required",
      "neighborhood|required",
      "city|required",
      "state|required"
    ],body);
  }
}