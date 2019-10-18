layui.use(['table', 'form', 'extension', 'urlrelated'], function () {
    var laydate = layui.laydate,
        extension = layui.extension,
        table = layui.table,
        $ = layui.$,
        layer = layui.layer,
        form = layui.form,
        urlrelated = layui.urlrelated;
    form.render();
    $("#querytype").val(localStorage.getItem("querytypeItem"));
    $("body", parent.document).find('#sub-title').html('数据字典');
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

    urlrelated.requestBody.data = {
        "ctDecrible": ""
    }
    table.render({
        elem: '#dictionary-table-page',
        toolbar: "#table-hreader",
        url: urlrelated.irisCodeList,
        method: 'post',
        even: true,
        contentType: "application/json;charset=UTF-8" //推荐写这个
            ,
        where: urlrelated.requestBody,
        defaultToolbar: ['filter'],
        limits: [10, 20, 30],
        cols: [
            [{
                field: 'ctDecrible',
                title: '字典名称'
            }, {
                field: 'ctId',
                title: '字典编号'
            }, {
                field: 'cdDt',
                minWidth: 165,
                title: '更新时间'
            }, {
                field: 'ctRemark',
                title: '备注'
            }, {
                field: '',
                minWidth: 165,
                align: 'center',
                fixed: 'right',
                title: '操作',
                toolbar: '#dictionary-table-operate'
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
                "data": res.data.records //解析数据列表
            };
        }
    });
    // var tableData;
    // function getInfo(){
    //     var data = $.extend(true, {}, requestData);
    //     data['page'] = 1;
    //     data['limit'] = 10;
    //     data = JSON.stringify(data);
    //     $.ajax({
    //         url: urlrelated.irisCodeList,
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
        table.reload('dictionary-table-page', {
            where: {
                data: {
                    ctDecrible: data.field.ctDecrible
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
        $("#ctDecrible").val('');
    });
    table.on('tool(dictionary-table-operate)', function (obj) {
        var data = obj.data;
        //console.log(obj);
        if (obj.event === 'edit') {
            changeDictionary(false, data)
        } else if (obj.event === 'del') {
            DeleteUser(data.ctId, null);
        } else if (obj.event === 'manage') {
            DictionaryManage(data.ctId);
        }
    });
    table.on('toolbar(dictionary-table-operate)', function (obj) {
        //console.log(obj);
        if (obj.event === 'add') {
            changeDictionary(true, null)
        }
    });

    function changeDictionary(isadd, info) {
        var changeData = "add";
        var titleinfo = "添加字典";
        if (isadd) {
            changeData = "add";
        } else {
            changeData = "edit";
            titleinfo = "编辑字典";
        }
        var isclickyes = false;
        layer.open({
            title: '<span style="font-weight: 650;font-size: 16px;">' + titleinfo + '</span>',
            type: 2,
            move: false,
            area: [extension.getDialogSize().width, extension.getDialogSize().height],
            resize: false,
            content: ['/html/system/dictionary/add_dictionary.html?type=' + changeData, "no"],
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                var body = layer.getChildFrame('body', index);
                body.find("#changeSubmit").click();
                isclickyes = true;
                // layer.close(index);
            },
            btn2: function (index, layero) {
                isclickyes = false;
            },
            success: function (layero, index) {
                var body = layer.getChildFrame('body', index);
                if (isadd == false) {
                    body.find('#ctDecrible').val(info.ctDecrible);
                    body.find('#ctId').val(info.ctId);
                    body.find('#ctId').attr('disabled', true);
                    body.find('#ctRemark').val(info.ctRemark);
                }
                if (extension.getDialogSize().height == "370px") {
                    body.find("form").css("padding-top", "50px");
                }
            },
            end: function () {
                if (isclickyes) {
                    table.reload('dictionary-table-page', {
                        page: {
                            curr: 1 //重新从第 1 页开始
                        }
                    });
                }
            }
        });
    }
    //打开键值管理弹出层
    function DictionaryManage(cdId) {
        var btnArray = ['确定', '取消'];
        if (localStorage.rolesName == "超级管理员") {
            btnArray = ['确定', '取消'];
        } else {
            btnArray = ['取消'];
        }
        layer.open({
            title: '<span style="font-weight: 650;font-size: 16px;">键值管理</span>',
            type: 2,
            move: false,
            area: ['800px', '580px'],
            resize: false,
            content: ['/html/system/dictionary/dictionary_manage.html?id=' + cdId, "no"],
            btn: btnArray,
            yes: function (index, layero) {
                //按钮【按钮一】的回调
                if (localStorage.rolesName != "超级管理员") {
                    layer.close(index);
                    return
                }
                var body = layer.getChildFrame('body', index);
                body.find("#save_change").click();
                var allowsubmit = $(layero).find("iframe")[0].contentWindow.isallowsubmit;
                if (allowsubmit == false) {
                    // $(layero).find("iframe")[0].contentWindow.isallowsubmit = true;
                    return;
                }
                var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                var data = iframeWin.SaveChangeData();
                // console.log(data)
                urlrelated.requestBody.data = {
                    "codeList": data.data.codeList,
                    "ctId": data.data.ctId
                }
                var loadingIndex = layer.load(1, {
                    shade: 0.3
                });
                $.ajax({
                    url: urlrelated.irisCodeCodeList,
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
                            layer.msg("保存成功");
                            layer.close(index);
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

            },
            btn2: function (index, layero) {
                //按钮【按钮一】的回调

            },
            success: function (layero, index) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                //滚动条
                var add_scroll_section = iframeWin.document.getElementsByClassName("section");
                // $(add_scroll_section).css('overflow-y', 'auto');
                var iframe_height = iframeWin.innerHeight;
                $(add_scroll_section).css('height', iframe_height);
            }
        });
    }

    var DeleteUser = function (obj) {
        layer.confirm('是否确定删除?', {
            icon: 3,
            title: '删除确认',
            resize: false
        }, function (index) {
            //console.log(obj)
            urlrelated.requestBody.data = {
                "ctId": obj
            }
            var loadingIndex1 = layer.load(1, {
                shade: 0.3
            });
            $.ajax({
                url: urlrelated.irisCodeDelete,
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
                        top.layer.msg("删除成功");
                        table.reload('dictionary-table-page', {
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
    }
});