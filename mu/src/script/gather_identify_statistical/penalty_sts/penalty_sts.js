layui.use(['table', 'form', "layer", "element", "laydate", "urlrelated", "extension"], function () {
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
        echartsZCdata = {},
        echartsCYdata = {},
        echartsHYdata = {},
        form = layui.form,
        dropDownList = extension.getDropDownList(), //获取下拉框信息
        loginuserinfo = extension.getUserInfo(); //获取的登录获得的信息
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
    form.render();
    element.init();
    $("#querytype").val(localStorage.getItem("querytypeItem"))
    form.render("select");

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
                $("#prev_org").attr("data-jgdm", selectTreeOrg[0].treeId);
                layer.close(index);
            },
            success: function (layero, index) {
                // var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                // iframeWin.layui.initTree("single");
            }
        });
    });

    var nowdate = new Date();
    var nowdatebefore = new Date(nowdate);
    nowdatebefore.setDate(nowdate.getDate() - 6);
    function getFormatDate(date) {
        var Str = date.getFullYear() + '-' +
            ((date.getMonth() + 1).toString().length == 1 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-' +
            (date.getDate().toString().length == 1 ? '0' + date.getDate() : date.getDate());
        return Str;
    }
    nowdate = getFormatDate(nowdate);
    nowdatebefore = getFormatDate(nowdatebefore);
    beginDate = nowdatebefore;
    endDate = nowdate;
    //日期范围
    laydate.render({
        elem: '#log-laydate-range-date',
        range: '~',
        trigger: "click",
        max: 0,
        value: nowdatebefore + ' ~ ' + nowdate,
        theme: '#2F4056' //设置主题颜色
        ,
        done: function (value, date) {
            if (typeof value === "string" && value != "") {
                beginDate = value.substr(0, 10);
                endDate = value.substr(13);
            } else {
                beginDate = "";
                endDate = "";
            }
            // urlrelated.requestBody.data["startDate"] = beginDate;
            // urlrelated.requestBody.data["endDate"] = endDate;
        }
    });

    $("#prev_org").val(loginuserinfo.jgmc);
    $("#prev_org").attr("data-jgdm", loginuserinfo.userJGDM);

    //获取当前登录用户的权限
    var pagepower = extension.getPagePower("调用刑专统计");

    //重置按钮
    $("#reset_btn").on("click", function () {
        $("#loginfo")[0].reset();
        beginDate = nowdatebefore;
        endDate = nowdate;
        $("#log-laydate-range-date").val(nowdatebefore + ' ~ ' + nowdate);
        $("#prev_org").val(loginuserinfo.jgmc);
        $("#prev_org").attr("data-jgdm", loginuserinfo.userJGDM);
        form.render();
    });
    var myChartZC, myChartCY, myChartHY; //echarts图表变量
    // 判断选项卡，给cxbs赋相应的值
    element.on('tab(component-tabs-brief)', function (data) {
        cxbs = data.index;
    });

    $("#prev_org").val(loginuserinfo.jgmc);
    $("#prev_org").attr({ "data-dm": loginuserinfo.userJGDM, "title": loginuserinfo.jgmc });
    //查询数据按钮
    var isAllowRenderEcharts = false;
    var orgdm;
    urlrelated.requestBody.data = {
        "requestType": "1",
        "jgmc": loginuserinfo.jgmc,
        "jgdm": loginuserinfo.userJGDM, //进入页面自动查询当前登录的机构
        "startDate": beginDate,
        "endDate": endDate
    };
    form.on('submit(searchinfo)', function (data) {
        echartsZCdata = {};
        echartsCYdata = {};
        echartsHYdata = {};
        // console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
        orgdm = $("#prev_org").attr("data-jgdm");
        if (orgdm == undefined) {
            layer.msg("请选择机构");
            return;
        }
        //去除空格
        for (var key in data.field) {
            data.field[key] = $.trim(data.field[key]);
        }
        isAllowRenderEcharts = true;
        var loadingIndex = layer.load(1, {
            shade: 0.3
        });
        urlrelated.requestBody.data = {
            "requestType": "1",
            "jgmc": data.field.jgmc,
            "jgdm": orgdm, //进入页面自动查询当前登录的机构
            "startDate": beginDate,
            "endDate": endDate
        };
        // if (chooseType == "zhe") {
        if ($.isEmptyObject(echartsZCdata)) {
            //请求生成折线图
            urlrelated.requestBody.data["requestType"] = "1";
            // jQuery.support.cors = true;
            $.ajax({
                url: urlrelated.uploadLogHistogram,
                type: "post",
                data: JSON.stringify(urlrelated.requestBody),
                cache: false,
                timeout: 120000,
                contentType: "application/json;charset=UTF-8",  //推荐写这个
                dataType: "json",
                success: function (res) {
                    layer.close(loadingIndex);
                    echartsZCdata = res;
                    RenderEchartsZC();
                },
                error: function (tt) {
                    layer.close(loadingIndex);
                    //只要进error就跳转到登录页面
                    ex.errorLogin();
                }
            });
        }
        // // } else if (chooseType == "zhu" || chooseType == "bing") {
        if ($.isEmptyObject(echartsCYdata)) {
            //请求生成柱状图和饼图
            urlrelated.requestBody.data["requestType"] = "2";
            $.ajax({
                url: urlrelated.uploadLogHistogram,
                type: "post",
                data: JSON.stringify(urlrelated.requestBody),
                cache: false,
                timeout: 120000,
                contentType: "application/json;charset=UTF-8",  //推荐写这个
                dataType: "json",
                success: function (res) {
                    layer.close(loadingIndex);
                    echartsCYdata = res;
                    RenderEchartsCY();
                },
                error: function (tt) {
                    layer.close(loadingIndex);
                    //只要进error就跳转到登录页面
                    ex.errorLogin();
                }
            });
        }
        if ($.isEmptyObject(echartsHYdata)) {
            //请求生成柱状图和饼图
            urlrelated.requestBody.data["requestType"] = "3";
            $.ajax({
                url: urlrelated.uploadLogHistogram,
                type: "post",
                data: JSON.stringify(urlrelated.requestBody),
                cache: false,
                timeout: 120000,
                contentType: "application/json;charset=UTF-8",  //推荐写这个
                dataType: "json",
                success: function (res) {
                    layer.close(loadingIndex);
                    echartsHYdata = res;
                    RenderEchartsHY();
                },
                error: function (tt) {
                    layer.close(loadingIndex);
                    //只要进error就跳转到登录页面
                    ex.errorLogin();
                }
            });
        }
        window.onresize = function () {
            myChartZC.resize();
            myChartCY.resize();
            myChartHY.resize();
        };
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    $(window).resize(function () {
        resize();
    })

    function resize() {
        autoChange();
    }
    function autoChange() {
        //图表自适应，宽高样式
        var bgWidth = $("#bgDIV").width() - 45
        var winHeight = $(window).height();
        var winWidth = bgWidth + 20

        $("#charts_register").css("height", winHeight * 0.7);
        $("#charts_inspection").css("height", winHeight * 0.7);
        $("#charts_Verification").css("height", winHeight * 0.7);

        $("#charts_register").css("width", winWidth);
        $("#charts_inspection").css("width", winWidth);
        $("#charts_Verification").css("width", winWidth);
    }
    // 点击切换tab是  echarts
    element.on('tab(docDemoTabBrief)', function (data) {
        if (isAllowRenderEcharts == false) {
            return
        }
        // autoChange();
        var loadingIndex1 = layer.load(1, {
            shade: 0.3
        });
        if (data.index == 0) {
            if ($.isEmptyObject(echartsZCdata)) {
                //请求生成折线图
                $.ajax({
                    url: urlrelated.uploadLogHistogram,
                    type: "post",
                    // async: true,
                    data: JSON.stringify(urlrelated.requestBody),
                    cache: false,
                    timeout: 120000,
                    contentType: "application/json;charset=UTF-8",  //推荐写这个
                    dataType: "json",
                    success: function (res) {
                        layer.close(loadingIndex1);
                        echartsZCdata = res;
                        RenderEchartsZC();
                    },
                    error: function (tt) {
                        layer.close(loadingIndex1);
                        //只要进error就跳转到登录页面
                        ex.errorLogin();
                    }
                });
            } else {
                layer.close(loadingIndex1);
                RenderEchartsZC();
            }
        }
        if (data.index == 1) {
            if ($.isEmptyObject(echartsCYdata)) {
                //请求生成柱状图和饼图
                $.ajax({
                    url: urlrelated.uploadLogHistogram,
                    type: "post",
                    // async: true,
                    data: JSON.stringify(urlrelated.requestBody),
                    cache: false,
                    timeout: 120000,
                    contentType: "application/json;charset=UTF-8",  //推荐写这个
                    dataType: "json",
                    success: function (res) {
                        layer.close(loadingIndex1);
                        echartsCYdata = res;
                        RenderEchartsCY();
                    },
                    error: function (tt) {
                        layer.close(loadingIndex1);
                        //只要进error就跳转到登录页面
                        ex.errorLogin();
                    }
                });
            } else {
                layer.close(loadingIndex1);
                RenderEchartsCY();
            }
        }
        if (data.index == 2) {
            if ($.isEmptyObject(echartsHYdata)) {
                //请求生成柱状图和饼图
                $.ajax({
                    url: urlrelated.uploadLogHistogram,
                    type: "post",
                    // async: false,
                    data: JSON.stringify(urlrelated.requestBody),
                    cache: false,
                    timeout: 120000,
                    contentType: "application/json;charset=UTF-8",  //推荐写这个
                    dataType: "json",
                    success: function (res) {
                        layer.close(loadingIndex1);
                        echartsHYdata = res;
                        RenderEchartsHY();
                    },
                    error: function (tt) {
                        layer.close(loadingIndex1);
                        //只要进error就跳转到登录页面
                        ex.errorLogin();
                    }
                });
            } else {
                layer.close(loadingIndex1);
                RenderEchartsHY();
            }
        }
    });

    //渲染注册信息
    function RenderEchartsZC() {
        var xAxisDataz = [];
        var seriesDataz = [];
        var seriesDataz2 = [];
        var seriesDataz3 = [];
        var seriesDataz4 = [];

        //柱状图数据
        for (var i = 0; i < echartsZCdata.data.juniorList.length; i++) {
            xAxisDataz.push(echartsZCdata.data.juniorList[i].juniorJgmc);
            seriesDataz.push(echartsZCdata.data.juniorList[i].juniorcJcg);
            seriesDataz2.push(echartsZCdata.data.juniorList[i].juniorHmycz);
            seriesDataz3.push(echartsZCdata.data.juniorList[i].juniorZjbyz);
            seriesDataz4.push(echartsZCdata.data.juniorList[i].juniorAmount);
        }
        var addzhuData = {
            xAxisData: xAxisDataz,
            seriesData: seriesDataz,
            seriesData2: seriesDataz2,
            seriesData3: seriesDataz3,
            seriesData4: seriesDataz4
        };
        autoChange();
        addChartsZC("charts_register", addzhuData, myChartZC);
        var colinfoall = [
            { field: 'juniorJgmc', minWidth: 200, title: '机构' }
            , { field: 'juniorcJcg', minWidth: 200, title: '采集量(成功)' }
            , { field: 'juniorHmycz', minWidth: 200, title: '虹膜已存在数量' }
            , { field: 'juniorZjbyz', minWidth: 200, title: '证件信息不一致数量' }
            , { field: 'juniorAmount', minWidth: 200, title: '采集总量' }
        ]
        var colinfome = [
            { field: 'ownJgmc', minWidth: 200, title: '机构' }
            , { field: 'ownCjcg', minWidth: 200, title: '采集量(成功)' }
            , { field: 'ownHmycz', minWidth: 200, title: '虹膜已存在数量' }
            , { field: 'ownZjbyz', minWidth: 200, title: '证件信息不一致数量' }
            , { field: 'ownAmount', minWidth: 200, title: '采集总量' }
        ]
        addTable("#charts_register_me", echartsZCdata.data.ownList, colinfome, false, "#table-hreader1");
        addTable("#charts_register_all", echartsZCdata.data.juniorList, colinfoall, true, "#table-hreader2");
    }
    //渲染查验信息
    function RenderEchartsCY() {
        var xAxisDataz = [];
        var seriesDataz = [];
        var seriesDataz2 = [];
        var seriesDataz3 = [];

        //柱状图数据
        for (var i = 0; i < echartsCYdata.data.juniorList.length; i++) {
            xAxisDataz.push(echartsCYdata.data.juniorList[i].juniorJgmc);
            seriesDataz.push(echartsCYdata.data.juniorList[i].juniorCyBz);
            seriesDataz2.push(echartsCYdata.data.juniorList[i].juniorCyWbz);
            seriesDataz3.push(echartsCYdata.data.juniorList[i].juniorAmount);
        }
        var addzhuData = {
            xAxisData: xAxisDataz,
            seriesData: seriesDataz,
            seriesData2: seriesDataz2,
            seriesData3: seriesDataz3,
        };
        autoChange();
        addChartsCY("charts_inspection", addzhuData, myChartZC);
        var colinfoall = [
            { field: 'juniorJgmc', minWidth: 200, title: '机构' }
            , { field: 'juniorCyBz', minWidth: 200, title: '查验量(比中)' }
            , { field: 'juniorCyWbz', minWidth: 200, title: '查验量(未比中)' }
            , { field: 'juniorAmount', minWidth: 200, title: '查验总量' }
        ]
        var colinfome = [
            { field: 'ownJgmc', minWidth: 200, title: '机构' }
            , { field: 'ownCyBz', minWidth: 200, title: '查验量(比中)' }
            , { field: 'ownCyWbz', minWidth: 200, title: '查验量(未比中)' }
            , { field: 'ownAmount', minWidth: 200, title: '查验总量' }
        ]
        addTable("#charts_inspection_me", echartsCYdata.data.ownList, colinfome, false, "#table-hreader1");
        addTable("#charts_inspection_all", echartsCYdata.data.juniorList, colinfoall, true, "#table-hreader2");
    }
    //渲染核验信息
    function RenderEchartsHY() {
        var xAxisDataz = [];
        var seriesDataz = [];
        var seriesDataz2 = [];
        var seriesDataz3 = [];
        var seriesDataz4 = [];

        //柱状图数据
        for (var i = 0; i < echartsHYdata.data.juniorList.length; i++) {
            xAxisDataz.push(echartsHYdata.data.juniorList[i].juniorJgmc);
            seriesDataz.push(echartsHYdata.data.juniorList[i].juniorHyBz);
            seriesDataz2.push(echartsHYdata.data.juniorList[i].juniorHyZjbyz);
            seriesDataz3.push(echartsHYdata.data.juniorList[i].juniorHyWbz);
            seriesDataz4.push(echartsHYdata.data.juniorList[i].juniorAmount);
        }
        var addzhuData = {
            xAxisData: xAxisDataz,
            seriesData: seriesDataz,
            seriesData2: seriesDataz2,
            seriesData3: seriesDataz3,
            seriesData4: seriesDataz4
        };
        autoChange();
        addChartsHY("charts_Verification", addzhuData, myChartHY);
        var colinfoall = [
            { field: 'juniorJgmc', minWidth: 200, title: '机构' }
            , { field: 'juniorHyBz', minWidth: 200, title: '核验量(比中)' }
            , { field: 'juniorHyWbz', minWidth: 200, title: '核验量(未比中)' }
            , { field: 'juniorHyZjbyz', minWidth: 200, title: '核验证件信息不一致数量' }
            , { field: 'juniorAmount', minWidth: 200, title: '采集总量' }
        ]
        var colinfome = [
            { field: 'ownJgmc', minWidth: 200, title: '机构' }
            , { field: 'ownHyBz', minWidth: 200, title: '核验量(比中)' }
            , { field: 'ownHyWbz', minWidth: 200, title: '核验量(未比中)' }
            , { field: 'ownHyZjbyz', minWidth: 200, title: '核验证件信息不一致数量' }
            , { field: 'ownAmount', minWidth: 200, title: '采集总量' }
        ]
        addTable("#charts_Verification_me", echartsHYdata.data.ownList, colinfome, false, "#table-hreader1");
        addTable("#charts_Verification_all", echartsHYdata.data.juniorList, colinfoall, true, "#table-hreader2");
    }

    function addTable(id, data, colsinfo, ispage, toolbar) {
        table.render({
            elem: id,
            /* , url:url*/
            data: data,
            defaultToolbar: [],
            even: true,
            toolbar: toolbar,
            limits: [10, 20, 30],
            cols: [colsinfo],
            page: ispage,
            done: function (res, curr, count) {
                // //console.log("回调函数")
                var box = $("#box_height,#box_height1").find(".layui-table-body").find(".layui-table-box")
                var height = $(box).find(".layui-table-body").css("height");
                // var width = $(box).find(".layui-table-body").css("width")
                var boxheight = parseInt(height) + 40 + "px"
                // var boxwidth = parseInt(width) - 40 + "px"
                $(box).css("height", boxheight);
                // $(box).css("width", boxwidth);
            }
        });
    }

    function addChartsZC(id, data) {
        //解析数据
        if (data == undefined) return;
        if (myChartZC != null && myChartZC != "" && myChartZC != undefined) {
            myChartZC.dispose();
        }
        var onlyone = [{
            type: 'slider',
            startValue: 0, //数据窗口范围的起始数值
            endValue: 40, //数据窗口范围的结束数值。
            top: "75%"
        }]
        if (data.seriesData.length == 1) {
            onlyone = [{
                type: 'slider',
                start: 0, //数据窗口范围的起始数值
                end: 100, //数据窗口范围的结束数值。
                top: "75%"
            }]
        }
        if (data.seriesData.length > 40) {
            onlyone = [{
                type: 'slider',
                startValue: data.seriesData.length - 40, //数据窗口范围的起始数值
                endValue: data.seriesData.length, //数据窗口范围的结束数值。
                top: "75%"
            }]
        }
        //添加柱状图
        myChartZC = echarts.init(document.getElementById(id));
        var optionzhu = {
            color: ['#3AA1FF', '#4ECB73', '#FBD437', '#435188', '#975FE5'],
            noDataLoadingOption: {
                text: '无数据',
                "textStyle": {
                    "fontSize": 20,
                    "fontWeight": 400
                },
                effect: 'bubble'
            },
            title: {
                textStyle: {
                    "color": "#fff",
                    "fontSize": 14,
                    "fontWeight": 400
                },
                top: "0",
                left: "45%"
            },
            tooltip: {
                trigger: 'axis',             //鼠标滑过显示的提示框
                axisPointer: {               //滑过是线还是阴影
                    type: "shadow",
                    shadowStyle: {              // 阴影指示器样式设置
                        width: 'auto',         // 阴影大小
                        color: 'rgba(0,0,0,0.3)'  // 阴影颜色
                    }
                }
            },
            legend: {
                itemWidth: 20,             // 图例图形宽度
                itemHeight: 14,            // 图例图形高度
                textStyle: {
                    color: '#333'          // 图例文字颜色
                }
            },
            grid: {
                left: '5%',
                right: '5%',
                top: "7%",
                containLabel: true,
                height: "65%",
                tooltip: {
                    borderColor: "#DD5145"
                }
            },
            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    data: data.xAxisData,
                    axisLabel: {
                        show: true,
                        // interval: 0,             //坐标轴间隔默认是auto 占不下自己隐藏 为0的话 最后一个会加粗
                        rotate: 40,
                        formatter: function (value) {
                            if (value != undefined) {
                                return (value.length > 6 ? (value.slice(0, 6) + "...") : value);
                            }
                        }
                    },
                    triggerEvent: true
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: "采集量(成功)",
                    type: 'bar',
                    barGap: 0,
                    stack: '采集量',
                    data: data.seriesData,
                    // markLine: {
                    //     data: [
                    //         {type: 'average', name: '平均值'}
                    //     ]
                    // }
                },
                {
                    name: "虹膜已存在",
                    type: 'bar',
                    stack: '采集量',
                    barGap: 0,
                    data: data.seriesData2,
                    // markLine: {
                    //     data: [
                    //         {type: 'average', name: '平均值'}
                    //     ]
                    // }
                },
                {
                    name: "证件信息不一致",
                    type: 'bar',
                    barGap: 0,
                    stack: '采集量',
                    data: data.seriesData3,
                    // markLine: {
                    //     data: [
                    //         {type: 'average', name: '平均值'}
                    //     ]
                    // }
                },
                {
                    name: "采集总量",
                    type: 'bar',
                    barGap: 0,
                    stack: '采集量',
                    data: data.seriesData4,
                    // markLine: {
                    //     data: [
                    //         {type: 'average', name: '平均值'}
                    //     ]
                    // }
                }
            ],
            dataZoom: onlyone
        };
        myChartZC.setOption(optionzhu);
        myChartZC.on('mouseover', function (params) {
            if (params.componentType == 'xAxis') {
                layer.msg(params.value);
            }
        });
        myChartZC.on('mouseout', function (params) {
            if (params.componentType == 'xAxis') {
                layer.closeAll();
            }
        });
    }
    function addChartsCY(id, data) {
        //解析数据
        if (data == undefined) return;
        if (myChartCY != null && myChartCY != "" && myChartCY != undefined) {
            myChartCY.dispose();
        }
        var onlyone = [{
            type: 'slider',
            startValue: 0, //数据窗口范围的起始数值
            endValue: 40, //数据窗口范围的结束数值。
            top: "75%"
        }]
        if (data.seriesData.length == 1) {
            onlyone = [{
                type: 'slider',
                start: 0, //数据窗口范围的起始数值
                end: 100, //数据窗口范围的结束数值。
                top: "75%"
            }]
        }
        if (data.seriesData.length > 40) {
            onlyone = [{
                type: 'slider',
                startValue: data.seriesData.length - 40, //数据窗口范围的起始数值
                endValue: data.seriesData.length, //数据窗口范围的结束数值。
                top: "75%"
            }]
        }
        //添加柱状图
        myChartCY = echarts.init(document.getElementById(id));
        var optionzhu = {
            color: ['#3AA1FF', '#4ECB73', '#FBD437', '#435188', '#975FE5'],
            noDataLoadingOption: {
                text: '无数据',
                "textStyle": {
                    "fontSize": 20,
                    "fontWeight": 400
                },
                effect: 'bubble'
            },
            title: {
                textStyle: {
                    "color": "#fff",
                    "fontSize": 14,
                    "fontWeight": 400
                },
                top: "0",
                left: "45%"
            },
            tooltip: {
                trigger: 'axis',             //鼠标滑过显示的提示框
                axisPointer: {               //滑过是线还是阴影
                    type: "shadow",
                    shadowStyle: {              // 阴影指示器样式设置
                        width: 'auto',         // 阴影大小
                        color: 'rgba(0,0,0,0.3)'  // 阴影颜色
                    }
                }
            },
            legend: {
                itemWidth: 20,             // 图例图形宽度
                itemHeight: 14,            // 图例图形高度
                textStyle: {
                    color: '#333'          // 图例文字颜色
                }
            },
            grid: {
                left: '5%',
                right: '5%',
                top: "7%",
                containLabel: true,
                height: "65%",
                tooltip: {
                    borderColor: "#DD5145"
                }
            },
            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    data: data.xAxisData,
                    axisLabel: {
                        show: true,
                        // interval: 0,             //坐标轴间隔默认是auto 占不下自己隐藏 为0的话 最后一个会加粗
                        rotate: 40,
                        formatter: function (value) {
                            if (value != undefined) {
                                return (value.length > 6 ? (value.slice(0, 6) + "...") : value);
                            }
                        }
                    },
                    triggerEvent: true
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: "查验量(比中)",
                    type: 'bar',
                    barGap: 0,
                    stack: '查验量',
                    data: data.seriesData,
                },
                {
                    name: "查验量(未比中)",
                    type: 'bar',
                    stack: '查验量',
                    barGap: 0,
                    data: data.seriesData2,
                },
                {
                    name: "查验总量",
                    type: 'bar',
                    barGap: 0,
                    stack: '查验量',
                    data: data.seriesData3,
                }
            ],
            dataZoom: onlyone
        };
        myChartCY.setOption(optionzhu);
        myChartCY.on('mouseover', function (params) {
            if (params.componentType == 'xAxis') {
                layer.msg(params.value);
            }
        });
        myChartCY.on('mouseout', function (params) {
            if (params.componentType == 'xAxis') {
                layer.closeAll();
            }
        });
    }
    function addChartsHY(id, data) {
        //解析数据
        if (data == undefined) return;
        if (myChartHY != null && myChartHY != "" && myChartHY != undefined) {
            myChartHY.dispose();
        }
        var onlyone = [{
            type: 'slider',
            startValue: 0, //数据窗口范围的起始数值
            endValue: 40, //数据窗口范围的结束数值。
            top: "75%"
        }]
        if (data.seriesData.length == 1) {
            onlyone = [{
                type: 'slider',
                start: 0, //数据窗口范围的起始数值
                end: 100, //数据窗口范围的结束数值。
                top: "75%"
            }]
        }
        if (data.seriesData.length > 40) {
            onlyone = [{
                type: 'slider',
                startValue: data.seriesData.length - 40, //数据窗口范围的起始数值
                endValue: data.seriesData.length, //数据窗口范围的结束数值。
                top: "75%"
            }]
        }
        //添加柱状图
        myChartHY = echarts.init(document.getElementById(id));
        var optionzhu = {
            color: ['#3AA1FF', '#4ECB73', '#FBD437', '#435188', '#975FE5'],
            noDataLoadingOption: {
                text: '无数据',
                "textStyle": {
                    "fontSize": 20,
                    "fontWeight": 400
                },
                effect: 'bubble'
            },
            title: {
                textStyle: {
                    "color": "#fff",
                    "fontSize": 14,
                    "fontWeight": 400
                },
                top: "0",
                left: "45%"
            },
            tooltip: {
                trigger: 'axis',             //鼠标滑过显示的提示框
                axisPointer: {               //滑过是线还是阴影
                    type: "shadow",
                    shadowStyle: {              // 阴影指示器样式设置
                        width: 'auto',         // 阴影大小
                        color: 'rgba(0,0,0,0.3)'  // 阴影颜色
                    }
                }
            },
            legend: {
                itemWidth: 20,             // 图例图形宽度
                itemHeight: 14,            // 图例图形高度
                textStyle: {
                    color: '#333'          // 图例文字颜色
                }
            },
            grid: {
                left: '5%',
                right: '5%',
                top: "7%",
                containLabel: true,
                height: "65%",
                tooltip: {
                    borderColor: "#DD5145"
                }
            },
            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    data: data.xAxisData,
                    axisLabel: {
                        show: true,
                        // interval: 0,             //坐标轴间隔默认是auto 占不下自己隐藏 为0的话 最后一个会加粗
                        rotate: 40,
                        formatter: function (value) {
                            if (value != undefined) {
                                return (value.length > 6 ? (value.slice(0, 6) + "...") : value);
                            }
                        }
                    },
                    triggerEvent: true
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: "核验量(比中)",
                    type: 'bar',
                    barGap: 0,
                    stack: '核验量',
                    data: data.seriesData,
                },
                {
                    name: "证件信息不一致",
                    type: 'bar',
                    stack: '核验量',
                    barGap: 0,
                    data: data.seriesData2,
                },
                {
                    name: "核验量(未比中)",
                    type: 'bar',
                    barGap: 0,
                    stack: '核验量',
                    data: data.seriesData3,
                },
                {
                    name: "核验总量",
                    type: 'bar',
                    barGap: 0,
                    stack: '核验量',
                    data: data.seriesData4,
                }
            ],
            dataZoom: onlyone
        };
        myChartHY.setOption(optionzhu);
        myChartHY.on('mouseover', function (params) {
            if (params.componentType == 'xAxis') {
                layer.msg(params.value);
            }
        });
        myChartHY.on('mouseout', function (params) {
            if (params.componentType == 'xAxis') {
                layer.closeAll();
            }
        });
    }


    //进图页面自动查询
    $("#search_btn").click();


});