const dbHelper = require('../helper/db');
const env = require('../../env');

module.exports={
  getUsers:(db,where='',limit='',inserts=[],uri=false)=>{
    return new Promise(async(res,rej)=>{
      let query = 'SELECT id, name, cpf'+
      (uri ? ', CONCAT("'+env.url+'users/",id) AS user_uri ':' ')+
      'FROM users '+where+' '+limit;

      try{
        let users = await dbHelper.prommiseQuery(
          db,
          query,
          inserts
        );
        res(users);
      }catch(err){
        rej(err)
      }
    });
  }
}