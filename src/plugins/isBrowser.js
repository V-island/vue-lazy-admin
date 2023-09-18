function myBrowser() {
  var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
  var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
  var isIE =
    userAgent.indexOf("compatible") > -1 &&
    userAgent.indexOf("MSIE") > -1 &&
    !isOpera; //判断是否IE浏览器
  var isEdge = userAgent.indexOf("Edge") > -1; //判断是否IE的Edge浏览器
  var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
  var isSafari =
    userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1; //判断是否Safari浏览器
  var isChrome =
    userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1; //判断Chrome浏览器

  if (isIE) {
    var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
    reIE.test(userAgent);
    var fIEVersion = parseFloat(RegExp["$1"]);
    if (fIEVersion == 7) {
      return 7;
    } else if (fIEVersion == 8) {
      return 8;
    } else if (fIEVersion == 9) {
      return 9;
    } else if (fIEVersion == 10) {
      return 10;
    } else {
      return 6; //IE版本<=7
    }
  }
  if (isOpera) {
    return "Opera";
  }
  if (isEdge) {
    return "Edge";
  }
  if (isFF) {
    return "FF";
  }
  if (isSafari) {
    return "Safari";
  }
  if (isChrome) {
    return "Chrome";
  }
}
//判断是手机还是电脑
function browserRedirect() {
  var sUserAgent = navigator.userAgent.toLowerCase();
  var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
  var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
  var bIsMidp = sUserAgent.match(/midp/i) == "midp";
  var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
  var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
  var bIsAndroid = sUserAgent.match(/android/i) == "android";
  var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
  var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
  if (
    bIsIpad ||
    bIsIphoneOs ||
    bIsMidp ||
    bIsUc7 ||
    bIsUc ||
    bIsAndroid ||
    bIsCE ||
    bIsWM
  ) {
    //手机
    return false;
  } else {
    //电脑
    return true;
  }
}
const Plugins = {};
Plugins.install = function () {
  let equipment = browserRedirect();
  if (equipment) {
    if (
      myBrowser() == "9" ||
      myBrowser() == "10" ||
      myBrowser() == "11" ||
      myBrowser() == undefined
    ) {
      // alert('请使用360极速浏览器,搜狗浏览器,谷歌浏览器获得最优的浏览体验!!!')
      var box = document.getElementById("body");
      box.innerHTML =
        "<image src='bg.png' style='width: 100%;height: 100vh;' />" +
        "<DIV id='browser' style='HEIGHT: 100%; WIDTH: 100%; POSITION: fixed;left:0px;background:rgba(0, 0, 0,0.2); Z-INDEX: 10000; TOP: 0px'>" +
        "<DIV class=wrapbrowser>" +
        "<P class=title>系统检测到您的浏览器版本较低，为使您能正常使用系统，操作体验更流畅，请选择下载安装一款以下版本的浏览器，请选择极速模式使用。</P>" +
        "<TABLE class=list>" +
        "<TBODY>" +
        "<TR>" +
        "<TD class='browser'><A class='link bc' href='http://www.google.cn/chrome/browser/desktop/index.html' target='_blank'><SPAN class='name'>Chrome</SPAN> <SPAN class='vendor'>Google</SPAN> </A></TD>" +
        "<TD class='browser'><A class='link bf' href='https://ie.sogou.com/' target='_blank'><SPAN class='name'>搜狗浏览器</SPAN> <SPAN class='vendor'>SoGou</SPAN> </A></TD>" +
        "<TD class='browser'><A class='link bo' href='https://browser.360.cn/ee/' target='_blank'><SPAN class='name'>360极速浏览器</SPAN> <SPAN class='vendor'>360</SPAN> </A></TD>" +
        "<TD class='browser'><A class='link bi' href='https://www.microsoft.com/zh-cn/download/internet-explorer.aspx' target='_blank'><SPAN class='name'>Internet Explorer Edge</SPAN> <SPAN class='vendor'>Microsoft</SPAN> </A></TD>" +
        "</TR>" +
        "</TBODY>" +
        "</TABLE>" +
        "<P class='tag'>以上版本浏览器已经经过系统测试，完全兼容，请选择使用。</P>" +
        "</DIV>" +
        "</DIV>";

      // setTimeout(function(){
      //     var se = confirm("请使用360极速浏览器,搜狗浏览器,谷歌浏览器获得最优的浏览体验!!!");
      //     if (se == true) {
      //         window.opener=null;
      //         window.open('', '_self'); //IE7必需的.
      //        window.close();
      //     }
      //     else {

      //         window.opener=null;
      //         window.open('', '_self'); //IE7必需的.
      //        window.close();
      //     }
      // },1000)
    }
  }
};
export default Plugins;
