 # 1 介绍
### 你会学到什么？
Express 基础知识（路由，中间件，模板引擎）——基于NodeJS的web框架
MongoDB 基础知识
实现一个小型 Todo List 应用
### express实现功能
web应用——网站、聊天室、商城、api、博客
Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
轻量级框架

* 简单路由系统
* 模板引擎
* 中间件
网站api提供的MongoDB数据库

初始化：npm init——生成package.json文件
```
var express = require('express');  //引入express框架

var app = express();   //形成实例

app.get('/', function(req, res) {
    res.send("this is the homepage");
});//get请求方法——delete,post

app.listen(3000);
console.log('listening to port 3000');
```
# 2 请求与响应
express默认执行JSON.stringify方法
send发送字符串、JSON
要看方法直接看api
<a href='http://expressjs.com/en/4x/api.html#req.method'></a>req.method的api文档
```
var express = require('express');

var app = express();

app.get('/', function(req, res) {
    var responseObject = req.method;
    res.send(responseObject);
});

app.listen(3000);
console.log('listening to port 3000');
```
# 3 路由参数
<a>路由api</a>http://expressjs.com/en/guide/routing.html
```
var express = require('express');

var app = express();
//:id说明是变化的、可以任意 有冒号的就是动态的
app.get('/profile/:id/user/:name', function(req, res) {
    //id是请求过来的，所以可以req.params.id得到（名字任取，自己对应就好）
    console.dir(req.params); //输出对象的包含内容
    res.send("You requested to see a profile with the name of " + req.params.name);
});
//正则表达式 ？前面表示可以出现一次或零次
app.get('/ab?cd', function(req, res) {
    res.send('/ab?cd');
})

app.listen(3000);
console.log('listening to port 3000');
```

# 4 查询字符串
得到地址上的参数，取？后面的参数
参数名——参数值
默认用query来获取参数值
```
app.get('/', function(req, res) {
    console.dir(req.query);
    //find自定义的参数名
    res.send("home page: " + req.query.find);
});
```

# 5 POST 请求 和 Postman 工具——表单上传
<a href='https://github.com/expressjs/body-parser'></a>**body-parser官方的库来处理POST请求**
postman工具上传数据——表单信息——x-www-form-urlencoded parser
使用中间件`app.use(bodyParser.urlencoded({ extended: false }))`看文档
处理表单内容
`app.use(bodyParser.urlencoded({ extended: false }))`
处理JSON内容
`app.use(bodyParser.json())`
同时处理表单内容和JSON内容——需要什么引入什么
```
// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
```
form-data可以选择上传文件
中间件内容稍后讲

前端发送JSON数据——jquery,axios库

# 6 上传文件——很难难于看懂
Multer库
Multer 是一个 node.js 中间件，用于处理 multipart/form-data 类型的表单数据，它主要用于上传文件。它是写在 busboy 之上非常高效。

类似express-fileupload
Simple express middleware for uploading files.
post也可以上传文件——选form-data
```
var express = require('express');
var bodyParser = require('body-parser');
//引入文件的库
var fs = require('fs');

var app = express();
//引入multer中间件——很重要
var multer = require('multer');
//创建文件夹用的
var createFolder = function(folder) {
    try {
        fs.accessSync(folder);
    } catch (e) {
        fs.mkdirSync(folder);
    }
};

var uploadFolder = './upload/';
//文档中的磁盘存储
//自定义路径
createFolder(uploadFolder);

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadFolder);
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

var upload = multer({ storage: storage });

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/', function(req, res) {
    console.dir(req.query);
    res.send("home page: " + req.query.find);
});
//绑定表单内容
app.get('/form', function(req, res) {
    var form = fs.readFileSync('./form.html', { encoding: "utf8" });
    res.send(form);
});

app.post('/', urlencodedParser, function(req, res) {
    console.dir(req.body);
    res.send(req.body.name);
});
//哪个文件的标签
app.post('/upload', upload.single('logo'), function(req, res) {
    console.dir(req.file);//req.file取文件的信息
    res.send({ 'ret_code': 0 });
});

app.get('/profile/:id/user/:name', function(req, res) {
    console.dir(req.params);
    res.send("You requested to see a profile with the name of " + req.params.name);
});

app.get('/ab?cd', function(req, res) {
    res.send('/ab?cd');
})

app.listen(3000);
console.log('listening to port 3000');``
```

# 7 模板引擎（template）介绍——动态嵌入一些变量
express下的更新html文件到浏览器
```
app.get('/form', function(req, res) {
    res.sendFile(__dirname + '/form.html');
});
```

数据库内容——动态数据放置浏览器

EJS——模板引擎
与ejs结合显示动态数据
1. 新建文件夹views存放ejs文件（与原来的html文件的语法一直，可能多了动态数据）
2. 引入ejs库,看官方文档
3. 显示person动态数据，name复制给person
```
app.get('/form/:name', function(req, res) {
    var person = req.params.name;
    res.render('form', { person: person });//person是自己的person
});
```

# 8 使用模板引擎
传递的动态数据可以是对象、数组、JSON等
ejs文件循环显示动态数据
直接输出的地方放置等于号
```
        <h1>
            <%= data.age %>
                <h2>hobbie</h2>
                <ul>
                    <% data.hobbie.forEach(function(item) { %>
                        <li>
                            <%= item %>
                        </li>
                        <% }) %>
                </ul>
        </h1>
```

模板功能的问题——重复的功能可以相互调用
`<%- include('partials/header.ejs') -%>`

# 9 中间件——middleware
请求和响应的中间
app.use()就是通常所说的使用中间件
一个请求发送到服务器后，它的生命周期是 先收到request（请求），然后服务端处理，处理完了以后发送response（响应）回去
而这个服务端处理的过程就有文章可做了，想象一下当业务逻辑复杂的时候，为了明确和便于维护，需要把处理的事情分一下，分配成几个部分来做，而每个部分就是一个中间件

好处：
1. 共用模块，每个模板抽成一个中间件，使用方便（比如路由、数据库）
2. 全局性操作，错误处理
类型：
* Application-level middleware
* Router-level middleware
* Error-handling middleware
* Built-in middleware
* Third-party middleware

中间件之间的传递
```
app.use(function(req, res, next) {
    console.log('first middleware');
    next();//没有next，就是这个中间件不需要传递给下一个，否则有next就调用下一个中间件
    console.log('first middleware after');
})
```
可以在响应上添加路径
<a href='http://expressjs.com/en/starter/static-files.html'></a>响应静态文件的中间件——`app.use('/assets', express.static('public'));
`

# 10 路由中间件
整理重构路由
1. 新增routes目录，分为user.js和index.js来整理两类文件
```
var router = express.Router();
```
2. 其他路由写法跟之前一样
3. 主文件引入路由模块
```
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

app.use('/', indexRouter);
app.use('/users', usersRouter);
```
有更多路由就分为更多的文件来维护

# 11 项目实践 part 1 项目搭建
1. 引入静态文件
2. 初始化库 npm init
3. $ npm install --save express body-parser ejs
(ejs模板引擎 body-parser是用来处理表单的)

# 12 项目实践 part 2 Controller
模块化路由
Controller——请求器、控制器(路由)**MVC框架的C**
model——处理数据、数据库
view——视图相关的
```
var express = require('express');   //引入库
var todoController = require('./controllers/todoController');

var app = express();

app.set('view engine', 'ejs');   //设置模板引擎

app.use(express.static('./public'));   //使用静态文件

todoController(app);//调用路由

app.listen(3000);   //监听在3000端口

console.log('You are listening to port 3000');
```

# 13 项目实践 part 3 实现页面
BootCDN引入jquery库——https://www.bootcdn.cn/
线上的jquery库引入
`<script src="https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js"></script>`
默认是 views 这个目录来存放模板的位置。

# 14 项目实践 part 4 实现功能——数据放在本地内存中
1. 已有的动态数据显示
2. 输入内容可以显示，传到服务器，服务器处理，再显示到浏览器——JS发送请求
服务器有数据，在push回去，body-parser


nodejs刷新页面数据不会变化，需要重启服务器才会（rs命令）

# 15 项目实践 part 5 MongoDB & mLab
避免nodejs重启，数据丢失——磁盘存储
MongoDB是nosql数据库，存储内容的格式是JSON
JS读取内容方便
线上服务mLab——https://mlab.com/
1. 创建账号，登录进去
2. 选择sandbox沙盒免费版的数据库
