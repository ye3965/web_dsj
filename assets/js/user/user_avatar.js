  $(function() {
      var layer = layui.layer;
      // 获取img的DOM元素
      var $image = $('#image');
      // 配置选项参数
      const options = {
          // 裁剪区的形状
          aspectRatio: 1,
          // 裁剪的图片 指定预览的区域 
          preview: '.img-preview'
      };
      // 创建裁剪区域
      $image.cropper(options);
      //通过点击上传按钮 触发隐藏的上传文件元素
      $('#uploading').on('click', function(e) {
          //触发上传文件元素
          $('#file').click()
      });

      //为文件选择框绑定change 事件 
      $('#file').on('change', function(e) {
          //获取用户选着的文件
          var filelist = e.target.files;
          // 判断是否有上传文件
          if (filelist.length === 0) {
              return
          };
          window.URL.revokeObjectURL(imgURL);
          console.log(imgURL);
          //将上传的文件 通过URL.createObjectURL方法 转换为url地址
          var imgURL = URL.createObjectURL(filelist[0]);
          //销毁旧的裁剪区域 重新设置图片的路径 重新初始化裁剪区域
          $image.cropper('destroy').attr('src', imgURL).cropper(options);
      });

      //上传裁剪的图片
      $('#submit').on('click', function(e) {
          //获得裁剪后的图片地址
          // 先将裁剪区域 创建为一个100*100的画布（canvas）
          //将创建好的画布转换为base64格式的字符串，并返回一个图片地址
          var dataURL = $image.cropper('getCroppedCanvas', {
              width: 100,
              height: 100
          }).toDataURL('image/png');
          console.log($image.cropper('getCroppedCanvas', {
              width: 100,
              height: 100
          }));
          //发起请求 更新头像
          $.ajax({
              method: 'post',
              url: '/my/update/avatar',
              data: {
                  avatar: dataURL
              },
              success: function(res) {
                  if (res.status !== 0) {
                      return layer.msg('更换头像失败')
                  }
                  layer.msg('更换头像成功');
                  //调用父页面的更新页面信息函数 从新渲染页面
                  window.parent.getUserInfo();
              }

          })
      })
  })