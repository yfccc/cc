layui.use(['urlrelated', 'laydate', 'table', 'form', 'extension'], function () {
    var laydate = layui.laydate,
        urlrelated = layui.urlrelated,
        table = layui.table,
        $ = layui.$,
        extension = layui.extension,
        layer = layui.layer,
        form = layui.form,
        userInfo = extension.getUserInfo(),
        pagepower = extension.getPagePower("批量查询");
    $(document).on("keydown", function (event) {
        var ev = event || window.event; //获取event对象 
        var obj = ev.target || ev.srcElement; //获取事件源 
        var t = obj.type || obj.getAttribute('type'); //获取事件源类型 
        var code = event.keyCode || event.which;
        if ((code == 13 || code == 8) && t != "password" && t != "text" && t != "textarea") {
            return false;
        }
    });
    //获取容器宽度
    var w = $("#LAY-component-grid-all").width();
    //更改table的宽度
    var p = w - 278.83 - 10;
    $("#bottom_table").width(p + "px");
    $(window).resize(function () {
        var w = $("#LAY-component-grid-all").width();
        //更改table的宽度
        var p = w - 278.83 - 10;
        $("#bottom_table").width(p + "px");
    });

    $("#querytype").val(localStorage.getItem("querytypeItem"));

    //日期范围
    laydate.render({
        elem: '#test-laydate-range-date',
        range: '~',
        max: 0,
        trigger: "click",
        theme: '#2F4056' //设置主题颜色
        ,
        done: function (value, date, endDate) {

            // if(isIE89()){
            //     if(value !== ""){
            //         $(".qssj").css("display","none")
            //     }
            //     if(value == ""){
            //         $(".qssj").css("display","block")
            //     }
            // }
        }
    });

    //组织机构点击
    $("#select_org").on("click", function () {
        localStorage.setItem("currentOrgCodeTree", userInfo.userJGDM);
        localStorage.setItem("chirdOrgCodeTree", "-1");
        localStorage.setItem("queryTypeTree", userInfo.querytypeItem);
        localStorage.setItem("orgListQueryTypeEq4Tree", userInfo.models);
        layer.open({
            title: '选择机构',
            type: 2,
            move: false,
            area: [extension.getDialogSize().width, extension.getDialogSize().height],
            resize: false,
            content: ['/html/system/institutions/select_institutions.html?tree_type=single', "no"],
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                //按钮【按钮一】的回调
                var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                //获取选中的组织机构
                var org = iframeWin.getSelectOrg();
                $("#jgxxGajgjgdm").val(org[0].treeId);
                $("#jgxxGajgjgname").val(org[0].title);
                layer.close(index);
            },
            btn2: function (index, layero) {

            },
            success: function (layero, index) {

            }
        });
    });

    urlrelated.requestBody.data = {
        "hmcjPpjgbdm": "2,1,3,4,5,6",
        "sfxxcjCyzjZjhm": "",
        "userJGDM": userInfo.userJGDM,
        "cjjg": "",
        "cards": "",
        "queryType": pagepower.queryType,
        "notifiedBody": pagepower.queryType == 4 ? pagepower.notifiedBodyStr : ""
    };

    function tablerender(requestData) {
        table.render({
            elem: '#record_pl_search',
            defaultToolbar: ['filter'],
            url: urlrelated.irisrecordbatchList,
            method: 'post',
            toolbar: "#download",
            contentType: "application/json;charset=UTF-8",
            where: requestData,
            limits: [10, 20, 30],
            even: true,
            cols: [
                [{
                    field: 'cjsj',
                    minWidth: 180,
                    title: '采集时间'
                }, {
                    field: 'jgxxGajgjgmc',
                    minWidth: 190,
                    title: '组织机构名称'
                }, {
                    field: 'sfxxcjXm',
                    minWidth: 80,
                    title: '姓名'
                }, {
                    field: 'xb',
                    minWidth: 80,
                    title: '性别'
                }, {
                    field: 'zjdm',
                    minWidth: 90,
                    title: '证件类型'
                }, {
                    field: 'sfxxcjCyzjZjhm',
                    minWidth: 190,
                    title: '证件号',
                    templet: function (row) {
                        if (row.zjdm == "无证件") {
                            return "-";
                        } else {
                            return row.sfxxcjCyzjZjhm;
                        }
                    }
                }, {
                    field: 'hmcjCjbh',
                    minWidth: 280,
                    title: '采集编号'
                }, {
                    field: 'zyydm',
                    minWidth: 80,
                    title: '单/双眼'
                }, {
                    field: 'ryfl',
                    minWidth: 180,
                    title: '人员分类',
                    hide: true
                }, {
                    field: 'mz',
                    minWidth: 110,
                    title: '民族',
                    hide: true
                }, {
                    field: 'csrq',
                    minWidth: 120,
                    title: '出生日期',
                    hide: true
                }, {
                    field: 'gj',
                    minWidth: 120,
                    title: '国籍',
                    hide: true
                }, {
                    field: 'sfxxcjLxdh1',
                    minWidth: 120,
                    title: '手机号',
                    hide: true
                }, {
                    field: 'deviceManufacturer',
                    minWidth: 170,
                    title: '设备厂商名称'
                }, {
                    field: 'userRealname',
                    minWidth: 140,
                    title: '操作人'
                }, {
                    field: 'hmcjCjcdmc',
                    minWidth: 120,
                    title: '采集地点',
                    hide: true
                }, {
                    field: 'cjjg',
                    minWidth: 100,
                    title: '采集结果'
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
                    "data": res.data.data //解析数据列表
                };
            }
        });
    }
    tablerender(urlrelated.requestBody);
    form.on("submit(gather_record_pl_filter)", function (obj) {

        if ($("input:checkbox[name='cjjg']:checked").length <= 0) {
            layer.msg("请勾选查询条件", {
                icon: 5,
                shift: 6
            });
            return false;
        }
        var cjjg = "";
        $("input:checkbox[name='cjjg']:checked").each(function (i, e) {
            cjjg += $(e).val() + ",";
        })
        cjjg = cjjg.substring(0, cjjg.length - 1);

        var idcards = $("#cards").val();
        var idarrs = idcards.split('\n');
        idcardstr = idarrs.join('\n');
        obj.field["sfxxcjCyzjZjhm"] = idcardstr;
        obj.field["hmcjPpjgbdm"] = cjjg;
        //去除空格
        for (var key in obj.field) {
            obj.field[key] = $.trim(obj.field[key]);
        }
        //赋值给requestbody 导出用
        $.extend(urlrelated.requestBody.data, obj.field);
        table.reload('record_pl_search', {
            where: {
                data: urlrelated.requestBody.data
            },
            page: {
                curr: 1 //重新从第 1 页开始
            }
        });
        return false;
    });

    table.on('toolbar(pl_tab)', function (obj) {
        var layEvent = obj.event;
        if (layEvent === "export") {
            var loadingicon = layer.load(1, {
                shade: 0.3
            })
            if (obj.config.page.count > 0) {
                var fieldstr = "";
                //拼接字段
                var colarr = obj.config.cols[0] || [];
                $.each(colarr, function (index, item) {
                    fieldstr += item.hide ? "" : item.field + ",";
                });
                if (fieldstr != "") {
                    fieldstr = fieldstr.substring(0, fieldstr.length - 1);
                    var urlstr = urlrelated.exportBatchList + "/" + fieldstr;
                    $.ajax({
                        url: urlstr,
                        type: "post",
                        async: true,
                        data: JSON.stringify(urlrelated.requestBody),
                        contentType: "application/json",
                        success: function (res) {
                            layer.close(loadingicon);
                            if (res.status === 200) {
                                var $a = $("<a></a>");
                                $a.attr("download", "");
                                $a.attr("href", urlrelated.downloadUrlPre + res.data.fileName);
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
                        }
                    });
                } else {
                    layer.close(loadingicon);
                    layer.msg("请选中要导出的列");
                }
            } else {
                layer.close(loadingicon);
                layer.msg("暂无数据");
            }
        }
    })

    //重置
    $("#reset_btn").on('click', function () {
        $("#gather_record_form")[0].reset();
        form.render();
    })

});