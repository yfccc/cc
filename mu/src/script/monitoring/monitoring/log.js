layui.use(['table', 'form', "element", "laydate", "urlrelated", "extension"], function () {
    var laydate = layui.laydate,
        element = layui.element,
        table = layui.table,
        $ = layui.$,
        layer = layui.layer,
        urlrelated = layui.urlrelated,
        extension = layui.extension,
        beginDate = "",
        endDate = "",
        tabIndex = 0,
        form = layui.form,
        dropDownList = extension.getDropDownList() //获取下拉框信息
        ,
        loginuserinfo = extension.getUserInfo(); //获取的登录获得的信息
    form.render();
    element.init();
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
    // console.log(powerControl);

    // 循环生成下拉框结构
    function eachData(list, data) {
        var html = '<option value="">请选择</option>';
        $.each(data, function (i, item) {
            if (item.codeIndex != null && typeof item.codeIndex != "undefined" && item.codeIndex != "") {
                html += '<option data-group="' + item.codeGroup + '" value="' + item.codeIndex + '">' + item.codeName + '</option>'
            } else {
                html += '<option value="' + item.codeName + '">' + item.codeName + '</option>'
            }
        });
        list.html(html);
    }
    // 循环出上面的检索项的下拉选项
    eachData($("select[name='igPlatform']"), dropDownList.platformList); //日志来源
    // eachData($("select[name='deviceTypeId']"), dropDownList.sbxhList);      //设备类型
    eachData($("select[name='igType']"), dropDownList.rzlxList); //日志类型
    eachData($("select[name='igxzType']"), dropDownList.xzrzlx); //日志类型-邢专

    form.render("select")

    //当日志来源变化的时候，设备类型根据条件筛选
    // form.on('select(igPlatform)', function (data) {
    //     var devicetype = "";
    //     // var groupid = data.elem[data.elem.selectedIndex].dataset.group;  //获取下拉框或者单选框的属性
    //     //设备类型
    //     devicetype += '<option value="" selected>请选择</option>';
    //     $.each(dropDownList.sbxhList, function (i, e) {
    //         if (data.value == "") {

    //             devicetype += '<option value="' + e.codeIndex + '">' + e.codeName + '</option>';
    //         } else {
    //             if (e.codeGroup == data.value) {
    //                 devicetype += '<option value="' + e.codeIndex + '">' + e.codeName + '</option>';
    //             }
    //         }
    //     });
    //     $("select[name='deviceTypeId']").html(devicetype);
    //     form.render('select');
    // })
    //日期范围
    laydate.render({
        elem: '#log-laydate-range-date',
        range: '~',
        trigger: "click",
        max: 0,
        theme: '#2F4056', //设置主题颜色
        done: function (value, date) {
            if (typeof value === "string" && value != "") {
                // var arr = value.split('~');
                // beginDate = arr[0];
                // endDate = arr[1];
                beginDate = value.substr(0, 10);
                endDate = value.substr(13);
            } else {
                beginDate = "";
                endDate = "";
            }
        }
    });
    //获取当前登录用户的权限
    var pagepower = extension.getPagePower("日志管理");

    urlrelated.requestBody.data = {
        "sjsjStart": beginDate,
        "sjsjEnd": endDate,
        "igDecrible": "",
        "igType": "",
        "igPlatform": "",
        // "deviceTypeId": "",
        "userJGDM": loginuserinfo.userJGDM,
        "queryType": pagepower.queryType,
        "notifiedBody": pagepower.notifiedBodyStr
    };
    urlrelated.requestBody["userId"] = loginuserinfo.userId;
    urlrelated.requestBody["userName"] = loginuserinfo.userName;

    //默认渲染第一个面板表格
    addCYTable(0, urlrelated.requestBody);
    //切换标签重新渲染table
    element.on('tab(identify_tab_filter)', function (data) {
        // //console.log(this); //当前Tab标题所在的原始DOM元素
        // //console.log(data.index); //得到当前Tab的所在下标
        // //console.log(data.elem); //得到当前的Tab大容器
        if (data.index == 0) {
            $("#igTypeParent,#logContent,#logPlatform").show();
            $("#igxzTypeParent,#typeParent,#thirdPartyName,#markType").hide();
            urlrelated.requestBody.data = {
                "sjsjStart": beginDate,
                "sjsjEnd": endDate,
                "igDecrible": "",
                "igType": "",
                "igPlatform": "",
                "deviceTypeId": "",
                "userJGDM": loginuserinfo.userJGDM,
                "queryType": pagepower.queryType,
                "notifiedBody": pagepower.notifiedBodyStr
            };
        } else if (data.index == 1) {
            $("#igxzTypeParent,#logContent,#logPlatform").show();
            $("#igTypeParent,#typeParent,#thirdPartyName,#markType").hide();
            urlrelated.requestBody.data = {
                "platform": "",
                "deviceType": "",
                "startDate": beginDate,
                "endDate": endDate,
                "requestType": "",
                "message": "",
                "userJGDM": loginuserinfo.userJGDM,
                "queryType": pagepower.queryType,
                "notifiedBody": pagepower.notifiedBody
            };
        } else if (data.index == 2) {
            $("#thirdPartyName,#typeParent,#markType").show();
            $("#igTypeParent,#igxzTypeParent,#logContent,#logPlatform").hide();
            urlrelated.requestBody.data = {
                "platform": "",
                "deviceType": "",
                "startDate": beginDate,
                "endDate": endDate,
                "requestType": "",
                "message": "",
                "userJGDM": loginuserinfo.userJGDM,
                "queryType": pagepower.queryType,
                "notifiedBody": pagepower.notifiedBody
            };
        }
        tabIndex = data.index;
        addCYTable(data.index, urlrelated.requestBody);
    });

    function addCYTable(tab_id, requestData) {
        switch (tab_id) {
            case 0:
                table.render({
                    elem: '#log-table-page',
                    url: urlrelated.selectLog,
                    method: 'post',
                    even: true,
                    defaultToolbar: ['filter'],
                    toolbar: true,
                    contentType: "application/json;charset=UTF-8", //推荐写这个
                    where: requestData,
                    toolbar: "#table-hreader",
                    limits: [10, 20, 30],
                    cols: [
                        [{
                                field: 'igDecrible',
                                minWidth: 80,
                                title: '日志内容'
                            }, {
                                field: 'igUrl',
                                minWidth: 80,
                                title: '请求URL'
                            }, {
                                field: 'userId',
                                minWidth: 80,
                                title: '操作人id'
                            }, {
                                field: 'userRealname',
                                minWidth: 100,
                                title: '操作人姓名'
                            }, {
                                field: 'mark',
                                minWidth: 60,
                                title: '异常',
                                templet: function (row) {
                                    var markHtml = '';
                                    if (row.mark == 0) {
                                        return markHtml = '成功';
                                    } else {
                                        return markHtml = '异常';
                                    }
                                }
                            }, {
                                field: 'igIp',
                                minWidth: 60,
                                title: 'IP'
                            }, {
                                field: 'timeConsume',
                                minWidth: 120,
                                title: '耗时（毫秒）'
                            }, {
                                field: 'rzlx',
                                minWidth: 80,
                                title: '日志类型'
                            }, {
                                field: 'sjly',
                                minWidth: 80,
                                title: '日志来源'
                            }
                            // , { field: 'sjlx', title: '设备类型' }
                            , {
                                field: 'igCreateTime',
                                minWidth: '165',
                                title: '创建时间'
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
                            "data": res.data.data //解析数据列表
                        };
                    }
                });
                break;
            case 1:
                table.render({
                    elem: '#log-table-page',
                    url: urlrelated.selectXZLogs,
                    method: 'post',
                    even: true,
                    toolbar: true,
                    defaultToolbar: ['filter'],
                    contentType: "application/json;charset=UTF-8", //推荐写这个
                    toolbar: "#table-hreader",
                    where: requestData,
                    limits: [10, 20, 30],
                    cols: [
                        [{
                            field: 'personId',
                            minWidth: 100,
                            title: '人员ID'
                        }, {
                            field: 'requestType',
                            minWidth: 100,
                            title: '请求类型',
                            templet: function (row) {
                                var requestTypeHtml = '';
                                if (row.requestType == 0) {
                                    return requestTypeHtml = '核验';
                                } else if (row.requestType == 1) {
                                    return requestTypeHtml = '注册';
                                } else if (row.requestType == 2) {
                                    return requestTypeHtml = '查验';
                                } else {
                                    return requestTypeHtml = row.requestType;
                                }
                            }
                        }, {
                            field: 'gatherUnit',
                            minWidth: 160,
                            title: '请求方公安机关名称'
                        }, {
                            field: 'gatherUnitCode',
                            minWidth: 200,
                            title: '请求方公安机关机构代码'
                        }, {
                            field: 'baseGatherUnit',
                            minWidth: 160,
                            title: '实际请求机关名称'
                        }, {
                            field: 'baseGatherUnitCode',
                            minWidth: 200,
                            title: '实际请求机关机构代码',
                            hide: true
                        }, {
                            field: 'ywfssj',
                            minWidth: 165,
                            title: '业务发生时间',
                            hide: true
                        }, {
                            field: 'bcjrZjhm',
                            minWidth: 180,
                            title: '被采集人证件号码'
                        }, {
                            field: 'bcjrXm',
                            minWidth: 120,
                            title: '被采集人姓名',
                            hide: true
                        }, {
                            field: 'gzdxFlag',
                            minWidth: 120,
                            title: '是否工作对象',
                            templet: function (row) {
                                var flagHtml = '';
                                if (row.gzdxFlag == 1) {
                                    return flagHtml = '是';
                                } else if (row.gzdxFlag == 0) {
                                    return flagHtml = '否';
                                } else {
                                    return flagHtml = row.gzdxFlag;
                                }
                            }
                        }, {
                            field: 'url',
                            minWidth: 100,
                            title: '刑专地址',
                            hide: true
                        }, {
                            field: 'requestId',
                            minWidth: 100,
                            title: '请求ID',
                            hide: true
                        }, {
                            field: 'status',
                            minWidth: 100,
                            title: '请求状态',
                            hide: true,
                            templet: function (row) {
                                var statusHtml = '';
                                if (row.status == 0) {
                                    return statusHtml = '成功';
                                } else if (row.status == 1) {
                                    return statusHtml = '失败';
                                } else {
                                    return statusHtml = row.status;
                                }
                            }
                        }, {
                            field: 'code',
                            minWidth: 100,
                            title: '返回code',
                            hide: true
                        }, {
                            field: 'message',
                            minWidth: 120,
                            title: '日志内容'
                        }, {
                            field: 'cjjg',
                            minWidth: 100,
                            title: '采集结果',
                            hide: true,
                            templet: function (row) {
                                var cjjgHtml = '';
                                if (row.cjjg == 1) {
                                    return cjjgHtml = '采集成功';
                                } else if (row.cjjg == 2) {
                                    return cjjgHtml = '虹膜已存在';
                                } else if (row.cjjg == 3) {
                                    return cjjgHtml = '证件信息不一致';
                                } else {
                                    return cjjgHtml = row.cjjg;
                                }
                            }
                        }, {
                            field: 'firstConsume',
                            minWidth: 125,
                            title: '第一次请求耗时',
                            hide: true
                        }, {
                            field: 'remarks',
                            minWidth: 80,
                            title: '备注',
                            hide: true
                        }, {
                            field: 'cdt',
                            minWidth: 165,
                            title: '创建时间'
                        }, {
                            field: 'platform',
                            minWidth: 100,
                            title: '日志来源'
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
                            "data": res.data.logList //解析数据列表
                        };
                    }
                });
                break;
            case 2:
                table.render({
                    elem: '#log-table-page',
                    url: urlrelated.selectOtherLogs,
                    method: 'post',
                    even: true,
                    defaultToolbar: ['filter'],
                    toolbar: true,
                    contentType: "application/json;charset=UTF-8", //推荐写这个
                    toolbar: "#table-hreader",
                    where: requestData,
                    limits: [10, 20, 30],
                    cols: [
                        [{
                            field: 'type',
                            minWidth: 80,
                            title: '日志类型'
                        }, {
                            field: 'clientId',
                            minWidth: 80,
                            title: '账号id',
                            hide: true
                        }, {
                            field: 'ip',
                            minWidth: 100,
                            title: '日志记录IP'
                        }, {
                            field: 'mark',
                            minWidth: 60,
                            title: '完成状态'
                        }, {
                            field: 'clientName',
                            minWidth: 60,
                            title: '账号名称'
                        }, {
                            field: 'createTime',
                            minWidth: 165,
                            title: '创建时间'
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
                            "data": res.data.logList //解析数据列表
                        };
                    }
                });
                break;
        }
    }

    //查询数据按钮
    form.on('submit(searchinfo)', function (data) {
        // console.log(data.field); //当前容器的全部表单字段，名值对形式：{name: value}
        //去除空格
        for (var key in data.field) {
            data.field[key] = $.trim(data.field[key]);
        }
        if (tabIndex == 0) {
            table.reload('log-table-page', {
                where: {
                    data: {
                        "sjsjStart": beginDate,
                        "sjsjEnd": endDate,
                        "igDecrible": data.field.igDecrible,
                        "igType": data.field.igType,
                        "igPlatform": data.field.igPlatform
                        // "deviceTypeId": data.field.deviceTypeId
                    }
                },
                page: {
                    curr: 1 //重新从第 1 页开始
                }
            });
        } else if (tabIndex == 1) {
            table.reload('log-table-page', {
                where: {
                    data: {
                        "startDate": beginDate,
                        "endDate": endDate,
                        "message": data.field.igDecrible,
                        "requestType": data.field.igxzType,
                        "platform": data.field.igPlatform
                        // "deviceType": data.field.deviceTypeId
                    }
                },
                page: {
                    curr: 1 //重新从第 1 页开始
                }
            });
        } else if (tabIndex == 2) {
            table.reload('log-table-page', {
                where: {
                    data: {
                        "startDate": beginDate,
                        "endDate": endDate,
                        "clientName": data.field.clientName,
                        "type": data.field.type,
                        "mark": data.field.mark
                        // "deviceType": data.field.deviceTypeId
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
        $("#loginfo")[0].reset();
        beginDate = "";
        endDate = "";
        form.render();
    });

});