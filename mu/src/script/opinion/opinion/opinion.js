layui.use(['table', 'form', "laydate", "extension", "urlrelated"], function () {
    var laydate = layui.laydate,
        element = layui.element,
        table = layui.table,
        $ = layui.$,
        layer = layui.layer,
        form = layui.form,
        extension = layui.extension,
        urlrelated = layui.urlrelated,
        startTime = "",
        endTime = "",
        adviceType = "",
        dropDownList = extension.getDropDownList() //获取下拉框信息
        ,
        loginuserinfo = extension.getUserInfo(); //获取登录用户信息
    form.render();
    $("#querytype").val(localStorage.getItem("querytypeItem"));
    $("body", parent.document).find('#sub-title').html('意见管理');
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
    // console.log(powerControl);

    // 循环生成下拉框结构
    function eachData(list, data) {
        var html = '<option value="">请选择</option>';
        $.each(data, function (i, item) {
            if (item.codeIndex != null && typeof item.codeIndex != "undefined" && item.codeIndex != "") {
                html += '<option value="' + item.codeIndex + '">' + item.codeName + '</option>'
            } else {
                html += '<option value="' + item.codeName + '">' + item.codeName + '</option>'
            }
        });
        list.html(html);
    }
    // 循环出上面的检索项的下拉选项
    eachData($("select[name='adviceType']"), dropDownList.yjlbList); //意见类别
    form.render("select");

    //查询数据按钮
    form.on('submit(searchinfo)', function (data) {
        //data.field); //当前容器的全部表单字段，名值对形式：{name: value}
        startTime = data.field.sjsj.substr(0, 10);
        endTime = data.field.sjsj.substr(13);
        //去除空格
        for (var key in data.field) {
            data.field[key] = $.trim(data.field[key]);
        }
        adviceType = data.field.adviceType;
        table.reload('opintion-table-page', {
            where: {
                data: {
                    sjsjStart: startTime,
                    sjsjEnd: endTime,
                    adviceType: adviceType
                }
            },
            page: {
                curr: 1 //重新从第 1 页开始
            }
        });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
    $("#reset_btn").on("click", function () {
        $("#JK")[0].reset();
        form.render();
    });

    //获取当前登录用户的权限
    var pagepower = extension.getPagePower("意见管理");

    urlrelated.requestBody.data = {
        "sjsjStart": startTime,
        "sjsjEnd": endTime,
        "adviceType": adviceType,
        "userJGDM": loginuserinfo.userJGDM,
        "queryType": pagepower.queryType,
        "notifiedBody": pagepower.notifiedBodyStr
    }
    var info = table.render({
        elem: '#opintion-table-page',
        toolbar: "#table-hreader",
        url: urlrelated.adviceList,
        method: 'post',
        even: true,
        defaultToolbar: ['filter'],
        contentType: "application/json;charset=UTF-8" //推荐写这个
            ,
        where: urlrelated.requestBody,
        limits: [10, 20, 30],
        cols: [
            [{
                field: 'type',
                title: '意见类别'
            }, {
                field: 'userRealname',
                title: '提交人'
            }, {
                field: 'adviceTime',
                minWidth: 165,
                title: '提交时间'
            }, {
                field: '',
                title: '操作',
                minWidth: 140,
                align: 'center',
                fixed: 'right',
                toolbar: '#opintion-table-operate'
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

    table.on('tool(opintion-table-operate)', function (obj) {
        var data = obj.data;
        //console.log(obj);
        if (obj.event === 'detail') {
            window.location.href = "view_opinion_details.html?id=" + data.adviceId;
        } else if (obj.event === 'del') {
            DeleteOpinion(data.adviceId, null);
        }
    });
    table.on('toolbar(opintion-table-operate)', function (obj) {
        var data = obj.data;
        //console.log(obj);
        if (obj.event === 'export') {
            if (obj.config.page.count > 0) {
                urlrelated.requestBody.data = {
                    "sjsjStart": startTime,
                    "sjsjEnd": endTime,
                    "adviceType": adviceType,
                    "userJGDM": loginuserinfo.userJGDM,
                    "queryType": pagepower.queryType,
                    "notifiedBody": pagepower.notifiedBodyStr
                }
                var loadingIndex = layer.load(1, {
                    shade: 0.3
                });
                $.ajax({
                    url: urlrelated.exportAdviceList,
                    type: "post",
                    async: true,
                    data: JSON.stringify(urlrelated.requestBody),
                    cache: false,
                    timeout: 120000,
                    contentType: "application/json;charset=UTF-8", //推荐写这个
                    dataType: "json",
                    success: function (res) {
                        if (res.status == 200) {
                            // layer.msg("导出成功");
                            layer.close(loadingIndex);
                            var url = urlrelated.downloadUrlPre + res.data.fileName;
                            autoDownloadUrl(url);
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
            } else {
                layer.msg("暂无数据");
            }

        }
    });

    var DeleteOpinion = function (obj) {
        layer.confirm('是否确定删除?', {
            icon: 3,
            title: '删除确认',
            resize: false
        }, function (index) {

            urlrelated.requestBody.data = {
                "adviceId": obj
            }
            var loadingIndex1 = layer.load(1, {
                shade: 0.3
            });
            $.ajax({
                url: urlrelated.adviceDelete,
                type: "post",
                async: true,
                data: JSON.stringify(urlrelated.requestBody),
                cache: false,
                timeout: 120000,
                contentType: "application/json;charset=UTF-8", //推荐写这个
                dataType: "json",
                success: function (res) {
                    if (res.status == 200) {
                        layer.close(loadingIndex1);
                        layer.msg("删除成功");
                        urlrelated.requestBody.data = {
                            "sjsjStart": startTime,
                            "sjsjEnd": endTime,
                            "adviceType": adviceType,
                            "userJGDM": loginuserinfo.userJGDM,
                            "queryType": pagepower.queryType,
                            "notifiedBody": pagepower.notifiedBodyStr
                        }
                        table.reload('opintion-table-page', {
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
    //日期范围
    laydate.render({
        elem: '#startAndEndTime',
        range: '~',
        trigger: "click",
        max: 0,
        theme: '#2F4056' //设置主题颜色
            ,
        done: function (value, date, endDate) {
            // if (isIE89()) {
            //     if (value !== "") {
            //         $(".dateSpan").css("display", "none")
            //     }
            //     if (value == "") {
            //         $(".dateSpan").css("display", "block")
            //     }
            // }
        }
    });
    // function ExportXsl(){
    //     getInfo();
    //     table.exportFile("opintion-table-page", tableData);
    // }
    // ExportXsl();

    function autoDownloadUrl(url) {
        // 创建隐藏的可下载链接
        var downloadLink = document.createElement('a');
        downloadLink.style.display = 'none';
        downloadLink.href = url;
        // 触发点击
        document.body.appendChild(downloadLink);
        downloadLink.click();
        // 然后移除
        document.body.removeChild(downloadLink);
    };
});