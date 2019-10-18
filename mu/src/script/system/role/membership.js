layui.use(['table', 'form', "extension", "urlrelated"], function () {
    var laydate = layui.laydate,
        element = layui.element,
        table = layui.table,
        $ = layui.$,
        layer = layui.layer,
        form = layui.form,
        extension = layui.extension,
        urlrelated = layui.urlrelated,
        loginuserinfo = extension.getUserInfo(); //获取用户登录信息
    form.render();
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
    $("body", parent.document).find('#sub-title').html('成员管理');

    var active = {
        getCheckData: function () { //获取选中数据
            var checkStatus = table.checkStatus('member-table-page'),
                data = checkStatus.data;
            // console.log(data);
            if (data.length == 0 || data == []) {
                layer.msg("请至少勾选一行要删除的数据");
                return;
            }
            var rolelist = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].userId != loginuserinfo.userId) {
                    rolelist.push(data[i].iruId);
                }
            }
            if (rolelist.length == 0) {
                layer.msg("不能删除自己");
                return;
            }
            DeleteUser(null, rolelist);
        },
        GetRequest: function (url) {
            var theRequest = {};
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
                }
            }
            return theRequest;
        }
    };
    var urldata = active["GetRequest"](window.location.search);

    //获取当前登录用户的权限
    var pagepower = extension.getPagePower("角色管理");
    urlrelated.requestBody.data = {
        "rmId": urldata.roleid,
        "userName": "",
        "userRealname": "",
        "queryType": pagepower.queryType,
        "notifiedBody": pagepower.notifiedBody,
        "userJGDM": loginuserinfo.userJGDM
    }
    table.render({
        elem: '#member-table-page',
        toolbar: "#table-hreader",
        url: urlrelated.roleMemberList //暂时不开启
        ,
        method: 'post',
        contentType: "application/json;charset=UTF-8" //推荐写这个
        ,
        where: urlrelated.requestBody,
        even: true,
        defaultToolbar: ['filter'],
        limits: [10, 20, 30],
        cols: [
            [{
                type: 'checkbox'
            }, {
                field: 'userName',
                title: '用户名'
            }, {
                field: 'userRealname',
                title: '姓名'
            }, {
                field: 'userGender',
                title: '性别',
                templet: function (row) {
                    var genderHtml = '';
                    if (row.userGender == 0) {
                        return genderHtml = '未知的性别';
                    } else if (row.userGender == 1) {
                        return genderHtml = '男性';
                    } else if (row.userGender == 2) {
                        return genderHtml = '女性';
                    } else if (row.userGender == 5) {
                        return genderHtml = '女性改(变)为男性';
                    } else if (row.userGender == 6) {
                        return genderHtml = '男性改(变)为女性';
                    } else if (row.userGender == 9) {
                        return genderHtml = '未说明的性别';
                    } else {
                        return genderHtml = '';
                    }
                }
            }, {
                field: 'jgxxgajgjgmc',
                title: '部门'
            }, {
                field: 'userPhone',
                title: '手机'
            }, {
                field: '',
                title: '操作',
                minWidth: 80,
                align: 'center',
                fixed: 'right',
                toolbar: '#member-table-operate'
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
                "data": res.data.roleUserList //解析数据列表
            };
        }
    });

    table.on('toolbar(member-table-operate)', function (obj) {
        //console.log(obj);
        if (obj.event === 'del') {
            active.getCheckData();
        } else if (obj.event === 'add') {
            localStorage.setItem("currentOrgCodeTree", loginuserinfo.userJGDM);
            localStorage.setItem("chirdOrgCodeTree", "-1");
            localStorage.setItem("queryTypeTree", loginuserinfo.querytypeItem);
            localStorage.setItem("orgListQueryTypeEq4Tree", loginuserinfo.models);
            layer.open({
                title: '选择成员',
                type: 2,
                move: false,
                // area: [extension.getDialogSize().width, extension.getDialogSize().height],
                area: ['800px', '580px'],
                resize: false,
                // content: ['/html/system/institutions/select_institutions.html?tree_type=more&mode=getUser', "no"],
                content: ['/html/system/role/membership_add.html', "no"],
                btn: ['确定', '取消'],
                yes: function (index, layero) {
                    var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                    var body = layer.getChildFrame('body', index);
                    body.find("#save_choose").click();
                    var userlistData = iframeWin.choosePersonInfo();
                    if(userlistData.length == 0){
                        // layer.msg("请至少勾选一个成员");
                        return
                    }
                    // var org = iframeWin.getSelectOrg();
                    // //console.log(org);
                    // if (org == "") {
                    //     layer.msg("请至少勾选一个成员");
                    //     return
                    // }
                    // var userlistData = [];
                    // for (var i = 0; i < org.length; i++) {
                    //     var obj = {
                    //         "userId": org[i].treeId,
                    //         "userPoliceId": org[i].treeId,
                    //         "userRealname": org[i].policeid,
                    //         "jgxxJgid": org[i].jgid,
                    //         "jgxxGajgjgdm": org[i].jgdm,
                    //         "jgxxgajgjgmc": org[i].jgmc
                    //     };
                    //     userlistData.push(obj);
                    // }
                    // //console.log(userlistData);
                    urlrelated.requestBody.data = {
                        "userList": userlistData,
                        "rmId": urldata.roleid,
                        "userId": loginuserinfo.userId,
                        "userPoliceId": loginuserinfo.policeId,
                        "jgxxJgid": loginuserinfo.JGID,
                        "jgxxGajgjgdm": loginuserinfo.userJGDM
                    }

                    $.ajax({
                        url: urlrelated.roleMemberSave,
                        type: "post",
                        async: true,
                        data: JSON.stringify(urlrelated.requestBody),
                        cache: false,
                        timeout: 120000,
                        contentType: "application/json;charset=UTF-8", //推荐写这个
                        dataType: "json",
                        success: function (res) {
                            //console.log(res);
                            if (res.status == 200) {
                                layer.msg("保存成功");
                                table.reload('member-table-page', {
                                    page: {
                                        curr: 1 //重新从第 1 页开始
                                    }
                                });
                            } else {
                                layer.msg(res.message);
                            }
                        },
                        error: function (xml, textstatus, thrown) {
                            extension.errorMessage(thrown);
                        }
                    });
                    layer.close(index);
                },
                success: function (layero, index) {
                    // var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                    // iframeWin.layui.initTree();
                }
            });
        }
    });
    table.on('tool(member-table-operate)', function (obj) {
        var data = obj.data;
        //console.log(obj);
        if (obj.event === 'del') {
            DeleteUser(data.iruId, null);
        }
    });
    //查询数据按钮
    form.on('submit(searchinfo)', function (data) {
        //console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
        //去除空格
        for (var key in data.field) {
            data.field[key] = $.trim(data.field[key]);
        }
        table.reload('member-table-page', {
            where: {
                data: {
                    userName: data.field.userName,
                    userRealname: data.field.userRealname
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
        $("#userRealname").val('');
        $("#userName").val('');
    });

    var DeleteUser = function (obj, userIdList) {
        layer.confirm('是否确定删除?', {
            icon: 3,
            title: '删除确认',
            resize: false
        }, function (index) {
            //do something
            if (obj != null) {
                var id = [];
                id.push(obj);
            } else {
                var id = userIdList;
            }
            //console.log(id)

            urlrelated.requestBody.data = {
                "iruIds": id
            }
            var loadingIndex = layer.load(1, {
                shade: 0.3
            });
            //console.log(deldata)
            $.ajax({
                url: urlrelated.roleMemberDelete,
                type: "post",
                async: true,
                data: JSON.stringify(urlrelated.requestBody),
                cache: false,
                timeout: 120000,
                contentType: "application/json;charset=UTF-8", //推荐写这个
                dataType: "json",
                success: function (res) {
                    layer.close(loadingIndex);
                    //console.log(res);
                    if (res.status == 200) {
                        table.reload('member-table-page', {
                            where: {
                                data: {
                                    "rmId": urldata.roleid
                                }
                            },
                            page: {
                                curr: 1 //重新从第 1 页开始
                            }
                        });
                        layer.msg("删除成功");
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