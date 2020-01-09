// pages/applyForm/applyForm.js
var util = require('../../utils/utils.js');
import Dialog from '../../dist/dialog/dialog';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    apply_unit:'',
    apply_department:'',  
    apply_reason:'',
    apply_name:'',
    apply_phone:'',
    apply_mail:'',
    // radio:'',
    // version_radio:'',
    lists: [{
      value: ''
    }],
    reply_license:'待审核',
    //0表示审核未通过，1表示待审核，2表示审核通过
    apply_status:1,
    verify_code:'',

  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    //调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },

 
  form_submit(e) {
    const telReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(16[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    const emailReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/; 
    if (this.data.apply_phone==''){
      Dialog.alert({
        message: '电话号码不能为空'
      });
    } else if (!telReg.test(this.data.apply_phone)){
      Dialog.alert({
        message: '请输入正确的电话号码'
      });
    } else if (this.data.apply_mail==''){
      Dialog.alert({
        message: '邮箱不能为空'
      });
    } else if (!emailReg.test(this.data.apply_mail)) {
      Dialog.alert({
        message: '邮箱格式不正确'
      });
    } else if (this.data.lists.length==0 || this.data.lists[0].value=='') {
      Dialog.alert({
        message: '请求码不能为空'
      });
    } else if (this.data.apply_unit == '') {
      Dialog.alert({
        message: '申请单位不能为空'
      });
    } else if (this.data.apply_department == '') {
      Dialog.alert({
        message: '部门名称不能为空'
      });
    } else if (this.data.apply_reason == '') {
      Dialog.alert({
        message: '申请理由不能为空'
      });
    } else if (this.data.apply_name == '') {
      Dialog.alert({
        message: '申请人不能为空'
      });
    // } else if (this.data.radio == '') {
    //   Dialog.alert({
    //     message: '申请版本不能为空'
    //   });
    // } else if (this.data.version_radio == '') {
    //   Dialog.alert({
    //     message: '版本类型不能为空'
    //   });
    }else{

      var licenses = []
      for (var license in this.data.lists) {
        licenses.push(this.data.lists[license].value)
      }
      var current_time = util.formatTime(new Date())

      if(this.data.verify_code=="ruihua007"){    //如果紧急验证码正确，立刻调用云函数生成注册码
        wx.cloud.callFunction({
          // 云函数名称
          name: 'regist_code',
          // 传给云函数的参数
          data: {
            requestCode: licenses.join(';'),
          },
          success: res => {
            this.setData({
              reply_license: res.result,
              // apply_status:2
            });
            console.log(res.result)

            let apply_info = this.data
            const db = wx.cloud.database()

            db.collection("apply").add({
              data: {
                form_id: e.detail.formId,
                apply_unit:apply_info.apply_unit,
                apply_department: apply_info.apply_department,
                apply_reason: apply_info.apply_reason,
                apply_name: apply_info.apply_name,
                apply_phone: apply_info.apply_phone,
                apply_mail: apply_info.apply_mail,
                // radio: apply_info.radio,
                // version_radio: apply_info.version_radio,
                license_num: apply_info.lists.length,
                apply_time: current_time,
                //0表示审核未通过，1表示待审核，2表示审核通过
                apply_status: 2,
                apply_license: licenses.join(';'),
                reply_license: apply_info.reply_license,
                verify_code: apply_info.verify_code,
              }, success: res => {
                Dialog.alert({
                  message: '提交申请成功，注册码生成成功，可立即查看'
                });

                this.setData({
                  apply_unit:'',
                  apply_department: '',
                  apply_mail: '',
                  apply_name: '',
                  apply_phone: '',
                  apply_reason: '',
                  // version_radio: '',
                  // radio: '',
                  license_num: '',
                  verify_code: '',
                  lists: [],
                })
                //发送小程序消息通知
                //util.send_apply_success_msg(getApp().globalData.openid, e.detail.formId, current_time)

              }, fail: err => {

                Dialog.alert({
                  message: '提交申请失败'
                });
              }

            })

          },
          fail: err => {
            console.log(err)
          }
        })
      }else{
        let apply_info = this.data
        const db = wx.cloud.database()

        db.collection("apply").add({
          data: {
            form_id: e.detail.formId,
            apply_unit: apply_info.apply_unit,
            apply_department: apply_info.apply_department,
            apply_reason: apply_info.apply_reason,
            apply_name: apply_info.apply_name,
            apply_phone: apply_info.apply_phone,
            apply_mail: apply_info.apply_mail,
            // radio: apply_info.radio,
            // version_radio: apply_info.version_radio,
            license_num: apply_info.lists.length,
            apply_time: current_time,
            //0表示审核未通过，1表示待审核，2表示审核通过
            apply_status: 1,
            apply_license: licenses.join(';'),
            reply_license: apply_info.reply_license,
            verify_code: apply_info.verify_code,
          }, success: res => {
            Dialog.alert({
              message: '提交申请成功'
            });

            this.setData({
              apply_unit:'',
              apply_department: '',
              apply_mail: '',
              apply_name: '',
              apply_phone: '',
              apply_reason: '',
              // version_radio: '',
              // radio: '',
              license_num: '',
              verify_code: '',
              lists: [],
            })
            //发送小程序消息通知
            //util.send_apply_success_msg(getApp().globalData.openid, e.detail.formId, current_time)

          }, fail: err => {

            Dialog.alert({
              message: '提交申请失败'
            });
          }

        })
      }




    }
  

  },



  // onTypeChange: function (e) {
  //   this.setData({
  //     radio: e.detail
  //   });
  //   console.log(this.data.radio)
  // },
  // onVersionChange: function (e) {
  //   this.setData({
  //     version_radio: e.detail
  //   });
  //   console.log(this.data.version_radio)
  // },
  handleLicenseNumberChange: function (e) {
    this.setData({
      license_num: e.detail.value
    });
    console.log(this.data.license_num)
  },
  unitChange: function (e) {
    this.setData({
      apply_unit: e.detail.value
    })
    console.log('单位' + this.data.apply_unit)
  },
  departmentChange: function (e) {
    this.setData({
      apply_department: e.detail.value
    })
    console.log('部门' + this.data.apply_department)
  },
  reasonChange: function (e) {
    this.setData({
      apply_reason: e.detail.value
    })
    console.log('原因' + this.data.apply_reason)
  },
  nameChange: function (e) {
    this.setData({
      apply_name: e.detail.value
    })
    console.log('姓名' + this.data.apply_name)
  },
  phoneChange: function (e) {
    this.setData({
      apply_phone: e.detail.value
    })
    console.log('电话' + this.data.apply_phone)
  },
  mailChange: function (e) {
    this.setData({
      apply_mail: e.detail.value
    })
    console.log('邮件' + this.data.apply_mail)
  },
  verifyCodeChange: function (e) {
    this.setData({
      verify_code: e.detail.value
    })
    console.log('验证码' + this.data.verify_code)
  },



  onAddPhone: function () {
    var lists = this.data.lists;
    var newData = { value: '' };
    if (lists.length >= 3) {
      Dialog.alert({
        message: '不能再增加输入框了'
      });
      return;
    }
    lists.push(newData);
    this.setData({
      lists: lists,
    })
  },
  delList: function () {
    var lists = this.data.lists;
    if (lists.length <= 1) {
      Dialog.alert({
        message: '不能删除默认输入框'
      });
      return;
    }
    lists.pop();
    this.setData({
      lists: lists,
    })
  },
  bindPhoneDataChang0: function (e) {
    var up = "lists[" + 0 + "].value";
    this.setData({
      [up]: e.detail
    })
  },
  bindPhoneDataChang1: function (e) {
    var up = "lists[" + 1 + "].value";
    this.setData({
      [up]: e.detail
    })
  },
  bindPhoneDataChang2: function (e) {
    var up = "lists[" + 2 + "].value";
    this.setData({
      [up]: e.detail
    })
  },



  getScancode0: function (e) {
    var up = "lists[" + 0 + "].value";
    var _this = this;
    // 允许从相机和相册扫码
    wx.scanCode({
      success: (res) => {
        var result = res.result;

        _this.setData({
          [up]: result,

        })
      }
    })
  },
  getScancode1: function (e) {
    var up = "lists[" + 1 + "].value";
    var _this = this;
    // 允许从相机和相册扫码
    wx.scanCode({
      success: (res) => {
        var result = res.result;

        _this.setData({
          [up]: result,

        })
      }
    })
  }, 
  getScancode2: function (e) {
    var up = "lists[" + 2 + "].value";
    var _this = this;
    // 允许从相机和相册扫码
    wx.scanCode({
      success: (res) => {
        var result = res.result;

        _this.setData({
          [up]: result,

        })
      }
    })
  },

})