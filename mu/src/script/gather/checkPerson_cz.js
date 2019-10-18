layui.use(['index', 'element','layer','form'], function() {
    var $ = layui.$,
        element = layui.element,
        layer = layui.layer;
        form = layui.form;
        storage = window.localStorage;

    form.render();
    var c_bcjr_xm = storage.getItem("c_bcjr_xm");
    var c_xb = storage.getItem("c_xb");
    var c_zjlx = storage.getItem("c_zjlx");
    var c_bcjr_zjhm = storage.getItem("c_bcjr_zjhm");
    var c_bcjr_csrq = storage.getItem("c_bcjr_csrq");
    var c_gj = storage.getItem("c_gj");
    var c_mz = storage.getItem("c_mz");
    var c_bcjr_hjdz = storage.getItem("c_bcjr_hjdz");
    var c_zjzpdz = storage.getItem("c_zjzpdz");

    //取过数据，本地缓存清空
    storage.clear();


    // 姓名
    $('#xm').attr('title',""+c_bcjr_xm+"");
    if (c_bcjr_xm.length>10){
        c_bcjr_xm = c_bcjr_xm.substring(0,9)+"...";
    }
    $("#xm").html(c_bcjr_xm);
    // 性别
    $('#xb').attr('title',""+c_xb+"");
    if (c_xb.length>10){
        c_xb = c_xb.substring(0,9)+"...";
    }
    $("#xb").html(c_xb);

    // 证件类型
    $('#zjlx').attr('title',""+c_zjlx+"");
    if (c_zjlx.length>10){
        c_zjlx = c_zjlx.substring(0,9)+"...";
    }
    $("#zjlx").html(c_zjlx);
    // 证件号
    $('#zjhm').attr('title',"" + c_bcjr_zjhm +"");
    // if (c_bcjr_zjhm.length>14){
    //     c_bcjr_zjhm = c_bcjr_zjhm.substring(0,13)+"...";
    // }
    $("#zjhm").html(c_bcjr_zjhm);
    // 出生日期
    $("#csrq").html(c_bcjr_csrq);
    // 国籍
    // $('#gj').attr('title',"" + c_gj + "");
    if (c_gj.length>14){
        c_gj = c_gj.substring(0,13)+"...";
    }
    $("#gj").html(c_gj);
    // 民族
    $("#mz").html(c_mz);
    // 户籍地址
    //数据为空，以“-”代替
    if (c_bcjr_hjdz==null||c_bcjr_hjdz==""){
        c_bcjr_hjdz = "-"
    }else {
        $('#hjdz').attr('title',""+c_bcjr_hjdz+"");
    }
    if (c_bcjr_hjdz.length>14){
        c_bcjr_hjdz = c_bcjr_hjdz.substring(0,13)+"...";
    }
    $("#hjdz").html(c_bcjr_hjdz);
    // 身份证头像
    var defaultCartdImg = basePath +  "/iias/img/card-img.png";
    var zjzpBase64 = c_zjzpdz == null || c_zjzpdz == "" ?  defaultCartdImg : "data:image/jpeg;base64," + c_zjzpdz ;
    $("#cardImage").attr("src", zjzpBase64);// 识别出的身份证照片

});