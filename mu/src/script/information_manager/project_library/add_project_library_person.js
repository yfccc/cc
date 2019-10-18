layui.use(['urlrelated', 'laydate', 'table', 'form', 'extension'], function () {
    var laydate = layui.laydate
        , urlrelated = layui.urlrelated
        , extension = layui.extension
        , table = layui.table
        , $ = layui.$
        , beginDate = ""
        , endDate = ""
        , layer = layui.layer
        , form = layui.form
        , dropDownList = extension.getDropDownList()
        , userInfo = extension.getUserInfo()
        , pagepower = extension.getPagePower("人员信息管理")
    $("body", parent.document).find('#sub-title').html('专题库人员>添加');
    var args = extension.getRequestParams(location.search);
    // 防止页面后退
    $(document).on("keydown", function (event) {
        var ev = event || window.event; //获取event对象 
        var obj = ev.target || ev.srcElement; //获取事件源 
        var t = obj.type || obj.getAttribute('type'); //获取事件源类型 
        var code = event.keyCode || event.which;
        if ((code == 13 || code == 8) && t != "password" && t != "text" && t != "textarea") {
            return false;
        }
    });
    //设置返回url
    $("#cancel_person").on('click', function () {
        $(this).attr("href", "./project_person_manage.html?isId=" + args.isId)
    })
    //日期范围
    laydate.render({
        elem: '#test-laydate-range-date'
        , range: '~'
        , max: 0
        , trigger: "click"
        , theme: '#2F4056'  //设置主题颜色
        , done: function (value) {
            if (typeof value === "string" && value != "") {
                var arr = value.split('~');
                beginDate = arr[0];
                endDate = arr[1];
            } else {
                beginDate = "";
                endDate = "";
            }
            // if (isIE89()) {
            //     if (value !== "") {
            //         $(".qssj").css("display", "none")
            //     }
            //     if (value == "") {
            //         $(".qssj").css("display", "block")
            //     }
            // }
        }
    });

    var cardGenreOption = ""
        , nationalityOption = ""
        , dataSourceOption = ""
        , imNameList = ""
        , genderOption = ""
        , personClassification = ""
        , ethnicOption = ""
        , isNameList = ""
        , sblxList = "";
    //证件类型
    cardGenreOption += '<option value="" selected>请选择</option>';
    $.each(dropDownList.zjlxList, function (i, e) {
        cardGenreOption += '<option value="' + e.codeIndex + '">' + e.codeName + '</option>';
    });
    $("select[name='ZJLXDM']").html(cardGenreOption);
    //数据源
    dataSourceOption += '<option value="" selected>请选择</option>';
    dataSourceOption += '<option value=""></option>'
    $.each(dropDownList.platformList, function (i, e) {
        dataSourceOption += '<option value="' + e.codeIndex + '">' + e.codeName + '</option>';
    });
    $("select[name='platform']").html(dataSourceOption);
    //性别
    genderOption += '<option value="" selected>请选择</option>';
    $.each(dropDownList.xbList, function (i, e) {
        genderOption += '<option value="' + e.codeIndex + '">' + e.codeName + '</option>';
    });
    $("select[name='XBDM']").html(genderOption);
    //人员分类
    personClassification += '<option value="" selected>请选择</option>';
    $.each(dropDownList.ryflList, function (i, e) {
        personClassification += '<option value="' + e.codeIndex + '">' + e.codeName + '</option>';
    });
    $("select[name='RYFL']").html(personClassification);
    //民族
    ethnicOption += '<option value="" selected>请选择</option>';
    $.each(dropDownList.mzList, function (i, e) {
        ethnicOption += '<option value="' + e.codeIndex + '">' + e.codeName + '</option>';
    });
    $("select[name='MZDM']").html(ethnicOption);
    //国籍
    nationalityOption += '<option value="" selected>请选择</option>';
    $.each(dropDownList.gjList, function (i, e) {
        nationalityOption += '<option value="' + e.codeIndex + '">' + e.codeName + '</option>';
    });
    $("select[name='GJDM']").html(nationalityOption);
    //专题库
    isNameList += '<option value="" selected>请选择</option>';
    $.each(dropDownList.isNameList, function (i, e) {
        if (e != null && typeof e != 'undefined')
            isNameList += '<option value="' + e.isName + '">' + e.isName + '</option>';
    });
    $("select[name='isName']").html(isNameList);
    //人员标签
    imNameList += '<option value="" selected>请选择</option>';
    $.each(dropDownList.imNameList, function (i, e) {
        imNameList += '<option value="' + e.imName + '">' + e.imName + '</option>';
    });
    $("select[name='imName']").html(imNameList);
    //设备管理
    // eachData($("select[name='deviceTypeId']"), dropDownList.sbxhList);      //设备类型
    sblxList += '<option value="" selected>请选择</option>';
    var wyjcode = "05";
    $.each(dropDownList.sbxhList, function (i, e) {
        if (e.codeName == "望远镜形状虹膜采集识别设备") {
            wyjcode = e.codeIndex;
        }
        sblxList += '<option value="' + e.codeIndex + '">' + e.codeName + '</option>';
    });
    $("select[name='SBLXDM']").html(sblxList);
    $("select[name='SBLXDM']").val(wyjcode);
    form.render('select');

    var selected = {
        selectedcache: [],
        perCount: {},
        curr: 1,
        //重载表格
        reloadTable: function (tableId) {
            var tab_obj = person_add_tab.config;
            if (table.cache["person_add_library"].length <= 0 && tab_obj.limit * this.curr < tab_obj.page.count) {
                table.reload(tableId, {
                    page: {
                        curr: this.curr + 1
                    }
                });
            } else {
                table.reload(tableId);
            }
        },
        //判断条数是否超过上限
        addAvailable: function (i) {
            var f = this.selectedcache.length + i <= 1000;
            return f;
        },
        //table.getCache()["person_add_library"],
        //已选择列表的渲染方法
        render: function () {
            var li_html = '<li class="title">已选（' + this.selectedcache.length + '）' + (this.selectedcache.length > 0 ? '<span id="clear">清空</span></li>' : "");

            $.each(this.selectedcache, function (i, e) {
                li_html += "<li><span class='item' data-rybh='" + i + "'>" + e.xm + "&nbsp;&nbsp;&nbsp;" + e.zjhm + "</span><span class='icon'>删除</span></li>"
            });
            $(".menu").html(li_html);
            registeredClick();
        },
        //添加到表格 并移除已选中列表
        totable: function (index) {
            var removes = this.selectedcache.splice(index, 1);
            var tablecache = table.getCache()["person_add_library"];
            tablecache.push(removes);
            table.reload('person_add_library');
            this.render();
        },
        toselected: function (index) {
            if (this.addAvailable(1)) {
                var tablecache = table.getCache()["person_add_library"];
                var removes = tablecache.splice(index, 1)[0];
                this.selectedcache.push(removes);
                this.reloadTable("person_add_library");
                // table.reload('person_add_library');
                this.render();
            } else {
                layer.msg("超出可选择上限,一次最多添加1000条");
            }
        },
        //清空方法
        clearSelected: function () {
            var removes = this.selectedcache.splice(0, this.selectedcache.length);
            var tablecache = table.getCache()["person_add_library"];
            tablecache.push(removes);
            table.reload('person_add_library');
            this.render();
        },
        batchToSelected: function (arr) {
            if (this.addAvailable(arr.length)) {
                var that = this;
                $(arr).each(function (index, item) {
                    var n = -1;
                    for (var i = 0; i < table.cache["person_add_library"].length; i++) {
                        if (item.rybh == table.cache["person_add_library"][i].rybh) {
                            n = i;
                            break;
                        }
                        n = -1;
                    }
                    n > -1 && table.cache["person_add_library"].splice(n, 1);
                    that.selectedcache.push(item);
                });
                this.reloadTable("person_add_library");
                // table.reload('person_add_library');
                this.render();
            } else {
                layer.msg("超出可选择上限,一次最多添加1000条");
            }
        }
    };



    //注册点击事件
    function registeredClick() {
        //注册点击事件
        $(".menu span.icon").on("click", function () {
            var rowindex = $(this).prev().data("rybh");
            selected.totable(rowindex);
        });
        $("#clear").on("click", function () {
            selected.clearSelected();
        });
    }

    urlrelated.requestBody.data = {
        "XM": "",
        "XBDM": "",
        "ZJLXDM": "",
        "ZJHM": "",
        "CZSSJ": "",
        "RYFL": "",
        "CZESJ": "",
        "ZTK": args.isId,
        "GJDM": "",
        "MZDM": "",
        "SBLXDM": wyjcode,
        "userJGDM": userInfo.userJGDM,
        "queryType": pagepower.queryType,
        "notifiedBody": pagepower.queryType == 4 ? pagepower.notifiedBody : []
    };

    //表格
    var person_add_tab = table.render({
        elem: '#person_add_library'
        , url: urlrelated.getPersonListForAdd
        , method: 'post'
        , contentType: "application/json;charset=UTF-8"
        , defaultToolbar: ['filter']
        , toolbar: "#head_opt"
        , limits: [10, 50, 100, 500, 1000]
        , cols: [[
            { type: 'checkbox' }
            , { field: 'xm', minWidth: 149, title: '姓名' }
            , { field: 'ryfl', minWidth: 149, title: '人员分类' }
            , { field: 'xbdm', minWidth: 149, title: '性别' }
            , { field: 'gj', minWidth: 120, title: '国籍' }
            , { field: 'mz', minWidth: 110, title: '民族' }
            , { field: 'zjlx', minWidth: 130, title: '证件类型' }
            , { field: 'zjhm', minWidth: 190, title: '证件号' }
            , { field: 'sblx', minWidth: 130, title: '设备类型' }
            , { fixed: 'right', minWidth: 149, align: 'center', fixed: 'right', toolbar: '#row_opt', title: '操作' }
        ]]
        , where: urlrelated.requestBody
        , loading: true
        , page: true
        , response: {
            statusCode: 200 //重新规定成功的状态码为 200，table 组件默认为 0
        }
        , parseData: function (res) { //将原始数据解析成 table 组件所规定的数据
            if (res.status != 200) {
                return {
                    "code": res.status, //解析接口状态
                    "msg": "暂无数据", //解析提示文本
                    "count": 0, //解析数据长度
                    "data": [] //解析数据列表
                }
            }
            //获取数据成功之后的过滤操作
            var tables = res.data.records;
            if (selected.selectedcache.length > 0) {
                for (var i = tables.length - 1; i >= 0; i--) {
                    $.each(selected.selectedcache, function (n, e) {
                        if (e.rybh === tables[i].rybh) {
                            tables.splice(i, 1);
                            return false;
                        }
                    })
                };
            }
            return {
                "code": res.status, //解析接口状态
                "msg": res.message, //解析提示文本
                "count": res.data.count, //解析数据长度
                "data": tables //解析数据列表
            };
        }
        , done: function (res, curr, count) {
            selected.curr = curr;
            $("#bottom_table span.layui-laypage-count").text("共 " + res.data.length + " 条");
        }
    });

    table.on('tool(person_add_library_filter)', function (obj) {
        var layEvent = obj.event;
        if (layEvent === "opt") {
            selected.toselected(obj.tr[0].rowIndex);
        }
    });
    table.on('toolbar()', function (obj) {
        var layEvent = obj.event;
        var checkStatus = table.checkStatus(obj.config.id);
        var data = checkStatus.data;
        if (layEvent === "select") {
            if (data.length > 0) {
                selected.batchToSelected(data);
            } else {
                layer.msg("请选中要添加的项！");
            }
        }
    })
    //确定
    $("#submit").on('click', function () {
        var loadingicon = layer.load(1, {
            shade: 0.3
        })
        var rybhs = [];
        $.each(selected.selectedcache, function (i, e) {
            rybhs.push(e.rybh);
        });
        if (rybhs.length <= 0) {
            layer.msg("请选择要添加的选项");
            layer.close(loadingicon);
            return;
        }
        urlrelated.requestBody.data = {
            "isId": args.isId,
            "rybhs": rybhs
        };

        $.ajax({
            url: urlrelated.addPersonSpecial,
            type: "post",
            dataType: "json",
            timeout: 300000,
            async: true,
            data: JSON.stringify(urlrelated.requestBody),
            contentType: "application/json",
            success: function (res) {
                layer.close(loadingicon);
                if (res.status === 200) {
                    top.layer.msg("新增成功！");
                    //清空已选中缓存
                    selected.selectedcache.splice(0, selected.selectedcache.length);
                    selected.render();
                    $("#cancel_person")[0].click();
                }
            }, error: function (XMLHttpRequest, textStatus, errorThrown) {
                layer.close(loadingicon);
                extension.errorMessage(errorThrown);
            }, complete: function (xhr, status) {
                layer.close(loadingicon);
            }
        });
    });
    //查询
    form.on('submit(add_project_person_filter)', function (obj) {
        //将开始结束时间写入参数
        obj.field["CZSSJ"] = beginDate;
        obj.field["CZESJ"] = endDate;
        //去除空格
        for (var key in obj.field) {
            obj.field[key] = $.trim(obj.field[key]);
        }
        table.reload('person_add_library', {
            where: {
                data: obj.field
            }, page: {
                curr: 1 //重新从第 1 页开始
            }
        })
    });

    //重置
    $("#add_pro_per_reset_btn").on('click', function () {
        beginDate = "";
        endDate = "";
        $("#add_pro_per_form")[0].reset();
        form.render();
    });
    // 左侧样式设置
    //   最开始小的左面menu显示
    $("#left_menu_big").removeClass("show");
    $("#left_menu_somre").addClass("show");
    $("#left_menu_big").addClass("none");
    $("#left_menu_somre").removeClass("none");
    function resize() {
        var width = $(window).width();
        //按钮自适应，解决调动
        var formWidth = $("#formDiv").width();
        $("#subDIV").css("margin-left", formWidth * 0.5 - 95);

        if (width < 1200) {
            $(".layui-form-label").css("width", 70);
            $(".layui-inline").css("margin-right", 0)
        } else {
            $(".layui-form-label").css("width", 100);
            $(".layui-inline").css("margin-right", 10)
        }
        //下面的table
        if ($("#left_menu_big").is(".show")) {
            var widths = $("#left_menu_big").width();
            var bodwidths = $("body").width();
            var bodwidthss = parseInt(bodwidths - widths) - 60;

            $("#bottom_table").width(bodwidthss);
            $("#bottom_table").css({
                "margin-left": 303
            })
        }

        if ($("#left_menu_somre").is(".show")) {
            var width = $("#left_menu_somre").width();
            /*alert(width)*/
            var bodwidth = $("body").width();
            var bodwidth = parseInt(bodwidth - width) - 43;

            $("#bottom_table").width(bodwidth);
            $("#bottom_table").css({
                "margin-left": 55
            })
        }
    }

    resize();
    $(window).resize(function () {
        resize()

    });
    $("#left_menu_btn_big").click(function () {
        $("#left_menu_big").removeClass("show");
        $("#left_menu_somre").addClass("show");
        $("#left_menu_big").addClass("none");
        $("#left_menu_somre").removeClass("none");
        if ($("#left_menu_somre")) {
            var width = $("#left_menu_somre").width();
            var bodwidth = $("body").width();
            var bodwidth = parseInt(bodwidth - width) - 43;
            $("#bottom_table").width(bodwidth);
            $("#bottom_table").css({
                "margin-left": 55
            })
        }
    });
    $("#left_menu_btn_somre").click(function () {
        $("#bcjr_zjhm").val("");
        $("#left_menu_big").addClass("show");
        $("#left_menu_somre").removeClass("show");
        $("#left_menu_big").removeClass("none");
        $("#left_menu_somre").addClass("none");
        if ($("#left_menu_big")) {
            var widths = $("#left_menu_big").width();
            var bodwidths = $("body").width();
            var bodwidthss = parseInt(bodwidths - widths) - 63;
            $("#bottom_table").width(bodwidthss);
            $("#bottom_table").css({
                "margin-left": 298

            })
        }
    })
});