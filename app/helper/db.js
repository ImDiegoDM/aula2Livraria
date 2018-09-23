/**
 * get all numbers that is a string and parse to float
 */
function jsonFormatNumber(json){
  for(let key in json){
    let parsed = parseFloat(json[key]);
    json[key] = parsed ? parsed : json[key];
  }
  return json;
}

module.exports ={
  /**
   * gets a json object and parse to a concat for sql query group this elements
   */
  concatQuery:function(obj,uriValue,uriName='uri'){
    let concat='CONCAT("{ ",';
    for(let key in obj){
      concat+='"\''+key+'\': ",';
      concat+='"\'",'+obj[key]+',"\'",",",'
    }
    if(uriValue){
      concat+='"\''+uriName+'\': ",';
      uriValue = uriValue.split("?");
      if(uriValue.length>1){
        concat+='"\'","'+uriValue[0]+'",';
        concat+=obj.id+',';
        concat+='"'+uriValue[1]+'","\'",",",';
      }else{
        concat+='"\'","'+uriValue+'",';
        concat+=obj.id+',"\'",",",';
      }
    }

    concat = concat.slice(0,-4);
    concat+='" }")'
    return concat;
  },
  /**
   * iterate through object and convert the string value to a json object if it is a json 
   */
  responseToJson:function(obj){
    for(let key in obj){
      for(let key2 in obj[key]){
        let value = obj[key][key2];
        try{
          obj[key][key2]=JSON.parse(value.replace(/'/g,"\""));
          obj[key][key2] = jsonFormatNumber(obj[key][key2]);
        }catch(err){}
      }
    }
    return obj;
  },
  /**
   * add uri to objs 
   */
  addUri:function(obj,uri,uriName='uri'){
    uri = uri.split("?");
    for (let i = 0; i < obj.length; i++) {
      if(uri.length>1){
        obj[i][uriName] = uri[0]+obj[i].id+uri[1];
      }else{
        obj[i][uriName] = uri+obj[i].id;
      }
    }
    return obj;
  },
  /**
   * paginated default response
   */
  paginateResponse(data,url,page,itensPerPage,pages){
    pages=Math.ceil(pages/itensPerPage);
    let obj = {
      pages:pages,
      actualPage:page,
    }
    if(page<pages){
      obj.nextPage=url+'?page='+(parseInt(page)+1)+'&itensPerPage='+itensPerPage;
    }
    obj.data=data;
    return obj;
  },
  /**
   * Count rows of query
   */
  countRows(table,db,where='',inserts=[]){
    return new Promise((res,rej)=>{
      db.query('SELECT COUNT(*) FROM ??'+where,[table].concat(inserts),(error, results, fields)=>{
        if (error) rej(error);
        res(results[0]["COUNT(*)"]);
      });
    });
  },
  /**
   * Promissed query
   */
  prommiseQuery(db,query,inserts=[]){
    return new Promise((res,rej)=>{
      db.query(query,inserts,(error,results,fields)=>{
        if(error) rej(error);
        res(results);
      });
    });
  },
  /**
   * return a query for get secondary object
   */
  querySecondaryObjects(objs,idKey){
    let ids=[1,2,3];
    for(let key in objs){
      for(let key2 in objs[key]){
        if(key2==idKey){
          ids.push(objs[key][key2]);
        }
      }
    }
    ids = ids.filter(function(item, pos) {
      return ids.indexOf(item) == pos;
    });
    let where='WHERE id IN ('
    ids.forEach((value)=>{
      where+=value+', ';
    });
    where = where.slice(0,-2);
    return where+')'
  }
}