const dbHelper = require('../helper/db');
var mysql = require('mysql');
var env = require('../../env');
var validate = require('../helper/validate');
const booksModel = require('../model/books');
const commenstModel = require('../model/commnets');

module.exports={
  getBooks:function(db,options,search){
    let inserts = [
      options.itensPerPage*(options.page-1),
      options.itensPerPage
    ];
    return new Promise((res,rej)=>{
      console.log(inserts);
      if(search){
        booksModel.search(db,'LIMIT ?,?',inserts,search).then(async (response)=>{
          res(
            dbHelper.paginateResponse(
              response,
              env.url+'books',
              options.page,
              options.itensPerPage,
              await booksModel.countSearch(db,search),
              search
            )
          );
        }).catch((err)=>{
          rej(err);
        })
      }
      else{
        booksModel.getBooks(db,'','LIMIT ?,?',inserts,true).then(async (response)=>{
          res(
            dbHelper.paginateResponse(
              response,
              env.url+'books',
              options.page,
              options.itensPerPage,
              await dbHelper.countRows('books',db)
            )
          );
        }).catch((err)=>{
          rej(err);
        })
      }
    });
  },
  getSingleBook:function(db,bookId){
    return new Promise((res,rej)=>{
      let select = 'books.id, books.name, books.price, books.year,'+
      dbHelper.concatQuery({id:'authors.id',name:'authors.name'},env.url+'authors/','author_uri')+' AS author, '+
      dbHelper.concatQuery({id:'pub_companies.id',name:'pub_companies.name'},env.url+'publishers/','pub_company_uri')+' AS pub_company, '+
      dbHelper.concatQuery({id:'categories.id',name:'categories.name'},env.url+'categories/','catgory_uri')+' AS category ';
  
      let query = 'SELECT '+select+
      'FROM books '+
      'INNER JOIN authors ON books.authors_id = authors.id '+
      'INNER JOIN pub_companies ON books.pub_companies_id = pub_companies.id '+
      'INNER JOIN categories ON books.categories_id = pub_companies.id '+
      'WHERE books.id = ?';
      let inserts = [
        bookId
      ];
  
      db.query(query,inserts,(error, results, fields)=> {
        if (error) rej(error);
        results = dbHelper.responseToJson(results);
        res(results[0]);
      });
    });
  },
  save:function(db,book){
    return new Promise((res,rej)=>{
      db.query('INSERT INTO books SET ?',book,async(error, results, fields)=>{
        if (error) rej(error);
        res(await this.getSingleBook(db,results.insertId));
      });
    });
  },
  update:function(db,body,bookId){
    return new Promise((res,rej)=>{
      db.query(
        'UPDATE books SET name = ?, authors_id = ?, pub_companies_id = ?, categories_id = ?, price = ? , year = ? WHERE id = ?',
        [
          body.name,
          body.authors_id,
          body.pub_companies_id,
          body.categories_id,
          body.price,
          body.year,
          bookId
        ],
        async(error, result, fields)=>{
          if (error) rej(error);
          res(result);
        }
      );
    });
  },
  getComments:function(db,bookId,options){
    return new Promise(async (res,rej)=>{
      let inserts=[
        bookId,
        options.itensPerPage*(options.page-1),
        options.itensPerPage
      ]
      let commnets = await commenstModel.getComments(db,'WHERE books_id = ?','LIMIT ?,?',inserts)
      res(
        dbHelper.paginateResponse(
          commnets,
          env.url+'books/'+bookId+'/comments',
          options.page,
          options.itensPerPage,
          await dbHelper.countRows('comments',db,'WHERE books_id = ?',bookId)
        )
      );
    });
  },
  delete:function(db,bookId){
    return new Promise((res,rej)=>{
      db.query('DELETE FROM books WHERE id = ?',bookId,(error,results,fields)=>{
        if (error) rej(error);
        res(results.affectedRows);
      });
    });
  },
  validate:function(body){
    return validate([
      "name|required",
      "authors_id|required",
      "pub_companies_id|required",
      "categories_id|required",
      "price|required",
      "year|required", 
    ],body);
  }
}