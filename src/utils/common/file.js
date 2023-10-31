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

// * 前端导出, 传入文件内容和文件名称
export function downloadFile(content, fileName) {
  const aEle = document.createElement('a') // 创建下载链接
  aEle.download = fileName // 设置下载的名称
  aEle.style.display = 'none'// 隐藏的可下载链接
  // 字符内容转变成 blob 地址
  const blob = new Blob([content])
  aEle.href = URL.createObjectURL(blob)
  // 绑定点击时间
  document.body.appendChild(aEle)
  aEle.click()
  // 然后移除
  document.body.removeChild(aEle)
}

// 使用 iframe 实现下载
// export function downloadFile(url) {
//   // url = 'https://static.talkxj.com/markdown/博客技术总结.md'
//   const iframe = document.createElement('iframe')
//   iframe.style.display = 'none' // 防止影响页面
//   iframe.style.height = 0 // 防止影响页面
//   iframe.src = convertImgUrl(url)
//   document.body.appendChild(iframe)
//   setTimeout(() => {
//     iframe.remove()
//   }, 5 * 60 * 1000)
// }

// 通过 a 标签实现下载
// export function downloadFile(url) {
//   const a = document.createElement('a')
//   a.href = convertImgUrl(url) // 文件链接
//   a.target = '_blank'
//   a.download = '下载的文件名' // 文件名，跨域资源 download 无效
//   a.click()
//   a.remove()
// }

// fetch 读取文件内容再转二进制流下载 FIXME: 跨域
// export function downloadFile(url) {
//   const link = document.createElement('a')
//   fetch(convertImgUrl(url))
//     .then(res => res.blob())
//     .then((blob) => { // 将链接地址字符内容转变成 blob 地址
//       link.href = URL.createObjectURL(blob)
//       link.download = ''
//       document.body.appendChild(link)
//       link.click()
//       document.body.removeChild(link)
//     })
// }

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