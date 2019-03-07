var bodyParser = require('body-parser');//取出提交的数据

var urlencodedParser = bodyParser.urlencoded({ extended: false });

var data = [ {item: 'get milk'}, {item: "walk dog"}, {item: 'kick some coding ass'} ];
//数组的内容来渲染在页面，（渲染动态数据——模板引擎）
//data放在todos,然后再在模板中取出来
//模块导出
module.exports = function(app) {
  //请求列表的路由
  app.get('/todo', function(req, res) {
    res.render('todo', { todos: data });
  });
  //新增项的路由
  app.post('/todo', urlencodedParser, function(req, res) {
    data.push(req.body); //传入值
    res.json(data);  //响应内容
  });
   //删除项的路由 :item变化的，删除空格用横线替代
  app.delete('/todo/:item', function(req, res) {
    data = data.filter(function(todo) {
      return todo.item.replace(/ /g, "-") !== req.params.item;//返回true 就是要的
    });
    res.json(data);
  });
}