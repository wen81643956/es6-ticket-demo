import $ from 'jquery'

class Base {
  /**
   * 初始化奖金和玩法以及说明
   */
  initPlayList() {
    this.play_list.set('r2', {
      bonus: 6,
      tip: '从01～11中任选2个或多个号码，所选号码与开奖号码任意两个号码相同，即中奖<em class="red">6</em>元',
      name: '任二'
    }).set('r3', {
      bonus: 19,
      tip: '从01～11中任选3个或多个号码，所选号码与开奖号码任意三个号码相同，即中奖<em class="red">19</em>元',
      name: '任三'
    }).set('r4', {
      bonus: 78,
      tip: '从01～11中任选4个或多个号码，所选号码与开奖号码任意四个号码相同，即中奖<em class="red">78</em>元',
      name: '任四'
    }).set('r5', {
      bonus: 540,
      tip: '从01～11中任选5个或多个号码，所选号码与开奖号码相同，即中奖<em class="red">540</em>元',
      name: '任五'
    }).set('r6', {
      bonus: 90,
      tip: '从01～11中任选6个或多个号码，所选号码与开奖号码五个号码相同，即中奖<em class="red">90</em>元',
      name: '任六'
    }).set('r7', {
      bonus: 26,
      tip: '从01～11中任选7个或多个号码，所选号码与开奖号码五个号码相同，即中奖<em class="red">26</em>元',
      name: '任七'
    }).set('r8', {
      bonus: 9,
      tip: '从01～11中任选8个或多个号码，所选号码与开奖号码五个号码相同，即中奖<em class="red">9</em>元',
      name: '任八'
    })
  }

  /**
   * 初始化号码
   */
  initNumber() {
    for (let i = 1; i < 12; i++) {
      this.number.add((`${i}`)).padStart(2, '0')
    }
  }

  /**
   * 设置遗漏数据
   * @param omit
   */
  setOmit(omit) {
    let _this = this
    _this.omit.clear()
    for (let [index, item] of omit.entries()) {
      _this.omit.set(index, item)
    }
    $(_this.omit_el).each(function (index, item) {
      $(item).text(_this.omit.get(index))
    })
  }

  /**
   * 设置开奖
   * @param code
   */
  setOpenCode(code) {
    let _this = this
    _this.open_code.clear()
    for (let item of code.values()) {
      _this.open_code.add(item)
    }
    _this.updateOpenCode && _this.updateOpenCode.call(_this, code)
  }

  /**
   * 号码选中取消
   * @param e
   */
  toggleCodeActive(e) {
    let _this = this
    let $cur = $(e.currentTarget)
    $cur.toggleClass('btn-boll-active')
    _this.getCount()
  }

  /**
   * 切换玩法
   * @param e
   */
  changePlayNav(e) {
    let _this = this
    let $cur = $(e.currentTarget)
    $cur.addClass('active').siblings().removeClass('active')
    _this.cur_play = $cur.attr('desc').toLocaleLowerCase()
    $('#zx_sm span').html(_this.play_list.get(_this.cur_play).tip)
    $('.boll-list .btn-boll').removeClass('btn-boll-active')
    _this.getCount()
  }

  /**
   * 操作区
   * @param e
   */
  assistHandle(e) {
    e.preventDefault()
    let _this = this
    let $cur = $(e.currentTarget)
    let index = $cur.index()
    $('.boll-list .btn-boll').removeClass('btn-boll-active')
    if (index === 0) {
      $('.boll-list .btn-boll').addClass('btn-boll-active')
    }
    if (index === 1) {
      $('.boll-list .btn-boll').each(function (i, t) {
        if (t.textContent - 5 > 0) {
          $(t).addClass('btn-boll-active')
        }
      })
    }
    if (index === 2) {
      $('.boll-list .btn-boll').each(function (i, t) {
        if (t.textContent - 6 < 0) {
          $(t).addClass('btn-boll-active')
        }
      })
    }
    if (index === 3) {
      $('.boll-list .btn-boll').each(function (i, t) {
        if (t.textContent % 2  === 1) {
          $(t).addClass('btn-boll-active')
        }
      })
    }
    if (index === 4) {
      $('.boll-list .btn-boll').each(function (i, t) {
        if (t.textContent % 2 === 0) {
          $(t).addClass('btn-boll-active')
        }
      })
    }
    _this.getCount()
  }

  /**
   * 获取当前彩票名
   */
  getName() {
    return this.name
  }

  /**
   * 添加号码
   */
  addCode() {
    let _this = this
    let $active = $('boll-list .btn-boll-active').text().match(/\d{2}/g)
    let active = $active ? $active.length : 0
    let count =_this.computeCount(active, _this.cur_play)
    if (count) {
      _this.addCodeItem($active.join(''), _this.cur_play, _this.play_list.get(_this.cur_play).name, count)
    }
  }

  /**
   * 添加单次号码
   * @param code
   * @param type
   * @param typeName
   * @param count
   */
  addCodeItem(code, type, typeName, count) {
    let _this = this
    const tpl = `
      <li codes="${type}|${code}" bonus="${count * 2}" count="${count}">
        <div class="code">
          <b>${typeName}${count > 1 ? '复式' : '单式'}</b>
          <b class="em">${code}</b>
          [${count}注,<em class="code-list-money">${count * 2}</em>]
        </div>
      </li>
    `
    $(_this.cart_el).append(tpl)
    _this.getTotal()
  }

  getCount() {
    let _this = this
    let active = $('boll-list .btn-boll-active')
    let count = _this.computeCount(active, _this.cur_play)
    let range = _this.computeBonus(active, _this.cur_play)
    let money = count * 2
    let win1 = range[0] - money
    let win2 = range[1] - money
    let tpl
    let c1 = (win1 < 0 && win2 < 0) ? Math.abs(win1) : win1
    let c2 = (win1 < 0 && win2 < 0) ? Math.abs(win2) : win2
    if (count === 0) {
      tpl = `<p class="sel_info">您选了 <b>${count}</b> 注，共 <b>${count * 2}</b> 元 <em></em></p>`
    } else if (range[0] === range[1]) {
      tpl = `您选了 <b>${count}</b> 注,共 <b>${count * 2}</b> 元  <em>若中奖，奖金：
            <strong class="red">${range[0]}</strong> 元,
            您将${win1 >=0 ? '盈利' : '亏损'}
            <strong class="${win1 >= 0 ? 'red' : 'green'}">${Math.abs(win1)}</strong> 元</em>`
    } else {
      tpl = `您选了 <b>${count}</b> 注,共 <b>${count * 2}</b> 元  <em>若中奖，奖金：
            <strong class="red">${range[0]}</strong> 至 <strong class="red">${range[1]}</strong>元,
            您将${(win1 < 0 && win2 < 0) ? '亏损' : '盈利'}
            <strong class="${win1 >= 0 ? 'red' : 'green'}">${c1}</strong> 至
            <strong class="${win2 >= 0 ? 'red' : 'green'}">${c2}</strong> 元</em>`
    }
    $('.sel_info').html(tpl)
  }

  /**
   * 计算所有金额
   */
  getTotal() {
    let count = 0
    $('.codelist li').each(function (index, item) {
      count += $(item).attr('count') * 1
    })
    $('#count').text(count)
    $('#money').text(count * 2)
  }

  /**
   * 生成随机数
   * @param num
   */
  getRandom(num) {
    let arr = [], index
    let number = Array.from(this.number)
    while(num --) {
      index = Math.parseInt(Math.random() * number.length)
      arr.push(index)
      number.splice(index, 1)
    }
    return arr.join(' ')
  }

  /**
   * 添加随机号码
   * @param e
   */
  getRandomCode(e) {
    e.preventDefault()
    let num = e.currentTarget.getAttribute('count')
    let play = this.cur_play.match(/\d+/g)[0]
    if (num === '0') {
      $(this.cart_el).html('')
    } else {
      for (let i = 0; i < num; i++) {
        this.addCodeItem(this.getRandom(play), this.cur_play, this.play_list.get(this.cur_play).name, 1)
      }
    }
  }
}

export default Base