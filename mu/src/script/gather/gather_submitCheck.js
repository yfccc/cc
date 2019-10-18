layui.use('layer', function() {
    var $ = layui.$
        , layer = layui.layer
        , index = parent.layer.getFrameIndex(window.name); //获取窗口索引
    var defaultCartdImg = basePath +  "/iias/img/card-img.png";

    //原注册信息       //新注册的信息为页面提取
    var gatherData = parent.layui.$("#submitData").val();
    var gData = eval('('+gatherData+')');

    //当前信息赋值

    // 姓名
    if (parent.layui.$("#bcjr_xm").val().length>10) {
        $("#xm").html(parent.layui.$("#bcjr_xm").val().substring(0,9)+"...");
    }else {
        $("#xm").html(parent.layui.$("#bcjr_xm").val());
    }
    $('#xm').attr('title',""+parent.layui.$("#bcjr_xm").val()+"");
    // 性别
    if (parent.layui.$("#bcjr_xb option[value="+parent.layui.$("#bcjr_xb").val()+"]").html().length>10){
        $("#xb").html(parent.layui.$("#bcjr_xb option[value="+parent.layui.$("#bcjr_xb").val()+"]").html().substring(0,9)+"...");
    }else {
        $("#xb").html(parent.layui.$("#bcjr_xb option[value="+parent.layui.$("#bcjr_xb").val()+"]").html());
    }
    $('#xb').attr('title',"" + parent.layui.$("#bcjr_xb option[value="+parent.layui.$("#bcjr_xb").val()+"]").html() +"");
    // 证件类型
    if (parent.layui.$("#bcjr_zjlxdm option[value="+parent.layui.$("#bcjr_zjlxdm").val()+"]").html().length>10){
        $("#zjlx").html(parent.layui.$("#bcjr_zjlxdm option[value="+parent.layui.$("#bcjr_zjlxdm").val()+"]").html().substring(0,9)+"...");
    }else {
        $("#zjlx").html(parent.layui.$("#bcjr_zjlxdm option[value="+parent.layui.$("#bcjr_zjlxdm").val()+"]").html());
    }
    $('#zjlx').attr('title',"" + parent.layui.$("#bcjr_zjlxdm option[value="+parent.layui.$("#bcjr_zjlxdm").val()+"]").html() +"");
    // 证件号
    $("#zjhm").html(parent.layui.$("#bcjr_zjhm").val());
    $('#zjhm').attr('title',"" + parent.layui.$("#bcjr_zjhm").val() +"");
    // 出生日期
    $("#csrq").html(parent.layui.$("#bcjr_csrq").val());
    // 民族
    $("#mz").html(parent.layui.$("#bcjr_mz option[value="+parent.layui.$("#bcjr_mz").val()+"]").html());
    // 国籍
    $("#gj").html(parent.layui.$("#bcjr_gj option[value="+parent.layui.$("#bcjr_gj").val()+"]").html());
    $('#gj').attr('title',"" + parent.layui.$("#bcjr_gj option[value="+parent.layui.$("#bcjr_gj").val()+"]").html() + "");
    // 户籍地址
    var c_bcjr_hjdz = parent.layui.$("#bcjr_hjdz").val();
    //数据为空，以“-”代替
    if (c_bcjr_hjdz==null||c_bcjr_hjdz==""){
        c_bcjr_hjdz = "-"
    }else {
        $('#hjdz').attr('title',""+c_bcjr_hjdz+"");
    }
    if (c_bcjr_hjdz.length>15){
        $("#hjdz").html(c_bcjr_hjdz.substring(0,14)+"...");
    }else {
        $("#hjdz").html(c_bcjr_hjdz);
    }

    // 身份证头像
    var zjzpBase64 = parent.layui.$('#zjzp').val() == "" ? defaultCartdImg : "data:image/jpeg;base64,"+parent.layui.$('#zjzp').val();
    $("#cardImage").attr("src", zjzpBase64);


    //原信息赋值
    var active = {
        fmtCjsj: function(date){
            if (date == null) {
                return false;
            }
            if (date.length < 14){
                return false;
            }

            var yy = date.substring(0,4);
            var MM = date.substring(4,6);
            var dd = date.substring(6, 8);
            var HH = date.substring(8, 10);
            var mm = date.substring(10, 12);
            var ss = date.substring(12, 14);
            return yy + "-" + MM +'-' + dd + " " + HH + ":" +mm + ":" + ss;
        }
    };
    // 姓名
    $('#y_xm').attr('title',"" + gData.xm + "");
    if (gData.xm.length>10){
        gData.xm = gData.xm.substring(0,9)+"...";
    }
    $("#y_xm").html(gData.xm);
    // 性别
    $('#y_xb').attr('title',"" + parent.layui.$("#bcjr_xb option[value=" + gData.xb + "]").html() +"");
    if (parent.layui.$("#bcjr_xb option[value=" + gData.xb + "]").html().length > 10){
        $("#y_xb").html(parent.layui.$("#bcjr_xb option[value=" + gData.xb + "]").html().substring(0,9)+"...");
    } else {
        $("#y_xb").html(parent.layui.$("#bcjr_xb option[value=" + gData.xb + "]").html());
    }
    // 证件类型
    $('#y_zjlx').attr('title',"" + parent.layui.$("#bcjr_zjlxdm option[value=" + gData.zjlx + "]").html() +"");
    if (parent.layui.$("#bcjr_zjlxdm option[value=" + gData.zjlx + "]").html().length>10){
        $("#y_zjlx").html(parent.layui.$("#bcjr_zjlxdm option[value=" + gData.zjlx + "]").html().substring(0,9)+"...");
    } else {
        $("#y_zjlx").html(parent.layui.$("#bcjr_zjlxdm option[value=" + gData.zjlx + "]").html());
    }
    // 证件号
    $("#y_zjhm").html(gData.zjhm);
    $('#y_zjhm').attr('title',"" + gData.zjhm +"");
    // 出生日期
    $("#y_csrq").html(gData.csrq);
    // 国籍
    $("#y_gj").html(parent.layui.$("#bcjr_gj option[value='" + gData.gj + "']").html());
    $('#y_gj').attr('title',"" + parent.layui.$("#bcjr_gj option[value='" + gData.gj + "']").html() + "");
    // 民族
    $("#y_mz").html(parent.layui.$("#bcjr_mz option[value='" + gData.mz + "']").html());
    // 户籍地址
    var y_hjdz = gData.hjdz;
    if (y_hjdz==null||y_hjdz==""){
        y_hjdz = "-"
    }else {
        $('#y_hjdz').attr('title',"" + y_hjdz + "");
    }

    if (y_hjdz.length>14){
        $("#y_hjdz").html(y_hjdz.substring(0,14)+"...");
    } else {
        $("#y_hjdz").html(y_hjdz);
    }
    // 身份证头像
    var zjzpBase64 = gData.zjzp == "" || gData.zjzp == null ? defaultCartdImg : "data:image/jpeg;base64," + gData.zjzp ;
    $("#y_cardImage").attr("src", zjzpBase64);

    //对比信息是否一致，把不一致的原信息标题标红
    if (gData.xm != parent.layui.$("#bcjr_xm").val()) {
        $("#xm").prev().css("color","red");
    }
    if (gData.xb != parent.layui.$("#bcjr_xb").val()) {
        $("#xb").prev().css("color","red");
    }
    if (gData.zjlx != parent.layui.$("#bcjr_zjlxdm").val()) {
        $("#zjlx").prev().css("color","red");
    }
    if (gData.zjhm != parent.layui.$("#bcjr_zjhm").val()) {
        $("#zjhm").prev().css("color","red");
    }
    if (gData.csrq != parent.layui.$("#bcjr_csrq").val()) {
        $("#csrq").prev().css("color","red");
    }
    if (gData.gj != parent.layui.$("#bcjr_gj").val()) {
        $("#gj").prev().css("color","red");
    }
    if (gData.mz != parent.layui.$("#bcjr_mz").val()) {
        $("#mz").prev().css("color","red");
    }
    if (gData.hjdz != parent.layui.$("#bcjr_hjdz").val()) {
        $("#hjdz").prev().css("color","red");
    }
});