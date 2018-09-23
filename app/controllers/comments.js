const dbHelper = require('../helper/db');
const commentModel = require('../model/commnets');
var validate = require('../helper/validate');

module.exports={
  saveComment:function(db,body,bookId){
    return new Promise(async(res,rej)=>{
      let comment = await dbHelper.prommiseQuery(
        db,
        'SELECT id FROM comments WHERE users_id = ? AND books_id = ?',
        [ body.users_id, bookId ]
      )
      
      if(comment[0]){
        res(commentModel.update(db,body,comment[0].id));
      }else{
        res(commentModel.save(db,body,bookId));
      }
    });
  },
  validate(body){
    return validate([
      "users_id|required",
      "comment|required",
      "stars|required"
    ],body);
  }
}