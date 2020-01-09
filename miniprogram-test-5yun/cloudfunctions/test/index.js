const cloud = require('wx-server-sdk')
cloud.init()  
// 云函数入口函数
exports.main = async (event, context) => {
  console.log("Start to test")
  return await cloud.callFunction({
    name: 'regist_code',
    // 传给云函数的参数
    data: {
      requestCode:'aaaaaaaa;ssssssss;ddddddd'
    },
  })
}