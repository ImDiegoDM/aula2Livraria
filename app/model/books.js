const dbHelper = require('../helper/db');
const rHelper = require('../helper/response');
const authorsModel = require('./authors');
const publishersModel = require('./publishers');
const categoriesModel = require('./categories');
const env = require('../../env');

module.exports={
  getBooks:(db,where='',limit='',inserts=[],uri=false)=>{
    return new Promise(async(res,rej)=>{
      let query = 'SELECT id, name, price, year'+
      (uri ? ', CONCAT("'+env.url+'books/",id) AS book_uri':'')+
      ', authors_id, pub_companies_id, categories_id '+
      'FROM books '+where+' '+limit;
      console.log(query);
      let books = await dbHelper.prommiseQuery(
        db,
        query,
        inserts
      );
  
      let authorsWhere = dbHelper.querySecondaryObjects(books,'authors_id');
      let authors = await authorsModel.getAuthors(db,authorsWhere,'',[],true);
  
      let publishersWhere = dbHelper.querySecondaryObjects(books,'pub_companies_id');
      let publishers = await publishersModel.getPublishers(db,publishersWhere,'',[],true);
  
      let categoriesWhere = dbHelper.querySecondaryObjects(books,'categories_id');
      let categories = await categoriesModel.getCategories(db,categoriesWhere,'',[],true);

      books = rHelper.groupObjs(books,'authors_id',authors,'author');
      books = rHelper.groupObjs(books,'pub_companies_id',publishers,'pub_company');
      books = rHelper.groupObjs(books,'categories_id',categories,'category');
      res(books);
    });
  }
}