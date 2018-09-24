const dbHelper = require('../helper/db');
const rHelper = require('../helper/response');
const booksModel = require('./books');
const publishersModel = require('./publishers');
const categoriesModel = require('./categories');
const env = require('../../env');
const userModel = require('./users');
const adressesModel = require('./adresses');
const deliverStatusModel = require('./deliverStatus');
var mysql = require('mysql');

module.exports={
  getOrders:(db,where='',limit='',inserts=[],uri=false)=>{
    return new Promise(async(resolve,rej)=>{
      let query = 'SELECT id, status, users_id, adresses_id, deliver_satus_id, total_price'+
      (uri ? ', CONCAT("'+env.url+'users/",id) AS cart_uri ':' ')+
      'FROM orders '+where+' '+limit;
      
      let orders = await dbHelper.prommiseQuery(
        db,
        query,
        inserts
      );

      if(orders.length==0){
        rej('cart not finded');
        return;
      }

      orders = orders.map((item)=>{
        return Object.assign(item,{books:[]});
      });

      let userWherer = dbHelper.querySecondaryObjects(orders,'users_id');
      let users = await userModel.getUsers(db,userWherer,'',[],true);
  
      let adressesWhere = dbHelper.querySecondaryObjects(orders,'adresses_id');
      let adresses = await adressesModel.getAddress(db,adressesWhere,'',[],true);
  
      let deliverWhere = dbHelper.querySecondaryObjects(orders,'deliver_satus_id');
      let deliverStatus = await deliverStatusModel.getDeliverStatus(db,deliverWhere,'',[],true);

      orders = rHelper.groupObjs(orders,'users_id',users,'user');
      orders = rHelper.groupObjs(orders,'adresses_id',adresses,'address');
      orders = rHelper.groupObjs(orders,'deliver_satus_id',deliverStatus,'deliver_status');

      let ordersIds = rHelper.getIds(orders);
      
      let orderWhere='WHERE orders_id IN ('
      ordersIds.forEach((value)=>{
        orderWhere+=value+', ';
      });
      orderWhere = orderWhere.slice(0,-2);
      orderWhere = orderWhere+')';

      //

      let orderBooks = await dbHelper.prommiseQuery(db,'SELECT * FROM orders_has_books '+orderWhere);
      
      
      let booksIdsQuery = dbHelper.querySecondaryObjects(orderBooks,'books_id');
      let books = await booksModel.getBooks(db,booksIdsQuery,'',[],true);

      for (let i = 0; i < orderBooks.length; i++) {
        for (let j = 0; j < orders.length; j++) {
          if(orders[j].id==orderBooks[i].orders_id){
            for (let k = 0; k < books.length; k++) {
              if(books[k].id==orderBooks[i].books_id){
                orders[j].books.push(books[k]);
              }
            }
          }
        }
      }
      resolve(orders);
    });
  },
  createOrder(db,body,userId){
    return new Promise(async(res,rej)=>{
      let address;
      if(body.adresses_id){
        address = {id:body.adresses_id};
      }else{
        address = await adressesModel.save(db,JSON.parse(body.address));
      }

      let cartId = await dbHelper.prommiseQuery(db,'SELECT id FROM carts WHERE users_id = ?',[userId]);
      cartId = cartId[0].id;

      let cartsBooks = await dbHelper.prommiseQuery(db,'SELECT * FROM carts_has_books WHERE carts_id = ?',[cartId]);
      console.log(cartsBooks);

      let booksidsQuery = dbHelper.querySecondaryObjects(cartsBooks,'books_id');
      console.log(booksidsQuery);
      let books = await booksModel.getBooks(db,booksidsQuery,'',[],true);

      let totalPrice=0;
      
      
      for (let i = 0; i < books.length; i++) {
        const element = books[i];
        totalPrice+=element.price;
      }

      let orderResult = await dbHelper.prommiseQuery(
        db,
        'INSERT INTO orders SET status = ?, users_id = ?, adresses_id = ?, deliver_satus_id = ?, total_price = ? ',
        ['Pagamento pendente',userId,address.id,1,totalPrice]
      );
      
      let insertQuery='INSERT INTO orders_has_books (orders_id,books_id) VALUES ';
      let inserts=[];
      for (let i = 0; i < cartsBooks.length; i++) {
        const element = cartsBooks[i].books_id;
        insertQuery+='(?,?), ';
        inserts.push(orderResult.insertId);
        inserts.push(element);
      }
      insertQuery=insertQuery.slice(0,-2);

      await dbHelper.prommiseQuery(db,insertQuery,inserts);

      res(await this.getOrders(db,'WHERE id = ?','',[orderResult.insertId]));
    });
  }
}