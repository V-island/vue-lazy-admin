import xeUtils from 'xe-utils';
import dayjs from 'dayjs'
import { commonStore } from '@/store'

/* =================== 基础方法 ================ *

/**
 * @desc  格式化时间
 * @param {(Object|string|number)} time
 * @param {string} format
 * @returns {string | null}
 */
export function formatDateTime(time = undefined, format = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(time).format(format)
}

export function formatDate(date = undefined, format = 'YYYY-MM-DD') {
  return formatDateTime(date, format)
}
/**
 * @desc  函数节流
 * @param {Function} fn
 * @param {Number} wait
 * @returns {Function}
 */
export function throttle(fn, wait) {
  let context, args
  let previous = 0

  return function () {
    const now = +new Date()
    context = this
    args = arguments
    if (now - previous > wait) {
      fn.apply(context, args)
      previous = now
    }
  }
}

/**
 * @desc  函数防抖
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(method, wait, immediate) {
  let timeout
  return function (...args) {
    const context = this
    if (timeout)
      clearTimeout(timeout)

    // 立即执行需要两个条件，一是 immediate 为 true，二是 timeout 未被赋值或被置为 null
    if (immediate) {
      /**
       * 如果定时器不存在，则立即执行，并设置一个定时器，wait毫秒后将定时器置为null
       * 这样确保立即执行后wait毫秒内不会被再次触发
       */
      const callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if (callNow)
        method.apply(context, args)
    }
    else {
      // 如果immediate为false，则函数wait毫秒后执行
      timeout = setTimeout(() => {
        /**
         * args 是一个类数组对象，所以使用 fn.apply
         * 也可写作 method.call(context, ...args)
         */
        method.apply(context, args)
      }, wait)
    }
  }
}

// 字典转义
export function getDictToName(findDict, value, option = { value: 'value', name: 'name' }) {
  const item = xeUtils.find(findDict, (item) => `${item[option.value]}` == `${value}`);
  if (item) return item[option.name];
  return '-';
}

// 格式化菜单链接
export function formatMenuUrl(url) {
  if (/^(http:\/\/|https:\/\/|www\.|iframe:)/i.test(url) || !url) return url;

  const menuName = url.replace(/\/index/g, '').replace(/\//g, '-');
  const name = xeUtils.camelCase(menuName);

  return name;
}

// 封装promise，返回数组[err, data]
export function awaitWrap(promise) {
  return promise.then((data) => [null, data]).catch((err) => [err, null]);
}

// 返回结果
export function getResult(state = false, message = '') {
  return { result: state, message };
}

// 校验错误结果
export function validateResult(results) {
  const { get } = xeUtils;
  let info = null;
  results.some((data) => {
    if (get(data, 'code') !== 200) {
      info = Promise.resolve(getResult(false, data.msg));
      return true;
    }
  });
  return info;
}

// 生成uuid唯一标识
export function getBuildUUID() {
  var s = [];
  var hexDigits = '0123456789abcdef';
  for (var i = 0; i < 30; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-';
  var uuid = s.join('');
  return uuid;
}

// 生成随机数
export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 对象转URL参数
 * @param {object} param 对象传参
 * @param {string} type 拼接字段
 * @param {string} last 首字母字段
 * @returns query 字符串
 */
export function getObjectByQuery(param, type = '&', last = '?') {
  const query = Object.keys(param).map((key) => `${key}=${param[key]}`);
  return `${last}${query.join(type)}`;
}

/**
 * 阿拉伯数字转中文数字,
 * 如果传入数字时则最多处理到21位，超过21位js会自动将数字表示成科学计数法，导致精度丢失和处理出错
 * 传入数字字符串则没有限制
 * @param {number|string} digit
 */
export function ToZhDigit(digit) {
  digit = typeof digit === 'number' ? String(digit) : digit;
  const zh = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const unit = ['千', '百', '十', ''];
  const quot = [
    '万',
    '亿',
    '兆',
    '京',
    '垓',
    '秭',
    '穰',
    '沟',
    '涧',
    '正',
    '载',
    '极',
    '恒河沙',
    '阿僧祗',
    '那由他',
    '不可思议',
    '无量',
    '大数',
  ];

  let breakLen = Math.ceil(digit.length / 4);
  let notBreakSegment = digit.length % 4 || 4;
  let segment;
  let zeroFlag = [],
    allZeroFlag = [];
  let result = '';

  while (breakLen > 0) {
    if (!result) {
      // 第一次执行
      segment = digit.slice(0, notBreakSegment);
      let segmentLen = segment.length;
      for (let i = 0; i < segmentLen; i++) {
        if (segment[i] != 0) {
          if (zeroFlag.length > 0) {
            result += '零' + zh[segment[i]] + unit[4 - segmentLen + i];
            // 判断是否需要加上 quot 单位
            if (i === segmentLen - 1 && breakLen > 1) {
              result += quot[breakLen - 2];
            }
            zeroFlag.length = 0;
          } else {
            result += zh[segment[i]] + unit[4 - segmentLen + i];
            if (i === segmentLen - 1 && breakLen > 1) {
              result += quot[breakLen - 2];
            }
          }
        } else {
          // 处理为 0 的情形
          if (segmentLen == 1) {
            result += zh[segment[i]];
            break;
          }
          zeroFlag.push(segment[i]);
          continue;
        }
      }
    } else {
      segment = digit.slice(notBreakSegment, notBreakSegment + 4);
      notBreakSegment += 4;

      for (let j = 0; j < segment.length; j++) {
        if (segment[j] != 0) {
          if (zeroFlag.length > 0) {
            // 第一次执行zeroFlag长度不为0，说明上一个分区最后有0待处理
            if (j === 0) {
              result += quot[breakLen - 1] + zh[segment[j]] + unit[j];
            } else {
              result += '零' + zh[segment[j]] + unit[j];
            }
            zeroFlag.length = 0;
          } else {
            result += zh[segment[j]] + unit[j];
          }
          // 判断是否需要加上 quot 单位
          if (j === segment.length - 1 && breakLen > 1) {
            result += quot[breakLen - 2];
          }
        } else {
          // 第一次执行如果zeroFlag长度不为0, 且上一划分不全为0
          if (j === 0 && zeroFlag.length > 0 && allZeroFlag.length === 0) {
            result += quot[breakLen - 1];
            zeroFlag.length = 0;
            zeroFlag.push(segment[j]);
          } else if (allZeroFlag.length > 0) {
            // 执行到最后
            if (breakLen == 1) {
              result += '';
            } else {
              zeroFlag.length = 0;
            }
          } else {
            zeroFlag.push(segment[j]);
          }

          if (j === segment.length - 1 && zeroFlag.length === 4 && breakLen !== 1) {
            // 如果执行到末尾
            if (breakLen === 1) {
              allZeroFlag.length = 0;
              zeroFlag.length = 0;
              result += quot[breakLen - 1];
            } else {
              allZeroFlag.push(segment[j]);
            }
          }
          continue;
        }
      }

      --breakLen;
    }

    return result;
  }
}

/**
 * 中文数字转阿拉伯数字,
 * 如果传入数字时则最多处理到21位，超过21位js会自动将数字表示成科学计数法，导致精度丢失和处理出错
 * 传入数字字符串则没有限制
 * @param {number|string} digit
 */
export function zhDigitToArabic(digit) {
  const zh = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const unit = ['千', '百', '十'];
  const quot = [
    '万',
    '亿',
    '兆',
    '京',
    '垓',
    '秭',
    '穰',
    '沟',
    '涧',
    '正',
    '载',
    '极',
    '恒河沙',
    '阿僧祗',
    '那由他',
    '不可思议',
    '无量',
    '大数',
  ];
  let result = 0,
    quotFlag;

  for (let i = digit.length - 1; i >= 0; i--) {
    if (zh.indexOf(digit[i]) > -1) {
      // 数字
      if (quotFlag) {
        result += quotFlag * getNumber(digit[i]);
      } else {
        result += getNumber(digit[i]);
      }
    } else if (unit.indexOf(digit[i]) > -1) {
      // 十分位
      if (quotFlag) {
        result += quotFlag * getUnit(digit[i]) * getNumber(digit[i - 1]);
      } else {
        result += getUnit(digit[i]) * getNumber(digit[i - 1]);
      }
      --i;
    } else if (quot.indexOf(digit[i]) > -1) {
      // 万分位
      if (unit.indexOf(digit[i - 1]) > -1) {
        if (getNumber(digit[i - 1])) {
          result += getQuot(digit[i]) * getNumber(digit[i - 1]);
        } else {
          result += getQuot(digit[i]) * getUnit(digit[i - 1]) * getNumber(digit[i - 2]);
          quotFlag = getQuot(digit[i]);
          --i;
        }
      } else {
        result += getQuot(digit[i]) * getNumber(digit[i - 1]);
        quotFlag = getQuot(digit[i]);
      }
      --i;
    }
  }

  return result;

  // 返回中文大写数字对应的阿拉伯数字
  function getNumber(num) {
    for (let i = 0; i < zh.length; i++) {
      if (zh[i] == num) {
        return i;
      }
    }
  }

  // 取单位
  function getUnit(num) {
    for (let i = unit.length; i > 0; i--) {
      if (num == unit[i - 1]) {
        return Math.pow(10, 4 - i);
      }
    }
  }

  // 取分段
  function getQuot(q) {
    for (var i = 0; i < quot.length; i++) {
      if (q == quot[i]) {
        return Math.pow(10, (i + 1) * 4);
      }
    }
  }
}

/**
 * 阿拉伯数字转大写 - 金额
 * @param {*} n  金额
 * @returns
 */
export function ToAmountByString(n) {
  if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) {
    return '数据非法'; //判断数据是否大于0
  }
  var unit = '千百拾亿千百拾万千百拾元角分',
    str = '';
  n += '00';
  var indexpoint = n.indexOf('.'); // 如果是小数，截取小数点前面的位数

  if (indexpoint >= 0) {
    n = n.substring(0, indexpoint) + n.substr(indexpoint + 1, 2); // 若为小数，截取需要使用的unit单位
  }

  unit = unit.substr(unit.length - n.length); // 若为整数，截取需要使用的unit单位
  for (var i = 0; i < n.length; i++) {
    str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i); //遍历转化为大写的数字
  }

  return str
    .replace(/零(千|百|拾|角)/g, '零')
    .replace(/(零)+/g, '零')
    .replace(/零(万|亿|元)/g, '$1')
    .replace(/(亿)万|壹(拾)/g, '$1$2')
    .replace(/^元零?|零分/g, '')
    .replace(/元$/g, '元整'); // 替换掉数字里面的零字符，得到结果
}

// 显示全局加载组件
export function showPageLoading(text = '正在努力加载中...') {
  const store = commonStore();
  store.setLoading(true, text);
}

// 隐藏全局加载组件
export function hidePageLoading() {
  const store = commonStore();
  store.setLoading(false);
}

/**
 * 挂载 XeUtils API
 */
export function setupXeUtilsApi() {
  window.$utils = xeUtils
}
