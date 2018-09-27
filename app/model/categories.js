const dbHelper = require('../helper/db');
const env = require('../../env');

module.exports={
  getCategories:(db,where='',limit='',inserts=[],uri=false)=>{
    return new Promise(async(res,rej)=>{
      let query = 'SELECT id, name'+
      (uri ? ', CONCAT("'+env.url+'v1/categories/",id) AS category_uri ':' ')+
      'FROM categories '+where+' '+limit;

      try{
        let categories = await dbHelper.prommiseQuery(
          db,
          query,
          inserts
        );
        res(categories);
      }catch(err){
        rej(err)
      }
    });
  },
  save(db,params){
    return new Promise((res,rej)=>{
      db.query(
        'INSERT INTO categories SET name = ?',
        [params.name],
        async(error, results, fields)=>{
          if (error) rej(error);
          let deliverStatus = await this.getCategories(db,'WHERE id = ?','',[results.insertId],true);
          res(deliverStatus[0]);
        }
      );
    });
  },
  update(db,body,categorieId){
    return new Promise((res,rej)=>{
      db.query(
        'UPDATE categories SET name = ?',
        [
          body.name,
          categorieId
        ],
        async(error, result, fields)=>{
          if (error) rej(error);
          let deliverStatus = await this.getCategories(db,'WHERE id = ?','',[categorieId])
          res(deliverStatus[0]);
        }
      );
    });
  },
  delete(db,categorieId){
    return new Promise((res,rej)=>{
      db.query('DELETE FROM categories WHERE id = ?',[categorieId],(error,results)=>{
        if(error) rej(error);
        res(results.affectedRows);
      });
    });
  }
}