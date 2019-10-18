layui.use(['table', 'form', "layer", "urlrelated", "extension"], function () {
    var laydate = layui.laydate,
        $ = layui.$,
        layer = layui.layer,
        form = layui.form,
        table = layui.table,
        urlrelated = layui.urlrelated,
        extension = layui.extension,
        orgid = new Array(),
        loginuserinfo = extension.getUserInfo(); //获取用户登录信息
    form.render();
    $("#querytype").val(localStorage.getItem("querytypeItem"));
    $("body", parent.document).find('#sub-title').html('用户管理');
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

    var pagepower = extension.getPagePower("用户管理");
    // console.log(powerControl);
    urlrelated.requestBody.data = {
        "jgxxJgid": loginuserinfo.JGID,
        "jgxxGajgjgdm": loginuserinfo.userJGDM,
        "userName": "",
        "userRealName": "",
        "orgIds": null,
        "queryType": pagepower.queryType,
        "orgListQueryTypeEq4": pagepower.notifiedBody
    }

    table.render({
        elem: '#test-table-page',
        toolbar: "#table-hreader",
        url: urlrelated.getUserInfoList,
        method: 'post',
        even: true,

        defaultToolbar: ['filter'],
        contentType: "application/json;charset=UTF-8" //推荐写这个
        ,
        where: urlrelated.requestBody,
        limits: [10, 20, 30],
        cols: [
            [{
                type: 'checkbox'
            }, {
                field: 'userName', width: 202,
                title: '用户名'
            }, {
                field: 'userRealname', width: 202,
                title: '姓名'
            }, {
                field: 'userGender2', width: 202,
                title: '性别'
            }, {
                field: 'jgxxgajgjgmc', width: 220,
                title: '归属机构'
            }, {
                field: 'userIsLock', width: 202, 
                title: '状态',
                templet: function (row) {
                    var stateHtml = '';
                    if (row.userIsLock == 0) {
                        return stateHtml = '<span style="color: #1ABC9C;">启用</span>';
                    } else {
                        return stateHtml = '<span style="color: #FF0000;">禁用</span>';
                    }
                }
            }, {
                field: 'rmName', width: 202,
                title: '所属角色',
            }, {
                field: '',
                title: '操作',
                minWidth: '210',
                align: 'center',
                fixed: 'right',
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
                "count": res.data.total, //解析数据长度
                "data": res.data.records //解析数据列表
            };
        }
    });

    table.on('toolbar(test-table-operate)', function (obj) {
        var data = obj.data;
        // console.log(obj);
        if (obj.event === 'add') {
            window.location.href = "add_user.html?type=add";
        } else if (obj.event === 'del') {
            active.getCheckData();
        }
    });
    table.on('tool(test-table-operate)', function (obj) {
        var data = obj.data;
        //console.log(obj);
        if (obj.event === 'edit') {
            window.location.href = "add_user.html?type=edit&id=" + data.userId;
        } else if (obj.event === 'del') {
            DeleteUser(data.userId, null);
        } else if (obj.event === 'modifypsd') {
            ModifyPsd(data.userId);
            // layer.alert('编辑行：<br>' + JSON.stringify(data))
        } else if (obj.event === 'islock') {
            var loadingicon = layer.load(1, {
                shade: 0.3
            })
            var userIsLock = obj.data.userIsLock;
            var message = "启用成功";
            if (userIsLock == "0") {
                userIsLock = "1";
            message = "禁用成功";
            } else {
                userIsLock = "0";
            message = "启用成功";
            }

            urlrelated.requestBody.data = {
                "userId": obj.data.userId,
                "userIsLock": userIsLock
            }
            delete urlrelated.requestBody.imei;
            delete urlrelated.requestBody.signature;
            $.ajax({
                url: urlrelated.setUserState,
                type: "post",
                async: true,
                timeout: 120000,
                data: JSON.stringify(urlrelated.requestBody),
                cache: false,
                contentType: "application/json;charset=UTF-8", //推荐写这个
                dataType: "json",
                success: function (res) {
                    layer.close(loadingicon);
                    if (res.status == 200) {
                        urlrelated.requestBody.data = {
                            "jgxxJgid": loginuserinfo.JGID,
                            "jgxxGajgjgdm": loginuserinfo.userJGDM,
                            "userName": "",
                            "userRealName": "",
                            "orgIds": null,
                            "queryType": pagepower.queryType,
                            "orgListQueryTypeEq4": pagepower.notifiedBody
                        }
                        table.reload('test-table-page', {
                            data: res.data.records,
                            page: {
                                curr: 1 //重新从第 1 页开始
                            }
                        });
                        layer.msg(message);
                    } else {
                        layer.msg(res.message);
                    }
                },
                error: function (xml, textstatus, thrown) {
                    layer.close(loadingicon);
                    extension.errorMessage(thrown);
                }
            })

        }
    });
    var active = {
        getCheckData: function () { //获取选中数据
            var checkStatus = table.checkStatus('test-table-page'),
                data = checkStatus.data;
            //console.log(data);
            if (data.length == 0 || data == []) {
                layer.msg("请至少勾选一行要删除的数据");
                return;
            }
            var userlist = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].userId != loginuserinfo.userId) {
                    userlist.push(data[i].userId)
                }
            }
            if (userlist.length == 0) {
                layer.msg("不能删除自己");
                return;
            }
            DeleteUser(null, userlist);
        }
    };
    $("#delete_multiple").on("click", function () {
        active.getCheckData();
    });
    //查询数据按钮
    form.on('submit(searchinfo)', function (data) {
        //console.log(data.field); //当前容器的全部表单字段，名值对形式：{name: value}
        //去除空格
        for (var key in data.field) {
            data.field[key] = $.trim(data.field[key]);
        }
        //剩一个组织机构
        if (selectTreeOrg.length > 0) {
            table.reload('test-table-page', {
                where: {
                    data: {
                        orgIds: orgid,
                        userName: data.field.userName,
                        userRealName: data.field.userRealName,
                    }
                },
                page: {
                    curr: 1 //重新从第 1 页开始
                }
            });
        } else {
            table.reload('test-table-page', {
                where: {
                    data: {
                        orgIds: null,
                        userName: data.field.userName,
                        userRealName: data.field.userRealName,
                    }
                },
                page: {
                    curr: 1 //重新从第 1 页开始
                }
            });
        }

        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
    $("#reset_btn").on("click", function () {
        $("#userinfo")[0].reset();
        selectTreeOrg = new Array();
        orgid = new Array();
        form.render();
    });
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
                orgid = new Array();
                $("#prev_org").val(selectTreeOrg[0].title);
                orgid.push(selectTreeOrg[0].treeId)
                layer.close(index);
            },
            success: function (layero, index) {
                // var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                // iframeWin.layui.initTree("single");
            }
        });
    });

    //修改密码
    function ModifyPsd(modifyid) {
        var isclickyes = false;
        layer.open({
            title: '修改密码',
            type: 2,
            move: false,
            area: ['530px', '260px'],
            resize: false,
            content: ['/html/system/user/modify_passwd.html', "no"],
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                var body = layer.getChildFrame('body', index);
                body.find("#modify_psd_submit").click();
                isclickyes = true;
                // layer.close(index);
            },
            btn2: function () {
                isclickyes = false;
            },
            success: function (layero, index) {

                var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                iframeWin.changeData(modifyid);
                layer.iframeAuto(index);
                // var  objbiaoqian =  iframeWin.document.getElementById("Biometrics")
                // $(objbiaoqian).height(169)
                // //erorr提示框宽度
                // var  tishi =  iframeWin.document.getElementById("tishi")
                // $(tishi).width(480)
                // var  Biometrics =  iframeWin.document.getElementById("Biometrics")
                // $(Biometrics).css("margin-top",0)
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
    var DeleteUser = function (obj, userIdList) {
        layer.confirm('是否确定删除?', {
            icon: 3,
            title: '删除确认',
            resize: false
        }, function (index) {
            //do something
            var loadingicon = layer.load(1, {
                shade: 0.3
            })
            if (obj != null) {
                var id = [];
                id.push(obj);
            } else {
                var id = userIdList;
            }

            urlrelated.requestBody.data = {
                "userId": loginuserinfo.userId,
                "userIdList": id
            }
            //console.log(id);
            $.ajax({
                url: urlrelated.deleteUser,
                type: "post",
                async: true,
                timeout: 120000,
                data: JSON.stringify(urlrelated.requestBody),
                cache: false,
                contentType: "application/json;charset=UTF-8", //推荐写这个
                dataType: "json",
                success: function (res) {
                    layer.close(loadingicon);
                    if (res.status == 200) {
                        layer.msg("删除成功");
                        // urlrelated.requestBody["companyCode"] = "";
                        // urlrelated.requestBody["ip"] = "";
                        // urlrelated.requestBody["mac"] = "";
                        urlrelated.requestBody.data = {
                            "jgxxJgid": loginuserinfo.JGID,
                            "jgxxGajgjgdm": loginuserinfo.userJGDM,
                            "userName": "",
                            "userRealName": "",
                            "orgIds": null,
                            "queryType": pagepower.queryType,
                            "orgListQueryTypeEq4": pagepower.notifiedBody
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
                error: function (xml, textstatus, thrown) {
                    layer.close(loadingicon);
                    extension.errorMessage(thrown);
                }
            });
            layer.close(index);
        });
    }
    
    //console.log(returnCitySN["cip"]);
});
