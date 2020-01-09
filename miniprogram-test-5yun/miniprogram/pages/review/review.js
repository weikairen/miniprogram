// pages/review/review.js
var util = require('../../utils/utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    records:[{}],
    apply_success_value:'',
    apply_fail_value:'',
    review_num:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      const db = wx.cloud.database();
      db.collection('apply').where({
        apply_status: 1 ,
       // version_radio:'正式版'
        }).count({
          success: res=> {
            this.setData({
              review_num:res.total
            })
          }
        })

      db.collection("apply").where({
        apply_status: 1,
        //version_radio: '正式版'
      }).limit(1).get({
        success: res => {
          this.setData({
            records: res.data//返回的是一个数组
          })
          console.log(res.data)
        }, fail: err => {
          console.log(err)
        }
      })
    // }

  },
  // onApplySuccess: function (e){
  //   this.setData({
  //     apply_success_value: e.detail
  //   });
  //   // console.log(this.data.apply_success_value)
  // },
  generateCode: function (e) {
    wx.cloud.callFunction({
      // 云函数名称
      name: 'regist_code',
      // 传给云函数的参数
      data: {
        requestCode: this.data.records[0].apply_license
      },
      success: res => {
        this.setData({
          apply_success_value: res.result
        });
        console.log(res.result)
      },
      fail: err => {
        console.log(err)
      }
    })

    // console.log(this.data.apply_success_value)
  },
  apply_success:function(e){
    var success_value=this.data.apply_success_value
    wx.cloud.callFunction({
      // 云函数名称
      name: 'review',
      // 传给云函数的参数
      data: {
        _id: this.data.records[0]._id,
        reply_license: success_value,
        status:2
      },
      success:res => {
        wx.showToast({
          title: '审核通过',
        })
        console.log(res)
        this.setData({
          records : res.result.data,
          apply_success_value:'',
          review_num: this.data.review_num-1
        })
        // console.log(res.result.data)
        // console.log(this.data.records)
      },
      fail: err => {
        console.log(err)
      }
    })

    wx.cloud.callFunction({
      // 云函数名称
      name: 'send_mail',
      // 传给云函数的参数
      data: {
        to: this.data.records[0].apply_mail,
        subject: '锐化嵌入式操作系统',
        text: '你的申请已经通过审核，与请求码' + this.data.records[0].apply_license + '对应的注册码是' + success_value
      },
      success: res => {
        console.log('发送邮件成功')
      },
      fail: err => {
        console.log('邮件发送失败')
        console.log(err)
      }
    })
  },
  onApplyFail: function (e) {
    this.setData({
      apply_fail_value: e.detail
    });
    // console.log(this.data.apply_fail_value)
  },

  apply_fail: function (e) {
    var fail_value=this.data.apply_fail_value
    wx.cloud.callFunction({
      // 云函数名称
      name: 'review',
      // 传给云函数的参数
      data: {
        _id: this.data.records[0]._id,
        reply_license: fail_value,
        status: 0
      },
      success: res => {
        wx.showToast({
          title: '审核未通过',
        })
        console.log(res)
        this.setData({
          records: res.result.data,
          apply_fail_value: '',
          review_num: this.data.review_num - 1
        })
        // console.log(res.result.data)
        // console.log(this.data.records)
      },
      fail: err => {
        console.log(err)
      }
    })

   
    wx.cloud.callFunction({
      // 云函数名称
      name: 'send_mail',
      // 传给云函数的参数
      data: {
        to: this.data.records[0].apply_mail,
        subject: '锐化嵌入式操作系统',
        text: '你的申请未能通过了审核，原因是' + fail_value
      },
      success: res => {
        console.log('发送邮件成功')
      },
      fail: err => {
        console.log('邮件发送失败')
        console.log(err)
      }
    })
    // wx.cloud.callFunction({
    //   // 云函数名称
    //   name: 'send_mail',
    //   // 传给云函数的参数
    //   data: {
    //     to: this.data.records[0].apply_mail,
    //     subject: '锐化嵌入式操作系统',
    //     text: '你的申请未能通过了审核，原因是' + fail_value
    //   },
    //   success: res => {
    //     console.log('发送邮件成功')
    //   },
    //   fail: err => {
    //     console.log('邮件发送失败')
    //     console.log(err)
    //   }
    // })
  },


})