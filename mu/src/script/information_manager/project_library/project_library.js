layui.use(['element', 'laydate', 'table', 'form', 'urlrelated', 'extension', 'upload'], function () {
    var laydate = layui.laydate,
        urlrelated = layui.urlrelated,
        table = layui.table,
        $ = layui.$,
        layer = layui.layer,
        form = layui.form,
        element = layui.element,
        upload = layui.upload,
        extension = layui.extension,
        userInfo = extension.getUserInfo(),
        pagepower = extension.getPagePower("专题库管理");
    $("body", parent.document).find('#sub-title').html('专题库管理');
    $("#querytype").val(localStorage.getItem("querytypeItem"))
    // 防止页面后退
    $(document).on("keydown", function (event) {
        var ev = event || window.event; //获取event对象 
        var obj = ev.target || ev.srcElement; //获取事件源 
        var t = obj.type || obj.getAttribute('type'); //获取事件源类型 
        var code = event.keyCode || event.which;
        if ((code == 13 || code == 8) && t != "password" && t != "text" && t != "textarea") {
            return false;
        }
    });
    var project_details = '';
    form.render();
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var date = d.getDate();
    var day = d.getDay();
    var curDateTime = year;
    if (month > 9)
        curDateTime = curDateTime + "-" + month;
    else
        curDateTime = curDateTime + "-0" + month;
    if (date > 9)
        curDateTime = curDateTime + "-" + date;
    else
        curDateTime = curDateTime + "-0" + date;

    urlrelated.requestBody.data = {
        "name": "",
        "userJGDM": userInfo.userJGDM,
        "queryType": pagepower.queryType,
        "notifiedBody": pagepower.queryType == 4 ? pagepower.notifiedBody : []
    };

    table.render({
        elem: '#project_tab',
        url: urlrelated.speciallist,
        method: 'post',
        contentType: "application/json;charset=UTF-8",
        where: urlrelated.requestBody,
        limits: [10, 20, 30],
        // height: "full - 200",
        toolbar: "#download",
        defaultToolbar: ['filter'],
        even: true,
        cols: [
            [{
                type: 'checkbox'
            }, {
                field: 'isName',
                minWidth: 130,
                title: '名称'
            }, {
                field: 'count',
                minWidth: 30,
                title: '人数'
            }, {
                field: 'createTimeStr',
                minWidth: 180,
                title: '创建时间'
            }, {
                field: 'updateTimeStr',
                minWidth: 180,
                title: '最后修改时间'
            }, {
                field: 'userName',
                minWidth: 110,
                title: '操作员'
            }, {
                field: 'version',
                minWidth: 125,
                title: '版本号'
            }, {
                field: 'isWarn',
                minWidth: 200,
                title: '是否报警',
                templet: function (row) {
                    if (row.isWarn == 1) {
                        return "报警"
                    } else if (row.isWarn == 0) {
                        return "不报警";
                    }
                }
            }, {
                field: 'isDescrible',
                minWidth: 180,
                title: '描述'
            }, {
                minWidth: 210,
                align: 'center',
                fixed: 'right',
                toolbar: "#edit",
                title: '操作'
            }]
        ],
        page: true,
        loading: true,
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
        },
        done: function () {
            var $table = $("#box_height").find(".layui-table-box");
            var height = parseInt($table.find(".layui-table-body").css("height"));
            $table.css("height", height + 38 + "px");
        }
    });
    //查询
    form.on('submit(project_lib_filter)', function (obj) {
        //去除空格
        for (var key in obj.field) {
            obj.field[key] = $.trim(obj.field[key]);
        }
        table.reload('project_tab', {
            where: {
                data: obj.field
            },
            page: {
                curr: 1 //重新从第 1 页开始
            }
        });
        return false;
    });

    //重置
    $("#project_lib_reset_btn").on('click', function () {
        $("#project_lib_form")[0].reset();
        form.render();
    })
    //    弹窗大小
    var iris_width, iris_height;
    var wiodeWidth = $(window).width();
    if (wiodeWidth < 1130) {
        iris_width = 520 + "px", iris_height = 370 + "px"
    } else {
        iris_width = 755 + "px", iris_height = 430 + "px"
    }

    table.on("tool(project_tab_filter)", function (obj) {

        var Pdata = obj.data;
        var layEvent = obj.event;
        switch (layEvent) {
            case "edit":
                var isRefresh = false;
                layer.open({
                    title: '编辑专题库',
                    type: 2,
                    area: [iris_width, iris_height],
                    resize: false,
                    content: ['./add_project_library.html?isId=' + Pdata.isId + '&layEvent=edit', "no"],
                    btn: ['确定', '取消'],
                    yes: function (index, layero) {
                        //按钮【按钮一】的回调
                        var body = layer.getChildFrame('body', index);
                        //模拟提交表单
                        isRefresh = true;
                        body.find("#add_library_submit").click();
                    },
                    btn2: function (index, layero) {
                        //按钮【按钮一】的回调
                        isRefresh = false;
                    },
                    success: function (layero, index) {

                    },
                    end: function () {
                        if (isRefresh) {
                            table.reload('project_tab', {
                                page: {
                                    curr: 1
                                }
                            });
                        }
                    }
                });
                break;
            case "del":
                if (layEvent == "del") {
                    layer.confirm('是否确定删除?', {
                        resize: false,
                        icon: 3,
                        title: '删除确认'
                    },
                        function (index) {
                            var loadingicon = layer.load(1, {
                                shade: 0.3
                            })
                            var isId = Pdata.isId;
                            urlrelated.requestBody.data = {
                                "userId": userInfo.userId,
                                "isId": isId
                            };
                            $.ajax({
                                url: urlrelated.specialdelete,
                                type: "post",
                                dataType: "json",
                                timeout: 120000,
                                async: true,
                                data: JSON.stringify(urlrelated.requestBody),
                                contentType: "application/json",
                                success: function (res) {
                                    layer.close(loadingicon);
                                    if (res.status === 200) {
                                        top.layer.msg("删除成功！");
                                        urlrelated.requestBody.data = {
                                            "name": "",
                                            "userJGDM": userInfo.userJGDM,
                                            "queryType": pagepower.queryType,
                                            "notifiedBody": pagepower.queryType == 4 ? pagepower.notifiedBody : []
                                        };
                                        table.reload('project_tab', {
                                            page: {
                                                curr: 1 //重新从第 1 页开始
                                            }
                                        });
                                        //清空下拉缓存
                                        extension.removeDropDownList();
                                    } else {
                                        layer.msg("删除失败！");
                                    }
                                },
                                error: function (XMLHttpRequest, textStatus, errorThrown) {
                                    layer.close(loadingicon);
                                    extension.errorMessage(errorThrown);
                                },
                                complete: function (XMLHttpRequest, textStatus) {
                                    layer.close(loadingicon);
                                    urlrelated.requestBody.data.isId = "";
                                    urlrelated.requestBody.data = {
                                        "name": "",
                                        "userJGDM": userInfo.userJGDM,
                                        "queryType": pagepower.queryType,
                                        "notifiedBody": pagepower.queryType == 4 ? pagepower.notifiedBody : []
                                    };
                                }
                            })
                            layer.close(index);
                        });
                }
                break;
            case "person_manage":
                location.href = "./project_person_manage.html?isId=" + Pdata.isId;
                break;
        }
    });
    table.on('toolbar(project_tab_filter)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        var data = checkStatus.data;
        switch (obj.event) {
            case 'add':
                var flag = false;
                layer.open({
                    title: '添加专题库',
                    type: 2,
                    area: [iris_width, iris_height],
                    resize: false,
                    content: ['./add_project_library.html?isId=0&layEvent=add', "no"],
                    btn: ['确定', '取消'],
                    yes: function (index, layero) {
                        //按钮【按钮一】的回调
                        var body = layer.getChildFrame('body', index);
                        flag = true;
                        //模拟提交表单
                        body.find("#add_library_submit").click();
                    },
                    btn2: function (index, layero) {
                        //按钮【按钮一】的回调
                        flag = false;
                    },
                    success: function (layero, index) {

                    },
                    end: function () {
                        if (flag) {
                            table.reload('project_tab', {
                                page: {
                                    curr: 1
                                }
                            });
                        }
                    }
                });
                break;
            case 'export':
                var loadingicon = layer.load(1, {
                    shade: 0.3
                })
                if (data.length > 0) {
                    var ids = [];
                    $.each(data, function (i, e) {
                        ids.push(e.isId);
                    })
                    urlrelated.requestBody.data = {
                        "ids": ids
                    };
                    $.ajax({
                        url: urlrelated.exportSpecialJson,
                        type: "post",
                        async: true,
                        data: JSON.stringify(urlrelated.requestBody),
                        cache: false,
                        contentType: "application/json;charset=UTF-8",
                        dataType: "json",
                        timeout: 600000,
                        success: function (res) {
                            layer.close(loadingicon);
                            if (res.status === 200) {
                                var $a = $("<a></a>");
                                $a.attr("download", "");
                                $a.attr("href", urlrelated.downloadUrlpro + res.data.name);
                                $("body").append($a);
                                $a[0].click();
                                $a.remove();
                            } else {
                                layer.msg(res.message);
                            }
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            layer.close(loadingicon);
                            extension.errorMessage(errorThrown);
                        },
                        complete: function (XMLHttpRequest, textStatus) {
                            layer.close(loadingicon);
                            delete urlrelated.requestBody.data.ids;
                        }
                    });
                } else {
                    layer.close(loadingicon);
                    layer.msg("请选中要导出的项！");
                }
                break;
            case 'export_all':
                layer.msg('非法操作');
                break;
        }
    });
    // urlrelated.requestBody["userPoliceId"] = userInfo.policeId;
    upload.render({ //允许上传的文件后缀
        elem: '#importfile',
        url: urlrelated.importDeviceData + '?userPoliceId=' + userInfo.policeId + '&userId=' + userInfo.userId,
        accept: 'file',
        // multiple: true,
        field: 'files',
        headers: { token: localStorage.token },
        data: urlrelated.requestBody,
        exts: 'xls|excel|xlsx',
        auto: true,
        done: function (res) {
            urlrelated.requestBody.data = {
                "name": "",
                "userJGDM": userInfo.userJGDM,
                "queryType": pagepower.queryType,
                "notifiedBody": pagepower.queryType == 4 ? pagepower.notifiedBody : []
            };
            if (res.status == 200) {
                layer.open({
                    title: '导入人员信息',
                    type: 2,
                    move: false,
                    area: ['755px', '430px'],
                    resize: false,
                    content: ['/html/information_manager/project_library/project_library_import.html', "no"],
                    btn: ['确定', '取消'],
                    yes: function (index, layero) {
                        var body = layer.getChildFrame('body', index);
                        // body.find("#import_submit").click();
                        return
                        // layer.close(index);
                    },
                    success: function (layero, index) {
                        var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                        iframeWin.changeData(res.data);
                        // layer.iframeAuto(index);
                    }
                });
            } else {
                layer.msg(res.message);
            }

        }, error: function () {
            urlrelated.requestBody.data = {
                "name": "",
                "userJGDM": userInfo.userJGDM,
                "queryType": pagepower.queryType,
                "notifiedBody": pagepower.queryType == 4 ? pagepower.notifiedBody : []
            };
            layer.msg("上传过程中出现问题");
        }
    });
});



function RenderDataVal(body, idpre, result) {
    $.each(result, function (item, val) {
        body.find("#" + idpre + item).val(val); //给弹出层页面赋值，id为对应弹出层表单id
    });
}

function RenderDataText(body, idpre, result) {
    $.each(result, function (item, val) {
        body.find("#" + idpre + item).text(val); //给弹出层页面赋值，id为对应弹出层表单id
    });
}