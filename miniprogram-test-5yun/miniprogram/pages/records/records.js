// pages/records/records.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // records: [{
    //   license: 'aaaaaaaaa',
    //   radio: '华睿嵌入式实时操作系统',
    //   version_radio: '正式版',
    //   apply_time: '2019年1月21号15:23:42'
    // }, {
    //   license: 'bbbbbbbbbb',
    //     radio: '华睿嵌入式实时操作系统',
    //   version_radio: '正式版',
    //   apply_time: '2019年1月21号15:23:42'
    // },]
      records:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(getApp().globalData.openid)
    if (getApp().globalData.openid) {
      console.log("ok")
      const db = wx.cloud.database();
      db.collection("apply").where({
        _openid: getApp().globalData.openid
      }).get({
        success: res => {
          console.log(res.data)
          this.setData({
            records: res.data//返回的是一个数组，取第一个
          })
          console.log(this.data.records)
        }, fail: err => {
          console.log(err)
        }
      })
    }

  },

  goToReview: function(){
    wx.navigateTo({
      url: '../admin/admin',
    })    
  }




})