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