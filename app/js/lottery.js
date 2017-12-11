import 'babel-polyfill'
import Base from './lottery/base'
import Calculate from './lottery/calculate'
import Interface from './lottery/interface'
import Timer from './lottery/timer'
import $ from 'jquery'

const copyProperties = (target, source) => {
  for (let key of Reflect.ownKeys(source)) {
    if (key !== 'constructor' && key !== 'prototype' && key !== 'name') {
      let desc = Object.getOwnPropertyDescriptor(source, key)
      Object.defineProperty(target, key, desc)
    }
  }
}

const mix = (...mixins) => {
  class Mix {}
  for (let mixin of mixins) {
    copyProperties(Mix, mixin)
    copyProperties(Mix.prototype, mixin.prototype)
  }
  return Mix
}

class Lottery extends mix(Base, Calculate, Interface, Timer){
  constructor (name = 'syy', cname = '11选5', issue = '**', state = '**'){
    super()
    this.name = name
    this.cname = cname
    this.issue = issue
    this.state = state
    this.el = ''
    this.omit = new Map()
    this.open_code = new Set()
    this.open_code_list = new Set()
    this.play_list = new Map()
    this.number = new Set()
    this.issue_el = '#curr_issue'
    this.countdown_el = '#countdown'
    this.state_el = '.state_el'
    this.cart_el = '.codelist'
    this.omit_el = ''
    this.cur_play = 'r5'
    this.initPlayList()
    this.initNumber()
    this.updateState()
    this.initEvent()
  }

  /**
   * 状态更新
   */
  updateState () {
    let _this = this
    this.getState().then(res => {
      _this.issue = res.issue
      _this.end_time = res.end_time
      _this.state = res.state
      $(_this.issue_el).text(res.issue)
      _this.countdown(res.end_time, time => {
        $(_this.countdown_el).html(time)
      }, () => {
        setTimeout(() => {
          _this.updateState()
          _this.getOmit(_this.issue).then(res => {

          })
          _this.getOpenCode(_this.issue).then(res => {

          })
        }, 500)
      })
    })
  }

  /**
   * 初始化事件
   */
  initEvent () {
    let _this = this
    $('#plays').on('click', 'li', _this.changePlayNav.bind(_this))
    $('.boll-list').on('click', '.btn-boll', _this.toggleCodeActive.bind(_this))
    $('#confirm_sel_code').on('click', _this.addCode.bind(_this))
    $('.dxjo').on('click', 'li', _this.assistHandle.bind(_this))
    $('.qkmethod').on('click', '.btn-middle', _this.getRandomCode.bind(_this))
  }
}

export default Lottery