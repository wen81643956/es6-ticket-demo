import $ from 'jquery'

class Interface {

  /**
   * 获取遗漏数据
   * @param issue 当前期号
   */
  getOmit(issue) {
    let _this = this
    return new Promise((resolve, reject) => {
      $.ajax({
        url: '/get/omit',
        data: {
          issue: issue
        },
        dataType: 'json',
        success: function (res) {
          _this.setOmit(res.data)
          resolve.call(_this, res)
        },
        error: function (err) {
          reject.call(err)
        }
      })
    })
  }

  /**
   * 获取开奖号码
   * @param issue 期号
   */
  getOpenCode(issue){
    let _this = this
    return new Promise((resolve, reject) => {
      $.ajax({
        url: '/get/opencode',
        data: {
          issue: issue
        },
        dataType: 'json',
        success: function (res) {
          _this.setOpenCode(res.data)
          resolve.call(_this, res)
        },
        error: function (err) {
          reject.call(err)
        }
      })
    })
  }

  /**
   * 获取当前期号
   * @param issue 期号
   */
  getState(issue) {
    let _this = this
    return new Promise((resolve, reject) => {
      $.ajax({
        url: '/get/state',
        data: {
          issue: issue
        },
        dataType: 'json',
        success: function (res) {
          resolve.call(_this, res)
        },
        error: function (err) {
          reject.call(err)
        }
      })
    })
  }
}


export default Interface