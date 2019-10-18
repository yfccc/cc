//注意：选项卡 依赖 element 模块，否则无法进行功能性操作
layui.use(['element', 'laydate', 'table', "layer", "extension", "urlrelated"], function () {
    var $ = layui.$,
        element = layui.element,
        carousel = layui.carousel,
        laydate = layui.laydate,
        table = layui.table,
        layer = layui.layer;
    ex = layui.extension,
        echartszhedata = {},
        urlrelated = layui.urlrelated;
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
    var myChartzhe; //echarts图表变量
    // 0为按部门查询，1为按人员查询
    var cxbs = 0;
    // 判断选项卡，给cxbs赋相应的

    var boolBS = false;
    // 图表自适应，宽高样式，方法抽取
    function autoChange() {
        var bgWidth = $("#bgDIV").width() - 45;
        var winHeight = $(window).height();
        var winWidth = bgWidth + 20;

        $("#duidiezhuzhuangtu").css("height", winHeight * 0.7);
        $("#duidiezhuzhuangtu").css("width", winWidth);

    }
    var urldata = ex.getRequestParams(location.search);
    urlrelated.requestBody.data = requestinfo;
    var loadingIndex = layer.load(1, {
        shade: 0.3
    });
    //请求生成折线图
    $.ajax({
        url: urlrelated.collectionAmountList,
        type: "post",
        // async: false,
        data: JSON.stringify(urlrelated.requestBody),
        cache: false,
        timeout: 120000,
        contentType: "application/json;charset=UTF-8",  //推荐写这个
        dataType: "json",
        success: function (res) {
            layer.close(loadingIndex);
            echartszhedata = res;
            $("#charts_zhe").css({
                "width": "100%",
                "height": "100%"
            });
            var xAxisData = [];
            var seriesData = [];
            var seriesData2 = [];
            for (var i = 0; i < echartszhedata.data.length; i++) {
                xAxisData.push(echartszhedata.data[i].datetime);
                seriesData.push(echartszhedata.data[i].successCount);
                seriesData2.push(echartszhedata.data[i].failCount);
            }
            var addzheData = {
                xAxisData: xAxisData,
                seriesData: seriesData,
                seriesData2: seriesData2
            };
            var colinfozhe = [
                { field: 'datetime', minWidth: 200, title: '时间' }
                , { field: 'count', title: '核查量' }
                , { field: 'successCount', title: '核查量(比中)' }
                , { field: 'failCount', title: '核查量(未比中)' }
                , { field: 'totalCount', title: '核查总量' }
            ]
            addChartszhe("charts_zhe", addzheData);
            ex.addTable("#charts_zhe_table", echartszhedata.data, colinfozhe);
        },
        error: function (xml, textstatus, thrown) {
            layer.close(loadingIndex);
            //只要进error就跳转到登录页面
            extension.errorInOpen();
        }
    });

    function addChartszhe(id, data) {
        //   type判断哪个页面调用这个方法   1主页面双折线  其他两个页面单折现0
        if (data == undefined) return;
        if (myChartzhe != null && myChartzhe != "" && myChartzhe != undefined) {
            myChartzhe.dispose();
        }
        myChartzhe = echarts.init(document.getElementById(id));
        myChartzhe.resize();

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
        //    第一个页面
        optionzhe = {
            color: ["#147BD9", "#28A54D"],
            legend: {
                data: ['核查量(比中)', '核查量(未比中)']
            },
            noDataLoadingOption: {
                text: '无数据',
                "textStyle": {
                    "fontSize": 20,
                    "fontWeight": 400
                },
                effect: 'bubble'
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
                boundaryGap: true,
                axisLabel: {
                    show: true,
                    // interval: 0,     //坐标轴间隔默认是auto 占不下自己隐藏 为0的话 最后一个会加粗
                    rotate: 40
                },
                data: data.xAxisData
            },
            yAxis: [
                {
                    name: '核查量(比中)',
                    type: 'value'
                },
                {
                    name: '核查量(未比中)',
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '核查量(比中)',
                    type: 'line',
                    yAxisIndex: 0,
                    areaStyle: {},
                    data: data.seriesData
                },
                {
                    name: '核查量(未比中)',
                    type: 'line',
                    yAxisIndex: 1,
                    areaStyle: {},
                    data: data.seriesData2
                }
            ],
            dataZoom: onlyone
        };
        myChartzhe.setOption(optionzhe);
    }

});

var requestinfo = {}
function getInfo(obj) {
    requestinfo = obj;
    return requestinfo
}