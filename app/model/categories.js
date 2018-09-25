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
  }
}