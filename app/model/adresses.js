const dbHelper = require('../helper/db');
const env = require('../../env');

module.exports={
  getAddress:(db,where='',limit='',inserts=[],uri=false)=>{
    return new Promise(async(res,rej)=>{
      let query = 'SELECT id, cep, street, neighborhood, city, state'+
      (uri ? ', CONCAT("'+env.url+'adresses/",id) AS address_uri ':' ')+
      'FROM adresses '+where+' '+limit;
      try{
        let adresses = await dbHelper.prommiseQuery(
          db,
          query,
          inserts
        );
        res(adresses);
      }catch(err){
        rej(err)
      }
    });
  },
  save(db,params){
    return new Promise((res,rej)=>{
      db.query(
        'INSERT INTO adresses SET cep = ?, street = ?, neighborhood = ?, city = ?, state = ?',
        [params.cep,params.street,params.neighborhood,params.city,params.state],
        async(error, results, fields)=>{
          if (error) rej(error);
          let address = await this.getAddress(db,'WHERE id = ?','',[results.insertId],true);
          res(address[0]);
        }
      );
    });
  }
}