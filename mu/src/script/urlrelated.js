//layui接口相关
layui.define(function (exports) {
    var serverBase = "/apis/";
    // var serverBase = "http://10.2.1.35:9080/";
    localStorage.setItem("serverBase", serverBase);
    var active = {
        requestBody: {
            "platform": "1007",
            "appVersion": "1.0.3",
            "apiVersion": "1.0.2",
            "token": localStorage.getItem("token"),
            "userJGDM": localStorage.getItem("userJGDM"),
            "data": {},
            "userId": localStorage.getItem("userId"),
            "userName": localStorage.getItem("userName")
        },
        requestBodyTree: {
            "currentOrgCodeTree": localStorage.getItem("currentOrgCodeTree"),
            "chirdOrgCodeTree": "-1",
            "queryTypeTree": localStorage.getItem("querytypeItem"),       //localStorage.getItem("queryType")
            "orgListQueryTypeEq4Tree": localStorage.getItem("models")           //localStorage.getItem("orgListQueryTypeEq4")
        },
        loginUrl: serverBase + "IriskingUser/login",
        logDesUrl: serverBase + "common/desEncrypt",
        resetPassword: serverBase + "IriskingUser/resetPassword",
        indexModelList: serverBase + "SysManage/getModelList",
        indexSQWJdownload: serverBase + "IriskingUser/downloadLicense",//首页接口
        gatherCheckDevice: serverBase + "collection/gather/checkDevice",//采集页面设备校验
        gatherGetCodeList: serverBase + "collection/gather/getCodeList",//采集获取数据接口
        gatherGetMarkList: serverBase + "collection/gather/getMarkList",//采集页接口
        gatherIrisRegister: serverBase + "collection/gather/irisRegister",
        gatherGetDriveVersion: serverBase + "collection/gather/getDriveVersion",//采集弹窗
        identifyidentifyHistory: serverBase + "collection/identify/identifyHistory",
        identifyCompareHistory: serverBase + "collection/identify/compareHistory",
        identify: serverBase + "collection/identify/identify",
        collectionIdentifyCompare: serverBase + "collection/identify/compare",//识别的核验
        searchMenuList: serverBase + "SysManage/getModelList",
        searchMenuDetails: serverBase + "SysManage/getModelDetail",
        modifyMenuDetails: serverBase + "SysManage/editModelDetail",
        addMenu: serverBase + "SysManage/insertModel/",
        deleteMenu: serverBase + "SysManage/deleteModel/",
        personLabelList: serverBase + "dataManagement/getIrisMarkList",
        addPersonLabel: serverBase + "dataManagement/addIrisMark",
        modifyPersonLabel: serverBase + "dataManagement/editIrisMark",
        deleteLabel: serverBase + "dataManagement/deleteIrisMark",
        deletePersonLabel: serverBase + "dataManagement/deletePersonMark",
        getUserInfoList: serverBase + "SysManage/getUserInfoList",
        // getUserInfoList: "http://10.10.1.171:9080/SysManage/getUserInfoList",
        editUser: serverBase + "SysManage/editUserById",
        addUSer: serverBase + "SysManage/insertUser",
        deleteUser: serverBase + "SysManage/deleteUserById",
        modifyUserPsd: serverBase + "SysManage/modifyUserPassword",
        getUserDetailById: serverBase + "SysManage/getUserDetailById",
        setUserState: serverBase + "SysManage/setUserState",
        getIdcardIfRegister: serverBase + "SysManage/getIdcardIfRegister",
        getUserNameIfRegister: serverBase + "SysManage/getUserNameIfRegister",
        getRoleList: serverBase + "SysManage/role/list",
        roleAdd: serverBase + "SysManage/role/add",
        roleEdit: serverBase + "SysManage/role/edit",
        roleDelete: serverBase + "SysManage/role/delete",
        deleteRolesUser: serverBase + "SysManage/role/deleteRolesUser",
        initRolesUser: serverBase + "SysManage/role/initRolesUser",
        noticeList: serverBase + "SysManage/notice/list",
        noticeAdd: serverBase + "SysManage/notice/add",
        noticeEdit: serverBase + "SysManage/notice/edit",
        noticeDetails: serverBase + "SysManage/notice/details",
        noticeDelete: serverBase + "SysManage/notice/delete",
        noticeEditStatus: serverBase + "SysManage/notice/editStatus",
        noticeDisplay: serverBase + "SysManage/notice/display",
        getOrganizationTree: serverBase + "SysManage/getOrganizationList",
        getOrganizationDetailById: serverBase + "SysManage/getOrganizationDetailById",
        editOrganization: serverBase + "SysManage/editOrganization",
        insertOrganization: serverBase + "SysManage/insertOrganization",
        deleteOrganization: serverBase + "SysManage/deleteOrganization",
        roleMemberList: serverBase + "SysManage/roleUser/list",
        roleMemberDelete: serverBase + "SysManage/roleUser/delete",
        roleMemberGetUser: serverBase + "SysManage/roleUser/getOrgAndUser",
        roleMemberSave: serverBase + "SysManage/roleUser/saveBatch",
        roleAddableUser: serverBase + "SysManage/roleUser/addableUser",
        adviceList: serverBase + "dataQuery/adviceList",
        adviceDelete: serverBase + "dataQuery/adviceDelete",
        adviceDetail: serverBase + "dataQuery/adviceDetail",
        adviceAdd: serverBase + "dataQuery/adviceInsert",
        idenifyRecord: serverBase + "dataQuery/idenifyRecord",
        idenifyVerification: serverBase + "dataQuery/idenifyRecord1",
        identifyCompare: serverBase + "dataQuery/identifyCompare",
        irisCodeList: serverBase + "SysManage/irisCode/list",
        irisCodeAdd: serverBase + "SysManage/irisCode/add",
        irisCodeEdit: serverBase + "SysManage/irisCode/edit",
        irisCodeDelete: serverBase + "SysManage/irisCode/delete",
        irisCodeCodeList: serverBase + "SysManage/irisCode/codeList",
        checkList: serverBase + "dataQuery/checkList",
        getPersonInfoList: serverBase + "dataManagement/getPersonInfoList",
        irisCodeGetCodeList: serverBase + "SysManage/irisCode/getCodeList",
        deletePersonInfo: serverBase + "dataManagement/deletePersonInfo",
        getPersonInfoDetail: serverBase + "dataManagement/getPersonInfoDetail",
        gatherRecord: serverBase + "dataQuery/gatherRecord",
        speciallist: serverBase + "dataManagement/basicData/special/list",
        specialdelete: serverBase + "dataManagement/basicData/special/delete",
        getPersonInfoListBySpecial: serverBase + "dataManagement/getPersonInfoListBySpecial",
        deletePersonSpecial: serverBase + "dataManagement/deletePersonSpecial",
        specialget: serverBase + "dataManagement/basicData/special/get",
        specialedit: serverBase + "dataManagement/basicData/special/edit",
        specialadd: serverBase + "dataManagement/basicData/special/add",
        addPersonSpecial: serverBase + "dataManagement/addPersonSpecial",
        irisrecordbatchList: serverBase + "dataQuery/batchList",
        irisrecordalarmRecord: serverBase + "dataQuery/alarmRecord",
        getDevicePageList: serverBase + "dataManagement/getDevicePageList",
        //exportGatherRecords://"http://10.10.1.171:9080/" + "common/exportGatherRecords",
        exportGatherRecords: serverBase + "common/exportGatherRecords",
        editDevice: serverBase + "dataManagement/editDevice",
        delDevice: serverBase + "dataManagement/delDevice",
        addDevice: serverBase + "dataManagement/addDevice",
        getDeviceById: serverBase + "dataManagement/getDeviceById",
        addDriveManage: serverBase + "SysManage/DriveManage/addDriveManage",
        editDriveManage: serverBase + "SysManage/DriveManage/editDriveManage",
        getDriveManage: serverBase + "SysManage/DriveManage/getDriveManage",
        getDriveManageById: serverBase + "SysManage/DriveManage/getDriveManageById",
        uploadDrivce: serverBase + "SysManage/DriveManage/uploadDrivce",
        getNewDrive: serverBase + "SysManage/DriveManage/getNewDrive",
        editPersonInfoDetail: serverBase + "dataManagement/editPersonInfoDetail",
        getPersonListForAdd: serverBase + "dataManagement/getPersonListForAdd",
        querySyncRule: serverBase + "SysManage/querySyncRule",
        editSyncRule: serverBase + "SysManage/editSyncRule",
        getOffineDataExportState: serverBase + "common/getOffineDataExportState",
        offlineDataUpload: serverBase + "zuul/common/offlineDataUpload",
        offlineDataUpload1: "http://10.2.1.35:8083/common/offlineDataUpload",
        selectLog: serverBase + "systemMonitor/selectLog",
        selectXZLogs: serverBase + "systemMonitor/selectXZLogs",
        uploadPersonInfo: serverBase + "dataManagement/uploadPersonInfo",
        exportSpecialJson: serverBase + "common/exportSpecial/json",
        exportBatchList: serverBase + "common/exportBatchList",
        exportIdenifyRecord: serverBase + "common/exportIdenifyRecord",
        exportIdenifyRecord1: serverBase + "common/exportIdenifyRecord1",
        exportAlarmRecord: serverBase + "common/exportAlarmRecord",
        exportAdviceList: serverBase + "common/exportAdviceList",
        downloadUrlPre: serverBase + "common/uploads/",
        downloadUrlpro: serverBase + "common/special/",
        downloadUrlDrive: serverBase + "SysManage/uploads",
        querySyncRuleList: serverBase + "SysManage/querySyncRuleList",
        queryUserForSyncRule: serverBase + "SysManage/queryUserForSyncRule",
        editSyncRuleByAdmin: serverBase + "SysManage/editSyncRuleByAdmin",
        getdetailIpList: serverBase + "SysManage/getList",
        addInsertIp: serverBase + "SysManage/insert",
        deleteInsertIpById: serverBase + "SysManage/deleteById",
        selectInsertIpById: serverBase + "SysManage/selectById",
        updateInfoById: serverBase + "SysManage/updateInfo",
        detailInsertIpById: serverBase + "SysManage/detail",
        deleteIpById: serverBase + "SysManage/deleteIp",
        insertIpById: serverBase + "SysManage/insertIp",
        collectionAmountList: serverBase + "statistics/collectionAmountList",
        orgAmountList: serverBase + "statistics/orgAmountList",
        updateDeviceBindingStatus: serverBase + "dataManagement/updateDeviceBindingStatus",
        waitExportData: serverBase + "common/waitExportData",
        reStartExportData: serverBase + "common/reStartExportData",
        exportGatherCountZx: serverBase + "common/exportGatherCountZx",
        exportGatherOrgZz: serverBase + "common/exportGatherOrgZz",
        selectOtherLogs: serverBase + "systemMonitor/selectOtherLogs",
        getMarkList: serverBase + "collection/gather/getMarkList",
        uploadLogStatistics: serverBase + "statistics/uploadLogStatistics",
        deleteExportData: serverBase + "common/deleteExportData",
        querySystemConfig: serverBase + "SysManage/querySystemConfig",
        editSystemConfig: serverBase + "SysManage/editSystemConfig",
        idenfityCompare: serverBase + "dataQuery/selectPerson",
        importDeviceData: serverBase + "common/importDeviceData",
        getDevicDataExportState: serverBase + "common/getDevicDataExportState",
        uploadLogHistogram: serverBase + "statistics/uploadLogHistogram",
        userHelp: serverBase + "SysManage/userHelp",
        title: "虹膜身份核查系统"
    };



    exports('urlrelated', active);
});