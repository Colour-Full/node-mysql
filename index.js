'use strict';

var _babelPolyfill = require('babel-polyfill');

var _babelPolyfill2 = _interopRequireDefault(_babelPolyfill);

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

//Promisify
var mysqlQuery = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(sql, params) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt('return', new Promise(function (resolve, reject) {

              db.query(sql, params, function (err, results) {
                if (err) {
                  return reject(console.log('ERROR while adding post ' + err));
                }
                resolve(results);
              });
            }));

          case 1:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function mysqlQuery(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var htmlBody = '\n    <!doctype html>\n        <html>\n        <head>\n          <title>Server React App</title>\n        // </head>\n\n        <body>\n          <div id="root">\n          <h1> Hello Node World </h1>\n          </div>\n        </body>\n        <script type="text/javascript" src="./dist/bundle.js"></script>\n      </html>\n    ';
// Add DB
var db = _mysql2.default.createConnection({
  host: 'localhost',
  port: '8889',
  user: 'root',
  password: 'root',
  database: 'node_mysql'
});

// Connect to the DB
db.connect(function (err) {
  if (err) {
    console.log('MySQL ' + err);
  } else {
    console.log('MySql connected');
  }
});
var httpPort = 9000;
var app = new _koa2.default();
var router = new _koaRouter2.default();
// Adding router
app.use(router.routes());

// Routes with params
router.get('/createposttable', function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(ctx, next) {
    var sql;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            sql = 'CREATE TABLE posts(id int AUTO_INCREMENT, title VARCHAR(255), body VARCHAR(255), PRIMARY KEY(id))';

            db.query(sql, function (err, result) {
              if (err) {
                console.log('THERE IS AN ERROR' + err);
              }
              console.log(ctx.request);
            });
            _context2.next = 4;
            return next;

          case 4:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());

router.get('/addpost/:title/:body/', function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(ctx, next) {
    var post, sql;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            post = {
              title: ctx.params.title,
              body: ctx.params.body
            };
            sql = 'INSERT INTO posts SET ?';

            db.query(sql, post, function (err, results) {
              if (err) {
                console.log('ERROR while adding post ' + err);
              }
              console.log(results);
            });
            _context3.next = 5;
            return next;

          case 5:
            ctx.body = 'Hello Tester ' + ctx.response.body;

          case 6:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());

// Attempt for REST
router.get('/getpost/:id', function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(ctx, next) {
    var sql, data;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            sql = 'SELECT * FROM posts WHERE id=\'' + ctx.params.id + '\'';
            _context4.next = 3;
            return mysqlQuery(sql);

          case 3:
            data = _context4.sent;

            ctx.body = data;
            _context4.next = 7;
            return next();

          case 7:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}());

router.post('/updatepost/:id/:title/:body', function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(ctx, next) {
    var post, sql;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            post = {
              title: ctx.params.title,
              body: ctx.params.body
            };
            sql = 'UPDATE posts SET ? WHERE id=\'' + ctx.params.id + '\'';
            _context5.next = 4;
            return mysqlQuery(sql, post);

          case 4:
            _context5.next = 6;
            return next();

          case 6:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}());

router.get('/', function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(ctx, next) {
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            ctx.type = 'html';
            ctx.body = htmlBody;
            _context6.next = 4;
            return next();

          case 4:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  }));

  return function (_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}());

app.listen(httpPort);