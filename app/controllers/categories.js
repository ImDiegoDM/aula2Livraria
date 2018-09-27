const dbHelper = require('../helper/db');
var env = require('../../env');
var validate = require('../helper/validate');
const categoriesModel = require('../model/categories');
const booksModel = require('../model/books');

module.exports={
  getCategories:(db,options)=>{
    let inserts = [
      options.itensPerPage*(options.page-1),
      options.itensPerPage
    ];
    return new Promise((res,rej)=>{
      categoriesModel.getCategories(db,'','LIMIT ?,?',inserts,true).then(async (response)=>{
        res(
          dbHelper.paginateResponse(
            response,
            env.url+'categories',
            options.page,
            options.itensPerPage,
            await dbHelper.countRows('categories',db)
          )
        );
      }).catch((err)=>{
        rej(err);
      })
    });
  },
  getBooks:function(db,categoryId,options){
    return new Promise(async(res,rej)=>{
      let inserts = [
        categoryId,
        options.itensPerPage*(options.page-1),
        options.itensPerPage
      ];
      booksModel.getBooks(db,'WHERE categories_id = ?','LIMIT ?,?',inserts,true).then(async(response)=>{
        res(
          dbHelper.paginateResponse(
            response,
            env.url+'categories/'+categoryId+'/books',
            options.page,
            options.itensPerPage,
            await dbHelper.countRows('books',db,'WHERE categories_id = ?',[categoryId])
          )
        );
      })
    });
  },
  getSingleCategorie:function(db,categorieId){
    return new Promise((res,rej)=>{
      categoriesModel.getCategories(db,'WHERE id = ?','',[categorieId]).then((response)=>{
        res(response[0]);
      }).catch((err)=>{
        rej(err);
      })
    });
  },
  save:function(db,body){
    return new Promise((res,rej)=>{
      categoriesModel.save(db,body).then((response)=>{
        res(response);
      }).catch((err)=>{
        rej(err);
      })
    });
  },
  update:function(db,body,categorieId){
    return new Promise((res,rej)=>{
      categoriesModel.update(db,body,categorieId).then((response)=>{
        if(response==undefined) throw {message:'Categorie of id '+categorieId+' not found'};
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