const dbHelper = require('../helper/db');
const rHelper = require('../helper/response');
const booksModel = require('./books');
const env = require('../../env');
var mysql = require('mysql');

module.exports={
  getCarts:(db,where='',limit='',inserts=[],uri=false)=>{
    return new Promise(async(resolve,rej)=>{
      let query = 'SELECT id, users_id'+
      (uri ? ', CONCAT("'+env.url+'users/",id) AS cart_uri ':' ')+
      'FROM carts '+where+' '+limit;

      console.log(mysql.format(query, inserts));
      
      let carts = await dbHelper.prommiseQuery(
        db,
        query,
        inserts
      );

      if(carts.length==0){
        rej('cart not finded');
        return;
      }

      carts = carts.map((item)=>{
        return Object.assign(item,{books:[]});
      });
      
      let cartsIds = rHelper.getIds(carts);
      console.log(cartsIds);
      let cartsWhere='WHERE carts_id IN ('
      cartsIds.forEach((value)=>{
        cartsWhere+=value+', ';
      });
      cartsWhere = cartsWhere.slice(0,-2);
      cartsWhere = cartsWhere+')';

      let cartsBooks = await dbHelper.prommiseQuery(db,'SELECT * FROM carts_has_books '+cartsWhere);

      let booksidsQuery = dbHelper.querySecondaryObjects(cartsBooks,'books_id');
      let books = await booksModel.getBooks(db,booksidsQuery,'',[],true);

      for (let i = 0; i < cartsBooks.length; i++) {
        for (let j = 0; j < carts.length; j++) {
          if(carts[j].id==cartsBooks[i].carts_id){
            for (let k = 0; k < books.length; k++) {
              if(books[k].id==cartsBooks[i].books_id){
                carts[j].books.push(books[k]);
              }
            }
          }
        }
      }
      resolve(carts);
    });
  },
  save(db,userId){
    return new Promise((res,rej)=>{
      db.query('INSERT INTO carts SET ?',{users_id:userId},(error,result)=>{
        if(error) rej(error);
        else res(result);
      })
    });
  },
  updateBooks(db,userId,booksIds){
    return new Promise(async(res,rej)=>{
      let cartId = await dbHelper.prommiseQuery(db,'SELECT id FROM carts WHERE users_id = ?',[userId]);
      cartId = cartId[0].id;

      await dbHelper.prommiseQuery(db,'DELETE FROM carts_has_books WHERE carts_id = ?',[cartId]);

      if(booksIds.length==0) res();

      let inserts=[];
      let query="INSERT INTO carts_has_books (carts_id,books_id) VALUES ";
      for (let i = 0; i < booksIds.length; i++) {
        const element = booksIds[i];
        query+='(?,?), ';
        inserts.push(cartId);
        inserts.push(element);
      }
      query=query.slice(0,-2);
      console.log(mysql.format(query, inserts));
      
      db.query(query,inserts,(err,results)=>{
        if(err) rej(err);
        else res(results);
      });
    });
  }
}