import Mock from 'mockjs'
import demo from './demo'

/**
 * 将写好的api展开并解构赋值给mocks
 */
const mocks = [
  ...demo
]


/**
 * 构建新的路由映射
 * @param {*} url 
 * @param {*} type 
 * @param {*} respond 
 */
const routeNew = (url, type, respond) => {
  return {
    url: new RegExp(`${process.env.APP_BASE_URL}${url}`),
    type: type || 'get',
    response(req, res) {
      console.log('request invoke:' + req.path)
      res.json(Mock.mock(respond instanceof Function ? respond(req, res) : respond))
    }
  }
}

export default mocks.map(route => {
  return routeNew(route.url, route.type, route.response)
})