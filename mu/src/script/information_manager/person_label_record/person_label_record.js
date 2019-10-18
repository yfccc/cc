layui.use(['table', 'form', 'extension', 'urlrelated'], function () {
    var urlrelated = layui.urlrelated,
        element = layui.element,
        extension = layui.extension,
        table = layui.table,
        $ = layui.$,
        layer = layui.layer,
        form = layui.form,
        userInfo = extension.getUserInfo(),
        pagepower = extension.getPagePower("人员标签管理");
    $("body", parent.document).find('#sub-title').html('人员标签管理');
    form.render();
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
    //获取表格数据
    urlrelated.requestBody.data = {
        "markName": "",
        "userJGDM": userInfo.userJGDM,
        "queryType": pagepower.queryType,
        "notifiedBody": pagepower.queryType == 4 ? pagepower.notifiedBody : []
    };
    table.render({
        elem: '#person_label_tab',
        url: urlrelated.personLabelList,
        method: 'post',
        contentType: "application/json;charset=UTF-8",
        toolbar: "#add",
        limits: [10, 20, 30],
        defaultToolbar: ['filter'],
        even: true,
        cols: [
            [{
                field: 'markName',
                title: '标签名称'
            }, {
                field: 'markPopulation',
                title: '人数',
                templet: function (d) {
                    return d.markPopulation == 0 ? d.markPopulation : '<a href="/html/information_manager/person/person.html?RYBQ=' + d.markId + '"style="color:blue;">' + d.markPopulation + '</a>'
                }
            }, {
                field: 'markDecrible',
                title: '描述'
            }, {
                title: '操作',
                align: 'center',
                toolbar: '#row_opt'
            }]
        ],
        loading: true,
        page: true,
        where: urlrelated.requestBody,
        response: {
            statusCode: 200 //重新规定成功的状态码为 200，table 组件默认为 0
        },
        parseData: function (res) { //将原始数据解析成 table 组件所规定的数据
            if (res.status != 200) {
                return {
                    "code": res.status, //解析接口状态
                    "msg": "暂无数据", //解析提示文本
                    "count": 0, //解析数据长度
                    "data": [] //解析数据列表
                }
            }
            return {
                "code": res.status, //解析接口状态
                "msg": res.message, //解析提示文本
                "count": res.data.count, //解析数据长度
                "data": res.data.marks //解析数据列表
            };
        }
    });

    $("#test_add_btn").on("click", function () {
        layer.open({
            title: '添加标签',
            type: 2,
            area: [extension.getDialogSize().width, extension.getDialogSize().height],
            resize: false,
            content: ['/html/information_manager/person_label_record/add_lable.html', "no"],
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                //按钮【按钮一】的回调
                layer.close(index);
            },
            btn2: function (index, layero) {
                //按钮【按钮一】的回调

            },
            success: function (layero, index) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                //设置card body的高度与实际iframe内部高度相同
                var card_body = iframeWin.document.getElementsByClassName("layui-card-body");
                $(card_body).css('height', iframeWin.innerHeight);
            }
        });
    });

    $("#test_edit_btn").on("click", function () {
        layer.open({
            title: '编辑标签',
            type: 2,
            moveType: 1,
            area: [extension.getDialogSize().width, extension.getDialogSize().height],
            resize: false,
            content: ['/html/information_manager/person_label_record/add_label.html', "no"],
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                //按钮【按钮一】的回调
                layero.content;
                layer.close(index);

            },
            btn2: function (index, layero) {
                //按钮【按钮一】的回调

            },
            success: function (layero, index) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                //设置card body的高度与实际iframe内部高度相同
                var card_body = iframeWin.document.getElementsByClassName("layui-card-body");
                $(card_body).css('height', iframeWin.innerHeight);
                var name_doc = iframeWin.document.getElementsByName("name");
                $(name_doc).val("模拟赋值名字");
                var desc_doc = iframeWin.document.getElementsByName("description");
                $(desc_doc).val("模拟赋值描述");
            }
        });
    });
    //监听表格头工具条
    table.on('toolbar(person_label_tab_filter)', function (obj) {
        if (obj.event === "add") {
            var flag = false;
            layer.open({
                title: '添加标签',
                type: 2,
                area: ['530px', '312px'],
                resize: false,
                content: ['/html/information_manager/person_label_record/add_label.html', "no"],
                btn: ['确定', '取消'],
                yes: function (index, layero) {
                    var body = layer.getChildFrame('body', index);
                    flag = true;
                    //模拟提交表单
                    //body.find("#add_label_submit").attr("data-event", "add");
                    body.find("#add_label_submit").click();
                },
                btn2: function (index, layero) {
                    flag = false;
                },
                success: function (layero, index) {
                    var iframeWin = window[layero.find('iframe')[0]['name']];
                    var body = layer.getChildFrame('body', index);
                    //模拟提交表单
                    body.find("#add_label_submit").attr("data-event", "add");
                    //设置高度等于iframe的高度
                    body.find(".layui-card").css("height", iframeWin.innerHeight);
                },
                end: function () {
                    if (flag) {
                        //刷新数据
                        table.reload('person_label_tab', {
                            page: {
                                curr: 1
                            }
                        });
                    }
                }
            });
        }
    });
    //监听表格行工具条
    table.on('tool(person_label_tab_filter)', function (obj) {
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值

        switch (layEvent) {
            case "edit": //编辑
                var isRefresh = false;
                layer.open({
                    title: '编辑标签',
                    type: 2,
                    area: ['530px', '312px'],
                    resize: false,
                    content: ['/html/information_manager/person_label_record/add_label.html', "no"],
                    btn: ['确定', '取消'],
                    yes: function (index, layero) {
                        var body = layer.getChildFrame('body', index);
                        isRefresh = true;
                        //模拟提交表单
                        body.find("#add_label_submit").attr("data-event", "edit");
                        body.find("#add_label_submit").click();
                    },
                    btn2: function (index, layero) {
                        isRefresh = false;
                    },
                    success: function (layero, index) {
                        var iframeWin = window[layero.find('iframe')[0]['name']];
                        //调用填值方法
                        iframeWin.add_label_setval(data.markId, data.markName, data.markDecrible);

                        var body = layer.getChildFrame('body', index);
                        //设置高度等于iframe的高度
                        body.find(".layui-card").css("height", iframeWin.innerHeight);
                        //设置提交按钮的值
                        body.find("#add_label_submit").attr("data-event", "edit");
                    },
                    end: function () {
                        if (isRefresh) {
                            //刷新数据
                            table.reload('person_label_tab', {
                                page: {
                                    curr: 1
                                }
                            });
                        }
                    }
                });
                break;
            case "del": //删除
                layer.confirm('是否确定删除?', {
                    resize: false,
                    icon: 3,
                    title: '删除确认'
                },
                    function (index) {
                        var loadingicon = layer.load(1, {
                            shade: 0.3
                        })
                        urlrelated.requestBody.data = {
                            "userId": userInfo.userId,
                            "imId": data.markId
                        };
                        $.ajax({
                            url: urlrelated.deleteLabel,
                            type: "post",
                            async: true,
                            data: JSON.stringify(urlrelated.requestBody),
                            cache: false,
                            contentType: "application/json;charset=UTF-8",
                            dataType: "json",
                            success: function (res) {
                                layer.close(loadingicon);
                                if (res.status === 200) {
                                    layer.msg("删除成功！");
                                    urlrelated.requestBody.data = {
                                        "markName": "",
                                        "userJGDM": userInfo.userJGDM,
                                        "queryType": pagepower.queryType,
                                        "notifiedBody": pagepower.queryType == 4 ? pagepower.notifiedBody : []
                                    };
                                    table.reload('person_label_tab', {
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
                                urlrelated.requestBody.data.imId = "";
                                urlrelated.requestBody.data = {
                                    "markName": "",
                                    "userJGDM": userInfo.userJGDM,
                                    "queryType": pagepower.queryType,
                                    "notifiedBody": pagepower.queryType == 4 ? pagepower.notifiedBody : []
                                };
                            }
                        });
                        layer.close(index);
                    });

                break;
        }
    });
    //查询
    form.on('submit(person_label_filter)', function (obj) {
        table.reload('person_label_tab', {
            where: {
                data: obj.field
            },
            page: {
                curr: 1 //重新从第 1 页开始
            }
        })
    })
    //重置
    $("#reset_btn").on('click', function () {
        $("#search_label_name").val("");
        form.render();
    });
});