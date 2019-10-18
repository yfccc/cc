//layui扩展模块  还没有写
layui.define(["table", "urlrelated"], function (exports) {
    var table = layui.table,
        urlrelated = layui.urlrelated;
    var myChartzhu, myChartzhe, myChartbing;
    var active = {
        dropDownList: null,
        userInfo: null,
        addzhu: function (id, data) {
            //解析数据
            if (data == undefined) return;
            if (myChartzhu != null && myChartzhu != "" && myChartzhu != undefined) {
                myChartzhu.dispose();
            }
            //添加柱状图
            myChartzhu = echarts.init(document.getElementById(id));
            var optionzhu = {
                color: ['#3AA1FF', '#4CCA73'],
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    itemWidth: 20, // 图例图形宽度
                    itemHeight: 14, // 图例图形高度
                    textStyle: {
                        color: '#333' // 图例文字颜色
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
                xAxis: [{
                    type: 'category',
                    data: data.xAxisData,
                    axisLabel: {
                        rotate: 10
                    }
                }],
                yAxis: [{
                    type: 'value'
                }],
                series: [{
                    name: "采集量",
                    type: 'bar',
                    barGap: 0,
                    data: data.seriesData
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
                    data: data.seriesData
                    // markLine: {
                    //     data: [
                    //         {type: 'average', name: '平均值'}
                    //     ]
                    // }
                }
                ],
                dataZoom: [{
                    type: 'slider',
                    startValue: 0, //数据窗口范围的起始数值
                    endValue: 14, //数据窗口范围的结束数值。
                    top: "75%"
                }]
            };
            myChartzhu.setOption(optionzhu);
        },
        addBing: function (id, data) {
            if (data == undefined) return;
            if (myChartbing != null && myChartbing != "" && myChartbing != undefined) {
                myChartbing.dispose();
            }
            //   现在数组的长度  减去 之前记录数组的长度的数据   返回新数组  是饼图的数据
            myChartbing = echarts.init(document.getElementById(id));
            myChartbing.resize();
            // 指定图表的配置项和数据
            var optionbing = {
                color: ['#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed',
                    '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
                    '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700',
                    '#6699FF', '#ff6666', '#3cb371', '#b8860b', '#30e0e0'
                ],
                title: {
                    textStyle: {
                        color: "#fff"
                    },
                    top: "0",
                    left: "45%"
                },
                legend: {
                    itemWidth: 20, // 图例图形宽度
                    itemHeight: 14, // 图例图形高度
                    textStyle: {
                        color: '#333' // 图例文字颜色
                    }
                },
                radius: '50%',
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
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
                series: [{
                    name: '当前机构',
                    type: 'pie',
                    radius: '50%',
                    label: { //设置值域标签
                        normal: {
                            formatter: function (name) {
                                var names = name.name;
                                if (!names) return '';
                                if (names.length > 5) {
                                    return name.name = names.slice(0, 10) + '...';
                                }

                            },
                            textStyle: {
                                fontWeight: 'normal',
                                fontSize: 12
                            }
                        }
                    },
                    // center: ['50%', '60%'],
                    avoidLabelOverlap: false, //是否启用防止标签重叠策略
                    labelLine: { //设置值域标签的指向线
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

                ]
            };
            myChartbing.setOption(optionbing);
        },
        addChartszhe: function (id, data) {
            //   type判断哪个页面调用这个方法   1主页面双折线  其他两个页面单折现0
            if (data == undefined) return;
            if (myChartzhe != null && myChartzhe != "" && myChartzhe != undefined) {
                myChartzhe.dispose();
            }
            myChartzhe = echarts.init(document.getElementById(id));
            myChartzhe.resize();

            //    第一个页面
            optionzhe = {
                color: ["#147BD9", "#28A54D"],
                legend: {
                    data: ['采集量', '采集总量']
                },
                tooltip: {
                    trigger: 'item'
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
                    boundaryGap: true, //X轴左右留白
                    data: data.xAxisData
                },
                yAxis: [{
                    name: '采集量',
                    type: 'value'
                },
                {
                    name: '采集总量',
                    type: 'value'
                }
                ],
                series: [{
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
                dataZoom: [{
                    type: 'slider',
                    startValue: 3, //数据窗口范围的起始数值
                    endValue: 4, //数据窗口范围的结束数值。
                    top: "75%"
                }]
            };
            myChartzhe.setOption(optionzhe);
        },
        addTable: function (id, data, colsinfo) {
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
        },
        getDialogSize: function () {
            //弹窗大小
            if ($(window).width() < 1130) {
                return {
                    width: 520 + "px",
                    height: 370 + "px"
                }
            } else {
                return {
                    width: 755 + "px",
                    height: 430 + "px"
                }
            }
        },
        getRequestParams: function (url) {
            var params = {};
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    params[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
                }
            }
            return params;
        },
        errorMessage: function (errorInfo) {
            var msg = "";
            if (errorInfo == undefined) {
                msg = "未知错误";
            } else if (typeof errorInfo == "string") {
                if (errorInfo && errorInfo.length > 100) {
                    msg = errorInfo.substr(0, 100) + "...";
                } else {
                    msg = errorInfo;
                }
            } else if (typeof errorInfo == "object") {
                if (errorInfo.message && errorInfo.message.length > 100) {
                    msg = errorInfo.message.substr(0, 100) + "...";
                } else {
                    msg = errorInfo.message;
                }
            }

            layer.open({
                title: '注意',
                icon: 2,
                content: msg
            });
        },
        getDropDownList: function () {
            var that = this;
            if (typeof that.dropDownList == "undefined" || that.dropDownList == null) {
                var json_dropList = localStorage.getItem('dropDownList');
                try {
                    that.dropDownList = JSON.parse(json_dropList);
                } catch (err) {
                    that.errorMessage(err);
                }
            }
            if (typeof that.dropDownList == "undefined" || that.dropDownList == null) {
                jQuery.support.cors = true;
                $.ajax({
                    url: urlrelated.checkList,
                    type: "post",
                    async: false,
                    data: JSON.stringify(urlrelated.requestBody),
                    cache: false,
                    contentType: "application/json",
                    dataType: "json",
                    success: function (res) {
                        if (res.status === 200) {
                            $.each(res.data, function (index, item) {
                                res.data[index] = item || [];
                            });
                            that.dropDownList = res.data;
                            localStorage.setItem('dropDownList', JSON.stringify(that.dropDownList));
                        } else {
                            that.dropDownList = {};
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        that.errorLogin();
                    }
                });
            }
            return that.dropDownList;
        },
        removeDropDownList: function () {
            this.dropDownList = null;
            localStorage.removeItem('dropDownList');
        },
        getUserInfo: function () {
            var that = this;
            if (that.userInfo == null) {
                that.userInfo = {};
                try {
                    that.userInfo["userName"] = localStorage.getItem("userName");
                    that.userInfo["userRealname"] = localStorage.getItem("userRealname");
                    that.userInfo["userId"] = localStorage.getItem("userId");
                    that.userInfo["userJGDM"] = localStorage.getItem("userJGDM");
                    that.userInfo["policeId"] = localStorage.getItem("policeId");
                    that.userInfo["JGID"] = localStorage.getItem("JGID");
                    that.userInfo["QDurl"] = localStorage.getItem("QDurl");
                    that.userInfo["SFZurl"] = localStorage.getItem("SFZurl");
                    that.userInfo["idCard"] = localStorage.getItem("idCard");
                    that.userInfo["name"] = localStorage.getItem("name");
                    that.userInfo["querytypeItem"] = localStorage.getItem("querytypeItem");
                    that.userInfo["jgmc"] = localStorage.getItem("jgmc");
                    that.userInfo["models"] = localStorage.getItem("models");
                    that.userInfo["rolesName"] = localStorage.getItem("rolesName");
                } catch (err) {
                    that.errorMessage(err);
                }
            }
            return that.userInfo
        },
        getPagePower: function (pagename) {
            var pageinfo = {};
            if (localStorage.models != '' && localStorage.models != null) {
                var model = JSON.parse(localStorage.models);
                for (var i = 0; i < model.length; i++) {
                    if (model[i].modelName == pagename) {
                        pageinfo = model[i];
                    }
                }
            }
            pageinfo["notifiedBodyStr"] = pageinfo.notifiedBody && pageinfo.notifiedBody.join(",");
            return pageinfo
        },
        errorLogin: function (indexs) {
            layer.open({
                type: 0,
                title: "<div style='font-weight:bold;color:red'>提示</div>",
                btn: ["确定"],
                resize: false,
                area: ["450px", "210px"],
                content: "<div  style='font-size:14px;color:black;text-indent:10px;line-height:70px'><span class='layui-icon layui-icon-face-cry' style='color:orangered;font-size:30px;margin-left:5px'></span><span style='margin-left:5px;line-height:66px'>账号已过期，请重新登录</span></div>",
                btn1: function (index) {
                    // 点击退出
                    if (indexs == undefined || indexs == null) {
                        window.parent.location.href = "/login.html"
                    } else {
                        window.location.href = "/login.html"
                    }
                    localStorage.clear()
                }, cancel: function () {
                    if (indexs == undefined || indexs == null) {
                        window.parent.location.href = "/login.html"
                    } else {
                        window.location.href = "/login.html"
                    }
                    localStorage.clear()
                }
            })
        },
        timeOut: function () {
            //点击退出
            layer.open({
                type: 0,
                title: "<div style='font-weight:bold;color:red'>提示</div>",
                btn: ["确定"],
                resize: false,
                area: ["450px", "210px"],
                content: "<div  style='font-size:14px;color:black;text-indent:10px;line-height:70px'><span class='layui-icon layui-icon-face-cry' style='color:orangered;font-size:30px;margin-left:5px'></span><span style='margin-left:5px;line-height:66px'>请求超时</span></div>",
                btn1: function () {
                    window.location.reload()
                }, cancel: function () {
                    window.location.reload()
                }
            })
        },
        error: function (indexs) {
            //点击退出
            layer.open({
                type: 0,
                title: "<div style='font-weight:bold;color:red'>提示</div>",
                btn: ["确定"],
                resize: false,
                area: ["450px", "210px"],
                content: "<div  style='font-size:14px;color:black;text-indent:10px;line-height:70px'><span class='layui-icon layui-icon-face-cry' style='color:orangered;font-size:30px;margin-left:5px'></span><span style='margin-left:5px;line-height:66px'>系统错误，请联系管理员</span></div>",
                btn1: function () {
                    // 点击退出
                    if (indexs == undefined || indexs == null) {

                        window.parent.location.href = "/login.html"
                    } else {
                        window.location.href = "/login.html"
                    }
                    localStorage.clear()
                }, cancel: function () {
                    // 点击退出
                    if (indexs == undefined || indexs == null) {
                        window.parent.location.href = "/login.html"
                    } else {
                        window.location.href = "/login.html"
                    }
                    localStorage.clear()
                }
            })
        },
        errorInOpen: function () {
            layer.open({
                type: 0,
                title: "<div style='font-weight:bold;color:red'>提示</div>",
                btn: ["确定"],
                resize: false,
                area: ["450px", "210px"],
                content: "<div  style='font-size:14px;color:black;text-indent:10px;line-height:70px'><span class='layui-icon layui-icon-face-cry' style='color:orangered;font-size:30px;margin-left:5px'></span><span style='margin-left:5px;line-height:66px'>账号已过期，请重新登录</span></div>",
                btn1: function (index) {
                    // 点击退出
                    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                    parent.layer.close(index); //再执行关闭 
                }, cancel: function () {
                    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                    parent.layer.close(index); //再执行关闭 
                }
            })
        },
        isIE89: function () {//兼容判断浏览器
            var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
            var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
            var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
            var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
            if (isIE) {
                var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
                reIE.test(userAgent);
                var fIEVersion = parseFloat(RegExp["$1"]);
                if (fIEVersion == 9 || fIEVersion == 8) {
                    return true
                } else {
                    return false
                }
            }
        },
        isIE8: function () {
            var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
            var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
            var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
            var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
            if (isIE) {
                var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
                reIE.test(userAgent);
                var fIEVersion = parseFloat(RegExp["$1"]);
                if (fIEVersion == 8) {
                    return true
                } else {
                    return false
                }
            }
        }
    };
    exports('extension', active);
});