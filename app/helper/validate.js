function validateField(fullField,body){
  let splited = fullField.split('|');
  let field = splited[0];
  splited.shift();

  let response={
    field:field
  };
  for (let i = 0; i < splited.length; i++) {
    if(splited[i]=='required'){
      if(!body[field]){
        response.errors={
          required:true
        };
        return response;
      }
    }
  }
  return response;
}

module.exports = function(fieldsToValidate,body){
  let missingFields=[]
  let fields={}

  for (let index = 0; index < fieldsToValidate.length; index++) {
    let response = validateField(fieldsToValidate[index],body);
    console.log(response);
    if(response.errors){
      if(response.errors.required){
        missingFields.push(response.field);
      }
    }
    else{
      fields[response.field]=body[response.field];
    }
  }

  if(missingFields.length>0){
    let message ='the '+(missingFields.length==1 ? 'field ':'fields ');
    for (let i = 0; i < missingFields.length; i++) {
      if(i==missingFields.length-2){
        message+= missingFields[i]+' and ';
      }else{
        message+= missingFields[i]+', ';
      }
    }
    message=message.slice(0,-2);
    message+=' is missing';
    throw {
      message:message
    }
  }

  return fields;
}