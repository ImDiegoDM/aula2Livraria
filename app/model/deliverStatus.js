const dbHelper = require('../helper/db');
const env = require('../../env');

module.exports={
  getDeliverStatus:(db,where='',limit='',inserts=[],uri=false)=>{
    return new Promise(async(res,rej)=>{
      let query = 'SELECT id, status'+
      (uri ? ', CONCAT("'+env.url+'deliver_status/",id) AS deliver_status_uri ':' ')+
      'FROM deliver_satus '+where+' '+limit;
      try{
        let deliver_satus = await dbHelper.prommiseQuery(
          db,
          query,
          inserts
        );
        res(deliver_satus);
      }catch(err){
        rej(err)
      }
    });
  },
}