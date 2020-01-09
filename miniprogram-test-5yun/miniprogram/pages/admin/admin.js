// pages/admin/admin.js
// Page({

//   /**
//    * 页面的初始数据
//    */
//   data: {
//     secret: '',
//   },

//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad: function (options) {
    
//   },
//   secretChange: function (e) {
//     this.setData({
//       secret: e.detail.value
//     })
//     console.log(e.detail.value)
//   },
//   login:function(e){
    
// //密码已经写死，为ruihua007
//     if(this.data.secret == 'ruihua007'){
//       wx.navigateTo({
//         url: '../review/review',
//       }) 
//     }else{
//       wx.showToast({
//         title: '密码错误请重试',
//       })
//       // this.setData({
//       //   secret: ''
//       // })
//     }
//   },

// })


Page({
  data: {
    phone: '',
    password: ''
  },

  // 获取输入账号
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  // 获取输入密码
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },

  // 登录
  login: function () {
    if (this.data.phone.length == 0 || this.data.password.length == 0) {
      wx.showToast({
        title: '验证不通过',
        icon: 'loading',
        duration: 1000
      })
    } else if (this.data.phone != 'password' || this.data.password != 'password') {
      wx.showToast({
        title: '验证不通过',
        icon: 'loading',
        duration: 1000
      })
    } else {
      // 这里修改成跳转的页面
      wx.navigateTo({
        url: '../review/review',
      })
      wx.showToast({
        title: '登录成功',
        icon: 'success',
        duration: 2000
      })
    }
  }
})