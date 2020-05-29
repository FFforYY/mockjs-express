# mockjs-express

A simple mockjs server implemented in express.

## install

```bash
git clone git@github.com:bvcoder/mockjs-express.git
cd mockjs-express
npm install
npm run dev
```

## how to use

For Example:

- create a new file user.js in mock folder

```javascript
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
```

- import the file in route-parser.js

```javascript
import user from './user'

/**
 * 将写好的api展开并解构赋值给mocks
 */
const mocks = [
  ...demo,
  ...user
]

```
