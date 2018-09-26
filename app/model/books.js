const dbHelper = require('../helper/db');
const rHelper = require('../helper/response');
const authorsModel = require('./authors');
const publishersModel = require('./publishers');
const categoriesModel = require('./categories');
const env = require('../../env');
var mysql = require('mysql');

module.exports={
  getBooks:(db,where='',limit='',inserts=[],uri=false)=>{
    return new Promise(async(res,rej)=>{
      let query = 'SELECT id, name, price, year'+
      (uri ? ', CONCAT("'+env.url+'v1/books/",id) AS book_uri':'')+
      ', authors_id, pub_companies_id, categories_id '+
      'FROM books '+where+' '+limit;
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
  },
  search(db,limit='',inserts=[],searchWord){
    return new Promise(async(res,rej)=>{
      searchWord = '%'+searchWord+'%';
      let query = 'SELECT books.id as id, books.name as name, books.price as price, books.year as year'+
      (', CONCAT("'+env.url+'v1/books/",books.id) AS book_uri')+
      ',books.authors_id as authors_id, books.pub_companies_id as pub_companies_id, books.categories_id as categories_id '+
      'FROM books '+
      'INNER JOIN authors ON books.authors_id = authors.id '+
      'INNER JOIN pub_companies ON books.pub_companies_id = pub_companies.id '+
      'INNER JOIN categories ON books.categories_id = categories.id '+
      'WHERE books.name LIKE ? '+
      'OR authors.name LIKE ? '+
      'OR pub_companies.name LIKE ? '+
      'OR categories.name LIKE ? '+
      limit;
      //console.log(mysql.format(query, [searchWord,searchWord,searchWord,searchWord].concat(inserts)));
      let books = await dbHelper.prommiseQuery(
        db,
        query,
        [searchWord,searchWord,searchWord,searchWord].concat(inserts)
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
  },
  countSearch(db,search){
    return new Promise((res,rej)=>{
      search = '%'+search+'%';
      let searchQuery = 'SELECT COUNT(*)'+
        'FROM books '+
        'INNER JOIN authors ON books.authors_id = authors.id '+
        'INNER JOIN pub_companies ON books.pub_companies_id = pub_companies.id '+
        'INNER JOIN categories ON books.categories_id = categories.id '+
        'WHERE books.name LIKE ? '+
        'OR authors.name LIKE ? '+
        'OR pub_companies.name LIKE ? '+
        'OR categories.name LIKE ? ';
        
        db.query(searchQuery,[search,search,search,search],(error, results, fields)=>{
          if (error) rej(error);
          else {
            
            res(results[0]["COUNT(*)"]);
          }
        });
    });
  }
}