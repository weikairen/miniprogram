function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function send_apply_success_msg (openid, formid, apply_time) {
  console.log("调用模板消息成功")
  console.log(openid, formid, apply_time)
  wx.request({
    url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx332c4b0e1524aa71&secret=933d7b925586905c723bcb1c8d194201',
    method: 'GET',
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      console.log(res)
      console.log(res.data.access_token);
      wx.request({
        url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + res.data.access_token,
        method: 'POST',
        data: {
          "touser": openid,
          "template_id": "2WK-ELVINvHnTpXJfmIpzOGuLaK1r4SzlVHpocwL4eA",
          "form_id": formid,
          "data": {
            "keyword1": {
              "value": apply_time,
              "color": "#173177"
            },
            "keyword2": {
              "value": "平台将尽快审核申请并将注册码发送到您的邮箱，请留意您的邮箱。",
              "color": "#173177"
            }
          },

        },

        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res)
        }
      })
    }
  })
}
module.exports = {
  formatTime: formatTime,
  send_apply_success_msg: send_apply_success_msg
}