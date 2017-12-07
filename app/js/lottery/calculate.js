class Calculate {
  /**
   * 计算注数
   * @param {number} active 当前选中的号码
   * @param {string} play_name 当前的玩法标识
   * @return {number} 注数
   */
  computeCount(active, play_name) {
    let count = 0;
    const exist = this.play_list.has(play_name);
    const arr = new Array(active).fill('0');
    if (exist && play_name.charAt(0) === 'r') {
      count = Calculate.combine(arr, play_name.split('')[1]).length;
    }
    return count;
  }

  /**
   * 奖金范围预测
   * @param {number} active 当前选中的号码
   * @param {string} play_name 当前的玩法标识
   * @return {array} 奖金范围
   */
  computeBonus(active, play_name) {
    const play = play_name.split('');
    const _this = this;
    let arr = new Array(play[1] * 1).fill('0');
    let min, max;
    if (play[0] === 'r') {
      let min_active = 5 - (11 - active);
      if (min_active > 0) {
        if (min_active - play[1] >= 0) {
          arr = new Array(min_active).fill(0);
          min = Calculate.combine(arr, play[1]).length;
        } else {
          if (play[1] - 5 > 0 && active - play[1] >= 0) {
            arr = new Array(active - 5).fill(0);
            min = Calculate.combine(arr, play[1] - 5).length;
          } else {
            min = active - play[1] > -1 ? 1 : 0;
          }
        }
      } else {
        min = active - play[1] > -1 ? 1 : 0;
      }

      let max_active = Math.min(active, 5);
      if (play[1] - 5 > 0) {
        if (active - play[1] >= 0) {
          arr = new Array(active - 5).fill(0);
          max = Calculate.combine(arr, play[1] - 5).length;
        } else {
          max = 0;
        }
      } else if (play[1] - 5 < 0) {
        arr = new Array(Math.min(active, 5)).fill(0);
        max = Calculate.combine(arr, play[1]).length;
      } else {
        max = 1;
      }
    }

    return [min, max].map(item => item * _this.play_list.get(play_name).bonus)
  }

  /**
   * 组合运算
   * @param {array} arr 参与组合运算的数组
   * @param {number} size 组合运算的基数
   * @return {number} 计算注数
   */
  static combine(arr, size) {
    let all_result = [];
    (function (arr, size, result) {
      let len = arr.length;
      if (size > len) {
        return;
      }
      if (size === len) {
        all_result.push([].concat(result, arr))
      } else {
        for (let i = 0; i < len; i++) {
          let new_result = [].concat(result);
          new_result.push(arr[i]);
          if (size === 1) {
            all_result.push(new_result);
          } else {
            let new_arr = [].concat(arr);
            new_arr.splice(0, i + 1);
            f(new_arr, size - 1, new_result);
          }
        }
      }
    })(arr, size, [])
    return all_result;
  }
}

export default Calculate