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
  }
}