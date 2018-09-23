const dbHelper = require('../helper/db');
const env = require('../../env');
const usersModel = require('../model/users');
const booksModel = require('./books');
const rHelper = require('../helper/response');

module.exports={
  getComments:(db,where='',limit='',inserts=[],uri=false)=>{
    return new Promise(async(res,rej)=>{
      let query = 'SELECT id, comment, stars'+
      (uri ? ', CONCAT("'+env.url+'comments/",id) AS comment_uri ':' ')+
      ', users_id, books_id '+
      'FROM comments '+where+' '+limit;

      let comments = await dbHelper.prommiseQuery(db,query,inserts);

      let usersWhere = dbHelper.querySecondaryObjects(comments,'users_id');
      let users = await usersModel.getUsers(db,usersWhere,'',[],true);

      let booksWhere = dbHelper.querySecondaryObjects(comments,'books_id');
      let books = await booksModel.getBooks(db,booksWhere,'',[],true);

      comments = rHelper.groupObjs(comments,'users_id',users,'user');
      comments = rHelper.groupObjs(comments,'books_id',books,'book');
      res(comments);
    });
  },
  save(db,body,bookId){
    return new Promise((res,rej)=>{
      console.log(body);
      
      db.query(
        'INSERT INTO comments SET comment = ?, stars = ?, books_id = ?, users_id = ?',
        [body.comment,body.stars,bookId,body.users_id],
        async(error, results, fields)=>{
          if (error) rej(error);
          let comment = await this.getComments(db,'WHERE id = ?','',[results.insertId])
          res(comment[0]);
        }
      );
    });
  },
  update(db,body,commentId){
    return new Promise((res,rej)=>{
      db.query(
        'UPDATE comments SET comment = ?, stars = ? WHERE id = ?',
        [
          body.comment,
          body.stars,
          commentId
        ],
        async(error, result, fields)=>{
          if (error) rej(error);
          let comment = await this.getComments(db,'WHERE id = ?','',[commentId])
          res(comment[0]);
        }
      );
    });
  }
}