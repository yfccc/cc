layui.use(['table', 'form', "layer", "urlrelated", "extension"], function () {
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
    $("#querytype").val(localStorage.getItem("querytypeItem"));
    $("body", parent.document).find('#sub-title').html('公告管理');

    //获取权限信息
    var powerControl = $("#querytype").val();
    //console.log(powerControl);

    //获取当前登录用户的权限
    var pagepower = extension.getPagePower("公告管理");

    urlrelated.requestBody.data = {
        "noticeTitle": "",
        "noticeStatus": "",
        "noticeType": "",
        "userJGDM": loginuserinfo.userJGDM,
        "queryType": pagepower.queryType,
        "notifiedBody": pagepower.notifiedBody
    }
    table.render({
        elem: '#sign-table-page',
        toolbar: "#table-hreader",
        url: urlrelated.noticeList,
        method: 'post',
        contentType: "application/json;charset=UTF-8" //推荐写这个
        ,where: urlrelated.requestBody,
        defaultToolbar: ['filter'],
        even: true,
        limits: [10, 20, 30],
        cols: [
            [
                // { type: "checkbox" },
                {
                    field: 'noticeId',
                    title: '公告编号'
                }, {
                    field: 'noticeTitle',
                    title: '标题'
                }, {
                    field: 'noticeDtStr',
                    minWidth: '180',
                    title: '修改时间'
                }, {
                    field: 'userRealname',
                    title: '最后修改人员'
                }, {
                    field: 'userName',
                    title: '接受对象',
                    templet: function (row) {
                        var stateHtml = '待定';
                        return stateHtml
                    }
                }, {
                    field: 'noticeTypeName',
                    title: '分类'
                }, {
                    field: 'noticeStatusName',
                    title: '发布状态'
                }, {
                    field: '',
                    title: '操作',
                    align: 'center',
                    fixed: 'right',
                    minWidth: '180',
                    toolbar: '#sign-table-operate'
                }
            ]
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
                "data": res.data.items //解析数据列表
            };
        }
    });
    table.on('tool(sign-table-operate)', function (obj) {
        var data = obj.data;
        //console.log(obj);
        if (obj.event === 'edit') {
            window.location.href = "change_sign.html?type=edit&id=" + data.noticeId;
        } else if (obj.event === 'del') {
            DeleteInfo(data.noticeId, null);
        } else if (obj.event === 'detail') {
            window.location.href = "see_sign.html?type=detail&id=" + data.noticeId;
        } else if (obj.event === 'release') {
            ReleaseSign(data.noticeId);
        }
    });
    //查询数据按钮
    form.on('submit(searchinfo)', function (data) {
        //去除空格
        for (var key in data.field) {
            data.field[key] = $.trim(data.field[key]);
        }
        //console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
        table.reload('sign-table-page', {
            where: {
                data: {
                    noticeTitle: data.field.noticeTitle,
                    noticeStatus: data.field.noticeStatus,
                    noticeType: data.field.noticeType
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
        $("#noticeTitle").val('');
        var select = 'dd[lay-value=""]';
        $('#noticeStatus').siblings("div.layui-form-select").find('dl').find(select).click();
        $("#noticeType").siblings("div.layui-form-select").find('dl').find(select).click();
    });
    // function getInfo() {
    //     requestData["page"] = 1;
    //     requestData["limit"] = 10;
    //     var data = JSON.stringify(requestData);
    //     $.ajax({
    //         url: urlrelated.noticeList,
    //         type: "post",
    //         async: false,
    //         data: data,
    //         cache:false,
    //         contentType: "application/json;charset=UTF-8",  //推荐写这个
    //         dataType: "json",
    //         success: function (res) {
    //             //console.log(res);
    //             tableData = res;
    //         },
    //         error: function (xml, textstatus, thrown) {
    //             extension.errorMessage(thrown);
    //         }
    //     })
    // }
    var DeleteInfo = function (obj) {
        layer.confirm('是否确定删除?', {
            icon: 3,
            title: '删除确认',
            resize: false
        }, function (index) {

            urlrelated.requestBody.data = {
                "noticeId": obj,
            }
            var loadingIndex1 = layer.load(1, {
                shade: 0.3
            });
            $.ajax({
                url: urlrelated.noticeDelete,
                type: "post",
                async: true,
                data: JSON.stringify(urlrelated.requestBody),
                cache: false,
                timeout: 120000,
                contentType: "application/json;charset=UTF-8", //推荐写这个
                dataType: "json",
                success: function (res) {
                    //console.log(res);
                    layer.close(loadingIndex1);
                    if (res.status == 200) {
                        layer.msg("删除成功");
                        urlrelated.requestBody.data = {
                            "noticeTitle": "",
                            "noticeStatus": "",
                            "noticeType": "",
                            "userJGDM": loginuserinfo.userJGDM,
                            "queryType": pagepower.queryType,
                            "notifiedBody": pagepower.notifiedBody
                        }
                        table.reload('sign-table-page', {
                            page: {
                                curr: 1 //重新从第 1 页开始
                            }
                        });
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
            layer.close(index);
        });
    };
    var ReleaseSign = function (obj) {
        layer.confirm('确定发布公告?', {
            icon: 3,
            title: '确认提示',
            resize: false
        }, function (index) {

            urlrelated.requestBody.data = {
                "noticeId": obj,
                "noticeStatus": "3"
            }
            var loadingIndex = layer.load(1, {
                shade: 0.3
            });
            $.ajax({
                url: urlrelated.noticeEditStatus,
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
                        layer.msg("发布成功");
                        urlrelated.requestBody.data = {
                            "noticeTitle": "",
                            "noticeStatus": "",
                            "noticeType": "",
                            "userJGDM": loginuserinfo.userJGDM,
                            "queryType": pagepower.queryType,
                            "notifiedBody": pagepower.notifiedBody
                        }
                        table.reload('sign-table-page', {
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