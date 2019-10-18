layui.use(['table', 'form', "layer", "urlrelated", "extension"], function () {
    var laydate = layui.laydate,
        $ = layui.$,
        layer = layui.layer,
        form = layui.form,
        table = layui.table,
        urlrelated = layui.urlrelated,
        extension = layui.extension,
        loginuserinfo = extension.getUserInfo(); //获取用户登录信息
    form.render();
    $("#querytype").val(localStorage.getItem("querytypeItem"))
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

    //获取当前登录用户的权限
    var pagepower = extension.getPagePower("接入管理");
    // console.log(powerControl);
    urlrelated.requestBody.data = {
        "userJGDM": loginuserinfo.userJGDM,
        "queryType": pagepower.queryType,
        "notifiedBody": pagepower.notifiedBodyStr
    }

    table.render({
        elem: '#test-table-page',
        toolbar: "#table-hreader",
        url: urlrelated.getdetailIpList,
        method: 'post',
        even: true,
        defaultToolbar: ['filter'],
        contentType: "application/json;charset=UTF-8" //推荐写这个
            ,
        where: urlrelated.requestBody,
        limits: [10, 20, 30],
        cols: [
            [{
                title: 'No.',
                type: 'numbers'
            }, {
                field: 'name',
                title: '企业名称'
            }, {
                field: 'clientId',
                title: '接入Id'
            }, {
                field: 'clientSecret',
                title: '接入密码'
            }, {
                field: 'status',
                title: '状态',
                templet: function (row) {
                    var stateHtml = '';
                    if (row.status == 1) {
                        return stateHtml = '<span style="color: #1ABC9C;">启用</span>';
                    } else {
                        return stateHtml = '<span style="color: #FF0000;">禁用</span>';
                    }
                }
            }, {
                field: 'cdt',
                minWidth: 165,
                title: '日期'
            }, {
                field: 'remark',
                title: '备注'
            }, {
                field: '',
                title: '操作',
                align: 'center',
                fixed: 'right',
                minWidth: '200',
                toolbar: '#test-table-operate'
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
                "count": res.data.count, //解析数据长度
                "data": res.data.data //解析数据列表
            };
        }
    });

    //新增和编辑接入ip
    function changeInsert(isadd, info) {
        var changeData = "add";
        var titleinfo = "新增信息";
        if (isadd) {
            changeData = "add";
            info = {};
            info["id"] = '';
        } else {
            changeData = "edit";
            titleinfo = "修改信息";
        }
        var isclickyes = false;
        layer.open({
            title: '<span style="font-weight: 650;font-size: 16px;">' + titleinfo + '</span>',
            type: 2,
            move: false,
            area: [extension.getDialogSize().width, extension.getDialogSize().height],
            resize: false,
            content: ['/html/system/insert/change_insert.html?type=' + changeData + '&id=' + info.id, "no"],
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                var body = layer.getChildFrame('body', index);
                body.find("#changeSubmit").click();
                isclickyes = true;
            },
            btn2: function (index, layero) {
                isclickyes = false;
            },
            success: function (layero, index) {
                var body = layer.getChildFrame('body', index);
                if (isadd == false) {
                    body.find('#ctDecrible').val(info.ctDecrible);
                    body.find('#ctId').val(info.ctId);
                    body.find('#ctRemark').val(info.ctRemark);
                }
                if (extension.getDialogSize().height == "370px") {
                    body.find("form").css("padding-top", "20px");
                    body.find(".section").css("height", "270px");
                }else{
                    body.find(".section").css("height", "328px");
                }
            },
            end: function () {
                if (isclickyes) {
                    table.reload('test-table-page', {
                        page: {
                            curr: 1 //重新从第 1 页开始
                        }
                    });
                }
            }
        });
    }

    //添加ip
    function addInsertIp(data) {
        var isclickyes = false;
        layer.open({
            title: '<span style="font-weight: 650;font-size: 16px;">添加信息</span>',
            type: 2,
            move: false,
            area: [520 + 'px', 370 + 'px'],
            resize: false,
            content: ['/html/system/insert/add_insertip.html?id=' + data.id, "no"],
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                var body = layer.getChildFrame('body', index);
                body.find("#changeSubmit").click();
                isclickyes = true;
            },
            btn2: function (index, layero) {
                isclickyes = false;
            },
            success: function (layero, index) {

            },
            end: function () {
                if (isclickyes) {
                    table.reload('test-table-page', {
                        page: {
                            curr: 1 //重新从第 1 页开始
                        }
                    });
                }
            }
        });
    }

    //查看ip
    function detailInsertIp(data) {
        var isclickyes = false;
        layer.open({
            title: '<span style="font-weight: 650;font-size: 16px;">' + data.clientId + '</span>',
            type: 2,
            move: false,
            area: [520 + 'px', 370 + 'px'],
            resize: false,
            content: ['/html/system/insert/detail_insertip.html?id=' + data.id, "no"],
            btn: ['取消'],
            yes: function (index, layero) {
                layer.close(index);
            },
            success: function (layero, index) {

            }
        });
    }

    table.on('toolbar(test-table-operate)', function (obj) {
        var data = obj.data;
        // console.log(obj);
        if (obj.event === 'add') {
            changeInsert(true, data);
        }
    });
    table.on('tool(test-table-operate)', function (obj) {
        var data = obj.data;
        //console.log(obj);
        if (obj.event === 'edit') {
            changeInsert(false, data);
        } else if (obj.event === 'del') {
            DeleteUser(data.id);
        } else if (obj.event === 'addIp') {
            addInsertIp(data);
        } else if (obj.event === 'detailIp') {
            detailInsertIp(data);
        }
    });
    //查询数据按钮
    // form.on('submit(searchinfo)', function (data) {
    //     //console.log(data.field); //当前容器的全部表单字段，名值对形式：{name: value}
    //     //剩一个组织机构
    //     //去除空格
    //     for (var key in data.field) {
    //         data.field[key] = $.trim(data.field[key]);
    //     }
    //     if (selectTreeOrg.length > 0) {
    //         table.reload('test-table-page', {
    //             where: {
    //                 data: {
    //                     jgxxGajgjgdm: selectTreeOrg[0].treeId,
    //                     jgxxJgid: selectTreeOrg[0].title,
    //                     userName: data.field.userName,
    //                     userRealName: data.field.userRealName,
    //                 }
    //             }
    //             , page: {
    //                 curr: 1 //重新从第 1 页开始
    //             }
    //         });
    //     } else {
    //         table.reload('test-table-page', {
    //             where: {
    //                 data: {
    //                     jgxxGajgjgdm: "110108000000",
    //                     jgxxJgid: "E73809E4A95EE32F7A913508FC6DB502",
    //                     userName: data.field.userName,
    //                     userRealName: data.field.userRealName,
    //                 }
    //             }
    //             , page: {
    //                 curr: 1 //重新从第 1 页开始
    //             }
    //         });
    //     }

    //     return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    // });
    // $("#reset_btn").on("click", function () {
    //     $("#clientinfo")[0].reset();
    //     form.render();
    // });
    var selectTreeOrg = new Array();
    $("#select_org").on("click", function () {
        localStorage.setItem("currentOrgCodeTree", loginuserinfo.userJGDM);
        localStorage.setItem("chirdOrgCodeTree", "-1");
        localStorage.setItem("queryTypeTree", loginuserinfo.querytypeItem);
        localStorage.setItem("orgListQueryTypeEq4Tree", loginuserinfo.models);
        layer.open({
            title: '选择机构',
            type: 2,
            move: false,
            area: [extension.getDialogSize().width, extension.getDialogSize().height],
            resize: false,
            content: ['/html/system/institutions/select_institutions.html?tree_type=single', "no"],
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                selectTreeOrg = iframeWin.getSelectOrg();
                //console.log(selectTreeOrg);
                $("#prev_org").val(selectTreeOrg[0].title);

                layer.close(index);
            },
            success: function (layero, index) {
                // var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                // iframeWin.layui.initTree("single");
            }
        });
    });

    var DeleteUser = function (id) {
        layer.confirm('是否确定删除?', {
            icon: 3,
            title: '删除确认',
            resize: false
        }, function (index) {
            urlrelated.requestBody.data = {
                "id": id
            }
            var loadingIndex = layer.load(1, {
                shade: 0.3
            });
            //console.log(id);
            $.ajax({
                url: urlrelated.deleteInsertIpById,
                type: "post",
                async: true,
                data: JSON.stringify(urlrelated.requestBody),
                cache: false,
                timeout: 120000,
                contentType: "application/json;charset=UTF-8", //推荐写这个
                dataType: "json",
                success: function (res) {
                    layer.close(loadingIndex);
                    if (res.status == 200) {
                        layer.msg("删除成功");
                        urlrelated.requestBody.data = {
                            "userJGDM": loginuserinfo.userJGDM,
                            "queryType": pagepower.queryType,
                            "notifiedBody": pagepower.notifiedBodyStr
                        }
                        table.reload('test-table-page', {
                            page: {
                                curr: 1 //重新从第 1 页开始
                            }
                        });
                    } else {
                        layer.msg(res.message);
                    }
                },
                error: function (tt) {
                    layer.close(loadingIndex);
                    //只要进error就跳转到登录页面
                    extension.errorLogin();
                }
            });
            layer.close(index);
        });
    }
});