const dbHelper = require('../helper/db');
var env = require('../../env');
var validate = require('../helper/validate');
const authorsModel = require('../model/authors');
const booksModel = require('../model/books');

module.exports={
  getAuthors:(db,options)=>{
    let inserts = [
      options.itensPerPage*(options.page-1),
      options.itensPerPage
    ];
    return new Promise((res,rej)=>{
      authorsModel.getAuthors(db,'','LIMIT ?,?',inserts,true).then(async (response)=>{
        res(
          dbHelper.paginateResponse(
            response,
            env.url+'authors',
            options.page,
            options.itensPerPage,
            await dbHelper.countRows('authors',db)
          )
        );
      }).catch((err)=>{
        rej(err);
      })
    });
  },
  getBooks:function(db,authorId,options){
    return new Promise(async(res,rej)=>{
      let inserts = [
        authorId,
        options.itensPerPage*(options.page-1),
        options.itensPerPage
      ];
      booksModel.getBooks(db,'WHERE authors_id = ?','LIMIT ?,?',inserts,true).then(async(response)=>{
        res(
          dbHelper.paginateResponse(
            response,
            env.url+'authors/'+authorId+'/books',
            options.page,
            options.itensPerPage,
            await dbHelper.countRows('books',db,'WHERE authors_id = ?',[authorId])
          )
        );
      })
    });
  },
  getSingleAuthor:function(db,authorId){
    return new Promise((res,rej)=>{
      authorsModel.getAuthors(db,'WHERE id = ?','',[authorId]).then((response)=>{
        res(response[0]);
      }).catch((err)=>{
        rej(err);
      })
    });
  },
  save:function(db,body){
    return new Promise((res,rej)=>{
      authorsModel.save(db,body).then((response)=>{
        res(response);
      }).catch((err)=>{
        rej(err);
      })
    });
  },
  update:function(db,body,authorId){
    return new Promise((res,rej)=>{
      authorsModel.update(db,body,authorId).then((response)=>{
        if(response==undefined) throw {message:'Author of id '+authorId+' not found'};
        res(response);
      }).catch((err)=>{
        rej(err);
      })
    });
  },
  validate:function(body){
    return validate([
      "name|required"
    ],body);
  }
}