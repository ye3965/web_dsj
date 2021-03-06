 $(function() {
     // layui一个layer和form对象
     var layer = layui.layer;
     var form = layui.form;
     // 初始化分类菜单内容
     initCate();
     //初始化页面内容
     initEditor();
     // 获取分类菜单数据
     function initCate() {
         $.ajax({
             method: 'get',
             url: '/my/article/cates',
             success: function(res) {
                 if (res.status !== 0) {
                     return layer.msg(res.message)
                 }
                 //调用模板引擎 渲染分类下拉菜单 获取返回字符串
                 var text = template('tlp_cate', res);
                 //将返回的字符串渲染给页面
                 $('[name=cate_id]').html(text);
                 //因为form表单的下拉菜单是动态生成的 所以一定要调用form.render()才能显示数据
                 form.render();
             }
         })
     };
     // 获取img的DOM元素
     var $image = $('#image');
     // 配置选项参数
     const options = {
         // 裁剪区的形状
         aspectRatio: 400 / 280,
         // 裁剪的图片 指定预览的区域 
         preview: '.img-preview'
     };
     // 创建裁剪区域
     $image.cropper(options);

     // 点击选着上传图片 更换图片
     $('#btn_put').on('click', function() {
         // 触发上传表单的点击事件
         $('#coverFile').click();
     });

     //给上传表单元素 绑定change事件 只要有文件上传就触发函数
     $('#coverFile').on('change', function(e) {
         // 判断用户是否选择文件 没有选中文件直接退出任务
         if (e.target.files.length === 0) {
             return
         }
         // 通过e.target.files[0]来获得 File 对象 通过URL.createObjectURL 将其转换为图片的url地址
         var imgURL = URL.createObjectURL(e.target.files[0]);
         // 将图片地址从新加载到页面 先销毁原先的裁剪区域 然后在创建新的裁剪区域
         $image.cropper('destroy').attr('src', imgURL).cropper(options);
         // 释放内存中保存的imgURL地址
         URL.revokeObjectURL(imgURL)
     });
     // 初始状态点为已发布
     var states = '已发布';
     // 保存为草稿
     $('#btn_draft').on('click', function() {
         states = '草稿'
     });
     //提交表单数据 发起请求
     $('#form-pub').on('submit', function(e) {
         e.preventDefault();
         // 创建FormData实例 并将表单的值传进去
         var fd = new FormData($(this)[0]);
         //给fd 实例添加一个state 状态值
         fd.append('state', states);
         // 将裁剪区域创建画布 并将画布转换为blob二进制文件
         $image.cropper('getCroppedCanvas', {
             width: 400,
             height: 280
         }).toBlob(function(blob) {
             // 将获得的blob文件传入添加至fd实例中
             fd.append('cover_img', blob);
             // 循环遍历查看实例中的键和值
             // fd.forEach((v, k) => console.log(k, v))
             // 发起添加信息请求
             $.ajax({
                 method: 'POST',
                 url: '/my/article/add',
                 data: fd, //传入FormData格式数据 必须设置下边两项
                 contentType: false,
                 processData: false,
                 success: function(res) {
                     if (res.status !== 0) {
                         return layer.msg(res.message)
                     }
                     layer.msg(res.message);
                     // 添加成功后清空表单数据
                     $('#form-pub')[0].reset()

                 }
             })
         });

     });

 })