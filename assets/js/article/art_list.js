 $(function() {
     //实例layui的layer和form元素
     var layer = layui.layer;
     var form = layui.form;
     // 定义查询的参数对象 用于请求是提交数据
     var q = {
         pagenum: 1, //页码值 默认值为1 必填值
         pagesize: 2, //每页显示多少条数据 默认值为2 必填值
         cate_id: '', //文章分类的 Id      选填值
         state: '' //文章的状态      选填值
     };
     //初始化分类列表
     initCate();
     // 初始化页面内容
     initIable();
     //获取文章列表数据请求 渲染页面内容
     function initIable() {
         $.ajax({
             method: 'GET',
             url: '/my/article/list',
             data: q,
             success: function(res) {
                 if (res.status !== 0) {
                     return layer.msg(res.message)
                 };
                 // 获取内容列表模板数据
                 var text = template('tpl-table', res);
                 // 将模板数据渲染到页面 tbody标签中
                 $('tbody').html(text);
                 // 渲染分页器 res.total是总的数据条数
                 paging(res.total)
             }
         })
     };

     //请求文章分类列表数据 
     function initCate() {
         $.ajax({
             method: 'get',
             url: '/my/article/cates',
             success: function(res) {
                 if (res.status !== 0) {
                     return layer.msg(res.message)
                 }
                 //获取分类列表模板数据
                 var text = template('tpl-cate', res);
                 // 将分类列表模板渲染到页面
                 $('#cate_id1').html(text);
                 // 动态生成的form表单需要从新加载layui的form数据 不从新加载 页面不会显示
                 form.render()
             }

         })
     }
     // 模板引擎提供的时间过滤器 将时间的格式进行改变
     template.defaults.imports.dataFoemat = function(data) {
         return data.slice(0, data.length - 4)
     };

     // 为筛选表单绑定一个提交事件
     $('#form-search').on('submit', function(e) {
             // 阻止默认提交事件
             e.preventDefault();
             // 获取表单中选中项的值 将其值传给查询参数
             q.cate_id = $('#cate_id1').val();
             q.state = $('[name=state]').val();
             //从新渲染页面内容
             initIable();
         })
         // 分页器创建
     function paging(total) {
         // 获取layui的laypage 分页器方法
         var laypage = layui.laypage;
         //执行一个laypage实例 配置分页器参数 创建分页器
         laypage.render({
             elem: 'test1', //注意，这里的 test1 是 分页器父容器的 ID，不用加 # 号
             count: total, //数据总数，从服务端得到
             limit: q.pagesize, //每页显示多少条 q数据里面默认是2条
             curr: q.pagenum, //指定默认选中那一页 q数据里默认是1
             limits: [2, 5, 8, 10, 20], //设置每页显示多少条的选择器
             layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], //分页器显示的元素
             //jump触发的两种方式
             //1.点击页码的时候会触发
             //2.只要调用laypage.render（）方法，就会触发 这是导致jump死循环的原因
             //3.解决死循环 jump函数中有一个first参数 当触发方式为第二种是 值为true 点击任何元素都是undefined
             jump: function(obj, first) { //分页发送切换时触发的函数
                 q.pagenum = obj.curr; //将最新的页码值，赋值到q这个查询对象中
                 q.pagesize = obj.limit; //将每页显示的最新条数赋值到q这个查询对象中
                 if (!first) { //当触发方式为第二种时 不调用initIable()
                     initIable() //从新渲染页面内容
                 }
             }
         });
     };

     //编辑功能模块 edit
     $('tbody').on('click', '.edit', function() {
         // 获取选中编辑的数据的id
         var id = $(this).attr('data-id');
         // 获取信息的请求
         $.ajax({
             method: 'get',
             url: '/my/article/' + id, //将id值拼接到链接后面进行发送
             success: function(res) {
                 if (res.status !== 0) {
                     return layer.msg(res.message)
                 }
                 // 使用layui创建一个新的弹出层页面
                 layer.open({
                     title: ['修改文章', 'font-size:18px'], //页面的标题
                     type: 2, //弹出层的属性 设置为iframe层
                     area: ['100%', '100%'], //设置弹出层的宽高
                     scrollbar: false, //是否允许浏览器出现滚动条 选择否
                     move: false, //是否允许拖动元素 选择否
                     content: "/article/art_alter.html", //内容为新的页面URL地址
                     success: function(layero, index) { //层弹出后的成功回调函数
                         var iframe = window['layui-layer-iframe' + index]; //拿到iframe元素
                         iframe.child(res.data) //向此iframe层方法 传递参数
                     },
                     cancel: function() {
                         initIable()
                     }
                 })
             }
         })
     });

     // 删除
     $('tbody').on('click', '.delete', function() {
         var id = $(this).attr('data-id');
         var len = $('.edit').length;
         layer.confirm('确认删除？?', {
             icon: 3,
             title: '提示'
         }, function(index) {
             $.ajax({
                 method: 'get',
                 url: '/my/article/delete/' + id,
                 success: function(res) {
                     console.log(res);
                     if (res.status !== 0) {
                         return layer.msg(res.message)
                     }
                     layer.msg(res.message);
                     if (len === 1) {
                         q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                     }
                     initIable();
                 }
             })
         });
     })
 })