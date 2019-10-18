layui.use(["element", "urlrelated", "layer", "carousel", "extension"], function () {
    var el = layui.element;
    layer = layui.layer,
        urlrelated = layui.urlrelated,
        extension = layui.extension,
        loginuserinfo = extension.getUserInfo();      //获取用户登录信息
    var identifyZhe, gatherZhe;   //echarts图表变量
    var getsignData = {
        "token": localStorage.getItem("token"),
        "data": {
            "userJGDM": loginuserinfo.userJGDM
        },
        "page": 1,
        "limit": 1,
        "platform": "1007",
        "userId": localStorage.getItem("userId"),
        "userName": localStorage.getItem("userName"),
        "userJGDM": localStorage.getItem("userJGDM")
    };
    getsignData = JSON.stringify(getsignData);
    $.ajax({
        url: urlrelated.noticeDisplay,
        type: "post",
        data: getsignData,
        cache: false,
        contentType: "application/json;charset=UTF-8", //推荐写这个
        dataType: "json",
        success: function (res) {
            setTimeout(function () {
                if (res.data.items.length != 0) {
                    var text = res.data.items[0].noticeContent.replace(/<[^>]+>/g, "")
                    $("#sign_title").text(res.data.items[0].noticeTitle);
                    $("#sign_time").text(res.data.items[0].noticeDtStr);
                    $("#sign_content").html(text);
                }
            }, 200)
        },
        error: function (tt) {
            layer.msg("错误");
        }
    });
    //统计分析开始结束时间获取
    var date = new Date();
    // date.setDate(1);
    // var weekdayArray = new Array(7);
    // weekdayArray[0] = "星期日";
    // weekdayArray[1] = "星期一";
    // weekdayArray[2] = "星期二";
    // weekdayArray[3] = "星期三";
    // weekdayArray[4] = "星期四";
    // weekdayArray[5] = "星期五";
    // weekdayArray[6] = "星期六";
    //获取本月第一天是周几
    if (date.getDay() == 0) {
        date.getDay() = 7
    }
    var now = new Date(date.setDate(1) - (date.getDay() - 1) * 24 * 60 * 60 * 1000);
    var Eyear = now.getFullYear();
    var Emonth = now.getMonth() + 1;
    var Edate = now.getDate();
    if (Emonth > 9)
        Emonth = "-" + Emonth;
    else
        Emonth = "-0" + Emonth;
    if (date > 9)
        Edate = "-" + Edate;
    else
        Edate = "-0" + Edate;
    var currentMonth = date.getMonth();
    var nextMonth = ++currentMonth;
    var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
    var oneDay = 1000 * 60 * 60 * 24;
    var lastTime = new Date(nextMonthFirstDay - oneDay);
    var month = parseInt(lastTime.getMonth() + 1);
    var day = lastTime.getDate();
    if (month < 10) {
        month = '0' + month
    }
    if (day < 10) {
        day = '0' + day
    }
    var dateEnd = date.getFullYear() + '-' + month + '-' + day + " " + "23:59:59";
    var dateBegin = Eyear + Emonth + Edate + " " + "00:00:00";
    var gatherdata = {
        "dateType": "week",
        "typeCode": "1",
        "dateBegin": dateBegin,
        "dateEnd": dateEnd,
        "userId": loginuserinfo.userId,
        "queryType": "3"
    };
    var identifydata = {
        "dateType": "week",
        "typeCode": "2",
        "dateBegin": dateBegin,
        "dateEnd": dateEnd,
        "userId": loginuserinfo.userId,
        "queryType": "3"
    };
    requestecharts(gatherdata, true);
    requestecharts(identifydata, false);
    function requestecharts(requestdata, isgather) {
        urlrelated.requestBody.data = requestdata;
        $.ajax({
            url: urlrelated.collectionAmountList,
            type: "post",
            data: JSON.stringify(urlrelated.requestBody),
            cache: false,
            contentType: "application/json;charset=UTF-8", //推荐写这个
            dataType: "json",
            success: function (res) {
                if (res.status == 200) {
                    var xAxisData = [];
                    var seriesData = [];
                    var seriesData2 = [];
                    if (res.data.length != 0) {
                        for (var i = 0; i < res.data.length; i++) {
                            xAxisData.push(res.data[i].datetime);
                            seriesData.push(res.data[i].successCount);
                            seriesData2.push(res.data[i].failCount);
                        }
                    }
                    var addzheData = {
                        xAxisData: xAxisData,
                        seriesData: seriesData,
                        seriesData2: seriesData2
                    };
                    if (isgather) {
                        addGatherZhe("gather-charts", addzheData);
                    } else {
                        addIdentifyZhe("identify-charts", addzheData);
                    }
                } else {
                    layer.msg(res.message, { icon: "5" })
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                var status = XMLHttpRequest.status;
            }
        });
    }

    //生成堆叠折线图--采集量
    function addGatherZhe(id, data) {
        $("#gather-charts").css({
            "height": "80%"
        });
        //   type判断哪个页面调用这个方法   1主页面双折线  其他两个页面单折现0
        if (data == undefined) return;
        if (gatherZhe != null && gatherZhe != "" && gatherZhe != undefined) {
            gatherZhe.dispose();
        }
        gatherZhe = echarts.init(document.getElementById(id));
        gatherZhe.resize();

        //    第一个页面
        optionzhe = {
            color: ["#147BD9", "#28A54D"],
            legend: {
                data: ['采集量(成功)', '采集量(失败)']
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
                left: '10%',
                right: '10%',
                top: "20%",
                bottom: "0%",
                containLabel: true,
                height: "65%",
                tooltip: {
                    borderColor: "#DD5145"
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                data: data.xAxisData
            },
            yAxis: [
                {
                    name: '采集量(成功)',
                    type: 'value'
                },
                {
                    name: '采集量(失败)',
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '采集量(成功)',
                    type: 'line',
                    yAxisIndex: 0,
                    areaStyle: {},
                    data: data.seriesData
                },
                {
                    name: '采集量(失败)',
                    type: 'line',
                    yAxisIndex: 1,
                    areaStyle: {},
                    data: data.seriesData2
                }
            ]
        };
        gatherZhe.setOption(optionzhe);
    }

    // 生成堆叠折线图--识别量
    function addIdentifyZhe(id, data) {
        $("#identify-charts").css({
            "height": "80%"
        });
        //   type判断哪个页面调用这个方法   1主页面双折线  其他两个页面单折现0
        if (data == undefined) return;
        if (identifyZhe != null && identifyZhe != "" && identifyZhe != undefined) {
            identifyZhe.dispose();
        }
        identifyZhe = echarts.init(document.getElementById(id));
        identifyZhe.resize();

        //    第一个页面
        optionzhe = {
            color: ["#147BD9", "#28A54D"],
            legend: {
                data: ['识别量(比中)', '识别量(未比中)']
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
                left: '10%',
                right: '10%',
                top: "20%",
                bottom: "0%",
                containLabel: true,
                height: "65%",
                tooltip: {
                    borderColor: "#DD5145"
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                data: data.xAxisData
            },
            yAxis: [
                {
                    name: '识别量(比中)',
                    type: 'value'
                },
                {
                    name: '识别量(未比中)',
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '识别量(比中)',
                    type: 'line',
                    yAxisIndex: 0,
                    areaStyle: {},
                    data: data.seriesData
                },
                {
                    name: '识别量(未比中)',
                    type: 'line',
                    yAxisIndex: 1,
                    areaStyle: {},
                    data: data.seriesData2
                }
            ]
        };
        identifyZhe.setOption(optionzhe);
    }
    window.onresize = function () {
        gatherZhe.resize();
        identifyZhe.resize();
    }
});
// layuiuse里面找不到
$(document).on("click", "li a", function () {
    //  权限要用的id
    var thisQuertype = $(this).attr("queryType")
    localStorage.setItem("querytypeItem", thisQuertype)
    //左侧菜单栏状态
    var thisText = $(this).text();
    var subTitle = window.parent.document.getElementById("sub-title-span");
    $(subTitle).text(thisText)
    var leftMenu = window.parent.document.getElementById("left-menu");
    var leftMenuItem = $(leftMenu).find(".layui-nav-item");
    $(leftMenuItem).each(function (i, item) {
        var itemA = $(item).find(".letMenuA")
        $(itemA).each(function (ii, itemm) {
            var itemAtext = $(itemm).text();
            if (thisText == itemAtext) {
                // 同步主页左侧状态栏 
                $(itemm).parents(".layui-nav-item").addClass("layui-nav-itemed")
                $(itemm).parent().addClass("layui-this")
                // el.init()
                return
            }
        })

    })
})
$(".content li").find("span").click(function () {
    $(this).next().trigger("click")
    var nextHref = $(this).next().attr("href")
    window.location.href = nextHref
})