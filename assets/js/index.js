$(function() {
    var layer = layui.layer; //导出layui内的layer变量
    $('#exit').on("click", function() {
            // 提示用户是否确定退出
            layer.confirm('确定退出登录？', {
                icon: 3,
                title: '提示'
            }, function(index) {
                //do something
                //清空本地存储中 token的值
                localStorage.removeItem('token');
                // 跳回到登录页
                location.href = '/login.html';
                layer.close(index);
            });
        })
        //在每次发起ajax请求之前，会先调用jQ中ajaxPrefilter这个内置函数，这个函数中可以拿到ajax提供的配置对象
    $.ajaxPrefilter(function(options) {
            options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
            // 当options.url 中包含/my 开头的权限接口 才需要添加请求头信息
            if (options.url.indexOf('/my/') !== -1) {
                // 统一为需要权限的接口配置headers
                options.headers = {
                    Authorization: localStorage.getItem('token') || ''
                }
            }
        })
        // 调用请求函数
    getUserInfo();
});
// 请求数据函数
function getUserInfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        //headers 请求头
        // headers: {
        //     // 获取本地存储中的token值
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            };
            // 调用生成字母头像的函数
            renderAvatar(res.data);
        },
        //无论请求成功或失败 都会执行complete函数
        complete: function(res) {
            console.log(res.responseJSON.status);
            if (res.responseJSON.status !== 0) {
                //清空本地存储中 token的值
                localStorage.removeItem('token');
                // 跳回到登录页
                location.href = '/login.html';
            }
        }
    })
};
// 生成字母头像的函数
function renderAvatar(user) {
    // 获取用户的名称 优先获取昵称 没有在获取用户名
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎 ' + name);
    if (user.user_pic) { //如果头像的url不为空，则显示头像，隐藏字母头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide()
    } else { //否则隐藏头像 显示字母头像
        $('.layui-nav-img').hide();
        var text = name[0].toUpperCase(); //获取名字的第一个字符 如果是字母则转换为大写
        $('.text-avatar').html(text).show()
    }
}