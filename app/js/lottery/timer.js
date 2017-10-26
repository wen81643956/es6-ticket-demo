class Timer {
  countdown(end, update, handle) {
    const now = new Date().getTime();
    const _this = this;
    // 当倒计时结束时
    if (now - end) {
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
    }
  }
}