 // 实例化layui的layer和form对象
 var layer = layui.layer;
 var form = layui.form;
 // 获取修改元素的内容 
 function child(obj) {
     // 将请求回来的数据添加到表单中
     form.val('form-alter', obj);
     // 表单有动态产生的，所有需要从新加载一下
     form.render();
 }
 // 修改主题部分
 $(function() {
     // 渲染所有分类列表项
     initCate();
     // 渲染富文本
     initEditor();

     // 请求获取所有分类数据
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

     // 获取img的DOM元素 创建裁剪区域
     var $image = $('#image');
     // 配置裁剪区域选项参数
     const options = {
         // 裁剪区的形状
         aspectRatio: 400 / 280,
         // 裁剪的图片 指定预览的区域 
         preview: '.img-preview'
     };
     // 创建裁剪区域
     $image.cropper(options);

     // 点击选择上传图片 更换图片
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
     //设置文章状态  初始为已发布
     var states = '已发布';
     // 保存为草稿
     $('#btn_draft').on('click', function() {
         states = '草稿'
     });

     // 发送修改文章请求
     $('#form-alter').on('submit', function(e) {
         e.preventDefault();
         // 创建ForData 对象 用于请求是的请求参数 
         var fd = new FormData($(this)[0]);
         // 为fd对象添加一个state 发布状态参数
         fd.append('state', states);
         // 将裁剪区域创建一个画布，将画布转换为blob值
         $image.cropper('getCroppedCanvas', {
             width: 400,
             height: 280
         }).toBlob(function(blob) {
             fd.append('cover_img', blob);
             // fd.forEach((v, k) => console.log(k, v))
             // 发送修改请求
             $.ajax({
                 method: 'POST',
                 url: '/my/article/edit',
                 data: fd, ////传入FormData格式数据 必须设置下边两项
                 contentType: false,
                 processData: false,
                 success: function(res) {
                     if (res.status !== 0) {
                         return layer.msg(res.message)
                     }
                     // 关闭弹窗
                     window.parent.$('.layui-layer-ico').click()
                 }
             })
         });
     });
 });