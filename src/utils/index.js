// 相对图片地址 => 完整的图片路径, 用于本地文件上传
// 如果包含 http 说明是 Web 图片资源
// 否则是服务器上的图片，需要拼接服务器路径
const SERVER_URL = import.meta.env.VITE_SERVER_URL
export function convertImgUrl(
  imgUrl,
  { size = '400x400', bg, color, format = 'gif', text = '' } = {}
) {
  if (!imgUrl)
    return bg && color
      ? `http://dummyimage.com/${size}/${bg}/${color}.${format}&text=${text}`
      : `http://dummyimage.com/${size}.${format}&text=${text}`
  // 网络资源
  if (imgUrl.startsWith('http')) return imgUrl
  return `${SERVER_URL}/${imgUrl}`
}

export * from './common'
export * from './storage'
export * from './http'
export * from './auth'
