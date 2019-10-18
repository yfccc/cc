layui.use(['element', 'laydate', 'table', 'form'], function () {
    var laydate = layui.laydate,
        element = layui.element,
        table = layui.table,
        $ = layui.$,
        layer = layui.layer,
        form = layui.form;
    form.render();
    $("#querytype").val(localStorage.getItem("querytypeItem"))
    // 防止页面后退
    history.pushState(null, null, document.URL);
    window.addEventListener('popstate', function () {
        history.pushState(null, null, document.URL);
    });
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var date = d.getDate();
    var day = d.getDay();
    var curDateTime = year;
    if (month > 9)
        curDateTime = curDateTime + "-" + month;
    else
        curDateTime = curDateTime + "-0" + month;
    if (date > 9)
        curDateTime = curDateTime + "-" + date;
    else
        curDateTime = curDateTime + "-0" + date;

    //日期范围
    laydate.render({
        elem: '#test-laydate-range-date',
        range: '~',
        trigger: "click",
        max: curDateTime,
        theme: '#2F4056' //设置主题颜色
            ,
        done: function (value, date, endDate) {
            if (isIE89()) {
                if (value !== "") {
                    $(".dateSpan").css("display", "none")
                }
                if (value == "") {
                    $(".dateSpan").css("display", "block")
                }
            }
        }
    });

    laydate.render({
        elem: '#test-laydate-range-date1',
        range: '~',
        theme: '#2F4056' //设置主题颜色
    });


    // var url = "/information/getPersonList";
    // //监听Tab切换，以改变url值
    // element.on('tab(component-tabs-brief)', function () {
    //     url = "/information/getPersonList";
    //     table.reload();
    // });
    table.render({
        elem: '#test-table-page',
        data: [],
        limits: [10, 20, 30],
        cols: [
            [{
                field: 'bcjr_xm',
                width: 120,
                title: '修改时间'
            }, {
                field: 'bcjr_ryfl',
                width: 172,
                title: '姓名'
            }, {
                field: 'bcjr_xb',
                width: 170,
                title: '人员分类'
            }, {
                field: 'bcjr_gj',
                width: 120,
                title: '人员标签'
            }, {
                field: 'bcjr_mz',
                width: 110,
                title: '专题库'
            }, {
                field: 'bcjr_xm',
                width: 120,
                title: '性别'
            }, {
                field: 'bcjr_ryfl',
                width: 172,
                title: '国籍'
            }, {
                field: 'bcjr_xb',
                width: 170,
                title: '民族'
            }, {
                field: 'bcjr_gj',
                width: 120,
                title: '证件标志'
            }, {
                field: 'bcjr_mz',
                width: 110,
                title: '证件类型'
            }, {
                field: 'bcjr_xm',
                width: 120,
                title: '证件号'
            }, {
                field: 'bcjr_ryfl',
                width: 172,
                title: '采集时间'
            }, {
                field: 'bcjr_xb',
                width: 170,
                title: '操作类型'
            }, {
                field: 'bcjr_gj',
                width: 120,
                title: '最后修改人'
            }, {
                field: 'bcjr_mz',
                width: 110,
                title: '虹膜信息'
            }, {
                field: 'bcjr_mz',
                width: 110,
                title: '操作'
            }]
        ],
        loading: false,
        page: true,
        where: {
            time: new Date()
        },
        done: function (res, curr, count) {
            // // 鼠标在table框上移动时候  高度变高
            // var   box =  $("#box_height").find(".layui-table-body").find (".layui-table-box")
            // var   height =  $(box).find(".layui-table-body").css("height")
            // var  boxheight = parseInt(height)+40+"px"
            // $(box).css("height",boxheight);
        }
    });

    //Format("2016-10-04 8:9:4.423","yyyy-MM-dd hh:mm:ss.S") ==> 2016-10-04 08:09:04.423
    // Format("1507353913000","yyyy-M-d h:m:s.S")      ==> 2017-10-7 13:25:13.0
    function Format(datetime, fmt) {

        if (datetime == null || datetime == "") {
            return "-";
        }

        if (parseInt(datetime) == datetime) {
            if (datetime.length == 10) {
                datetime = parseInt(datetime) * 1000;
            } else if (datetime.length == 13) {
                datetime = parseInt(datetime);
            }
        }
        datetime = new Date(datetime);
        var o = {
            "M+": datetime.getMonth() + 1, //月份
            "d+": datetime.getDate(), //日
            "h+": datetime.getHours(), //小时
            "m+": datetime.getMinutes(), //分
            "s+": datetime.getSeconds(), //秒
            "q+": Math.floor((datetime.getMonth() + 3) / 3), //季度
            "S": datetime.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (datetime.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
});