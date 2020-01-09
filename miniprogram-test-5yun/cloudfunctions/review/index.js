// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  var id = event._id
  var reply_license = event.reply_license
  var status=event.status
  try {
    await db.collection("apply").doc(id
    ).update({
      data: {
        apply_status: status,
        reply_license: reply_license
      }
    })
    return  db.collection("apply").where({
      apply_status: 1
    }).limit(1).get()
  } catch (e) {
    console.log(e)
  }

}