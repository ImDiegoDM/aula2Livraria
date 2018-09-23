const dbHelper = require('../helper/db');
var env = require('../../env');
var validate = require('../helper/validate');
const publishersModel = require('../model/publishers');
const booksModel = require('../model/books');

module.exports={
  getPublishers(db,options){
    let inserts = [
      options.itensPerPage*(options.page-1),
      options.itensPerPage
    ];
    return new Promise((res,rej)=>{
      publishersModel.getPublishers(db,'','LIMIT ?,?',inserts,true).then(async (response)=>{
        console.log(response);
        
        res(
          dbHelper.paginateResponse(
            response,
            env.url+'publishers',
            options.page,
            options.itensPerPage,
            await dbHelper.countRows('pub_companies',db)
          )
        );
      }).catch((err)=>{
        rej(err);
      })
    });
  },
  getSinglePublisher(db,pubId){
    return new Promise((res,rej)=>{
      publishersModel.getPublishers(db,'WHERE id = ?','',[pubId]).then((response)=>{
        res(response[0]);
      })
    });
  },
  getPublishersBooks(db,pubId,options){
    return new Promise((res,rej)=>{
      let inserts = [
        pubId,
        options.itensPerPage*(options.page-1),
        options.itensPerPage
      ];
      booksModel.getBooks(db,'WHERE pub_companies_id = ?','LIMIT ?,?',inserts,true).then(async(response)=>{
        res(
          dbHelper.paginateResponse(
            response,
            env.url+'publishers/'+pubId+'/books',
            options.page,
            options.itensPerPage,
            await dbHelper.countRows('books',db,'WHERE pub_companies_id = ?',[pubId])
          )
        );
      })
    });
  },
  validate:function(body){
    return validate([
      "name|required"
    ],body);
  }
}