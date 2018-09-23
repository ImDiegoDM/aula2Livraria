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
  },
  save(db,body){
    return new Promise((res,rej)=>{
      console.log(body);
      
      db.query(
        'INSERT INTO authors SET ?',
        [body],
        async(error, results, fields)=>{
          if (error) rej(error);
          let comment = await this.getAuthors(db,'WHERE id = ?','',[results.insertId])
          res(comment[0]);
        }
      );
    });
  },
  update(db,body,atuhorId){
    return new Promise((res,rej)=>{
      db.query(
        'UPDATE authors SET name = ? WHERE id = ?',
        [
          body.name,
          atuhorId
        ],
        async(error, result, fields)=>{
          if (error) rej(error);
          let comment = await this.getAuthors(db,'WHERE id = ?','',[atuhorId])
          res(comment[0]);
        }
      );
    });
  },
  delete(db,atuhorId){
    return new Promise((res,rej)=>{
      db.query('DELETE FROM authors WHERE id = ?',[atuhorId],(error,results)=>{
        if(error) rej(error);
        res(results.affectedRows);
      });
    });
  }
}