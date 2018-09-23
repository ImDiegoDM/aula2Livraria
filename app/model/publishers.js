const dbHelper = require('../helper/db');
const env = require('../../env');

module.exports={
  getPublishers:(db,where='',limit='',inserts=[],uri=false)=>{
    return new Promise(async(res,rej)=>{
      let query = 'SELECT id, name'+
      (uri ? ', CONCAT("'+env.url+'publishers/",id) AS pub_company_uri ':' ')+
      'FROM pub_companies '+where+' '+limit;

      try{
        let publishers = await dbHelper.prommiseQuery(
          db,
          query,
          inserts
        );
        res(publishers);
      }catch(err){
        rej(err)
      }
    });
  },
  save(db,body){
    return new Promise((res,rej)=>{
      console.log(body);
      
      db.query(
        'INSERT INTO pub_companies SET name = ?',
        [body.name],
        async(error, results, fields)=>{
          if (error) rej(error);
          let publisher = await this.getPublishers(db,'WHERE id = ?','',[results.insertId])
          res(publisher[0]);
        }
      );
    });
  },
  update(db,body,pubId){
    return new Promise((res,rej)=>{
      db.query(
        'UPDATE pub_companies SET name = ? WHERE id = ?',
        [
          body.name,
          pubId
        ],
        async(error, result, fields)=>{
          if (error) rej(error);
          let publisher = await this.getPublishers(db,'WHERE id = ?','',[pubId]);
          res(publisher[0]);
        }
      );
    });
  },
  delete(db,pubId){
    return new Promise((res,rej)=>{
      db.query('DELETE FROM pub_companies WHERE id = ?',[pubId],(error,results)=>{
        if(error) rej(error);
        res(results.affectedRows);
      });
    });
  }
}