/**
 * 初始化加载效果的svg格式logo
 * @param {string} id - 元素id
 */
 function initSvgLogo(id) {
  const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><defs><style>.cls-1{isolation:isolate;}.cls-2{fill-rule:evenodd;}.cls-3{fill:#fff;}</style></defs><g id="矩形_1" data-name="矩形 1" class="cls-1"><path class="cls-2" d="M512,28V484a28,28,0,0,1-28,28H28A28,28,0,0,1,0,484V28A28,28,0,0,1,24.12.27,27.58,27.58,0,0,1,28,0H484A28,28,0,0,1,512,28Z"/></g><g id="L" class="cls-1"><path class="cls-3" d="M211,229H99L4.77,12.37A28,28,0,0,1,24.12.27l89.16,205h87.4Z"/></g><g id="椭圆_1" data-name="椭圆 1" class="cls-1"><circle class="cls-3" cx="353.5" cy="140.5" r="88.5" transform="translate(4.19 291.11) rotate(-45)"/></g><g id="y" class="cls-1"><polygon class="cls-3" points="288.18 275.74 185 512 159.28 512 186.1 450.5 108.49 275.74 134.21 275.74 199.19 421.34 262.29 275.74 288.18 275.74"/></g><g id="Z" class="cls-1"><polygon class="cls-3" points="413.15 275.74 303.74 512 272.78 512 370.16 303.23 262.96 303.23 262.96 275.74 413.15 275.74"/></g></svg>`
  const appEl = document.querySelector(id)
  const div = document.createElement('div')
  div.innerHTML = svgStr
  if (appEl) {
    appEl.appendChild(div)
  }
}

function addThemeColorCssVars() {
  const key = '__THEME_COLOR__'
  const defaultColor = '#66bb83FF'
  const themeColor = window.localStorage.getItem(key) || defaultColor
  const cssVars = `--primary-color: ${themeColor}`
  document.documentElement.style.cssText = cssVars
}

addThemeColorCssVars()

initSvgLogo('#loadingLogo')
