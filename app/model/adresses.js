const dbHelper = require('../helper/db');
const env = require('../../env');

module.exports={
  getAddress:(db,where='',limit='',inserts=[],uri=false)=>{
    return new Promise(async(res,rej)=>{
      let query = 'SELECT id, cep, street, neighborhood, city, state'+
      (uri ? ', CONCAT("'+env.url+'v1/adresses/",id) AS address_uri ':' ')+
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
  },
  update(db,body,addressId){
    return new Promise((res,rej)=>{
      db.query(
        'UPDATE adresses SET cep = ?, street = ?, neighborhood = ?, city = ?, state = ?',
        [
          body.cep,body.street,body.neighborhood,body.city,body.state,
          addressId
        ],
        async(error, result, fields)=>{
          if (error) rej(error);
          let address = await this.getAddress(db,'WHERE id = ?','',[addressId])
          res(address[0]);
        }
      );
    });
  },
  delete(db,addressId){
    return new Promise((res,rej)=>{
      db.query('DELETE FROM adresses WHERE id = ?',[addressId],(error,results)=>{
        if(error) rej(error);
        res(results.affectedRows);
      });
    });
  }
}