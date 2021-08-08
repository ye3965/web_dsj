$(function() {
    var form = layui.form; //获取layui中的form元素
    form.verify({ //自定义表单的验证规则
        pass: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        //确认密码验证
        samePwd: function(value) {
            //获取注册页面表单有name=password 属性的value值
            let pwd = $('.layui-form [name=oldPwd]').val();
            //判断当前表单的值和获取的pwd值是否一致
            if (pwd === value) {
                return '新密码不能和旧密码一致！请从新输入';
            }
        },
        //确认密码验证
        repass: function(value) {
            //获取注册页面表单有name=password 属性的value值
            let pwd = $('.layui-form [name=newPwd]').val();
            //判断当前表单的值和获取的pwd值是否一致
            if (pwd !== value) {
                return '两次输入的密码不一致';
            }
        }
    });

    // 发起请求 修改密码
    $('.layui-form ').on('submit', function(e) {
        e.preventDefault(); //阻止默认提交行为
        $.ajax({
            method: 'post',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('修改密码失败：' + res.message)
                }
                layui.layer.msg(res.message);
                // 重置表单
                // $('.layui-form ')[0].reset() //通过转为原生DOM 清空表单
                //调用重置按钮
                $('#butReset').click()

            }
        })

    })
})