import { createApp } from 'vue';
import xeUtils from 'xe-utils';
import { pageLoadingStore } from 'store/common';
import { resetRoutes } from 'router';

/* =================== 基础方法 ================ */
// // 重置store的所有state为初始状态
// export function resetStore() {
//   store.dispatch('resetState');
// }

// 重置router，将会清除所有异步路由，只保留常量路由
export function resetRouter() {
  resetRoutes();
}

// 退出登陆时清除store和router
export function clearAppState() {
  // resetStore();
  resetRoutes();
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
  const documentTitle = import.meta.env.VITE_APP_DOCUMENT_TITLE;
  if (pageTitle) {
    return `${pageTitle} - ${documentTitle}`;
  }
  return documentTitle;
}

/**
 * 获取系统主题颜色
 * @param opacity 透明度 0~1
 */
export function getThemeColor(opacity = 1) {
  return hexToRGBA('#1BBDAB', opacity);
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

// 生成随机数
export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 截取地址传参ticket
export function getTicketByLocation() {
  let url = location.search;
  let theRequest = {};
  if (url.indexOf('?') !== -1) {
    let str = url.substr(1);
    let strs = str.split('&');
    for (let i = 0; i < strs.length; i++) {
      theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
    }
  }
  return theRequest;
}

// 截取地址@拼接传参
export function getParamByLocation() {
  const search = location.search.substr(1).split('&')[0].split('@');
  let theRequest = {};
  for (let i = 0; i < search.length; i++) {
    theRequest[search[i].split('=')[0]] = unescape(search[i].split('=')[1]);
  }
  return theRequest;
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

/* =================== 打印下载 ================ */
// 下载
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

// 打印
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
export function dataURLtoBlob(dataurl) {
  var arr = dataurl.split(','),
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
  }, 2000);
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
export function showPageLoading(loadingText = '数据加载中，请稍后...') {
  const store = pageLoadingStore();
  store.setLoadingTip(loadingText);
  store.setLoadingStatus(true);
}

// 隐藏全局加载组件
export function hidePageLoading() {
  const store = pageLoadingStore();
  store.setLoadingTip(loadingText);
  store.setLoadingStatus(false);
}

// 是否具有按钮权限
export function hasPermission(permissionFlag) {
  return utilFn._get(store, 'state.user.permissions', []).includes(permissionFlag);
}

/**
 * 表单对象赋值:
 * 对目标对象存在且源对象同样存在的属性，全部覆盖；
 * 目标对象不存在但是源对象存在的属性， 全部丢弃；
 * 目标对象存在但是源对象不存在的属性，如果是字符串赋值为空串，其余类型赋值为undefined
 */
export function recover(target, source) {
  if (target === undefined || target === null) {
    throw new TypeError('Cannot convert first argument to object');
  }
  var to = Object(target);
  if (source === undefined || source === null) {
    return to;
  }
  var keysArray = Object.keys(Object(target));
  for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
    var nextKey = keysArray[nextIndex];
    var desc = Object.getOwnPropertyDescriptor(target, nextKey);
    if (desc !== undefined && desc.enumerable) {
      if (Object.prototype.hasOwnProperty.call(to, nextKey)) {
        if (to[nextKey] instanceof Array) {
          to[nextKey] = source[nextKey];
        } else if (to[nextKey] instanceof Object) {
          recover(to[nextKey], source[nextKey]);
        } else if (source[nextKey] !== undefined) {
          to[nextKey] = source[nextKey];
        } else if (typeof to[nextKey] === 'string') {
          to[nextKey] = '';
        } else {
          to[nextKey] = undefined;
        }
      }
    }
  }
  return to;
}

/**
 * 表单对象赋值:
 * 对目标对象存在且源对象同样存在的属性，全部覆盖；
 * 目标对象不存在但是源对象存在的属性， 全部丢弃；
 * 目标对象存在但是源对象不存在的属性，保留目标对象的属性不做处理
 */
export function recoverNotNull(target, source) {
  if (target === undefined || target === null) {
    throw new TypeError('Cannot convert first argument to object');
  }
  var to = Object(target);
  if (source === undefined || source === null) {
    return to;
  }
  var keysArray = Object.keys(Object(target));
  for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
    var nextKey = keysArray[nextIndex];
    var desc = Object.getOwnPropertyDescriptor(target, nextKey);
    if (desc !== undefined && desc.enumerable) {
      if (Object.prototype.hasOwnProperty.call(to, nextKey)) {
        if (to[nextKey] instanceof Array) {
          to[nextKey] = source[nextKey];
        } else if (to[nextKey] instanceof Object) {
          recover(to[nextKey], source[nextKey]);
        } else if (source[nextKey] !== undefined) {
          to[nextKey] = source[nextKey];
        }
      }
    }
  }
  return to;
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
  _get: xeUtils.get,
  _set: xeUtils.set,
  _has: xeUtils.has,
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
  _awaitWrap: awaitWrap,
  _isEmpty: isEmpty,
  _isNotEmpty: isNotEmpty,
  _isArrayRepeat: isArrayRepeat,
  _getThemeColor: getThemeColor,
  _showPageLoading: showPageLoading,
  _hidePageLoading: hidePageLoading,
  _hasPermission: hasPermission,
  _getUUID: getUUID,
  _getRandomInt: getRandomInt,
};