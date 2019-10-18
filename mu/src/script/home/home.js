layui.use(['index', 'element', 'echarts', 'laydate', 'form'], function() {
    var $ = layui.$, element = layui.element, echarts = layui.echarts,
        carousel = layui.carousel, laydate = layui.laydate, form = layui.form;

    var sjsjStart,sjsjEnd,id,name;
    //图表自适应，声明在这里了
    var zhuChart,zhuChart1;

    $.get("/time",function(result){
        sjsjStart=result[1];
        sjsjEnd=result[0];
        id=result[2];
        name=result[3];

        /*    alert(sjsjStart);
             alert(sjsjEnd);
             alert(id);*/

        /*-----------------------------------------------------------------------------------------------------------------------------------------------------*/

        $.get("/gather_record/sjtjList",{sjsjStart:sjsjStart, sjsjEnd:sjsjEnd ,flg_wo:"", /*id:id,*/ time:new Date()},function(result){
            /*    alert(sjsjStart);
                alert(sjsjEnd);*/
            /* alert(name);*/
            //采集时间集合
            var cdtlist = [];
            //采集数量集合
            var cjslList = [];

            var resultObj = eval("(" + result + ")");
            var data = resultObj.data;

            var nums = [];



            for (var i = 0; i < data.length; i++) {
                cdtlist[i] = data[i].cdt;
                cjslList[i] = data[i].count;

                var bing = {};
                bing.name = data[i].cdt;
                bing.value = data[i].count;
                nums.push(bing)
            }


            //柱状图
            zhuChart = echarts.init(document.getElementById('biao1'));
            zhuChart.setOption({
                noDataLoadingOption: {
                    text: '暂无数据',
                    "textStyle": {
                        "fontSize": 20,
                        "fontWeight":400
                    },
                    effect: 'bubble'
                },
                backgroundColor: 'white',
                title: {
                    text: '人数（单位：人）',
                    x: 60,
                    y: 30,
                    "textStyle": {
                        "fontSize": 14,
                        "fontWeight":400
                    }
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: []
                },
                xAxis: {
                    data: cdtlist
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: '采集人数',
                        type: 'bar',
                        data: nums,
                    }
                ]
            });
        });


        /*----------------------------------------------------------------------------------------------------------------------------------------------------*/

        $.get("/identify_record/sjtjList",{sjsjStart:sjsjStart, sjsjEnd:sjsjEnd,flg_wo:"", /*id:id,*/time:new Date()},function(result){

            //采集时间集合
            var cdtlist = [];
            //采集数量集合
            var cjslList = [];

            var resultObj = eval("(" + result + ")");
            var data = resultObj.data;

            var nums = [];



            for (var i = 0; i < data.length; i++) {
                cdtlist[i] = data[i].cdt;
                cjslList[i] = data[i].count;

                var bing = {};
                bing.name = data[i].cdt;
                bing.value = data[i].count;
                nums.push(bing)
            }


            //柱状图
            zhuChart1 = echarts.init(document.getElementById('biao2'));
            zhuChart1.setOption({
                noDataLoadingOption: {
                    text: '暂无数据',
                    "textStyle": {
                        "fontSize": 20,
                        "fontWeight":400
                    },
                    effect: 'bubble'
                },
                backgroundColor: 'white',
                title: {
                    text: '人数（单位：人）',
                    x: 60,
                    y: 30,
                    "textStyle": {
                        "fontSize": 14,
                        "fontWeight":400
                    }
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: []
                },
                xAxis: {
                    data: cdtlist
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: '识别人数',
                        type: 'bar',
                        data: nums,
                    }
                ]
            });

        });
    } );
    window.onresize = function(){
        zhuChart.resize();
        zhuChart1.resize();
    };

    var openItem = 'layui-nav-itemed';
    
    $('.lay-menu li').on('click', function () {
        parent.$('.layui-nav-item').removeClass(openItem);
        var type = $(this).data('type');
        parent.$('#' + type).addClass(openItem);
    });


        //  兼容ie8
        function IEVersion() {
            var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
            var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
            var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
            var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
            if (isIE) {
                var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
                reIE.test(userAgent);
                var fIEVersion = parseFloat(RegExp["$1"]);
                if (fIEVersion == 8) {
                    //    初始状态  设置首页图表宽度自适应
                    function resize() {
                        var  wiodnWidth = $(window).width();
                        var layui_col_md6 = document.querySelectorAll(".layui-col-md6");
                        var layui_col_md12width = document.querySelectorAll(".layui-col-md12");
                        var ban  =  parseInt($(layui_col_md12width).width())/2 + 7;
                        if(wiodnWidth > 1200){
                            $(layui_col_md6).css({
                                "width":ban
                                ,"float":"left"
                            })
                        }
                        if(wiodnWidth < 1200){
                            $(".layui-col-md6").css({
                                "width":parseInt($(layui_col_md12width).width())+14,
                                "float":"none"
                            })
                        }
                    }
                    resize();
                    //尺寸变化的时候
                    $(window).resize(function () {
                        resize()
                    });
                    $(".sjjlayui-col-md6").css("margin-top",-15)
                }

            }

        }
        IEVersion()
});