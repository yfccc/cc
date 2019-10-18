layui.use(['table', 'form', "extension", "urlrelated"], function () {
    var laydate = layui.laydate,
        element = layui.element,
        table = layui.table,
        $ = layui.$,
        layer = layui.layer,
        form = layui.form,
        extension = layui.extension,
        urlrelated = layui.urlrelated,
        loginuserinfo = extension.getUserInfo(); //获取用户登录信息
    form.render();
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
    $("body", parent.document).find('#sub-title').html('成员管理');

    var active = {
        getCheckData: function () { //获取选中数据
            var checkStatus = table.checkStatus('memberadd-table-page'),
                data = checkStatus.data;
            // console.log(data);
            if (data.length == 0 || data == []) {
                layer.msg("请至少勾选一行要添加的人员");
                return;
            }
            var rolelist = [];
            for (var i = 0; i < data.length; i++) {
                rolelist.push(data[i].iruId);
            }
        },
        GetRequest: function (url) {
            var theRequest = {};
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
                }
            }
            return theRequest;
        }
    };
    var urldata = active["GetRequest"](window.location.search);

    //获取当前登录用户的权限
    var pagepower = extension.getPagePower("角色管理");
    urlrelated.requestBody.data = {
        "name": "",
        "organCode": loginuserinfo.userJGDM,   //当前登录用户的机构代码
        "queryType": pagepower.queryType,
        "notifiedBody": pagepower.notifiedBody
    }
    table.render({
        elem: '#memberadd-table-page',
        toolbar: "#table-hreader",
        url: urlrelated.roleAddableUser,
        method: 'post',
        contentType: "application/json;charset=UTF-8", //推荐写这个
        where: urlrelated.requestBody,
        even: true,
        defaultToolbar: ['filter'],
        limits: [10, 20, 30],
        cols: [
            [{
                type: 'checkbox'
            }, {
                field: 'userName',
                title: '用户名'
            }, {
                field: 'userRealname',
                title: '姓名'
            }, {
                field: 'userGender',
                title: '性别',
                templet: function (row) {
                    var genderHtml = '';
                    if (row.userGender == 0) {
                        return genderHtml = '未知的性别';
                    } else if (row.userGender == 1) {
                        return genderHtml = '男性';
                    } else if (row.userGender == 2) {
                        return genderHtml = '女性';
                    } else if (row.userGender == 5) {
                        return genderHtml = '女性改(变)为男性';
                    } else if (row.userGender == 6) {
                        return genderHtml = '男性改(变)为女性';
                    } else if (row.userGender == 9) {
                        return genderHtml = '未说明的性别';
                    } else {
                        return genderHtml = '';
                    }
                }
            }, {
                field: 'jgxxGajgjgmc',
                title: '所属机构'
            }]
        ],
        loading: true,
        page: true,
        response: {
            statusCode: 200 //重新规定成功的状态码为 200，table 组件默认为 0
        },
        parseData: function (res) { //将原始数据解析成 table 组件所规定的数据
            if (res.status != 200) {
                return {
                    "code": res.status, //解析接口状态
                    "msg": res.message, //解析提示文本
                    "count": 0, //解析数据长度
                    "data": [] //解析数据列表
                }
            }
            return {
                "code": res.status, //解析接口状态
                "msg": res.message, //解析提示文本
                "count": res.data.count, //解析数据长度
                "data": res.data.data //解析数据列表
            };
        }
    });

    $("#save_choose").on("click",function(){
        getCheckData();
    })
    function getCheckData() { //获取选中数据
        var checkStatus = table.checkStatus('memberadd-table-page'),
            data = checkStatus.data;
        // console.log(data);
        if (data.length == 0 || data == []) {
            layer.msg("请至少勾选一行要添加的人员");
            return;
        }
        var userlistData = [];
        for (var i = 0; i < data.length; i++) {
            var obj = {
                "userId": data[i].userId,
                // "userPoliceId": data[i].userId,
                "userRealname": data[i].userRealname,
                // "jgxxJgid": data[i].jgid,
                "jgxxGajgjgdm": data[i].jgxxGajgjgdm,
                "jgxxgajgjgmc": data[i].jgxxGajgjgmc
            };
            userlistData.push(obj);
        }
        // console.log(userlistData);
        personinfo = userlistData;
    }
    
    //查询数据按钮
    form.on('submit(searchinfo)', function (data) {
        //console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
        //去除空格
        for (var key in data.field) {
            data.field[key] = $.trim(data.field[key]);
        }
        table.reload('memberadd-table-page', {
            where: {
                data: {
                    name: data.field.name,
                }
            },
            page: {
                curr: 1 //重新从第 1 页开始
            }
        });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
    //重置
    $("#reset_btn").on("click", function () {
        $("#name").val('');
    });

});

var personinfo = new Array();
function choosePersonInfo(){
    return personinfo;
}