const express = require('express')
const chalk = require('chalk')
const chokidar = require('chokidar')
const bodyParser = require('body-parser')
const path = require('path')

// 设置mock项目的基础路径, 默认为空，即根路径
process.env.APP_BASE_URL = ''
// 监听端口
const port = 6565

// 找到mock所在路径
const mockDir = path.join(process.cwd(), 'mock')
const parserDir = path.join(mockDir, 'route-parser.js')

// 创建app
const app = express()

// parse app.body
// https://expressjs.com/en/4x/api.html#req.body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

// 跨域处理
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


// 注册路由
function registerRoutes(app) {
  let routeLastIndex
  const { default: mocks } = require(parserDir)
  for (const mock of mocks) {
    app[mock.type](mock.url, mock.response)
    routeLastIndex = app._router.stack.length
  }
  const mockRoutesLength = Object.keys(mocks).length
  return {
    RoutesLength: mockRoutesLength,
    routeStartIndex: routeLastIndex - mockRoutesLength
  }
}

// 清除mock目录下的require缓存
function unregisterRoutes() {
  Object.keys(require.cache).forEach(i => {
    if (i.includes(mockDir)) {
      delete require.cache[require.resolve(i)]
    }
  })
}



// 注册路由
const mockRoutes = registerRoutes(app)
var mockRoutesLength = mockRoutes.RoutesLength
var mockStartIndex = mockRoutes.routeStartIndex

// 监听mock目录，热更新
chokidar.watch(mockDir, {
  ignoreInitial: true
}).on('all', (event, path) => {
  if (event === 'change' || event === 'add') {
    try {
      // 卸载已注册路由
      app._router.stack.splice(mockStartIndex, mockRoutesLength)

      // 清楚require缓存
      unregisterRoutes()

      // 重新注册路由
      const mockRoutes = registerRoutes(app)
      mockRoutesLength = mockRoutes.RoutesLength
      mockStartIndex = mockRoutes.routeStartIndex

      console.log(chalk.magentaBright(`\n > Mock Server hot reload success! changed  ${path}`))
    } catch (error) {
      console.log(chalk.redBright(error))
    }
  }
})


app.listen(port, function () {
  console.log(`Example app listening on port 6565! Please visit http://localhost:${port}${process.env.APP_BASE_URL}`);
})
