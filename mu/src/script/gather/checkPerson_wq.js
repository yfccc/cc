layui.use(['index', 'element','layer','form'], function() {
    var $ = layui.$,
        element = layui.element,
        layer = layui.layer;
        form = layui.form;
        storage = window.localStorage;



   /* $(function () {
        //     点击按钮
        $("#wq-open-close").click(function () {
            var storage = window.localStorage;
            storage.clear();
            //补录标识
            storage.setItem("blbs", "2");
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);//关闭当前
        })
        $("#wq-open-bl").click(function () {
            var storage = window.localStorage;

            //对页面元素进行取值判定，输入的值，不替换
            var id = storage.getItem("c_id");
            var c_bcjr_jzdz =  parent.layui.$("#bcjr_jzdz").val() ==null || parent.layui.$("#bcjr_jzdz").val() =="" ? storage.getItem("c_bcjr_jzdz"):parent.layui.$("#bcjr_jzdz").val();
            var c_bcjr_ryfl =  parent.layui.$("#bcjr_ryfl").val() ==null || parent.layui.$("#bcjr_ryfl").val() =="" ? storage.getItem("c_bcjr_ryfl"):parent.layui.$("#bcjr_ryfl").val();
            var c_bcjr_sjhm1 =  parent.layui.$("#bcjr_sjhm1").val() ==null || parent.layui.$("#bcjr_sjhm1").val() =="" ? storage.getItem("c_bcjr_sjhm1"):parent.layui.$("#bcjr_sjhm1").val();
            var c_bcjr_sjhm2 =  $("#bcjr_sjhm2").val() ==null || parent.layui.$("#bcjr_sjhm2").val() =="" ? storage.getItem("c_bcjr_sjhm2"):parent.layui.$("#bcjr_sjhm2").val();
            var c_cjbz =  parent.layui.$("#cjbz").val() ==null || parent.layui.$("#cjbz").val() =="" ? storage.getItem("c_cjbz"):parent.layui.$("#cjbz").val();
            var c_wfcj =  parent.layui.$("#wfcj").val() ==null || parent.layui.$("#wfcj").val() =="" ? storage.getItem("c_wfcj"):parent.layui.$("#wfcj").val();

            var c_bcjr_xm =  parent.layui.$("#bcjr_xm").val() ==null || parent.layui.$("#bcjr_xm").val() =="" ? storage.getItem("c_bcjr_xm"):parent.layui.$("#bcjr_xm").val();
            var c_bcjr_zjlxdm =  parent.layui.$("#bcjr_zjlxdm").val() ==null || parent.layui.$("#bcjr_zjlxdm").val() =="" ? storage.getItem("c_bcjr_zjlxdm"):parent.layui.$("#bcjr_zjlxdm").val();
            var c_bcjr_zjhm =  parent.layui.$("#bcjr_zjhm").val() ==null || parent.layui.$("#bcjr_zjhm").val() =="" ? storage.getItem("c_bcjr_zjhm"):parent.layui.$("#bcjr_zjhm").val();
            var c_bcjr_xb =  parent.layui.$("#bcjr_xb").val() ==null || parent.layui.$("#bcjr_xb").val() =="" ? storage.getItem("c_bcjr_xb"):parent.layui.$("#bcjr_xb").val();
            var c_bcjr_gj = parent.layui.$("#bcjr_gj").val() ==null || parent.layui.$("#bcjr_gj").val() =="" ? storage.getItem("c_bcjr_gj"):parent.layui.$("#bcjr_gj").val();
            var c_bcjr_mz =  parent.layui.$("#bcjr_mz").val() ==null || parent.layui.$("#bcjr_mz").val() =="" ? storage.getItem("c_bcjr_mz"):parent.layui.$("#bcjr_mz").val();
            var c_bcjr_csrq =  parent.layui.$("#bcjr_csrq").val() ==null || parent.layui.$("#bcjr_csrq").val() =="" ? storage.getItem("c_bcjr_csrq"):parent.layui.$("#bcjr_csrq").val();
            var c_bcjr_hjdz =  parent.layui.$("#bcjr_hjdz").val() ==null || parent.layui.$("#bcjr_hjdz").val() =="" ? storage.getItem("c_bcjr_hjdz"):parent.layui.$("#bcjr_hjdz").val();
            var c_bcjr_qfjg =  parent.layui.$("#bcjr_qfjg").val() ==null || parent.layui.$("#bcjr_qfjg").val() =="" ? storage.getItem("c_bcjr_qfjg"):parent.layui.$("#bcjr_qfjg").val();
            var c_bcjr_yxqx =  parent.layui.$("#bcjr_yxqx").val() ==null || parent.layui.$("#bcjr_yxqx").val() =="" ? storage.getItem("c_bcjr_yxqx"):parent.layui.$("#bcjr_yxqx").val();

            //一定要清缓存
            storage.clear();

            //补录标识
            storage.setItem("blbs","1");
            storage.setItem("id",id);
            //预先采集虹膜，但是后采集的身份补录后，未采集虹膜，先清除掉。。
            if (!(c_wfcj ==null || c_wfcj == "")){
                var defaultEyePicture = basePath + "/iias/img/iris.png"
                // $("#leftEye")
                parent.layui.$("#leftEye").attr('src',defaultEyePicture);
                parent.layui.$("#rightEye").attr('src',defaultEyePicture);
            }

            parent.layui.$('.wfcj').css("display","block")
            parent.layui.$('#cjzt').val("1");
            // 表单赋值
            parent.layui.$("#bcjr_jzdz").val(c_bcjr_jzdz);
            parent.layui.$("#bcjr_ryfl").val(c_bcjr_ryfl);
            parent.layui.$("#bcjr_sjhm1").val(c_bcjr_sjhm1);
            parent.layui.$("#bcjr_sjhm2").val(c_bcjr_sjhm2);
            parent.layui.$("#cjbz").val(c_cjbz);
            parent.layui.$("#cjztbox").attr("checked", true);
            parent.layui.$("#wfcj").val(c_wfcj);

            parent.layui.$("#bcjr_xm").val(c_bcjr_xm);
            parent.layui.$("#bcjr_zjlxdm").val(c_bcjr_zjlxdm);
            parent.layui.$("#bcjr_zjhm").val(c_bcjr_zjhm);
            parent.layui.$("#bcjr_xb").val(c_bcjr_xb);
            parent.layui.$("#bcjr_gj").val(c_bcjr_gj);
            parent.layui.$("#bcjr_mz").val(c_bcjr_mz);
            parent.layui.$("#bcjr_csrq").val(c_bcjr_csrq);
            parent.layui.$("#bcjr_hjdz").val(c_bcjr_hjdz);
            parent.layui.$("#bcjr_qfjg").val(c_bcjr_qfjg);
            parent.layui.$("#bcjr_yxqx").val(c_bcjr_yxqx);

            form.render('select')
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);//关闭当前
        })
    })*/

    form.render();
    var c_bcjr_xm = storage.getItem("c_bcjr_xm");
    var c_xb = storage.getItem("c_xb");
    var c_zjlx = storage.getItem("c_zjlx");
    var c_bcjr_zjhm = storage.getItem("c_bcjr_zjhm");
    var c_bcjr_csrq = storage.getItem("c_bcjr_csrq");
    var c_gj = storage.getItem("c_gj");
    var c_mz = storage.getItem("c_mz");
    var c_bcjr_jzdz = storage.getItem("c_bcjr_jzdz");
    var c_zjzpdz = storage.getItem("c_zjzpdz");
    var c_bcjr_sjhm1 = storage.getItem("c_bcjr_sjhm1");
    var c_ryfl = storage.getItem("c_ryfl");
    var c_cjbh = storage.getItem("c_cjbh");
    var c_cdt = Format(storage.getItem("c_cdt"),"yyyy-MM-dd hh:mm:ss");
    var c_cjbz = storage.getItem("c_cjbz");
    var c_bcjr_hjdz = storage.getItem("c_bcjr_hjdz");

    //取过数据，本地缓存清空,....放入弹出层父级页面的按钮回调中

    // 姓名
    $('#xm').attr('title',""+c_bcjr_xm+"");
    if (c_bcjr_xm.length>13){
        c_bcjr_xm = c_bcjr_xm.substring(0,12)+"...";
    }
    $("#xm").html(c_bcjr_xm);
    // 性别
    $("#xb").html(c_xb);
    // 证件类型
    $('#zjlx').attr('title',"" + c_zjlx +"");
    if (c_zjlx.length>13){
        c_zjlx = c_zjlx.substring(0,12)+"...";
    }
    $("#zjlx").html(c_zjlx);
    // 证件号
    $('#zjhm').attr('title',"" + c_bcjr_zjhm +"");
    // if (c_bcjr_zjhm.length>13){
    //     c_bcjr_zjhm = c_bcjr_zjhm.substring(0,12)+"...";
    // }
    $("#zjhm").html(c_bcjr_zjhm);
    // 出生日期
    $("#csrq").html(c_bcjr_csrq);
    // 国籍
    $('#gj').attr('title',"" + c_gj + "");
    if (c_gj.length>13){
        c_gj = c_gj.substring(0,12)+"...";
    }
    $("#gj").html(c_gj);
    // 民族
    $("#mz").html(c_mz);
    // 户籍地址
    if (c_bcjr_hjdz==null||c_bcjr_hjdz==""){
        c_bcjr_hjdz = "-"
    }else {
        $('#dz').attr('title',""+c_bcjr_hjdz+"");
    }
    if (c_bcjr_hjdz.length>13){
        c_bcjr_hjdz = c_bcjr_hjdz.substring(0,12)+"...";
    }
    $("#dz").html(c_bcjr_hjdz);
    // 身份证头像
    var defaultCartdImg = basePath +  "/iias/img/card-img.png";
    var zjzpBase64 = c_zjzpdz == "" || c_zjzpdz == null ?  defaultCartdImg : "data:image/jpeg;base64," + c_zjzpdz ;
    $("#cardImage").attr("src", zjzpBase64);// 识别出的身份证照片
    // 手机号码
    if (c_bcjr_sjhm1==null||c_bcjr_sjhm1==""){
        c_bcjr_sjhm1 = "-"
    }
    $("#sjhm").html(c_bcjr_sjhm1);
    //人员分类
    $('#ryfl').attr('title',""+c_ryfl+"");
    if (c_ryfl.length>13){
        c_ryfl = c_ryfl.substring(0,12)+"...";
    }
    $("#ryfl").html(c_ryfl);
    //采集编号

    $("#bh").attr('title',c_cjbh);

    if (c_cjbh.length>20){
        c_cjbh = c_cjbh.substring(0,20)+"...";
    }
    $("#bh").html(c_cjbh);
    //采集时间
    $("#cjsj").html(c_cdt);
    $("#cjsj").attr('title',c_cdt);
    // 采集备注
    if (c_cjbz==null||c_cjbz==""){
        c_cjbz = "-"
    }else {
        $('#bz').attr('title',""+c_cjbz+"");
    }
    if (c_cjbz.length>13){
        c_cjbz = c_cjbz.substring(0,12)+"...";
    }
    $("#bz").html(c_cjbz);

    // 采集点 从session取值
    var cjr = $("#cjr").html().replace(/(^\s*)|(\s*$)/g,"");

    $('#cjr').attr('title',""+cjr+"");

    $("#cjr").html(cjr);


    function Format(datetime, fmt) {

        if(datetime==null||datetime==""){
            return "-"
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
            "M+": datetime.getMonth() + 1,                 //月份
            "d+": datetime.getDate(),                    //日
            "h+": datetime.getHours(),                   //小时
            "m+": datetime.getMinutes(),                 //分
            "s+": datetime.getSeconds(),                 //秒
            "q+": Math.floor((datetime.getMonth() + 3) / 3), //季度
            "S": datetime.getMilliseconds()             //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (datetime.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

});