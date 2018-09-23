const dbHelper = require('../helper/db');
const env = require('../../env');

module.exports={
  getAuthors:(db,where='',limit='',inserts=[],uri=false)=>{
    return new Promise(async(res,rej)=>{
      let query = 'SELECT id, name'+
      (uri ? ', CONCAT("'+env.url+'authors/",id) AS author_uri ':' ')+
      'FROM authors '+where+' '+limit;
      try{
        let authors = await dbHelper.prommiseQuery(
          db,
          query,
          inserts
        );
        res(authors);
      }catch(err){
        rej(err)
      }
    });
  }
}