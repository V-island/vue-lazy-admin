/* =================== 系统操作 ================ */
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