  $(function() {
      var form = layui.form; //获取layui中的form元素
      form.verify({ //自定义表单的验证规则
          nickname: function(value) { //自定义昵称的规则
              if (value.length > 6) {
                  layer.msg('昵称长度必须在 1 ~ 6 个字符之间！');
                  return true
              }
          }
      });

      initUserInfo();
      //请求用户信息数据
      function initUserInfo() {
          $.ajax({
              method: 'get',
              url: '/my/userinfo',
              success: function(res) {
                  if (res.status !== 0) {
                      return layer.msg('获取用户信息失败')
                  }
                  // console.log(res);
                  //将获取的信息 传输到form表单对应的input标签中
                  form.val('formUserInfo', res.data);
              }
          })
      };
      // 重置按钮
      $('#butReset').on('click', function(e) {
          // 阻止表单默认的重置行为
          e.preventDefault()
              //从新获取用户信息 渲染到页面
          initUserInfo();
      });
      //表单提交
      $('.layui-form').on('submit', function(e) {
          //阻止表单的提交行为
          e.preventDefault();
          // console.log($(this).serialize());
          //发送数据 对内部数据进行修改
          $.ajax({
              method: 'post',
              url: '/my/userinfo',
              data: $(this).serialize(), //获取表单中所有数据
              success: function(res) {
                  if (res.status !== 0) {
                      return layer.msg('修改信息失败')
                  }
                  layer.msg('修改信息成功');
                  //获取父元素index.html中的 js事件 从新渲染父页面的数据
                  window.parent.getUserInfo();
              }
          })
      })
  })