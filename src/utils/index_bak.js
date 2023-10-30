import { createApp } from 'vue';
import xeUtils from 'xe-utils';
import { pageLoadingStore } from 'store/common';
import { useAuthStore, menuStore } from 'store/auth';
import { resetRoutes, getInitAsyncRoutes, staticRoutes } from 'router';
// RSA加密
import JSEncrypt from 'jsencrypt';

/* =================== 基础方法 ================ */
// 重置router，将会清除所有异步路由，只保留常量路由
export function resetRouter() {
  resetRoutes();
}

// 退出登陆时清除store和router
export function clearAppState() {
  resetRoutes();
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

// 获取views下所有文件
const modules = import.meta.glob('views/**/**/**/*.vue');
// 生成异步路由
export function generateAsyncRoutes(tree) {
  const menuTree = xeUtils.clone(tree, true);

  // 判断是否获取到新菜单
  if (!xeUtils.isArray(menuTree) && menuTree.length == 0) return [];

  // 获取初始异步路由表
  const asyncRoutes = getInitAsyncRoutes();
  // 将树结构菜单列表转成数组列表
  const menuList = xeUtils.toTreeArray(menuTree, { clear: true });
  // 筛掉属于外链菜单/无链接数据
  const notLinkMenuList = xeUtils.filter(
    menuList,
    (item) => 'url' in item && !/^(http:\/\/|https:\/\/|www\.|iframe:)/i.test(item.url),
  );
  // 将菜单列表转成路由格式
  const menuRoutes = xeUtils.map(notLinkMenuList, (item) => {
    const { url, title } = item;
    const menuName = formatMenuUrl(url);

    return {
      path: `/${menuName}`,
      name: `${menuName}`,
      component: modules[`/src/views/modules/${url}.vue`],
      meta: {
        title,
      },
    };
  });
  // 添加静态路由
  const newRouterTree = xeUtils.union(menuRoutes, staticRoutes);
  // 获取异步路由中layout所在引索Index
  const layoutIndex = xeUtils.findIndexOf(asyncRoutes, (item) => item.name == 'layout');

  // 判断是否找到layout
  if (layoutIndex < 0) return xeUtils.union(asyncRoutes, newRouterTree);

  // 获取异步路由中layout所在子集
  const layoutChildren = xeUtils.get(asyncRoutes, `[${layoutIndex}].children`);
  const newLayoutChildren = xeUtils.union(layoutChildren, newRouterTree);

  asyncRoutes[`${layoutIndex}`].children = newLayoutChildren;
  return asyncRoutes;
}

// 重新获取菜单并生成动态路由
// 添加修改菜单、切换角色后需要调用此方法清空异步路由，重新获取新菜单后生成异步路由
export async function resetRouterMenu() {
  try {
    // 获取菜单
    const menu = menuStore();
    await menu.getMenuListToToken();
  } catch (error) {
    // 菜单获取失败，回登陆页面
    clearAppState();
    Message.error('获取新菜单失败，请重新登陆');
  }
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
    if (get(data, 'code') !== 0) {
      info = Promise.resolve(getResult(false, data.msg));
      return true;
    }
  });
  return info;
}

// 值是否为空
export function isEmpty(val) {
  if (typeof val === 'string') {
    val = val.trim();
  }
  return val === undefined || val === null || val === '' || val === false || Object.is(val, NaN);
}

// 值是否不为空
export function isNotEmpty(val) {
  return !isEmpty(val);
}

// 数组是否存在重复
export function isArrayRepeat(array) {
  let is = false;

  array.forEach((item, index) => {
    if (array.indexOf(item) != index) is = true;
  });

  return is;
}

// 获取文档标题
export function getDocumentTitle(pageTitle) {
  const documentTitle = import.meta.env.VITE_HOLDER_TITLE;
  if (pageTitle) {
    return `${pageTitle} - ${documentTitle}`;
  }
  return documentTitle;
}

/**
 * 十六进制颜色值转为带透明度的颜色
 * @param _color 十六进制颜色
 * @param _opacity 透明度
 * @returns {string} rgba
 */
export function hexToRGBA(_color, _opacity) {
  var sColor = _color.toLowerCase();
  //十六进制颜色值的正则表达式
  var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  // 如果是16进制颜色
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      var sColorNew = '#';
      for (var i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
      }
      sColor = sColorNew;
    }
    //处理六位的颜色值
    var sColorChange = [];
    for (var j = 1; j < 7; j += 2) {
      sColorChange.push(parseInt('0x' + sColor.slice(j, j + 2)));
    }
    return 'rgba(' + sColorChange.join(',') + ',' + _opacity + ')';
  }
  return sColor;
}

// 获取UUID
export function getUUID(prefixStr = '') {
  return prefixStr + Date.now() + Math.random().toString().substr(2, 3);
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
 *
 * @param {*} n 阿拉伯数字转大写 - 金额
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

/* =================== 打印下载 ================ */
// 下载URL
export function saveFile(data, filename) {
  var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
  save_link.href = data;
  save_link.download = filename;
  save_link.target = '_blank';

  var event = document.createEvent('MouseEvents');
  event.initMouseEvent(
    'click',
    true,
    false,
    window,
    0,
    0,
    0,
    0,
    0,
    false,
    false,
    false,
    false,
    0,
    null,
  );
  save_link.dispatchEvent(event);
}

// 下载文件流
export function saveBlobFile(blob, fileName) {
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, fileName);
  } else {
    var a = document.createElement('a');
    var downUrl = window.URL.createObjectURL(blob);
    a.href = downUrl;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(downUrl);
  }
}

// 打印Dom
export function iframePrint(Element) {
  var userAgent = navigator.userAgent.toLowerCase(); //取得浏览器的userAgent字符串

  if (userAgent.indexOf('trident') > -1) {
    alert('请使用google或者360浏览器打印');
    return false;
  } else {
    //判断iframe是否存在，不存在则创建iframe
    var iframe = document.getElementById('print-iframe');
    if (iframe) {
      document.body.removeChild(iframe);
    } else {
      iframe = document.createElement('iframe');
      iframe.setAttribute('id', 'print-iframe');
      iframe.setAttribute(
        'style',
        'position:absolute;width:0px;height:0px;left:-500px;top:-500px;',
      );
      document.body.appendChild(iframe);

      var doc = iframe.contentWindow.document;
      doc.write(`<link rel="stylesheet" type="text/css" href="../css/style.css">`);
      doc.write(Element);
      doc.close();

      setTimeout(() => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      }, 500);
    }
  }
}

// base64图片旋转90度
export function rotateBase64Img(src, edg, callback) {
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');

  var imgW; //图片宽度
  var imgH; //图片高度
  var size; //canvas初始大小

  if (edg % 90 != 0) {
    console.error('旋转角度必须是90的倍数!');
    throw '旋转角度必须是90的倍数!';
  }
  edg < 0 && (edg = (edg % 360) + 360);
  const quadrant = (edg / 90) % 4; //旋转象限
  const cutCoor = { sx: 0, sy: 0, ex: 0, ey: 0 }; //裁剪坐标

  var image = new Image();
  image.crossOrigin = 'anonymous';
  image.src = src;

  image.onload = function () {
    imgW = image.width;
    imgH = image.height;
    size = imgW > imgH ? imgW : imgH;

    canvas.width = size * 2;
    canvas.height = size * 2;
    switch (quadrant) {
      case 0:
        cutCoor.sx = size;
        cutCoor.sy = size;
        cutCoor.ex = size + imgW;
        cutCoor.ey = size + imgH;
        break;
      case 1:
        cutCoor.sx = size - imgH;
        cutCoor.sy = size;
        cutCoor.ex = size;
        cutCoor.ey = size + imgW;
        break;
      case 2:
        cutCoor.sx = size - imgW;
        cutCoor.sy = size - imgH;
        cutCoor.ex = size;
        cutCoor.ey = size;
        break;
      case 3:
        cutCoor.sx = size;
        cutCoor.sy = size - imgW;
        cutCoor.ex = size + imgH;
        cutCoor.ey = size + imgW;
        break;
    }

    ctx.translate(size, size);
    ctx.rotate((edg * Math.PI) / 180);
    ctx.drawImage(image, 0, 0);

    var imgData = ctx.getImageData(cutCoor.sx, cutCoor.sy, cutCoor.ex, cutCoor.ey);
    if (quadrant % 2 == 0) {
      canvas.width = imgW;
      canvas.height = imgH;
    } else {
      canvas.width = imgH;
      canvas.height = imgW;
    }
    ctx.putImageData(imgData, 0, 0);
    callback(canvas.toDataURL());
  };
}

// Url转Blob
export function dataURLtoBlob(dataUrl) {
  var arr = dataUrl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

// 下载文件
export function downloadFile(url, name = '') {
  var a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', name);
  a.setAttribute('target', '_blank');
  let clickEvent = document.createEvent('MouseEvents');
  clickEvent.initEvent('click', true, true);
  a.dispatchEvent(clickEvent);
}

// base64图片下载
export function downloadFileByBase64(base64, name) {
  var myBlob = dataURLtoBlob(base64);
  var myUrl = URL.createObjectURL(myBlob);
  downloadFile(myUrl, name);
}

/* =================== Form表单数据格式化 ================ */
// Textarea换行 存储
export function textareaPush(str) {
  // eslint-disable-next-line no-control-regex
  var reg = new RegExp('\r\n', 'g');
  var reg1 = new RegExp(' ', 'g');

  str = str.replace(reg, '<br>').replace(reg1, '<p>');

  return str;
}

// Textarea换行 显示
export function textareaPull(str) {
  var reg = new RegExp('<br>', 'g');
  var reg1 = new RegExp('<p>', 'g');

  str = str.replace(reg, '\r\n').replace(reg1, ' ');

  return str;
}

/* =================== 系统操作 ================ */
// 跳转到登录页面
export function toLoginPage(url) {
  localStorage.clear();
  sessionStorage.clear();

  // 跳转
  setTimeout(() => {
    location.href = url;
  }, 500);
}

// DOM全屏
export function fullScreen(el) {
  var rfs =
      el.requestFullScreen ||
      el.webkitRequestFullScreen ||
      el.mozRequestFullScreen ||
      el.msRequestFullScreen,
    wscript;

  if (typeof rfs != 'undefined' && rfs) {
    rfs.call(el);
    return;
  }

  if (typeof window.ActiveXObject != 'undefined') {
    // eslint-disable-next-line no-undef
    wscript = new ActiveXObject('WScript.Shell');
    if (wscript) {
      wscript.SendKeys('{F11}');
    }
  }
}

// DOM 退出全屏
export function exitFullScreen(el) {
  el = el || document;
  var cfs =
      el.cancelFullScreen ||
      el.webkitCancelFullScreen ||
      el.mozCancelFullScreen ||
      el.exitFullScreen,
    wscript;

  if (typeof cfs != 'undefined' && cfs) {
    cfs.call(el);
    return;
  }

  if (typeof window.ActiveXObject != 'undefined') {
    // eslint-disable-next-line no-undef
    wscript = new ActiveXObject('WScript.Shell');
    if (wscript != null) {
      wscript.SendKeys('{F11}');
    }
  }
}

// 刷新
export function refresh(Url) {
  setTimeout(function () {
    if (Url) {
      location.href = Url;
      return;
    } else {
      return location.reload();
    }
  }, 1000);
}

// 元素添加背景水印
/**
 * 元素添加背景水印
 * 兼容IE9+及其它现代浏览器
 * @param text 水印文字
 * @param selectors 要添加水印的DOM元素(css选择器)
 * @param rotate 文字旋转角度
 * @param color 文字颜色(支持RGBA)
 *
 * 示例：createWatermark('XXX公司', '.watermark', -20, 'rgba(144,147,153,0.3)');
 */
export function createWatermark(text, selectors, rotate, color) {
  text = text || 'XXX公司';
  selectors = selectors || 'body';
  rotate = rotate || -20;
  color = color || 'rgba(144,147,153,0.3)';

  var can = document.createElement('canvas');
  var body = document.body;
  var nodes = document.querySelectorAll(selectors);
  body.appendChild(can);
  can.width = text.length * 30;
  can.height = text.length * 18;
  can.style.display = 'none';
  var cans = can.getContext('2d');
  // 弧度偏转
  cans.rotate((rotate * Math.PI) / 180);
  cans.font = '20px PingFang SC';
  cans.fontWeight = '400';
  cans.fontFamily =
    '-apple-system,BlinkMacSystemFont,Segoe UI,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Helvetica Neue,Helvetica,Arial,sans-serif,Roboto,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol!important;';
  cans.fillStyle = color;
  cans.fillText(text, 0, can.height);
  for (var i = 0; i < nodes.length; i++) {
    (function (node) {
      setWatermark(node);

      // 以下代码是防止用户通过调试控制台删除水印.
      if ('ActiveXObject' in window) {
        // 兼容IE浏览器
        node.addEventListener('DOMAttrModified', function () {
          setWatermark(node);
        });
      } else if ('MutationObserver' in window) {
        // 兼容其它现代浏览器
        var observer = new MutationObserver(function () {
          setWatermark(node);
        });
        observer.observe(node, {
          attributes: true,
          subtree: true,
        });
      }
    })(nodes[i]);
  }

  // 设置水印图片到元素背景
  function setWatermark(node) {
    node.style.backgroundImage = 'url(' + can.toDataURL('image/png') + ')';
    node.style.backgroundPosition = '-50px -50px,0px 0px';
  }
}

// 事件总线
export const EventBus = createApp();

// 显示全局加载组件
export function showPageLoading(loadingText = '正在努力加载中...') {
  const store = pageLoadingStore();
  store.setLoadingTip(loadingText);
  store.setLoadingStatus(true);
}

// 隐藏全局加载组件
export function hidePageLoading() {
  const store = pageLoadingStore();
  store.setLoadingStatus(false);
}

// 全局倒计时消息
export const showCountdownLoading = async (option = {}, callback) => {
  let time = option.time || 10;
  let text = option.text || `物资检查中，预计完成倒计时`;

  showPageLoading(`${text}${time}秒... `);
  return new Promise((resolve, reject) => {
    const loadingTimer = setInterval(() => {
      time--;
      showPageLoading(`${text}${time}秒... `);
      if (time == 0) {
        hidePageLoading();
        clearInterval(loadingTimer);
        typeof callback === 'function' && callback();
      }
    }, time * 100);

    resolve(loadingTimer);
  });
};

// 是否具有按钮权限
export function hasPermission(permissionFlag) {
  return utilFn._get(store, 'state.user.permissions', []).includes(permissionFlag);
}

export function getRsaCode(str) {
  // 注册方法
  const pubKey =
    'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDMCvuROelOvtv3DrvOuG3cWlMOCF6kjXtqxyjTyLJP9wCupe5M2XNok9gG5j8K8L2TVHGhLHZuCSKMIXl5/PYh++vhKtDG8uxUit9+vo9yCK7trRU1UZbQQ83Uep0ybNlkd25B2aQjJcrTxDJiyEMBGKqjPQhQzeR+EYLfnAIGpwIDAQAB'; // ES6 模板字符串 引用 rsa 公钥
  const encryptStr = new JSEncrypt();
  encryptStr.setPublicKey(pubKey); // 设置 加密公钥
  const data = encryptStr.encrypt(str.toString()); // 进行加密
  return data;
}

// 工具方法
export const utilFn = {
  _isString: xeUtils.isString,
  _isNumber: xeUtils.isNumber,
  _isFloat: xeUtils.isFloat,
  _isInteger: xeUtils.isInteger,
  _isBoolean: xeUtils.isBoolean,
  _isArray: xeUtils.isArray,
  _isFunction: xeUtils.isFunction,
  _isPlainObject: xeUtils.isPlainObject,
  _isDate: xeUtils.isDate,
  _isMap: xeUtils.isMap,
  _isSet: xeUtils.isSet,
  _isElement: xeUtils.isElement,
  _keys: xeUtils.keys,
  _values: xeUtils.values,
  _get: xeUtils.get,
  _set: xeUtils.set,
  _has: xeUtils.has,
  _find: xeUtils.find,
  _each: xeUtils.each,
  _map: xeUtils.map,
  _filter: xeUtils.filter,
  _findTree: xeUtils.findTree,
  _searchTree: xeUtils.searchTree,
  _toFixed: xeUtils.toFixed,
  _toNumber: xeUtils.toNumber,
  _toInteger: xeUtils.toInteger,
  _toString: xeUtils.toValueString,
  _clone: xeUtils.clone,
  _add: xeUtils.add,
  _subtract: xeUtils.subtract,
  _multiply: xeUtils.multiply,
  _divide: xeUtils.divide,
  _remove: xeUtils.remove,
  _escape: xeUtils.escape,
  _unescape: xeUtils.unescape,
  _awaitWrap: awaitWrap,
  _isEmpty: isEmpty,
  _isNotEmpty: isNotEmpty,
  _isArrayRepeat: isArrayRepeat,
  _showPageLoading: showPageLoading,
  _hidePageLoading: hidePageLoading,
  _hasPermission: hasPermission,
  _getUUID: getUUID,
  _getRandomInt: getRandomInt,
  _getDictToName: getDictToName,
};
