class Timer {
  countdown(end, update, handle) {
    const now = new Date().getTime();
    const _this = this;
    // 当倒计时结束时
    if (now - end > 0) {
      handle.call(_this);
    } else {
      let last_time = end - now;
      const DAY_TIMES = 1000 * 60 * 60 * 24;
      const HOUR_TIMES = 1000 * 60 * 60;
      const MINUTES_TIMES = 1000 * 60;
      const SECOND_TIMES = 1000;
      // 向下取整
      let d = ~~(last_time / DAY_TIMES);
      let h = ~~((last_time - d * DAY_TIMES) / HOUR_TIMES);
      let m = ~~((last_time - d * DAY_TIMES - h * HOUR_TIMES) / MINUTES_TIMES);
      let s = ~~((last_time - d * DAY_TIMES - h * HOUR_TIMES - m * MINUTES_TIMES) / SECOND_TIMES);
      let time_arr = [];
      if (d > 0) {
        time_arr.push(`<em>${d}</em>天`);
      }
      if (time_arr.length || (h > 0)) {
        time_arr.push(`<em>${h}</em>时`);
      }
      if (time_arr.length || (m > 0)) {
        time_arr.push(`<em>${m}</em>分`);
      }
      if (time_arr.length || s > 0) {
        time_arr.push(`<em>${s}</em>秒`);
      }
      _this.last_time = time_arr.join('');
      update.call(_this, time_arr.join(''));
      setTimeout(() => {
        _this.countdown(end, update, handle);
      }, 1000);
    }
  }
}

export default Timer