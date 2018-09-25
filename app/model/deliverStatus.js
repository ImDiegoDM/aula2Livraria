const dbHelper = require('../helper/db');
const env = require('../../env');

module.exports={
  getDeliverStatus:(db,where='',limit='',inserts=[],uri=false)=>{
    return new Promise(async(res,rej)=>{
      let query = 'SELECT id, status'+
      (uri ? ', CONCAT("'+env.url+'v1/deliver-status/",id) AS deliver_status_uri ':' ')+
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
  save(db,params){
    return new Promise((res,rej)=>{
      db.query(
        'INSERT INTO deliver_satus SET status = ?',
        [params.status],
        async(error, results, fields)=>{
          if (error) rej(error);
          let deliverStatus = await this.getDeliverStatus(db,'WHERE id = ?','',[results.insertId],true);
          res(deliverStatus[0]);
        }
      );
    });
  },
  update(db,body,deliverStatusId){
    return new Promise((res,rej)=>{
      db.query(
        'UPDATE deliver_satus SET status = ?',
        [
          body.status,
          deliverStatusId
        ],
        async(error, result, fields)=>{
          if (error) rej(error);
          let deliverStatus = await this.getDeliverStatus(db,'WHERE id = ?','',[deliverStatusId])
          res(deliverStatus[0]);
        }
      );
    });
  },
  delete(db,deliverStatusId){
    return new Promise((res,rej)=>{
      db.query('DELETE FROM deliver_satus WHERE id = ?',[deliverStatusId],(error,results)=>{
        if(error) rej(error);
        res(results.affectedRows);
      });
    });
  }
}