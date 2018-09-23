module.exports={
  groupObjs:function(objs,idKey,objsToGroup,groupName){
    for (let i = 0; i < objs.length; i++) {
      for(let key in objs[i]){
        if(key==idKey){
          objs[i][groupName]=this.findObjById(objs[i][key],objsToGroup);
          delete objs[i][key];
        }
      }
    }
    return objs;
  },
  findObjById(id,objs){
    for (let i = 0; i < objs.length; i++) {
      const element = objs[i];
      if(id==element.id){
        return element;
      }
    }
  }
}