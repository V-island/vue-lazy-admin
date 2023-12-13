const cags = [
  {
    id:1,
    title: 'Css',
    name: 'Css',
    description: 'css',
    createDate: '2021-11-04T04:03:36.000Z',
    updateDate: '2021-11-04T04:03:36.000Z',
    children: [
      {
        id:2,
        parent: 'Css',
        title: 'option',
        name: 'option',
        description: 'option',
        createDate: '2021-11-04T04:03:36.000Z',
        updateDate: '2021-11-04T04:03:36.000Z',
      },
    ],
  },
  {
    id:3,
    title: 'Vue',
    name: 'Vue',
    description: 'vue',
    createDate: '2021-10-25T08:57:47.000Z',
    updateDate: '2022-02-28T04:02:39.000Z',
    children: [
      {
        id:4,
        parent: 'Vue',
        title: 'vue2',
        name: 'vue2',
        description: 'vue2',
        createDate: '2021-11-04T04:03:36.000Z',
        updateDate: '2021-11-04T04:03:36.000Z',
      },
      {
        id:5,
        parent: 'Vue',
        title: 'vue3',
        name: 'vue3',
        description: 'vue3',
        createDate: '2021-11-04T04:03:36.000Z',
        updateDate: '2021-11-04T04:03:36.000Z',
      },
    ],
  },
  {
    id:6,
    title: 'JavaScript',
    name: 'JavaScript',
    description: 'javaScript',
    createDate: '2021-06-24T18:46:19.000Z',
    updateDate: '2021-09-23T07:51:22.000Z',
    children: [
      {
        id:7,
        parent:'JavaScript',
        title: 'ES5',
        name: 'ES5',
        description: 'es5',
        createDate: '2021-11-04T04:03:36.000Z',
        updateDate: '2021-11-04T04:03:36.000Z',
      },
      {
        id:8,
        parent:'JavaScript',
        title: 'ES6',
        name: 'ES6',
        description: 'es6',
        createDate: '2021-11-04T04:03:36.000Z',
        updateDate: '2021-11-04T04:03:36.000Z',
      },
    ],
  },
  {
    id:9,
    title: 'Http',
    name: 'Http',
    description: 'http',
    createDate: '2021-06-10T18:51:19.000Z',
    updateDate: '2021-09-17T09:33:24.000Z',
  },
]

export default [
  {
    url: '/api/cags',
    method: 'get',
    response: (data = {}) => {
      const { title, pageNo, pageSize } = data.query
      let pageData = []
      let total = 60
      const filterData = cags.filter(
        (item) => item.title.includes(title) || (!title && title !== 0)
      )
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
    url: '/api/cag',
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
    url: '/api/cag/:id',
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
    url: '/api/cag/:id',
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
