layui.use(['table', 'form', "urlrelated", "extension"], function () {
    var laydate = layui.laydate,
        element = layui.element,
        table = layui.table,
        $ = layui.$,
        layer = layui.layer,
        form = layui.form,
        urlrelated = layui.urlrelated,
        extension = layui.extension,
        loginuserinfo = extension.getUserInfo(); //获取用户登录信息
    form.render();
    $("#querytype").val(localStorage.getItem("querytypeItem"));
    $("body", parent.document).find('#sub-title').html('角色管理');
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
    //获取当前登录用户的权限
    var pagepower = extension.getPagePower("角色管理");

    urlrelated.requestBody.data = {
        "rmName": "",
        "queryType": pagepower.queryType,
        "notifiedBody": pagepower.notifiedBody,
        "userJGDM": loginuserinfo.userJGDM
    }
    table.render({
        elem: '#role-table-page',
        toolbar: "#table-hreader",
        url: urlrelated.getRoleList,
        method: 'post',
        contentType: "application/json;charset=UTF-8" //推荐写这个
            ,
        where: urlrelated.requestBody,
        even: true,
        defaultToolbar: ['filter'],
        limits: [10, 20, 30],
        cols: [
            [{
                field: 'rmName',
                title: "角色名称"
            }, {
                field: 'roleLevel',
                title: '角色等级'
            }, {
                field: 'namenum',
                title: '成员数量'
            }, {
                field: 'rmDescribe',
                title: '角色描述'
            }, {
                field: '',
                minWidth: 230,
                align: 'center',
                fixed: 'right',
                title: '操作',
                toolbar: '#role-table-operate'
            }]
        ],
        loading: true,
        page: true,
        response: {
            statusCode: 200 //重新规定成功的状态码为 200，table 组件默认为 0
        },
        parseData: function (res) { //将原始数据解析成 table 组件所规定的数据
            if (res.status != 200) {
                return {
                    "code": res.status, //解析接口状态
                    "msg": res.message, //解析提示文本
                    "count": 0, //解析数据长度
                    "data": [] //解析数据列表
                }
            }
            return {
                "code": res.status, //解析接口状态
                "msg": res.message, //解析提示文本
                "count": res.data.total, //解析数据长度
                "data": res.data.roleList //解析数据列表
            };
        }
    });
    table.on('tool(role-table-operate)', function (obj) {
        var data = obj.data;
        //console.log(obj);
        if (obj.event === 'edit') {
            ModifyRole(data, "编辑角色");
        } else if (obj.event === 'del') {
            if (data.namenum > 0) {
                layer.msg("该角色含有成员，不能删除");
                return;
            }
            DeleteUser(data.rmId);
        } else if (obj.event === 'member') {
            //跳转到成员管理页面
            window.location.href = "/html/system/role/membership.html?roleid=" + data.rmId;
        } else if (obj.event === 'auth') {
            //跳转到权限设置页面
            window.location.href = "/html/system/role/role_auth.html?roleid=" + data.rmId + "&rolename=" + encodeURI(encodeURI(data.rmName));
        }
    });

    // function getInfo() {
    //     var data = $.extend(true, {}, requestData);
    //     data['page'] = 1;
    //     data['limit'] = 10;
    //     data = JSON.stringify(data);
    //     $.ajax({
    //         url: urlrelated.getRoleList,
    //         type: "post",
    //         async: false,
    //         data: data,
    //         cache: false,
    //         contentType: "application/json;charset=UTF-8",  //推荐写这个
    //         dataType: "json",
    //         success: function (res) {
    //             //console.log(res);
    //             table.reload('role-table-page', {
    //                 where: {
    //                     data: {
    //                         rmName: requestData.data.rmName
    //                     }
    //                 }
    //             });
    //         },
    //         error: function (tt) {
    //             layer.msg("错误");
    //             //console.log(tt);
    //         }
    //     })
    // }

    //查询数据按钮
    form.on('submit(searchinfo)', function (data) {
        //console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
        //去除空格
        for (var key in data.field) {
            data.field[key] = $.trim(data.field[key]);
        }
        table.reload('role-table-page', {
            where: {
                data: {
                    rmName: data.field.rmName
                }
            },
            page: {
                curr: 1 //重新从第 1 页开始
            }
        });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
    //重置
    $("#reset_btn").on("click", function () {
        $("#rmName").val('');
    });

    table.on('toolbar(role-table-operate)', function (obj) {
        if (obj.event === 'add') {
            ModifyRole(null, "新增角色");
        }
    });

    function ModifyRole(info, title) {
        //console.log(info);
        var isclickyes = false;
        layer.open({
            title: '<span style="font-weight: 650;font-size: 16px;">' + title + '</span>',
            type: 2,
            move: false,
            area: ['530px', '350px'],
            resize: false,
            content: ['/html/system/role/change_role.html', "no"],
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                isclickyes = true;
                var body = layer.getChildFrame('body', index);
                body.find("#change_role_submit").click();
                // var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
            },
            btn2: function () {
                isclickyes = false;
            },
            success: function (layero, index) {
                var body = layer.getChildFrame('body', index);
                if (info != undefined && info != null && info != '') {
                    body.find('#rmName').val(info.rmName);
                    body.find('#rmDescribe').val(info.rmDescribe);
                    body.find('#rmName').attr("data-roleid", info.rmId);
                    body.find('#roleLevel').val(info.roleLevel);
                    body.find('#roleLevel').prop("disabled", true);
                }
            },
            end: function () {
                if (isclickyes) {
                    table.reload('role-table-page', {
                        page: {
                            curr: 1
                        }
                    });
                }
            }
        });
    }

    function DeleteUser(objid) {
        layer.confirm('是否确定删除?', {
            icon: 3,
            title: '删除确认',
            resize: false
        }, function (index) {
            //console.log(objid);
            urlrelated.requestBody.data = {
                "rmId": objid
            }
            var loadingIndex = layer.load(1, {
                shade: 0.3
            });
            $.ajax({
                url: urlrelated.roleDelete,
                type: "post",
                async: true,
                data: JSON.stringify(urlrelated.requestBody),
                cache: false,
                timeout: 120000,
                contentType: "application/json;charset=UTF-8", //推荐写这个
                dataType: "json",
                success: function (res) {
                    //console.log(res);
                    layer.close(loadingIndex);
                    if (res.status == 200) {
                        layer.msg("删除成功");
                        table.reload('role-table-page', {
                            page: {
                                curr: 1 //重新从第 1 页开始
                            }
                        });
                    } else {
                        layer.msg(res.message);
                    }
                },
                error: function (xml, textstatus, thrown) {
                    layer.close(loadingIndex);
                    //只要进error就跳转到登录页面
                    extension.errorLogin();
                }
            });
            layer.close(index);
        });
    }
});