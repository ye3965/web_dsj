$(function() {
    // 获取layui的layer方法
    var layer = layui.layer;
    // 渲染页面内容
    initArtCateList();
    // 获取文字分类类别 渲染页面内容
    function initArtCateList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 调用列表模板 获得模板内容
                var text = template('tpl-table', res);
                // 将模板内容渲染到页面当中
                $('#tbody').html(text);
            }
        })
    };

    // 添加信息弹窗
    var indexAdd = null; //获取当前弹窗的index值 用于关闭弹窗
    $('#btnAddCate').on('click', function(e) {
        // 调用layui的弹窗方法 得到返回的弹窗index值
        indexAdd = layer.open({
            type: 1, //弹窗的类型
            area: ['500px', '260px'], //弹窗的大小
            title: '添加文字类别', //弹窗的标题
            content: $('#dialog-add').html() //弹窗的内容 通过获取元素的html 渲染弹窗页面
        });
    });
    // 添加信息弹窗的数据提交 因为是通过js添加的页面元素 所有要用boty左事件委派
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault(); //清空默认提交行为
        // 发起添加信息的请求
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(), //表单内的值
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message);
                // 请求成功重新渲染页面
                initArtCateList();
                // 关闭对应index的弹窗
                layer.close(indexAdd);
            }
        })
    });
    //修改信息弹窗 edit
    var indexEdit = null; //获取当前弹窗的index值 用于关闭弹窗
    var form = layui.form; //获取layui的form方法
    $('#tbody').on('click', '.edit', function() {
        // 调用layui的弹窗方法 得到返回的弹窗index值
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '260px'],
            title: '修改文字类别',
            content: $('#dialog-edit').html(),
        });
        // 获取按钮的id
        var id = $(this).attr('data-id');
        // 获取信息的请求
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id, //将id值拼接到链接后面进行发送
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 请求成功后 将请求回的数据 渲染到对应的表单中 layui的form方法
                form.val('form-edit', res.data)
            }
        })
    });
    // 发起修改信息请求
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault(); //阻止默认提交行为
        // 发起修改信息的请求
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(), //将表单的数据进行发送
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message);
                //通过index关闭当前弹窗
                layer.close(indexEdit);
                // 请求成功重新渲染页面数据
                initArtCateList();
            }
        })
    });

    // 删除信息 delete
    $('#tbody').on('click', '.delete', function() {
        //获取按钮对应的id
        var id = $(this).attr('data-id');
        //发起删除请求
        $.ajax({
            method: 'get',
            url: '/my/article/deletecate/' + id, //发送对应的id进行请求
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message);
                // 请求成功重新渲染页面
                initArtCateList();
            }
        })
    })

})