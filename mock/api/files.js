const files = [
  {
    id: 1,
    name: '图片1',
    fileName: '1.jpg',
    ext: '.jpg',
    url: '//fakeimg.pl/200x100/?retina=1&text=预览图&font=noto',
    createDate: '2021-11-04T04:03:36.000Z',
  },
]

export default [
  {
    url: '/api/files',
    method: 'get',
    response: (data = {}) => {
      const { name, pageNo, pageSize } = data.query
      let pageData = []
      let total = 60
      const filterData = files.filter((item) => item.name.includes(name) || (!name && name !== 0))
      if (filterData.length) {
        if (pageSize) {
          while (pageData.length < pageSize) {
            pageData.push(filterData[Math.round(Math.random() * (filterData.length - 1))])
          }
        } else {
          pageData = filterData
        }
        pageData = pageData.map((item, index) => ({
          id: pageSize * (pageNo - 1) + index + 1,
          ...item,
        }))
      } else {
        total = 0
      }
      return {
        code: 200,
        message: 'ok',
        data: {
          pageData,
          total,
          pageNo,
          pageSize,
        },
      }
    },
  },
  {
    url: '/api/file',
    method: 'post',
    response: ({ body }) => {
      return {
        code: 200,
        message: 'ok',
        data: body,
      }
    },
  },
  {
    url: '/api/file/:id',
    method: 'put',
    response: ({ query, body }) => {
      return {
        code: 200,
        message: 'ok',
        data: {
          id: query.id,
          body,
        },
      }
    },
  },
  {
    url: '/api/file/:id',
    method: 'delete',
    response: ({ query }) => {
      return {
        code: 200,
        message: 'ok',
        data: {
          id: query.id,
        },
      }
    },
  },
]
