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
  },
  save(db,body){
    return new Promise((res,rej)=>{
      console.log(body);
      
      db.query(
        'INSERT INTO users SET ?',
        [body],
        async(error, results, fields)=>{
          if (error) rej(error);
          let users = await this.getUsers(db,'WHERE id = ?','',[results.insertId])
          res(users[0]);
        }
      );
    });
  },
  update(db,body,userId){
    return new Promise((res,rej)=>{
      db.query(
        'UPDATE users SET name = ?, cpf = ? WHERE id = ?',
        [
          body.name,
          body.cpf,
          userId
        ],
        async(error, result, fields)=>{
          if (error) rej(error);
          let users = await this.getUsers(db,'WHERE id = ?','',[userId])
          res(users[0]);
        }
      );
    });
  },
  delete(db,userId){
    return new Promise((res,rej)=>{
      db.query('DELETE FROM users WHERE id = ?',[userId],(error,results)=>{
        if(error) rej(error);
        res(results.affectedRows);
      });
    });
  }
}