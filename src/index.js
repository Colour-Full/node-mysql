import polyfill from 'babel-polyfill'
import Koa from 'koa'
import Router from 'koa-router'
import mysql from 'mysql'

// Promisify
const mysqlQuery = async (sql, params) => {
  return new Promise((resolve, reject) => {

      db.query(sql, params, (err, results) => {
      if (err) {
        return reject(console.log('ERROR while adding post ' + err))
      }
      resolve(results)
    })

  })
}

const htmlBody = `
    <!doctype html>
        <html>
        <head>
          <title>Server React App</title>
        // </head>

        <body>
          <div id="root">
          <h1> Hello Node World </h1>
          </div>
        </body>
        <script type="text/javascript" src="./dist/bundle.js"></script>
      </html>
    `
// Add DB
const db = mysql.createConnection({
  host: 'localhost',
  port: '8889',
  user: 'root',
  password: 'root',
  database: 'node_mysql'
});

// Connect to the DB
db.connect((err) => {
  if(err) {
    console.log('MySQL ' + err)
  } else {
    console.log('MySql connected')
  }
})
const httpPort = 9000
const app = new Koa()
const router = new Router()  
  // Adding router
  app.use(router.routes())

  // Routes with params
router.get('/createposttable', async (ctx, next) => {
    const sql = 'CREATE TABLE posts(id int AUTO_INCREMENT, title VARCHAR(255), body VARCHAR(255), PRIMARY KEY(id))'
    db.query(sql, (err, result) => {
      if(err) {
        console.log('THERE IS AN ERROR' + err)
      }
      console.log(ctx.request)
    })
    await (next)
  })

router.get('/addpost/:title/:body/', async (ctx, next) => {
    const post = {
      title: ctx.params.title,
      body: ctx.params.body
    }
    const sql = 'INSERT INTO posts SET ?'
    db.query(sql, post, (err, results) => {
    if(err) {
        console.log('ERROR while adding post ' + err)
      }
      console.log(results)
    })
    await (next)
    ctx.body = 'Hello Tester ' + ctx.response.body
})

// Attempt for REST
router.get('/getpost/:id', async (ctx, next) => {
  const sql = `SELECT * FROM posts WHERE id='${ctx.params.id}'`
  const data = await mysqlQuery(sql)
  ctx.body = data
  await next()
})

router.post('/updatepost/:id/:title/:body', async (ctx, next) => {
  const post = {
    title: ctx.params.title,
    body: ctx.params.body
  }
  const sql = `UPDATE posts SET ? WHERE id='${ctx.params.id}'`
  await mysqlQuery(sql, post)
  await next()
})

router.get('/', async (ctx, next) => {
    ctx.type = 'html'
    ctx.body = htmlBody
    await next()
  })

app.listen(httpPort)
