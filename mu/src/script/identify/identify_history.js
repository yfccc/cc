layui.use(["layer", 'table', "element", "urlrelated"], function () {
    var table = layui.table,
        $ = layui.$,
        urlrelated = layui.urlrelated,
        layer = layui.layer,
        element = layui.element;

    var getData = {
        "platform": "1007",
        "appversion": "1.0.3",
        "apiversion": "1.0.2",
        "mac": "12345678",
        "ip": "xxx.xxx.xx.xx",
        "companyCode ": "1001",
        "token": localStorage.getItem("token"),
        "userId": localStorage.getItem("userId"), //登录用户信息_用户ID
        "data": {
            "rybh": localStorage.getItem("rybh")
        }
    };

    var cols = [];
    element.init();

    //数据格式
    table.render({
        elem: '#hmsblsjl-table',
        url: urlrelated.identifyidentifyHistory,
        method: 'post',
        contentType: "application/json;charset=UTF-8", //推荐写这个,
        where: getData,
        even: true,
        cols: [
            [ //标题栏
                {
                    field: 'hmcjCzsjStr',
                    title: '操作时间',
                    width: "30%",
                    templet: function (row) {
                        // return formatDateTime(new Date(parseInt(row.hmcjCzsj)))
                        return row.hmcjCzsjStr
                    }
                }, {
                    field: 'hmcjDlyhXm',
                    title: '操作人'
                }, {
                    field: 'hmcjCjcdmc',
                    title: '识别地点'
                }
            ]
        ],
        loading: false,
        page: true,
        limits: [10, 20, 30],
        response: {
            statusCode: 200 //重新规定成功的状态码为 200，table 组件默认为 0
        },
        parseData: function (res) { //将原始数据解析成 table 组件所规定的数据
            if (res.status != 200) {
                return {
                    "code": res.status, //解析接口状态
                    "msg": "无数据", //解析提示文本
                    "count": 0, //解析数据长度
                    "data": [] //解析数据列表
                }
            }
            return {
                "code": res.status, //解析接口状态
                "msg": res.message, //解析提示文本
                "count": res.data.count, //解析数据长度
                "data": res.data.records //解析数据列表
            };
        }
    });
    table.render({
        elem: '#hmsblsjl-table_1',
        url: urlrelated.identifyCompareHistory //全局定义常规单元格的最小宽度，layui 2.2.1 新增
            ,
        method: 'post',
        where: getData,
        contentType: "application/json;charset=UTF-8" //推荐写这个
            ,
        page: true //开启分页
            ,
        method: "post",
        limits: [10, 20, 30],
        cols: [
            [ //标题栏
                {
                    field: 'hmcjCzsjStr',
                    title: '操作时间',
                    width: "30%",
                    templet: function (row) {
                        // return  formatDateTime(new Date(parseInt(row.hmcjCzsj)))
                        return row.hmcjCzsjStr
                    }
                }, {
                    field: 'hmcjWzjcjbz',
                    title: '证件标识',
                    templet: function (row) {
                        if (row.hmcjWzjcjbz == "1") {
                            return "有证";
                        } else if (row.hmcjWzjcjbz == "0") {
                            return "无证";
                        }
                    }
                }, {
                    field: 'hmhyPpjgbdm',
                    title: '是否比中',
                    templet: function (row) {

                        if (row.hmhyPpjgbdm == "2") {
                            return "未比中";
                        } else if (row.hmhyPpjgbdm == "1") {
                            return "比中";
                        } else {
                            return "-";
                        }
                    }
                }, {
                    field: 'hmcjDlyhXm',
                    title: '操作人'
                }, {
                    field: 'hmcjCjcdmc',
                    title: '识别地点'
                }
            ]
        ],
        response: {
            statusCode: 200 //重新规定成功的状态码为 200，table 组件默认为 0
        },
        parseData: function (res) { //将原始数据解析成 table 组件所规定的数据
            if (res.status != 200) {
                return {
                    "code": res.status, //解析接口状态
                    "msg": "无数据", //解析提示文本
                    "count": 0, //解析数据长度
                    "data": [] //解析数据列表
                }
            }
            return {
                "code": res.status, //解析接口状态
                "msg": res.message, //解析提示文本
                "count": res.data.count, //解析数据长度
                "data": res.data.records //解析数据列表
            };
        }
    });
    // 防止页面后退
    $(document).on("keydown",function(event){
        var ev = event || window.event; //获取event对象 
        var obj = ev.target || ev.srcElement; //获取事件源 
        var t = obj.type || obj.getAttribute('type'); //获取事件源类型 
        var code = event.keyCode|| event.which;
        if(code == 8 && t != "password" && t != "text" && t != "textarea"){
                return false
        } 
    })

    // window.onscroll = function(){
    //     var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    //     layer.closeAll();
    // }

    // 处理table中的显示详情在一些场景下不会关掉的问题。
    // $(document).on('click', function (event) {
    //     var tableTips = $('.layui-layer.layui-layer-tips.layui-table-tips');
    //     if (tableTips.length) {
    //         var tagElem = event.target || event.srcElement;
    //         if (tableTips.find(tagElem).length) {
    //             layui.stope(event);
    //         } else {
    //             layui.layer.close(tableTips.attr('times'));
    //         }
    //     }
    // });


});