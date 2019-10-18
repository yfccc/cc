//注意：选项卡 依赖 element 模块，否则无法进行功能性操作
layui.use(['element', 'laydate', 'form', 'table', "layer", "extension", "urlrelated"], function () {
    var $ = layui.$,
        element = layui.element,
        carousel = layui.carousel,
        laydate = layui.laydate,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        ex = layui.extension,
        dataType = "day",
        echartszhedata = {},
        echartszhudata = {},
        urlrelated = layui.urlrelated,
        loginuserinfo = ex.getUserInfo();      //获取用户登录信息
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
    var myChartzhe, myChartzhu, myChartbing; //echarts图表变量
    var isfirstenter = true;
    // 判断选项卡，给cxbs赋相应的值
    element.on('tab(component-tabs-brief)', function (data) {
        cxbs = data.index;
    });

    form.render('select');

    form.render(null, 'component-form-group');

    // 点击查询时候的树菜单
    $("#select_org").on("click", function () {
        localStorage.setItem("currentOrgCodeTree", loginuserinfo.userJGDM);
        localStorage.setItem("chirdOrgCodeTree", "-1");
        localStorage.setItem("queryTypeTree", loginuserinfo.querytypeItem);
        localStorage.setItem("orgListQueryTypeEq4Tree", loginuserinfo.models);
        layer.open({
            title: '选择机构',
            type: 2,
            move: false,
            area: [ex.getDialogSize().width, ex.getDialogSize().height],
            resize: false,
            content: ['/html/system/institutions/select_institutions.html?tree_type=single', "no"],
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                var selectTreeOrg = iframeWin.getSelectOrg();
                if (selectTreeOrg == '') {
                    layer.msg("请选择一个组织机构");
                    return;
                }
                $("#prev_org").val(selectTreeOrg[0].title);
                $("#prev_org").attr({ "data-dm": selectTreeOrg[0].treeId, "title": selectTreeOrg[0].title });
                layer.close(index);
            },
            success: function (layero, index) {
                // var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                // iframeWin.layui.initTree("single");
            }
        });
    });
    $("#prev_org").val(loginuserinfo.jgmc);
    $("#prev_org").attr({ "data-dm": loginuserinfo.userJGDM, "title": loginuserinfo.jgmc });
    //查询数据按钮
    var isAllowRenderEcharts = false;
    var dateBegin, dateEnd, orgdm;
    form.on('submit(searchinfo)', function (data) {
        if (checkDate()) {
            echartszhudata = {};
            echartszhedata = {};
            // console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
            if (data.field.dateBegin == '') {
                layer.msg("请选择开始时间");
                return;
            }
            if (data.field.dateEnd == '') {
                layer.msg("请选择结束时间");
                return;
            }
            orgdm = $("#prev_org").attr("data-dm");
            if (orgdm == undefined) {
                layer.msg("请选择机构");
                return;
            }
            //去除空格
            for (var key in data.field) {
                data.field[key] = $.trim(data.field[key]);
            }
            dateBegin = data.field.dateBegin;
            dateEnd = data.field.dateEnd;
            if (dataType == "month") {
                data.field.dateEnd = lastmonthDay;
                data.field.dateBegin = data.field.dateBegin + '-01';
            }
            urlrelated.requestBody.data = {
                "dateType": dataType,
                "typeCode": "1",        //1是采集 2是识别
                "dateBegin": data.field.dateBegin + ' ' + '00:00:00',
                "dateEnd": data.field.dateEnd + ' ' + '23:59:59',
                "fjjgdm": orgdm
            };
            isAllowRenderEcharts = true;
            var chooseType = $("#echarsList li.layui-this").attr("data-type");
            var loadingIndex = layer.load(1, {
                shade: 0.3
            });
            // if (chooseType == "zhe") {
            if ($.isEmptyObject(echartszhedata)) {
                //请求生成折线图
                urlrelated.requestBody.data["queryType"] = loginuserinfo.querytypeItem;
                jQuery.support.cors = true;
                $.ajax({
                    url: urlrelated.collectionAmountList,
                    type: "post",
                    async: true,
                    data: JSON.stringify(urlrelated.requestBody),
                    cache: false,
                    timeout: 120000,
                    contentType: "application/json;charset=UTF-8",  //推荐写这个
                    dataType: "json",
                    success: function (res) {
                        layer.close(loadingIndex);
                        // debugger
                        echartszhedata = res;
                        RenderZheEcharts();
                    },
                    error: function (tt) {
                        layer.close(loadingIndex);
                        //只要进error就跳转到登录页面
                        ex.errorLogin();
                    }
                });
            }
            // } else if (chooseType == "zhu" || chooseType == "bing") {
            if ($.isEmptyObject(echartszhudata)) {
                //请求生成柱状图和饼图
                delete urlrelated.requestBody.data["queryType"]
                jQuery.support.cors = true;
                $.ajax({
                    url: urlrelated.orgAmountList,
                    type: "post",
                    async: true,
                    data: JSON.stringify(urlrelated.requestBody),
                    cache: false,
                    timeout: 120000,
                    contentType: "application/json;charset=UTF-8",  //推荐写这个
                    dataType: "json",
                    success: function (res) {
                        layer.close(loadingIndex);
                        // debugger
                        echartszhudata = res;
                        // autoChange();
                        RenderZhuEcharts();
                        RenderBingEcharts();
                    },
                    error: function (tt) {
                        layer.close(loadingIndex);
                        //只要进error就跳转到登录页面
                        ex.errorLogin();
                    }
                });
            }
            window.onresize = function () {
                myChartzhe.resize();
                myChartzhu.resize();
                myChartbing.resize();
            };
            // }
            // if (isfirstenter) {
            //     //请求生成柱状图和饼图
            //     $.ajax({
            //         url: urlrelated.orgAmountList,
            //         type: "post",
            //         async: true,
            //         data: JSON.stringify(urlrelated.requestBody),
            //         cache: false,
            //         contentType: "application/json;charset=UTF-8",  //推荐写这个
            //         dataType: "json",
            //         success: function (res) {
            //             echartszhudata = res;
            //             autoChange();
            //             RenderZhuEcharts()
            //         },
            //         error: function (tt) {
            //             layer.msg("错误");
            //         }
            //     });
            //     isfirstenter = false;
            // }
            return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
        }
    });

    //重置按钮
    $("#btn_reset").on("click", function () {
        $("#prev_org").val(loginuserinfo.jgmc);
        $("#prev_org").attr("data-dm", loginuserinfo.userJGDM);
        $("input[name=dateType][value=day]").next().click();
        $(".dateval").val("").removeAttr("name");
        $("#ss_cjsjWeek,#ss_cjsjMonth,#ee_cjsjWeek,#ee_cjsjMonth").hide();
        $("#ss_cjsjDay").show().attr("name", "dateBegin").val(nowdatebefore);
        $("#ee_cjsjDay").show().attr("name", "dateEnd").val(nowdate);
        dataType = "day"
    });

    //切换单选框
    form.on('radio(timeType)', function (data) {
        // var now = new Date();
        // now.setTime(now.getTime());
        // //切换的时候重新设置时间选择器最大值
        // function resetMax(array) {
        //     for (var i = 0; i < array.length; i++) {
        //         array[i].config.max = {
        //             year: now.getFullYear(),
        //             month: now.getMonth(),
        //             date: now.getDate(),
        //             hours: 0,
        //             minutes: 0,
        //             seconds: 0
        //         }
        //     }
        // }
        // resetMax([monthstart, monthend, weekstart, weekend, daystart, dayend]);
        $(".dateval").val("").removeAttr("name");
        if (data.value == "month") {
            $("#ss_cjsjWeek,#ss_cjsjDay,#ee_cjsjWeek,#ee_cjsjDay").hide();
            $("#ss_cjsjMonth").show().attr("name", "dateBegin");
            $("#ee_cjsjMonth").show().attr("name", "dateEnd");
        } else if (data.value == "week") {
            $("#ss_cjsjMonth,#ss_cjsjDay,#ee_cjsjMonth,#ee_cjsjDay").hide();
            $("#ss_cjsjWeek").show().attr("name", "dateBegin");
            $("#ee_cjsjWeek").show().attr("name", "dateEnd");
        } else if (data.value == "day") {
            $("#ss_cjsjWeek,#ss_cjsjMonth,#ee_cjsjWeek,#ee_cjsjMonth").hide();
            $("#ss_cjsjDay").show().attr("name", "dateBegin");
            $("#ee_cjsjDay").show().attr("name", "dateEnd");
        }
        dataType = data.value
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

        $("#charts_zhe").css("height", winHeight * 0.7);
        $("#charts_zhu").css("height", winHeight * 0.7);
        $("#charts_bing").css("height", winHeight * 0.7);

        $("#charts_zhe").css("width", winWidth);
        $("#charts_zhu").css("width", winWidth);
        $("#charts_bing").css("width", winWidth);
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
            // debugger
            if ($.isEmptyObject(echartszhedata)) {
                //请求生成折线图
                $.ajax({
                    url: urlrelated.collectionAmountList,
                    type: "post",
                    // async: true,
                    data: JSON.stringify(urlrelated.requestBody),
                    cache: false,
                    timeout: 120000,
                    contentType: "application/json;charset=UTF-8",  //推荐写这个
                    dataType: "json",
                    success: function (res) {
                        layer.close(loadingIndex1);
                        echartszhedata = res;
                        RenderZheEcharts();
                    },
                    error: function (tt) {
                        layer.close(loadingIndex1);
                        //只要进error就跳转到登录页面
                        ex.errorLogin();
                    }
                });
            } else {
                layer.close(loadingIndex1);
                RenderZheEcharts();
            }
        }
        if (data.index == 1) {
            if ($.isEmptyObject(echartszhudata)) {
                //请求生成柱状图和饼图
                $.ajax({
                    url: urlrelated.orgAmountList,
                    type: "post",
                    // async: true,
                    data: JSON.stringify(urlrelated.requestBody),
                    cache: false,
                    timeout: 120000,
                    contentType: "application/json;charset=UTF-8",  //推荐写这个
                    dataType: "json",
                    success: function (res) {
                        layer.close(loadingIndex1);
                        echartszhudata = res;
                        RenderZhuEcharts();
                    },
                    error: function (tt) {
                        layer.close(loadingIndex1);
                        //只要进error就跳转到登录页面
                        ex.errorLogin();
                    }
                });
            } else {
                layer.close(loadingIndex1);
                RenderZhuEcharts();
            }
        }
        if (data.index == 2) {
            if ($.isEmptyObject(echartszhudata)) {
                //请求生成柱状图和饼图
                $.ajax({
                    url: urlrelated.orgAmountList,
                    type: "post",
                    // async: false,
                    data: JSON.stringify(urlrelated.requestBody),
                    cache: false,
                    timeout: 120000,
                    contentType: "application/json;charset=UTF-8",  //推荐写这个
                    dataType: "json",
                    success: function (res) {
                        layer.close(loadingIndex1);
                        echartszhudata = res;
                        RenderBingEcharts();
                    },
                    error: function (tt) {
                        layer.close(loadingIndex1);
                        //只要进error就跳转到登录页面
                        ex.errorLogin();
                    }
                });
            } else {
                layer.close(loadingIndex1);
                RenderBingEcharts();
            }
        }
    });

    //渲染折线图
    function RenderZheEcharts() {
        var xAxisData = [];
        var seriesData = [];
        var seriesData2 = [];

        //折线图数据
        for (var i = 0; i < echartszhedata.data.length; i++) {
            xAxisData.push(echartszhedata.data[i].datetime);
            seriesData.push(echartszhedata.data[i].count);
            seriesData2.push(echartszhedata.data[i].totalCount);
        }
        var addzheData = {
            xAxisData: xAxisData,
            seriesData: seriesData,
            seriesData2: seriesData2
        };
        autoChange();
        addChartsZhe("charts_zhe", addzheData);
        var colinfozhe = [
            { field: 'datetime', minWidth: 200, title: '时间' }
            , { field: 'count', minWidth: 140, title: '采集量' }
            , { field: 'successCount', minWidth: 140, title: '采集量(成功)' }
            , { field: 'failCount', minWidth: 140, title: '采集量(失败)' }
            , { field: 'totalCount', minWidth: 140, title: '采集总量' }
        ]
        addTable("#charts_zhe_table", echartszhedata.data, colinfozhe);
    }
    //渲染柱状图
    function RenderZhuEcharts() {
        var xAxisDataz = [];
        var seriesDataz = [];
        var seriesDataz2 = [];

        //柱状图数据
        for (var i = 0; i < echartszhudata.data.length; i++) {
            xAxisDataz.push(echartszhudata.data[i].jgmc);
            seriesDataz.push(echartszhudata.data[i].count);
            seriesDataz2.push(echartszhudata.data[i].totalCount);
        }
        var addzhuData = {
            xAxisData: xAxisDataz,
            seriesData: seriesDataz,
            seriesData2: seriesDataz2
        };
        autoChange();
        addChartsZhu("charts_zhu", addzhuData);
        var colinfozhu = [
            { field: 'jgmc', width: 400, title: '机构' }
            , { field: 'count', width: 400, title: '采集量' }
            , { field: 'totalCount', width: 400, title: '采集总量' }
            , { field: '', title: '操作', align: 'center', fixed: 'right', minWidth: 320, toolbar: '#chartsZhu-table-operate' }
        ]
        addTable("#charts_zhu_table", echartszhudata.data, colinfozhu);

        // var addbingData = $.extend(true, {}, echartszhudata);
        // //修改对象内部的字段名字
        // addbingData.data = JSON.parse(JSON.stringify(addbingData.data).replace(/jgmc/g, "name"));
        // addbingData.data = JSON.parse(JSON.stringify(addbingData.data).replace(/count/g, "value"));
        // addBing("charts_bing", addbingData.data);
    }
    //渲染饼状图
    function RenderBingEcharts() {
        autoChange();
        var addbingData = $.extend(true, {}, echartszhudata);
        //修改对象内部的字段名字
        addbingData.data = JSON.parse(JSON.stringify(addbingData.data).replace(/jgmc/g, "name"));
        addbingData.data = JSON.parse(JSON.stringify(addbingData.data).replace(/count/g, "value"));
        addChartsBing("charts_bing", addbingData.data);
    }
    function addTable(id, data, colsinfo) {
        table.render({
            elem: id
            /* , url:url*/
            ,
            data: data,
            even: true,
            // height : 'full-200',
            limits: [10, 20, 30],
            cols: [colsinfo],
            page: true,
            done: function (res, curr, count) {
                // //console.log("回调函数")
                var box = $("#box_height,#box_height1").find(".layui-table-body").find(".layui-table-box")
                var height = $(box).find(".layui-table-body").css("height")
                // var width = $(box).find(".layui-table-body").css("width")
                var boxheight = parseInt(height) + 40 + "px"
                // var boxwidth = parseInt(width) - 40 + "px"
                $(box).css("height", boxheight);
                // $(box).css("width", boxwidth);
            }
        });
    }

    //获取当前月份的最后一天
    var lastmonthDay = "";
    function getFirstAndLastMonthDay(year, month) {
        var day = new Date(year, month, 0);
        var lastdate = year + '-' + month + '-' + day.getDate();//获取当月最后一天日期  
        //给文本控件赋值。同下
        return lastdate;
    }

    // 初始化按月的日期范围
    var monthstart = laydate.render({
        elem: '#ss_cjsjMonth'
        , trigger: "click"
        , type: "month"
        , max: (new Date()).getTime()
        , btns: ['clear', 'confirm']
        , theme: '#2F4056'  //设置主题颜色
        // , ready: function(){
        //     //手动去掉默认选中的当前日期
        //     $(".layui-this").removeClass("layui-this");
        // }
        , done: function (value, dates) {
            // console.log(dates);
            // if ($.isEmptyObject(dates)) {
            //     monthend.config.min = {
            //         year: "1900",
            //         month: "1", //关键
            //         date: "1",
            //         hours: 0,
            //         minutes: 0,
            //         seconds: 0
            //     }
            // } else {
            //     monthend.config.min = {//开始日选好后，重置结束日的最小日期
            //         year: dates.year,
            //         month: dates.month - 1, //关键
            //         date: dates.date,
            //         hours: 0,
            //         minutes: 0,
            //         seconds: 0
            //     };
            // }
        }
    });
    var monthend = laydate.render({
        elem: '#ee_cjsjMonth'
        , trigger: "click"
        , type: "month"
        , max: (new Date()).getTime()
        , btns: ['clear', 'confirm']
        , theme: '#2F4056'  //设置主题颜色
        , done: function (value, dates) {
            lastmonthDay = "";
            var year = value.substring(0, 4);
            var month = value.substring(5, 7);
            lastmonthDay = getFirstAndLastMonthDay(year, month);
            // if ($.isEmptyObject(dates)) {
            //     //如果清空或者不选择的话
            //     monthstart.config.max = {
            //         year: "2099",
            //         month: "12", //关键
            //         date: "31",
            //         hours: 0,
            //         minutes: 0,
            //         seconds: 0
            //     }
            // } else {
            //     monthstart.config.max = {//结束日选好后，重置开始日的最大日期
            //         year: dates.year,
            //         month: dates.month - 1, //关键
            //         date: dates.date,
            //         hours: 0,
            //         minutes: 0,
            //         seconds: 0
            //     };
            // }
        }
    });
    //格式化日期：yyyy-MM-dd
    function formatDate(date) {
        var myyear = date.getFullYear();
        var mymonth = date.getMonth() + 1;
        var myweekday = date.getDate();

        if (mymonth < 10) {
            mymonth = "0" + mymonth;
        }
        if (myweekday < 10) {
            myweekday = "0" + myweekday;
        }
        return (myyear + "-" + mymonth + "-" + myweekday);
    }

    var now = new Date();
    var nowTime = now.getTime();
    var day = now.getDay();
    var oneDayTime = 24 * 60 * 60 * 1000;
    var MondayTime = nowTime - (day - 1) * oneDayTime;//显示周一
    var SundayTime = nowTime + (7 - day) * oneDayTime;//显示周日
    //获取当前月的周一
    function getWeekStr(str) {
        // 将字符串转为标准时间格式
        var changeDate = {};
        var str2 = Date.parse(str);
        var date = new Date(str2);
        var currentTime = date.getTime();
        var currentDay = date.getDay();
        var changeMonday = currentTime - (currentDay - 1) * oneDayTime;//显示周一
        var changeSunday = currentTime + (7 - currentDay) * oneDayTime;//显示周日
        changeDate = {
            "changeMonday": changeMonday,
            "changeSunday": changeSunday
        }
        return changeDate;
    }
    //禁用启用日历确定按钮
    var disabledbtn = function (flag, errorweek) {
        if (flag) {
            $(".laydate-footer-btns .laydate-btns-confirm").addClass("laydisabled");
            $(".laydate-footer-btns .laydate-btns-confirm").removeAttr("lay-type");
            $(".laydate-footer-btns .laydate-btns-confirm").on("click", errorweek);
        } else {
            $(".laydate-footer-btns .laydate-btns-confirm").removeClass("laydisabled");
            $(".laydate-footer-btns .laydate-btns-confirm").attr("lay-type", 'confirm');
            $(".laydate-footer-btns .laydate-btns-confirm").off("click", errorweek);
        }
    }
    function errorweekstart(week, weekinfo) {
        weekstart.hint("请选择周一");
    }
    function errorweekend(week, weekinfo) {
        weekend.hint("请选择周日");
    }
    // 初始化按周的日期范围只能选周一和周日
    var weekstart = laydate.render({
        elem: '#ss_cjsjWeek'
        // , range: '~'
        , trigger: "click"
        , type: "date"
        , value: formatDate(new Date(MondayTime))
        , max: (new Date()).getTime()
        , btns: ['clear', 'confirm']
        , theme: '#2F4056'  //设置主题颜色
        , ready: function (date) {
            addDisable('1')
            $(".layui-laydate-header").on("click", "i", function () {
                addDisable('1')
            })
        }
        , change: function (value, date, endDate) {
            var ismonday = false;
            $("tr").each(function (i, item) {
                var tds = $(item).find("td")
                $(tds).each(function (ii, itemm) {
                    if ($(itemm).index() == 1 && $(itemm).hasClass("layui-this")) {
                        ismonday = true;
                    }
                })
            })
            if (ismonday) {
                disabledbtn(false, errorweekstart);
            } else {
                disabledbtn(true, errorweekstart);
            }
        }
        , done: function (value, dates) {
            // if ($.isEmptyObject(dates)) {
            //     weekend.config.min = {
            //         year: "1900",
            //         month: "1", //关键
            //         date: "1",
            //         hours: 0,
            //         minutes: 0,
            //         seconds: 0
            //     }
            // } else {
            //     weekend.config.min = {//开始日选好后，重置结束日的最小日期
            //         year: dates.year,
            //         month: dates.month - 1, //关键
            //         date: dates.date,
            //         hours: 0,
            //         minutes: 0,
            //         seconds: 0
            //     };
            // }
        }
    });
    var weekend = laydate.render({
        elem: '#ee_cjsjWeek'
        , trigger: "click"
        , type: "date"
        , value: formatDate(new Date(SundayTime))
        , max: (new Date(SundayTime)).getTime()
        , btns: ['clear', 'confirm']
        , theme: '#2F4056'  //设置主题颜色
        , ready: function (date) {
            addDisable('0')
            $(".layui-laydate-header").on("click", "i", function () {
                addDisable('0')
            })
        }
        , change: function (value, date, endDate) {
            var issunday = false;
            $("tr").each(function (i, item) {
                var tds = $(item).find("td")
                $(tds).each(function (ii, itemm) {
                    if ($(itemm).index() == 0 && $(itemm).hasClass("layui-this")) {
                        issunday = true;
                    }
                })
            })
            if (issunday) {
                disabledbtn(false, errorweekend);
            } else {
                disabledbtn(true, errorweekend);
            }
        }
        , done: function (value, dates) {
            // if ($.isEmptyObject(dates)) {
            //     //如果清空或者不选择的话
            //     weekstart.config.max = {
            //         year: "2099",
            //         month: "12", //关键
            //         date: "31",
            //         hours: 0,
            //         minutes: 0,
            //         seconds: 0
            //     }
            // } else {
            //     weekstart.config.max = {//结束日选好后，重置开始日的最大日期
            //         year: dates.year,
            //         month: dates.month - 1, //关键
            //         date: dates.date,
            //         hours: 0,
            //         minutes: 0,
            //         seconds: 0
            //     };
            // }
        }
    });
    // 初始化按天的日期范围
    //首次进入默认选中按天选择
    var nowdate = new Date();
    var nowdatebefore = new Date(nowdate);
    nowdatebefore.setDate(nowdate.getDate() - 6);
    var daystart = laydate.render({
        elem: '#ss_cjsjDay'
        // , range: '~'
        , trigger: "click"
        , type: "date"
        , max: (new Date()).getTime()
        , value: nowdatebefore
        , btns: ['clear', 'confirm']
        , theme: '#2F4056'  //设置主题颜色
        , done: function (value, dates) {
            // if ($.isEmptyObject(dates)) {
            //     dayend.config.min = {
            //         year: "1900",
            //         month: "1", //关键
            //         date: "1",
            //         hours: 0,
            //         minutes: 0,
            //         seconds: 0
            //     }
            // } else {
            //     dayend.config.min = {//开始日选好后，重置结束日的最小日期
            //         year: dates.year,
            //         month: dates.month - 1, //关键
            //         date: dates.date,
            //         hours: 0,
            //         minutes: 0,
            //         seconds: 0
            //     };
            // }
        }
    });
    var dayend = laydate.render({
        elem: '#ee_cjsjDay'
        , trigger: "click"
        , type: "date"
        , max: (new Date()).getTime()
        , value: nowdate
        , btns: ['clear', 'confirm']
        , theme: '#2F4056'  //设置主题颜色
        , done: function (value, dates) {
            // if ($.isEmptyObject(dates)) {
            //     //如果清空或者不选择的话
            //     daystart.config.max = {
            //         year: "2099",
            //         month: "12", //关键
            //         date: "31",
            //         hours: 0,
            //         minutes: 0,
            //         seconds: 0
            //     }
            // } else {
            //     daystart.config.max = {//结束日选好后，重置开始日的最大日期
            //         year: dates.year,
            //         month: dates.month - 1, //关键
            //         date: dates.date,
            //         hours: 0,
            //         minutes: 0,
            //         seconds: 0
            //     };
            // }
        }
    });

    function addDisable(index1) {
        $("tr").each(function (i, item) {
            var tds = $(item).find("td")
            $(tds).each(function (ii, itemm) {
                if ($(itemm).index() != index1) {
                    $(itemm).addClass("laydate-disabled");
                }
            })
        })
    }

    //用来检验检查开始时间不能大于检查结束时间
    function checkDate() {
        var isright = true;
        var startDate = $("input[name='dateBegin']").val();
        var endDate = $("input[name='dateEnd']").val();
        if (startDate.length > 0 && endDate.length > 0) {
            var startDateTemp = startDate.split("-");
            var endDateTemp = endDate.split("-");
            if (dataType == "month") {
                var allStartDate = new Date(startDateTemp[0], startDateTemp[1]);
                var allEndDate = new Date(endDateTemp[0], endDateTemp[1]);
            } else {
                var allStartDate = new Date(startDateTemp[0], startDateTemp[1], startDateTemp[2]);
                var allEndDate = new Date(endDateTemp[0], endDateTemp[1], endDateTemp[2]);
            }

            if (allStartDate.getTime() > allEndDate.getTime()) {
                layer.msg("开始时间不能大于结束时间");
                isright = false;
            } else {
                isright = true;
            }
        }
        return isright;
    }


    table.on('tool(chartsZhu-table-operate)', function (obj) {
        var data = obj.data;
        var titledata = urlrelated.requestBody.data;
        var datetype = "按天";
        if (titledata.dateType == "month") {
            datetype = "按月";
        } else if (titledata.dateType == "week") {
            datetype = "按周";
        } else if (titledata.datetype == "day") {
            dateType = "按天";
        }
        var jgmcstr = data.jgmc;
        if (jgmcstr.length > 10) {
            jgmcstr = jgmcstr.substring(0, 10) + "...";
        }
        if (obj.event === 'detail') {
            // location.href="./gather_cjl_detail.html?name"+data.orgName;
            layer.open({
                title: '<span style="font-weight: 650;font-size: 16px;" title="' + data.jgmc + '">' + jgmcstr + '</span>' + '<span style="font-weight: 650;font-size: 16px;">&nbsp;&nbsp;&nbsp;&nbsp;' + datetype + ' ' + '(' + dateBegin + '至' + dateEnd + ')</span>',
                type: 2,
                move: false,
                area: ['800px', '600px'],
                resize: false,
                content: ['./gather_cjl_detail.html?name' + data.jgmc, "no"],
                btn: ['取消'],
                yes: function (index, layero) {
                    // var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                    // var selectTreeOrg = iframeWin.getSelectOrg();
                    // $("#prev_org").val(selectTreeOrg[0].title);

                    layer.close(index);
                },
                success: function (layero, index) {
                    var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                    var request = {
                        "dateType": dataType,
                        "fjjgdm": data.jgdm,
                        "typeCode": "1",
                        "dateBegin": urlrelated.requestBody.data.dateBegin,
                        "dateEnd": urlrelated.requestBody.data.dateEnd
                    }
                    iframeWin.getInfo(request);
                    // iframeWin.layui.initTree("single");
                }
            });
        }
    });
    function addChartsZhu(id, data) {
        //解析数据
        if (data == undefined) return;
        if (myChartzhu != null && myChartzhu != "" && myChartzhu != undefined) {
            myChartzhu.dispose();
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
        myChartzhu = echarts.init(document.getElementById(id));

        var optionzhu = {
            color: ['#3AA1FF', '#4CCA73'],
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
                        // interval: 0,         坐标轴间隔默认是auto 占不下自己隐藏 为0的话 最后一个会加粗
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
                    name: "采集量",
                    type: 'bar',
                    barGap: 0,
                    data: data.seriesData,
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
                    data: data.seriesData2,
                    // markLine: {
                    //     data: [
                    //         {type: 'average', name: '平均值'}
                    //     ]
                    // }
                }
            ],
            dataZoom: onlyone
        };
        myChartzhu.setOption(optionzhu);
        myChartzhu.on('mouseover', function (params) {
            if (params.componentType == 'xAxis') {
                layer.msg(params.value);
            }
        });
        myChartzhu.on('mouseout', function (params) {
            if (params.componentType == 'xAxis') {
                layer.closeAll();
            }
        });
    }
    function addChartsBing(id, data) {
        if (data == undefined) return;
        if (myChartbing != null && myChartbing != "" && myChartbing != undefined) {
            myChartbing.dispose();
        }
        var uncheckedlist = {};
        for (var i = 0; i < data.length; i++) {
            if (data[i].value == 0) {
                uncheckedlist[data[i].name] = false;
            }
        }
        //   现在数组的长度  减去 之前记录数组的长度的数据   返回新数组  是饼图的数据
        myChartbing = echarts.init(document.getElementById(id));
        myChartbing.resize();
        
        // 指定图表的配置项和数据
        var optionbing = {
            color: ['#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed',
                '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
                '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700',
                '#6699FF', '#ff6666', '#3cb371', '#b8860b', '#30e0e0'],
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
            legend: {
                itemWidth: 20,             // 图例图形宽度
                itemHeight: 14,            // 图例图形高度
                textStyle: {
                    color: '#333'          // 图例文字颜色
                },
                type: 'scroll',
                orient: 'vertical',
                right: 10,
                top: 100,
                bottom: 20,
                selected: uncheckedlist
            },
            radius: '50%',
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)",
            },
            grid: {
                left: '5%',
                right: '5%',
                top: "7%",
                containLabel: true,
                height: "100%",
                tooltip: {
                    borderColor: "#DD5145"
                }
            },
            series: [
                {
                    name: '当前机构',
                    type: 'pie',
                    radius: '50%',
                    center: ['40%', '50%'],
                    label: {                //设置值域标签
                        normal: {
                            formatter: function (name) {
                                var names = name.name;
                                if (!names) return '';
                                if (names.length > 10) {
                                    return name.name = names.slice(0, 10) + '...';
                                }
                            },
                            textStyle: {
                                fontWeight: 'normal',
                                fontSize: 12,
                            }
                        }
                    },
                    // center: ['50%', '60%'],
                    avoidLabelOverlap: false,   //是否启用防止标签重叠策略
                    labelLine: {        //设置值域标签的指向线
                        normal: {
                            length: 10,
                            length2: 30,
                            lineStyle: {
                                color: '#333'
                            }

                        }
                    },
                    data: data
                }

            ],
        };
        myChartbing.setOption(optionbing);
    }
    function addChartsZhe(id, data) {
        //   type判断哪个页面调用这个方法   1主页面双折线  其他两个页面单折现0
        if (data == undefined) return;
        if (myChartzhe != null && myChartzhe != "" && myChartzhe != undefined) {
            myChartzhe.dispose();
        }
        var onlyone = [{
            type: 'slider',
            startValue: 0, //数据窗口范围的起始数值
            endValue: 31, //数据窗口范围的结束数值。
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
        if (data.seriesData.length > 31) {
            onlyone = [{
                type: 'slider',
                startValue: data.seriesData.length - 31, //数据窗口范围的起始数值
                endValue: data.seriesData.length, //数据窗口范围的结束数值。
                top: "75%"
            }]
        }
        myChartzhe = echarts.init(document.getElementById(id));
        myChartzhe.resize();

        //    第一个页面
        optionzhe = {
            color: ["#147BD9", "#28A54D"],
            legend: {
                data: ['采集量', '采集总量']
            },
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
            grid: {
                left: '5%',
                right: '10%',
                top: "7%",
                bottom: "0%",
                containLabel: true,
                height: "65%",
                tooltip: {
                    borderColor: "#DD5145"
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,          //X轴左右留白
                // interval: 0,                   //坐标轴间隔默认是auto 占不下自己隐藏 为0的话 最后一个会加粗
                data: data.xAxisData,
                axisLabel: {
                    show: true,
                    rotate: 40,
                }
            },
            yAxis: [
                {
                    name: '采集量',
                    type: 'value'
                },
                {
                    name: '采集总量',
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '采集量',
                    type: 'line',
                    yAxisIndex: 0,
                    data: data.seriesData
                },
                {
                    name: '采集总量',
                    type: 'line',
                    yAxisIndex: 1,
                    data: data.seriesData2
                }
            ],
            dataZoom: onlyone
        };
        myChartzhe.setOption(optionzhe);
    }

    //进图页面自动查询
    $("#ss_button").click();

    //导出功能--折线图
    $("#exportZhe").on("click", function () {
        var table_cache = layui.table.cache.charts_zhe_table;
        if (table_cache.length == 0) {
            layer.msg("暂无数据");
            return
        }
        var loadingIndex2 = layer.load(1, {
            shade: 0.3
        });
        urlrelated.requestBody.data = {
            "dateType": dataType,
            "typeCode": "1",        //1是采集 2是识别
            "dateBegin": dateBegin + ' ' + '00:00:00',
            "dateEnd": dateEnd + ' ' + '23:59:59',
            "fjjgdm": orgdm,
            "queryType": loginuserinfo.querytypeItem
        };
        $.ajax({
            url: urlrelated.exportGatherCountZx,
            type: "post",
            // async: false,
            data: JSON.stringify(urlrelated.requestBody),
            cache: false,
            timeout: 120000,
            contentType: "application/json;charset=UTF-8",  //推荐写这个
            dataType: "json",
            success: function (res) {
                if (res.status == 200) {
                    layer.close(loadingIndex2);
                    var url = urlrelated.downloadUrlPre + res.data.fileName;
                    autoDownloadUrl(url);
                } else {
                    layer.msg(res.message);
                }
            },
            error: function (tt) {
                layer.close(loadingIndex2);
                //只要进error就跳转到登录页面
                ex.errorLogin();
            }
        });
    })
    //导出功能--柱状图
    $("#exportZhu").on("click", function () {
        var table_cache = layui.table.cache.charts_zhu_table;
        if (table_cache.length == 0) {
            layer.msg("暂无数据");
            return
        }
        var loadingIndex3 = layer.load(1, {
            shade: 0.3
        });
        urlrelated.requestBody.data = {
            "dateType": dataType,
            "typeCode": "1",        //1是采集 2是识别
            "dateBegin": dateBegin + ' ' + '00:00:00',
            "dateEnd": dateEnd + ' ' + '23:59:59',
            "fjjgdm": orgdm
        };
        $.ajax({
            url: urlrelated.exportGatherOrgZz,
            type: "post",
            // async: false,
            data: JSON.stringify(urlrelated.requestBody),
            cache: false,
            timeout: 120000,
            contentType: "application/json;charset=UTF-8",  //推荐写这个
            dataType: "json",
            success: function (res) {
                if (res.status == 200) {
                    layer.close(loadingIndex3);
                    var url = urlrelated.downloadUrlPre + res.data.fileName;
                    autoDownloadUrl(url);
                } else {
                    layer.msg(res.message);
                }
            },
            error: function (tt) {
                layer.close(loadingIndex3);
                //只要进error就跳转到登录页面
                ex.errorLogin();
            }
        });
    })
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