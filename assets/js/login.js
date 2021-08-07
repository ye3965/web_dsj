$(function() {
    //切换注册页面
    $('.Login').on('click', 'a', function() {
        $('.Login').hide(); //隐藏
        $('.enroll').show() //显示
    });
    //切换登录页面
    $('.enroll').on('click', 'a', function() {
        $('.enroll').hide(); //隐藏
        $('.Login').show() //显示
    });

    // 用户密码验证
    var form = layui.form; //layui方式获取form表单
    //自定义表单验证方式
    form.verify({
        // 用户名验证
        username: function(value, item) { //value：表单的值、item：表单的DOM对象
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d$/.test(value)) {
                return '用户名不能全为数字';
            }
            if (!/^[\S]{2,16}$/.test(value)) {
                return '用户名为2-16位，且不能出现空格';
            }
        },
        // 密码验证
        pass: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        //确认密码验证
        repass: function(value) {
            let pwd = $('.enroll [name=password]').val();
            if (pwd !== value) {
                return '两次输入的密码不一致';
            }
        }
    });
    //在每次发起ajax请求之前，会先调用jQ中ajaxPrefilter这个内置函数，这个函数中可以拿到ajax提供的配置对象
    $.ajaxPrefilter(function(options){
        // 在发起ajax请求之前 同意拼接url地址 方便后期维护
     options.url = 'http://api-breakingnews-web.itheima.net'+options.url
    })
    //注册表单
    $('#register').on('submit', function(e) {
        e.preventDefault();
        register($(this).serialize());
        // $(this)[0].reset()
    });
    // 注册信息验证
    var register = function(data) {
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message); //使用layui的警示窗口组件提示信息
            }
            layer.msg(res.message); //使用layui的警示窗口组件提示信息
            $('.layui-form-item>.float-r').click(); //注册成功切换到登录页面
            $('#register')[0].reset() //清空表单所有内容
        })
    };
    //登录表单
    $('#login').on('submit', function(e) {
        e.preventDefault();
        login($(this).serialize());
        // $(this)[0].reset() //清空表单所有内容
    });
    // 登录验证
    var login = function(data) {
        $.ajax({
            method: 'post',
            url: '/api/login',
            data: data,
            success: function(res) {
                if (res.status !== 0) {
                    //使用layui的警示窗口组件提示信息
                    return layer.msg(res.message, {
                        icon: 5
                    });
                }
                //使用layui的警示窗口组件提示信息
                layer.msg(res.message, {
                    icon: 6
                });
                // 登录成功后将获得的token字符串 保存到本地存储localStorage中，方便后边用的时候提取
                localStorage.setItem('token', res.token)
                    // 跳转到主页
                location.href = '/index.html'
            }
        })
    };


})