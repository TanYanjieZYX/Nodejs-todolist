var express = require('express');   //引入express库
var todoController = require('./controllers/todoController');

var app = express();    //实例化

app.set('view engine', 'ejs');   //设置模板引擎

app.use(express.static('./public'));   //响应静态文件的中间件，所以可以使用css,js文件

todoController(app);//调用路由

app.listen(3000);   //监听在3000端口

console.log('You are listening to port 3000');