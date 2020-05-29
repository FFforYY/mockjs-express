import Mock from 'mockjs'

const data = Mock.mock({
  'users|30': [{
    id: '@id',
    name: '@cname',
    email: '@email',
    birthday: '@Date',
    register_date: '@datetime',
    pageviews: '@integer(300, 5000)'
  }]
})

export default [
  {
    url: '^/$',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        message: 'Sucess!'
      }
    }
  },
  {
    url: '/list$',
    type: 'get',
    response: config => {
      const users = data.users
      return {
        code: 20000,
        data: {
          total: users.length,
          users: users
        }
      }
    }
  }
]