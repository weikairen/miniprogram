// 云函数入口文件
const cloud = require('wx-server-sdk')
var em_module = require('./generateRightKey.js');

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  var requestCodes = event.requestCode.split(';')
  var registCodes=[]
  for (var code of requestCodes){
    var retPtr = em_module.ccall('generateCode', 'string', ['string'], [code]);
    registCodes.push(retPtr)
  }
  
  console.log(registCodes.join(';'));
  return registCodes.join(';');
}