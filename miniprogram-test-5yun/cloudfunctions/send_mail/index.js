// 云函数入口文件
const nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  // service: 'qq',
  host: 'smtp.163.com',
  port: 465,               // SMTP 端口
  secure: true,            // 使用 SSL
  auth: {
    user: '***********',   //发邮件邮箱
    pass: '***********'       //此处不是qq密码是
  }
});


// 云函数入口函数
exports.main = async (event, context) => {
  var mailOptions = {
    from: '***********',   // 发件地址
    to: '************',    // 收件列表
    subject: '测试云函数',      // 标题
    text: '测试云函数'
  };
  mailOptions.to=event.to
  mailOptions.subject=event.subject
  mailOptions.text=event.text
  console.log("Start to sendemail")
  //开始发送邮件
  const info = await transporter.sendMail(mailOptions);
  console.log('Message sent: ' + info.response);
  return info
}