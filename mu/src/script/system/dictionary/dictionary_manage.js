var urldata = "";
var isallowsubmit = true;
layui.use(['table', 'form', "urlrelated", "extension"], function () {
    var laydate = layui.laydate,
        element = layui.element,
        table = layui.table,
        $ = layui.$,
        layer = layui.layer,
        form = layui.form,
        urlrelated = layui.urlrelated,
        extension = layui.extension;
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
    //行监听事件会给该属性赋值
    var selected_rowIndex;
    urldata = extension.getRequestParams(location.search);
    // urldata.id = Number(urldata.id);

    urlrelated.requestBody.data = {
        "ctId": urldata.id
    }
    var loadingIndex = layer.load(1, {
        shade: 0.3
    });
    $.ajax({
        type: "post", //请求方式
        url: urlrelated.irisCodeGetCodeList, //地址，就是json文件的请求路径
        dataType: "json", //数据类型可以为 text xml json  script  jsonp
        data: JSON.stringify(urlrelated.requestBody),
        async: true,
        timeout: 120000,
        cache: false,
        contentType: "application/json;charset=UTF-8", //推荐写这个
        success: function (res) { //返回的参数就是 action里面所有的有get和set方法的参数
            layer.close(loadingIndex);
            if (res.status == 200) {
                AddTable(res.data);
                extension.removeDropDownList();
            } else {
                layer.msg(res.message);
            }
        },
        error: function (tt) {
            layer.close(loadingIndex);
            //只要进error就跳转到登录页面
            extension.errorInOpen();
        }
    });

    //获取表格数据
    function AddTable(get_table_data) {
        //初始化表格
        table.render({
            elem: '#dictionary_table_id',
            toolbar: "#dictionary_tab_head",
            method: 'post',
            even: true,
            height: 450,
            defaultToolbar: [],
            contentType: "application/json;charset=UTF-8" //推荐写这个
            ,
            data: get_table_data
            // , limits: [10, 20, 30]
            ,
            limit: Number.MAX_VALUE,
            cols: [
                [{
                    field: 'codeName',
                    title: '<span style="color:red"> * </span>名称',
                    edit: 'text',
                    unresize: true
                }, {
                    field: 'codeIndex',
                    title: '<span style="color:red"> * </span>数据值',
                    edit: 'text'
                }
                    // , { field: 'codeGroup', title: '分组', edit: 'text' }
                    , {
                    field: 'codeRemark',
                    title: '描述',
                    edit: 'text'
                }, {
                    title: '操作',
                    align: 'center',
                    fixed: 'right',
                    toolbar: '#dictionary_operator'
                }
                ]
            ],
            loading: true,
            page: false
        });
    }
    var account = /^[0-9a-zA-Z\u4e00-\u9fa5]+$/; //32位数字、字母、汉字的组合
    //监听单元格编辑
    table.on('edit(dictionary_table)', function (obj) {
        var value = obj.value //得到修改后的值
            ,
            data = obj.data //得到所在行所有键值
            ,
            field = obj.field; //得到字段
        isallowsubmit = true;
        // debugger
        if ((data.codeIndex != '' && data.codeIndex != null) || (data.codeName != '' && data.codeName != null)) {
            if (data.codeIndex.length > 32) {
                layer.msg("数据值不能超过32位");
                isallowsubmit = false;
                return;
            }
            if (data.codeName.length > 60) {
                layer.msg("名称不能超过60位");
                isallowsubmit = false;
                return;
            }
            if (data.codeRemark != null && data.codeRemark != '') {
                if (data.codeRemark.length > 30) {
                    layer.msg("描述不能超过30位");
                    isallowsubmit = false;
                    return;
                }
            }
            // if (data.codeGroup != null && data.codeGroup != '') {
            //   if (data.codeGroup.length > 4) {
            //     layer.msg("分组不能超过4位");
            //     isallowsubmit = false;
            //     return;
            //   }
            // }
            if (data.codeIndex == value || data.codeName == value) {
                if (account.test(value) === false) {
                    layer.msg("仅支持英文字母、数字或汉字");
                    // value = $.trim(value);
                    isallowsubmit = false;
                    return
                }
            }
        }
        // var modify_field = {};
        // modify_field[field] = obj.value
        //obj.update(modify_field);
        //obj.update();
    });

    //监听行单击事件（单击事件为：rowDouble）
    table.on('row(dictionary_table)', function (obj) {
        selected_rowIndex = obj.tr[0] ? obj.tr[0].rowIndex : 0;
        //标注选中样式
        obj.tr.addClass('layui-table-click').siblings().removeClass('layui-table-click');
    });

    //监听头部工具栏事件
    table.on('toolbar(dictionary_table)', function (obj) {
        //获取选中行信息
        //var checkStatus = table.checkStatus(obj.config.id);
        if (selected_rowIndex == undefined) {
            table_cache = [];
        }
        //获取表格缓存数据
        var table_cache = table.getCache()["dictionary_table_id"];
        //获取当前选中行在数据中的index
        var num = typeof (selected_rowIndex) === typeof (undefined) ? 0 : selected_rowIndex;

        switch (obj.event) {

            case 'add_dictionary':
                // var num = typeof (selected_rowIndex) === typeof (undefined) ? 0 : selected_rowIndex;
                var new_data = {
                    "codeName": "",
                    "codeIndex": "",
                    "codeRemark": ""
                };
                if (typeof (selected_rowIndex) === typeof (undefined)) {
                    // table_cache = new Array();
                    table_cache.push(new_data);
                } else {
                    table_cache.splice(num, 0, new_data);
                }
                table.reload('dictionary_table_id', {
                    data: table_cache
                });
                break;
            case 'move_up':
                //是否已经选中行
                if (typeof (selected_rowIndex) === typeof (undefined)) {
                    layer.msg('请点击操作列的空白区域选中行');
                    return;
                }
                // var num = typeof (selected_rowIndex) === typeof (undefined) ? 0 : selected_rowIndex;
                if (num <= 0) {
                    //当前行在最上层
                    layer.msg("当前行在最上层");
                    return;
                }
                //位置互换
                var tab_data_n = table_cache[num];
                table_cache[num] = table_cache[num - 1];
                table_cache[num - 1] = tab_data_n;
                selected_rowIndex--;
                table.reload('dictionary_table_id', {
                    data: table_cache
                });
                break;
            case 'move_down':
                //是否已经选中行
                if (typeof (selected_rowIndex) === typeof (undefined)) {
                    layer.msg('请点击操作列的空白区域选中行');
                    return;
                }
                // var num = typeof (selected_rowIndex) === typeof (undefined) ? 0 : selected_rowIndex;
                if (num >= table_cache.length - 1) {
                    //当前行在最下层
                    layer.msg("当前行在最下层");
                    return;
                }
                //位置互换
                var tab_data_n = table_cache[num];
                table_cache[num] = table_cache[num + 1];
                table_cache[num + 1] = tab_data_n;
                selected_rowIndex++;
                table.reload('dictionary_table_id', {
                    data: table_cache
                });
                break;
        }
    });

    $(".layui-table-edit").on('focus', function () {
        //console.log($(this).val())
    })

    //监听行工具事件
    table.on('tool(dictionary_table)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）

        //获取表格缓存数据
        var table_cache = table.getCache()["dictionary_table_id"];

        //获取当前选中行在数据中的index
        var n = obj.tr[0].rowIndex;

        if (layEvent === 'add_at_next_row') { //从当前行的下一行添加
            var new_data = {
                "codeName": "",
                "codeIndex": "",
                "codeRemark": ""
            };
            table_cache.splice(n + 1, 0, new_data);

            table.reload('dictionary_table_id', {
                data: table_cache
            });

        } else if (layEvent === 'remove') { //删除
            // layer.confirm('确定删除此键值吗？', { resize: false }, function (index) {
            ////从数据缓存中删除
            table_cache.splice(n, 1);
            table.reload('dictionary_table_id', {
                data: table_cache
            });
            // layer.close(index);
            // });
        }
    });

    $("#save_change").on("click", function () {
        savechangeTable = JSON.parse(JSON.stringify(table.cache.dictionary_table_id).replace(/LAY_TABLE_INDEX/g, "codeSort"));
        // console.log(savechangeTable)
        isallowsubmit = true;
        for (var i = 0; i < savechangeTable.length; i++) {
            savechangeTable[i].codeIndex = $.trim(savechangeTable[i].codeIndex);
            savechangeTable[i].codeName = $.trim(savechangeTable[i].codeName);
            if (savechangeTable[i].codeIndex == "" || savechangeTable[i].codeName == "") {
                layer.msg("名称为“"+savechangeTable[i].codeName+"”的必填项不能为空");
                isallowsubmit = false;
                break;
            }
            if (savechangeTable[i].codeIndex.length > 32) {
                layer.msg("数据值为“"+savechangeTable[i].codeIndex+"”的格式错误。数据值不能超过32位");
                isallowsubmit = false;
                break;
            }
            if (savechangeTable[i].codeName.length > 60) {
                layer.msg("名称为“"+savechangeTable[i].codeName+"”的格式错误。名称不能超过60位");
                isallowsubmit = false;
                break;
            }
            if (account.test(savechangeTable[i].codeIndex) === false) {
                layer.msg("数据值为“"+savechangeTable[i].codeIndex+"”的格式错误。数据值仅支持英文字母、数字或汉字");
                isallowsubmit = false;
                return
            }
            if (account.test(savechangeTable[i].codeName) === false) {
                layer.msg("名称为“"+savechangeTable[i].codeName+"”的格式错误。名称仅支持英文字母、数字或汉字");
                isallowsubmit = false;
                return
            }
            if (savechangeTable[i].codeRemark != null && savechangeTable[i].codeRemark != '') {
                if (savechangeTable[i].codeRemark.length > 30) {
                    layer.msg("描述为“"+savechangeTable[i].codeRemark+"”的格式错误。描述不能超过30位");
                    isallowsubmit = false;
                    break;
                }
            }
        }
    })

});

var savechangeTable = '';

function SaveChangeData() {
    var rulData = {
        "data": {
            "ctId": urldata.id,
            "codeList": savechangeTable
        }
    };
    return rulData
}