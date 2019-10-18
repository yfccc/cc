layui.config({
    base: ''
}).extend({
    treetable: '../layui/layui/lay/modules/treetable'
}).use(['table', 'form', 'urlrelated', 'treetable', 'extension'], function () {
    var laydate = layui.laydate,
        element = layui.element,
        extension = layui.extension,
        treetable = layui.treetable,
        urlrelated = layui.urlrelated,
        table = layui.table,
        $ = layui.$,
        layer = layui.layer,
        form = layui.form,
        loginuserinfo = extension.getUserInfo(); //获取用户登录信息
    form.render();
    $("#querytype").val(localStorage.getItem("querytypeItem"));
    $("body", parent.document).find('#sub-title').html('菜单管理');
    // 防止页面后退
    $(document).on("keydown", function (event) {
        var ev = event || window.event; //获取event对象 
        var obj = ev.target || ev.srcElement; //获取事件源 
        var t = obj.type || obj.getAttribute('type'); //获取事件源类型 
        var code = event.keyCode || event.which;
        if ((code == 13 || code == 8) && t != "password" && t != "text" && t != "textarea") {
            return false
        }
    })
    //获取权限信息
    var powerControl = $("#querytype").val();
    //console.log(powerControl);

    // 渲染表格
    function renderTreeTable(data) {
        layer.load(2);
        treetable.render({
            treeColIndex: 0,
            treeSpid: 0,
            treeIdName: 'modelId',
            treePidName: 'modelParentid',
            elem: '#tab_menu',
            defaultToolbar: [],
            data: data,
            toolbar: '#opt_add',
            page: false,
            cols: [
                [{
                        field: 'modelName',
                        minWidth: 200,
                        title: '菜单名称'
                    },
                    {
                        field: 'modelUrl',
                        title: 'URL'
                    },
                    {
                        field: 'modelStatus',
                        title: '显示隐藏',
                        templet: function (d) {
                            if (d.modelStatus == 1) {
                                return "显示";
                            } else if (d.modelStatus == 2) {
                                return "隐藏";
                            }
                        }
                    },
                    {
                        field: 'modelType',
                        width: 80,
                        align: 'center',
                        templet: function (d) {
                            if (d.modelType == 1) {
                                return '<span class="layui-badge layui-bg-gray">菜单</span>';
                            } else if (d.modelType == 2) {
                                return '<span class="layui-badge layui-bg-gray">按钮</span>';
                            }
                        },
                        title: '类型'
                    },
                    {
                        field: 'modelAuthority',
                        title: '权限标识'
                    },
                    {
                        field: 'modelIcon',
                        title: '菜单图标'
                    },
                    {
                        templet: '#opt_opt',
                        minWidth: '230',
                        align: 'center',
                        fixed: 'right',
                        title: '操作'
                    }
                ]
            ],
            done: function () {
                layer.closeAll('loading');
                $(".treeTable-icon.open").on("hover", function () {
                    var id = $(this).attr("lay-tpid");
                    if (id != "0") {
                        $(this).css("cursor", "default");
                    }
                })
            }
        });
    }

    urlrelated.requestBody.data = {
        isTree: false
    }
    getMenuList();

    //获取菜单列表
    function getMenuList() {
        //console.log("获取菜单树");
        var loadingIndex = layer.load(1, {
            shade: 0.3
        });
        $.ajax({
            url: urlrelated.searchMenuList,
            //url: "/json/menus.json",
            type: "post",
            async: true,
            data: JSON.stringify(urlrelated.requestBody),
            cache: false,
            timeout: 120000,
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            success: function (res) {
                layer.close(loadingIndex);
                if (res.status == 200) {
                    renderTreeTable(res.data);
                } else {
                    layer.msg(res.message);
                }
            },
            error: function (tt) {
                layer.close(loadingIndex);
                //只要进error就跳转到登录页面
                extension.errorLogin();
            }
        })
    }
    //点击 获取行信息 并跳转到编辑/新增/查看/增加下级菜单 页面
    table.on('tool(tab_menu)', function (obj) {

        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值
        if (layEvent === 'details') { //查看
            //跳转到查看页面
            var url = "./add_menu.html?id=" + data.modelId + "&layEvent=" + layEvent;
            location.href = url;

        } else if (layEvent === 'del') { //删除
            layer.confirm('是否确定删除？', {
                icon: 3,
                title: '删除确认',
                resize: false
            }, function (index) {
                layer.close(index);
                //向服务端发送删除指令
                if (loginuserinfo.userRealname != "超级管理员") {
                    layer.msg("超级管理员有权限删除菜单");
                    return;
                }
                urlrelated.requestBody.data = {
                    "modelId": data.modelId,
                    "userId": loginuserinfo.userId
                }
                var loadingIndex1 = layer.load(1, {
                    shade: 0.3
                });
                $.ajax({
                    url: urlrelated.deleteMenu,
                    type: "post",
                    async: true,
                    data: JSON.stringify(urlrelated.requestBody),
                    cache: false,
                    timeout: 120000,
                    contentType: "application/json;charset=UTF-8", //推荐写这个
                    dataType: "json",
                    success: function (res) {
                        layer.close(loadingIndex1);
                        if (res.status == 200) {
                            layer.msg("删除成功");
                            getMenuList();
                        } else {
                            layer.msg(res.message);
                        }
                    },
                    error: function (tt) {
                        layer.close(loadingIndex1);
                        //只要进error就跳转到登录页面
                        extension.errorLogin();
                    }
                });
            });
        } else if (layEvent === 'edit') { //编辑
            var url = "./add_menu.html?id=" + data.modelId + "&layEvent=" + layEvent;
            location.href = url;
        } else if (layEvent === 'add_next') { //增加下级菜单
            var url = "./add_menu.html?id=" + data.modelId + "&layEvent=" + layEvent;
            location.href = url;
        }
    });

    table.on('toolbar(tab_menu)', function (obj) {
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值
        var url = "./add_menu.html?id=0&layEvent=" + layEvent;
        location.href = url;
    });
});