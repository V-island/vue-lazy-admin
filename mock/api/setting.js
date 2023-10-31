export default [
  {
    url: '/api/setting/blog-config',
    method: 'get',
    response: ({ headers }) => {
      return {
        code: 200,
        data: {
          "website_avatar": "https://www.bing.com/rp/ar_9isCNU2Q-VG1yEDDHnx8HAFQ.png",
          "website_name": "基础管理后台",
          "website_author": "Allen Li",
          "website_intro": "Lazy懒人星球",
          "website_notice": "是一个 **挤牙膏式** 的后台管理模板，基于 `Vue3、Vite4、Pinia、Unocss 和 Naive UI` 等前端技术栈。",
          "website_createtime": "2023-10-31",
          "website_record": "粤ICP备2022114741号-1",
          "social_login_list": [],
          "social_url_list": [],
          "qq": "123456",
          "github": "https://github.com/123456",
          "gitee": "https://gitee.com/123456",
          "tourist_avatar": "https://static.talkxj.com/photos/0bca52afdb2b9998132355d716390c9f.png",
          "user_avatar": "https://static.talkxj.com/avatar/user.png",
          "article_cover": "https://static.talkxj.com/config/e587c4651154e4da49b5a54f865baaed.jpg",
          "is_comment_review": 1,
          "is_message_review": 1,
          "is_email_notice": 0,
          "is_reward": 0,
          "wechat_qrcode": "http://dummyimage.com/100x100",
          "alipay_ode": "http://dummyimage.com/100x100"
        }
      }
    },
  }
]
