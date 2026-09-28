# 自动生成：从原站前端脚本扫描出的接口清单（小写路径）
TABLE_URLS = set([
"/api/customerapi/getcustomerfeedetailslist",
"/api/customerapi/getcustomerlist",
"/api/customerapi/rechargerank",
"/api/signcontract/getsystemcontarctlist",
"/customerajax/getcustomerbacklist",
"/empajax/getbillsummarydetailslist",
"/empajax/getbillsummarylist",
"/empajax/getbindalipaysettauthlist",
"/empajax/getbooklist",
"/empajax/getemplist",
"/empajax/getfunddetailslistdata",
"/empajax/getlearminformationlist",
"/empajax/getmyemp",
"/empajax/getmyonlinebillsummarydetailslist",
"/empajax/getmyonlinebillsummarylist",
"/empajax/getonlinebillsummarylist",
"/empajax/getprivatephonecallloglist",
"/empajax/getsalesmanstatistics",
"/gameaccountsajax/getgameacclist",
"/gameaccountsajax/getmygameacclist",
"/gameajax/getallordertypelist",
"/gameajax/getgameitemlist",
"/gameajax/getgameservermangelist",
"/gameajax/getprojectlist",
"/orderajax/getexceptionorderlogs",
"/orderajax/getgeneratecustomerorderloglist",
"/orderajax/getmyorderlist",
"/orderajax/getorderrecyclelist",
"/orderajax/getplatmpushoperatereport",
"/orderajax/getpushplatfromorderactionlogmangelist",
"/orderajax/getrecplayerchatmsgdetailslist",
"/orderajax/getrecplayerchatmsglist",
"/orderajax/getsoureorderchangepriceloglist",
"/orderajax/gettbsendrecordlist",
"/pvetaskajax/getgrouplist",
"/pvetaskajax/getmygroup",
"/pvetaskajax/getnewsgrouporderlist",
"/smsajax/getsmssendloglist",
"/smsajax/getsmssettingmangelist",
"/smsajax/getsmstemplatelist",
"/systemajax/getalllotteryawardlist",
"/systemajax/getallrolejoblist",
"/systemajax/getautodiscernsetlist",
"/systemajax/getautomaticadjustpricesetlist",
"/systemajax/getintegralcommodityexchangelist",
"/systemajax/getintegralcommoditylist",
"/systemajax/getlotteryawardgrantlist",
"/systemajax/getmybindhomesystemlist",
"/systemajax/getonlineconsultationsetlist",
"/systemajax/getorderlabellist",
"/systemajax/getordersouremangelist",
"/systemajax/getplatformautoreplysetlist",
"/systemajax/getplatformpushorderconfiglist",
"/systemajax/getpublicnewslist",
"/systemajax/getpublicseachorderquestionmlist",
"/systemajax/getpushordergroupmsgsetlist",
"/systemajax/getshopitemlist",
"/systemajax/getsysmteloglist",
"/systemajax/getsystemgrouplist",
"/systemajax/getsystemnoticelist",
"/systemajax/gettaobaointerfacelist",
"/systemajax/gettransfrominterfacelist",
"/systemajax/getusergrouplist",
"/systemajax/getverifiaddorderkeystrbygamelist",
"/systemajax/getwechatcustomerlist",
"/userajax/getcheckidenticalalipayacc",
"/userajax/getmymessagelist",
"/userajax/getonboardinglist",
"/userajax/getrecordertotallist",
"/userajax/getsystemuserbacklist",
"/userajax/getusercheckinlist",
"/userajax/getusercheckinstaticlist",
"/userajax/getuserlist",
"/userajax/getuserloginrestrictlist",
"/userajax/getuserrnamecertloglist"
])
AJAX_METHODS = {
"/api/customerapi/calculateconsumer": [
"POST"
],
"/api/customerapi/calculaterecharge": [
"POST"
],
"/api/customerapi/deducbalance": [
"POST"
],
"/api/customerapi/delcustomer": [
"POST"
],
"/api/customerapi/dellevel": [
"POST"
],
"/api/customerapi/getcustomerselect": [
"GET"
],
"/api/customerapi/getlevellist": [
"GET"
],
"/api/customerapi/getlevelselectlist": [
"GET"
],
"/api/customerapi/modiftydiscountinfluencemode": [
"POST"
],
"/api/customerapi/recharge": [
"POST"
],
"/api/customerapi/restcustomerloginpwd": [
"GET"
],
"/api/customerapi/revocationmemberrecharge": [
"POST"
],
"/api/customerapi/savelevel": [
"POST"
],
"/api/customerapi/setarrearsnote": [
"POST"
],
"/api/customerapi/updatecustomerlevel": [
"POST"
],
"/api/imapi/acceptagreement": [
"POST"
],
"/api/imapi/checkimauth": [
"GET"
],
"/api/imapi/creategroup": [
"POST"
],
"/api/imapi/destroygroup": [
"POST"
],
"/api/signcontract/batchcreatecontract/": [
"POST"
],
"/api/signcontract/checkcontract": [
"GET"
],
"/api/signcontract/contractbindsysuser": [
"POST"
],
"/api/signcontract/contractrescission": [
"POST"
],
"/api/signcontract/contractrevoke": [
"POST"
],
"/api/signcontract/createcontract": [
"POST"
],
"/api/signcontract/deletecontract": [
"POST"
],
"/api/signcontract/getcontracttemplatelist": [
"GET"
],
"/api/signcontract/getcontracturl": [
"GET"
],
"/api/signcontract/getsigncontracturl": [
"GET"
],
"/api/signcontract/getsystemcontracttotal": [
"GET"
],
"/api/signcontract/savesignconfig": [
"POST"
],
"/api/signcontract/setsignstatus": [
"POST"
],
"/api/userapi/bindemail": [
"POST"
],
"/api/userapi/getsign": [
"GET"
],
"/api/userapi/getuserinfo": [
"GET"
],
"/api/userapi/getuserrnamecerttosystem": [
"POST"
],
"/api/userapi/sendemailcode": [
"POST"
],
"/api/userapi/verifyemailcode/": [
"POST"
],
"/commonpermissionajax/delsingleimg": [
"POST"
],
"/commonpermissionajax/getaliosspolicy": [
"GET"
],
"/commonpermissionajax/uploadsingleimg": [
"POST"
],
"/customerajax/delback": [
"POST"
],
"/customerajax/getconsereport": [
"POST"
],
"/customerajax/gethyraisereporyyears": [
"POST"
],
"/customerajax/getintervallevel": [
"GET"
],
"/customerajax/getmemberbalance": [
"GET"
],
"/customerajax/getsourtypereport": [
"POST"
],
"/customerajax/saveintervallevel": [
"POST"
],
"/empajax/acceptsettagreenment": [
"POST"
],
"/empajax/addbindalipaysettauthdata": [
"POST"
],
"/empajax/addeditqatypename": [
"POST"
],
"/empajax/applicationemp": [
"POST"
],
"/empajax/batchdeductfee": [
"POST"
],
"/empajax/changeempremark": [
"POST"
],
"/empajax/changeorderrecprice": [
"POST"
],
"/empajax/changeprivatephonecalllogremark": [
"POST"
],
"/empajax/checkonlinepaysetrecname": [
"POST"
],
"/empajax/delbook": [
"POST"
],
"/empajax/delemp": [
"POST"
],
"/empajax/deletebindalipaysettauth": [
"POST"
],
"/empajax/dellearminformation": [
"POST"
],
"/empajax/getbalanceandfreeamount": [
"POST"
],
"/empajax/gethomepushorderoperatereport": [
"GET"
],
"/empajax/gethometodayorderdatastatistics": [
"GET"
],
"/empajax/getjdpbalance": [
"POST"
],
"/empajax/getkefuoperationdata": [
"GET"
],
"/empajax/getlingyuefangzhousystemsettlebalance": [
"GET"
],
"/empajax/getmydayoperationdata": [
"GET"
],
"/empajax/getoperationdata": [
"GET"
],
"/empajax/getorderconsetypebycondition": [
"POST"
],
"/empajax/getrecorderranklist": [
"POST"
],
"/empajax/getsystembuessionoperationdata": [
"GET"
],
"/empajax/gettotalpricetrendreport": [
"POST"
],
"/empajax/moditybindalipaysettauthremarkresetauth": [
"POST"
],
"/empajax/onlinepaysetrec": [
"POST"
],
"/empajax/onlinepaysetrecgetfailresult": [
"POST"
],
"/empajax/refshplatformorderstatusbytaobao": [
"POST"
],
"/empajax/synchempordertomysystem": [
"POST"
],
"/gameaccountsajax/addeditgameaccount": [
"POST"
],
"/gameaccountsajax/changeaccremark": [
"POST"
],
"/gameaccountsajax/changegameaccountjiwei": [
"POST"
],
"/gameaccountsajax/changegameaccountprice": [
"POST"
],
"/gameaccountsajax/changegameaccountprostatus": [
"POST"
],
"/gameaccountsajax/changegameaccountusestatus": [
"POST"
],
"/gameaccountsajax/changegameaccountusetype": [
"POST"
],
"/gameaccountsajax/delgameaccountbyidx": [
"POST"
],
"/gameaccountsajax/disaddgameaccountcontent": [
"POST"
],
"/gameaccountsajax/getacctipslist": [
"POST"
],
"/gameaccountsajax/getallgameaccountusetypeselect": [
"GET"
],
"/gameaccountsajax/getsellacclistbypreview": [
"POST"
],
"/gameaccountsajax/getsellacctipslist": [
"POST"
],
"/gameaccountsajax/sellaccaction": [
"POST"
],
"/gameaccountsajax/sellaccgetinfo": [
"POST"
],
"/gameajax/addeditgame": [
"POST"
],
"/gameajax/addeditproject": [
"POST"
],
"/gameajax/addmodityordertype": [
"POST"
],
"/gameajax/changegamesendsmsswitch": [
"POST"
],
"/gameajax/delgame": [
"POST"
],
"/gameajax/delgameitem": [
"POST"
],
"/gameajax/delordertype": [
"POST"
],
"/gameajax/delproject": [
"POST"
],
"/gameajax/getcalculationprice": [
"POST"
],
"/gameajax/getgamedata": [
"GET"
],
"/gameajax/getgameiteminfobyitemid": [
"GET"
],
"/gameajax/getloljinjidatalist": [
"POST"
],
"/gameajax/getpricecalculatorsettingpricedw": [
"POST"
],
"/gameajax/getpricesettpackgename": [
"POST"
],
"/gameajax/getproject": [
"GET"
],
"/gameajax/pwgamebygameid": [
"POST"
],
"/gameajax/reshrefgameservercache": [
"POST"
],
"/gameajax/setgameismobliegame": [
"POST"
],
"/gameajax/topgamebygameid": [
"POST"
],
"/gameajax/updategameordernum": [
"POST"
],
"/home/agreesystemprotocol": [
"POST"
],
"/home/blacklistappeal": [
"POST"
],
"/home/blacklistgetlist": [
"POST"
],
"/home/getblacklistmangebymy": [
"POST"
],
"/home/getmsgservicetoken": [
"GET"
],
"/home/getsystemagreeuseprotocol": [
"GET"
],
"/home/getsysteminsidenotity": [
"GET"
],
"/home/readsysteminsidenotitybyme": [
"POST"
],
"/home/revokeblacklistdata": [
"POST"
],
"/index/readexptimewarr": [
"POST"
],
"/orderajax/addorderajax": [
"POST"
],
"/orderajax/addorderautodiskeys": [
"POST"
],
"/orderajax/addorderrefundlogs": [
"POST"
],
"/orderajax/appendalltransctionorderprice": [
"POST"
],
"/orderajax/appendtransctionorderprice": [
"POST"
],
"/orderajax/buildersellemporderlog": [
"POST"
],
"/orderajax/changeorderbusstype": [
"POST"
],
"/orderajax/changeordergamerolenamebyorderid": [
"POST"
],
"/orderajax/changeorderjiaji": [
"POST"
],
"/orderajax/changeorderlock": [
"POST"
],
"/orderajax/changeordernetreceiptsprice": [
"POST"
],
"/orderajax/changeorderprice": [
"POST"
],
"/orderajax/changeorderproject": [
"POST"
],
"/orderajax/changeorderremark": [
"POST"
],
"/orderajax/changeordershphone": [
"POST"
],
"/orderajax/changeordersoureid": [
"POST"
],
"/orderajax/changetransctionorderarbitration": [
"POST"
],
"/orderajax/changetransctionorderlock": [
"POST"
],
"/orderajax/changetransctionorderrevoke": [
"POST"
],
"/orderajax/chcekasynfailorder": [
"POST"
],
"/orderajax/clearordertogroupmanger": [
"POST"
],
"/orderajax/configmtransctionorder": [
"POST"
],
"/orderajax/copyorderlog": [
"POST"
],
"/orderajax/copyordertoneworder": [
"POST"
],
"/orderajax/delorderbyidx": [
"POST"
],
"/orderajax/detransctionallplatformorder": [
"POST"
],
"/orderajax/detransctionplatformorder": [
"POST"
],
"/orderajax/disgamenamebycontent": [
"POST"
],
"/orderajax/dismissrecplayerchat": [
"POST"
],
"/orderajax/edittransctionorderprice": [
"POST"
],
"/orderajax/generatecustomerorderajax": [
"POST"
],
"/orderajax/getbuidergamescanqrcode": [
"GET"
],
"/orderajax/getorderclientorderurllink": [
"POST"
],
"/orderajax/getordercontentbyid": [
"GET"
],
"/orderajax/getordergroupmangerlog": [
"POST"
],
"/orderajax/getorderjobgrouptotal": [
"GET"
],
"/orderajax/getorderlist": [
"POST"
],
"/orderajax/getplatformorderlist": [
"POST"
],
"/orderajax/getrecempamountbyorderid": [
"POST"
],
"/orderajax/getrecplayerchatmsgfilterkey": [
"POST"
],
"/orderajax/getsendgroupnewordermsg": [
"POST"
],
"/orderajax/gettransactionorderbyorderidfunc": [
"GET"
],
"/orderajax/getuserqqbyorderid": [
"POST"
],
"/orderajax/readtaobaoorderdata": [
"GET"
],
"/orderajax/recorderbyinternal": [
"POST"
],
"/orderajax/reforderrecycle": [
"POST"
],
"/orderajax/relesorderandtaskbyorderid": [
"POST"
],
"/orderajax/relesordertohomebyorderid": [
"POST"
],
"/orderajax/saveordertogroupmanger": [
"POST"
],
"/orderajax/saverecplayerchatmsgfilterkey": [
"POST"
],
"/orderajax/sendagin": [
"POST"
],
"/orderajax/senddlorderrevpricebyorderid": [
"POST"
],
"/orderajax/sendordertomysystem": [
"POST"
],
"/orderajax/setorderjiwei": [
"POST"
],
"/orderajax/setordersta": [
"POST"
],
"/orderajax/synchtransctionorderstatus": [
"POST"
],
"/orderajax/updatedlorderrevpricebyorderid": [
"POST"
],
"/orderajax/updateorderlabel": [
"POST"
],
"/orderajax/upordertips": [
"POST"
],
"/orderajax/upsettlementorderbyidx": [
"POST"
],
"/orderajax/urgentorderbyidx": [
"POST"
],
"/pvetaskajax/addeditpvetask": [
"POST"
],
"/pvetaskajax/changegrouppostionorderby": [
"POST"
],
"/pvetaskajax/changetaskmaininfo": [
"POST"
],
"/pvetaskajax/changetaskneedjobrecuser": [
"POST"
],
"/pvetaskajax/changetaskorderby": [
"POST"
],
"/pvetaskajax/changetaskstrarttime": [
"POST"
],
"/pvetaskajax/checkgroupfullinfo": [
"POST"
],
"/pvetaskajax/copytonewgroup": [
"POST"
],
"/pvetaskajax/delgroupaccbytaskidaccid": [
"POST"
],
"/pvetaskajax/delgroupneedjobbypid": [
"POST"
],
"/pvetaskajax/delpvetask": [
"POST"
],
"/pvetaskajax/deltaskneedjobtemplatebytid": [
"POST"
],
"/pvetaskajax/disselectfiletogroup": [
"POST"
],
"/pvetaskajax/editpveteampostionamount": [
"POST"
],
"/pvetaskajax/editpveteamproject": [
"POST"
],
"/pvetaskajax/getcurrentweekdaytaskgrapneedjob": [
"POST"
],
"/pvetaskajax/getjdppublictaskcontactdata": [
"POST"
],
"/pvetaskajax/getjdppublictaskdata": [
"POST"
],
"/pvetaskajax/getnewsgrouplist": [
"POST"
],
"/pvetaskajax/gettaskneedjobtemplate": [
"POST"
],
"/pvetaskajax/gettaskneedjobtemplatebytid": [
"POST"
],
"/pvetaskajax/publicneedjobpostion": [
"POST"
],
"/pvetaskajax/publicneedjobpostioncancel": [
"POST"
],
"/pvetaskajax/savegrouplevelimg": [
"POST"
],
"/pvetaskajax/savetaskneedjobtemplate": [
"POST"
],
"/pvetaskajax/setjobneeditemlevel": [
"POST"
],
"/pvetaskajax/setpveaccgroup": [
"POST"
],
"/pvetaskajax/settaskaddpostionorder": [
"POST"
],
"/pvetaskajax/settaskcolorvalue": [
"POST"
],
"/pvetaskajax/settaskpostionmutual": [
"POST"
],
"/pvetaskajax/settaskpostionorder": [
"POST"
],
"/pvetaskajax/settaskreplacepostionorder": [
"POST"
],
"/pvetaskajax/startautomatchgroup": [
"POST"
],
"/pvetaskajax/uppvetasksta": [
"POST"
],
"/smsajax/addsmstemplate": [
"POST"
],
"/smsajax/getsmsbulkhairmobliecount": [
"POST"
],
"/smsajax/savemoditysmsapplyallgame": [
"POST"
],
"/smsajax/savemoditysmscontent": [
"POST"
],
"/smsajax/savemoditysmsswictht": [
"POST"
],
"/systemajax/addedisoure": [
"POST"
],
"/systemajax/addeditlearminformation": [
"POST"
],
"/systemajax/addmodityorderlabel": [
"POST"
],
"/systemajax/addmodtifytaobaointerface": [
"POST"
],
"/systemajax/batcheditreplycontent": [
"POST"
],
"/systemajax/changepublicseachorderquestionhot": [
"POST"
],
"/systemajax/changepublicseachorderquestionsta": [
"POST"
],
"/systemajax/changesouredonotsendsms": [
"POST"
],
"/systemajax/changewehcatappshopitemisneedgroup": [
"POST"
],
"/systemajax/clearplatformpushorderconfig": [
"POST"
],
"/systemajax/clearsystemjdpbind": [
"POST"
],
"/systemajax/copyroelnewjob": [
"POST"
],
"/systemajax/delautomaticadjustpriceset": [
"POST"
],
"/systemajax/delawardbyids": [
"POST"
],
"/systemajax/deldelintegralitem": [
"POST"
],
"/systemajax/deliveraward": [
"POST"
],
"/systemajax/delorderguidetemplate": [
"POST"
],
"/systemajax/delorderlabel": [
"POST"
],
"/systemajax/delplatformautoreplyset": [
"POST"
],
"/systemajax/delpublicnewsbyids": [
"POST"
],
"/systemajax/delpublicseachorderquestion": [
"POST"
],
"/systemajax/delpushordergroupmsg": [
"POST"
],
"/systemajax/delrole": [
"POST"
],
"/systemajax/delshopitem": [
"POST"
],
"/systemajax/delsoure": [
"POST"
],
"/systemajax/delsystemnotice": [
"POST"
],
"/systemajax/deltaobaointerface": [
"POST"
],
"/systemajax/deltransfrominterface": [
"POST"
],
"/systemajax/delwechatapphydisc": [
"POST"
],
"/systemajax/delwechatappshopfuldec": [
"POST"
],
"/systemajax/delwechatappshopitemtypename": [
"POST"
],
"/systemajax/editautodiscernset": [
"POST"
],
"/systemajax/editwechatappshopitemtypename": [
"POST"
],
"/systemajax/getallrolelist": [
"GET"
],
"/systemajax/getintegarlexchangeiteminfobyid": [
"POST"
],
"/systemajax/getintegarliteminfobyid": [
"POST"
],
"/systemajax/getintegralcommoditybytypelist": [
"GET"
],
"/systemajax/getnewscontent": [
"GET"
],
"/systemajax/getorderguidetemplatelist": [
"GET"
],
"/systemajax/getorderlabellist": [
"GET"
],
"/systemajax/getordersourelist": [
"GET"
],
"/systemajax/getpublicnews": [
"GET"
],
"/systemajax/getpublicseachorderquestionmlist": [
"GET"
],
"/systemajax/getpushjdp_templatelist": [
"GET"
],
"/systemajax/getshopiteminfobyid": [
"POST"
],
"/systemajax/getsystemexpiretime": [
"GET"
],
"/systemajax/getsystemgrouplist": [
"GET"
],
"/systemajax/getsystemnoticelist": [
"GET"
],
"/systemajax/getsystemupdatelist": [
"GET"
],
"/systemajax/getuserlistbyonlineconsultationset": [
"GET"
],
"/systemajax/getwechatappshopfuldeclist": [
"GET"
],
"/systemajax/getwechatappshopitemtypelist": [
"POST"
],
"/systemajax/modifyonlineconsultationset": [
"POST"
],
"/systemajax/modifyplatformautoreplysetstatus": [
"POST"
],
"/systemajax/modifyplatformpaypassword": [
"POST"
],
"/systemajax/modifysouresmssign": [
"POST"
],
"/systemajax/modifytransfrominterfacehelperswitch": [
"POST"
],
"/systemajax/modityorderlabelstatus": [
"POST"
],
"/systemajax/moditypushordergroupmsgstatus": [
"POST"
],
"/systemajax/modityshopitemsellcount": [
"POST"
],
"/systemajax/opensmssig": [
"POST"
],
"/systemajax/pddshipsetting": [
"POST"
],
"/systemajax/qsendsms": [
"POST"
],
"/systemajax/resetverifiaddorderkeystr": [
"POST"
],
"/systemajax/saveaddmodiftyautomaticadjustpriceset": [
"POST"
],
"/systemajax/saveaward": [
"POST"
],
"/systemajax/saveawardsetting": [
"POST"
],
"/systemajax/savebindhomesystemver": [
"POST"
],
"/systemajax/saveclientwriteordersetting": [
"POST"
],
"/systemajax/saveintegralcommodity": [
"POST"
],
"/systemajax/saveintegralexchangeitem": [
"POST"
],
"/systemajax/saveorderexportpwd": [
"POST"
],
"/systemajax/saveplatformautoreplysetmodify": [
"POST"
],
"/systemajax/saveplatformpushorderconfig": [
"POST"
],
"/systemajax/saveprivacyphoneservicesetting": [
"POST"
],
"/systemajax/savepublicnew": [
"POST"
],
"/systemajax/savepublicseachorderquestion": [
"POST"
],
"/systemajax/savepushordergroupmsgsetmodify": [
"POST"
],
"/systemajax/saveshopitem": [
"POST"
],
"/systemajax/savesystemnotice": [
"POST"
],
"/systemajax/savetransfrominterfaceaddmodify": [
"POST"
],
"/systemajax/savetripartitleplatform": [
"POST"
],
"/systemajax/saveverifiaddorderkeystr": [
"POST"
],
"/systemajax/savewechatapphydisc": [
"POST"
],
"/systemajax/savewechatappshopfuldec": [
"POST"
],
"/systemajax/smssetting": [
"POST"
],
"/systemajax/systemordersetting": [
"POST"
],
"/systemajax/taobaoshipsetting": [
"POST"
],
"/systemajax/unbindhomesystem": [
"POST"
],
"/systemajax/updateautomaticadjustpricesetstatus": [
"POST"
],
"/systemajax/updownintegralitem": [
"POST"
],
"/systemajax/updownshopitem": [
"POST"
],
"/systemajax/veryjdpacc": [
"POST"
],
"/systemajax/wechatchangebind": [
"POST"
],
"/systemajax/wechatsetting": [
"POST"
],
"/systemajax/wechatunbind": [
"POST"
],
"/userajax/addedituser": [
"POST"
],
"/userajax/addmodiftysystemuserbacklist": [
"POST"
],
"/userajax/adduserloginrestrictbyip": [
"POST"
],
"/userajax/auditonboarding": [
"POST"
],
"/userajax/changeprohibitedvieworderphone": [
"POST"
],
"/userajax/changeprohibitedvieworderpwd": [
"POST"
],
"/userajax/changeuserbalance": [
"POST"
],
"/userajax/changeuserbusstype": [
"POST"
],
"/userajax/changeuserensureamount": [
"POST"
],
"/userajax/changeuserisautosett": [
"POST"
],
"/userajax/changeuserorderby": [
"POST"
],
"/userajax/changeuserrecorderprice": [
"POST"
],
"/userajax/checkadduseriscontainsblack": [
"POST"
],
"/userajax/creategrouporinvitation": [
"POST"
],
"/userajax/createphonenoareport": [
"POST"
],
"/userajax/deleteonboarding/": [
"POST"
],
"/userajax/delsystemuserbacklistbyid": [
"POST"
],
"/userajax/deluser": [
"POST"
],
"/userajax/deluserloginrestrict": [
"POST"
],
"/userajax/editusermark": [
"POST"
],
"/userajax/getalluserbygamename": [
"GET"
],
"/userajax/getalluserbygroupname": [
"GET"
],
"/userajax/getallusertablebygamename": [
"GET"
],
"/userajax/getcontractwhitelist": [
"GET"
],
"/userajax/getdyplsossinfoforuploadfile": [
"POST"
],
"/userajax/getgroupmangelist": [
"POST"
],
"/userajax/gethomepagemyrecordertotaldata": [
"POST"
],
"/userajax/getjdpuidlist": [
"GET"
],
"/userajax/getmymessagelist": [
"GET"
],
"/userajax/getmyrecommendcode": [
"POST"
],
"/userajax/getmysystemaccbalance": [
"POST"
],
"/userajax/getsysuserselect": [
"GET"
],
"/userajax/getuserphonereport": [
"GET"
],
"/userajax/getzprootusers": [
"GET"
],
"/userajax/queryrnamecertresult": [
"POST"
],
"/userajax/refchangepwd": [
"POST"
],
"/userajax/resetinternalneworderpushwechatmsgsetting": [
"POST"
],
"/userajax/resetrnamecert": [
"POST"
],
"/userajax/rnamecertinit": [
"POST"
],
"/userajax/savecertsetting": [
"POST"
],
"/userajax/savecontractwhitelist": [
"POST"
],
"/userajax/savemyfeaturesmyjdpset": [
"POST"
],
"/userajax/savemyfeaturesmysystemset": [
"POST"
],
"/userajax/savemyinfo": [
"POST"
],
"/userajax/savemyloginpwd": [
"POST"
],
"/userajax/savetasklistseachconfigconfig": [
"POST"
],
"/userajax/saveuserconfigforassorderbyuserid": [
"POST"
],
"/userajax/saveuserconfigformsgsoundsourebyuserid": [
"POST"
],
"/userajax/saveuserconfigformsgsoundswichtbyuserid": [
"POST"
],
"/userajax/setforbidviewordercontent": [
"POST"
],
"/userajax/setisprohibitpublicrecorder": [
"POST"
],
"/userajax/setmymessageread": [
"POST"
],
"/userajax/setuserprivatephone": [
"POST"
],
"/userajax/setuserprohibitedvieworderpwd": [
"POST"
],
"/userajax/setuserselfrecordermaxcount": [
"POST"
],
"/userajax/totalalluserordercomplaterat": [
"POST"
],
"/userajax/upuserdissettsta": [
"POST"
],
"/userajax/upuserloginrestrictstatus": [
"POST"
],
"/userajax/upusersta": [
"POST"
],
"/userajax/upuserstabatch": [
"POST"
],
"/userajax/upuserversta": [
"POST"
]
}
ALL_URLS = set([
"/api/customerapi/calculateconsumer",
"/api/customerapi/calculaterecharge",
"/api/customerapi/deducbalance",
"/api/customerapi/delcustomer",
"/api/customerapi/dellevel",
"/api/customerapi/getcustomerfeedetailslist",
"/api/customerapi/getcustomerlist",
"/api/customerapi/getcustomerselect",
"/api/customerapi/getlevellist",
"/api/customerapi/getlevelselectlist",
"/api/customerapi/modiftydiscountinfluencemode",
"/api/customerapi/recharge",
"/api/customerapi/rechargerank",
"/api/customerapi/restcustomerloginpwd",
"/api/customerapi/revocationmemberrecharge",
"/api/customerapi/savelevel",
"/api/customerapi/setarrearsnote",
"/api/customerapi/updatecustomerlevel",
"/api/imapi/acceptagreement",
"/api/imapi/checkimauth",
"/api/imapi/creategroup",
"/api/imapi/destroygroup",
"/api/signcontract/batchcreatecontract/",
"/api/signcontract/checkcontract",
"/api/signcontract/contractbindsysuser",
"/api/signcontract/contractrescission",
"/api/signcontract/contractrevoke",
"/api/signcontract/createcontract",
"/api/signcontract/deletecontract",
"/api/signcontract/getcontracttemplatelist",
"/api/signcontract/getcontracturl",
"/api/signcontract/getsigncontracturl",
"/api/signcontract/getsystemcontarctlist",
"/api/signcontract/getsystemcontracttotal",
"/api/signcontract/savesignconfig",
"/api/signcontract/setsignstatus",
"/api/userapi/bindemail",
"/api/userapi/getsign",
"/api/userapi/getuserinfo",
"/api/userapi/getuserrnamecerttosystem",
"/api/userapi/sendemailcode",
"/api/userapi/verifyemailcode/",
"/auth/code",
"/commonpermissionajax/delsingleimg",
"/commonpermissionajax/getaliosspolicy",
"/commonpermissionajax/uploadsingleimg",
"/commonpermissionajax/uploadsingletxttoroot",
"/css/elementindex.css",
"/css/font-awesome.min.css",
"/css/jquery.contextmenu.min.css",
"/css/library.css",
"/css/slide-unlock.css",
"/css/slidercaptcha.min.css",
"/css/zdy.css",
"/customer/backlist",
"/customer/customerlist",
"/customer/hyanalysisreport",
"/customer/hyfundetailslist",
"/customer/hylevelsetting",
"/customerajax/delback",
"/customerajax/getconsereport",
"/customerajax/getcustomerbacklist",
"/customerajax/gethyraisereporyyears",
"/customerajax/getintervallevel",
"/customerajax/getmemberaddordersimpinfo",
"/customerajax/getmemberbalance",
"/customerajax/getsourtypereport",
"/customerajax/saveintervallevel",
"/emp/billsummary",
"/emp/bindalipaysettauth",
"/emp/booklist",
"/emp/dayoperation",
"/emp/emplist",
"/emp/funddetailslist",
"/emp/learminformationlist",
"/emp/mybillsummary",
"/emp/myemp",
"/emp/onlinepaytorecdetail",
"/emp/privatephonecalllog",
"/emp/qacenter",
"/emp/salesmanstatistics",
"/emp/viewlearminformation",
"/empajax/acceptsettagreenment",
"/empajax/addbindalipaysettauthdata",
"/empajax/addeditqatypename",
"/empajax/applicationemp",
"/empajax/batchdeductfee",
"/empajax/changeempremark",
"/empajax/changeorderrecprice",
"/empajax/changeprivatephonecalllogremark",
"/empajax/checkonlinepaysetrecname",
"/empajax/delbook",
"/empajax/delemp",
"/empajax/deletebindalipaysettauth",
"/empajax/dellearminformation",
"/empajax/getbalanceandfreeamount",
"/empajax/getbillsummarydetailslist",
"/empajax/getbillsummarylist",
"/empajax/getbindalipaysettauthlist",
"/empajax/getbooklist",
"/empajax/getemplist",
"/empajax/getfunddetailslistdata",
"/empajax/gethomepushorderoperatereport",
"/empajax/gethometodayorderdatastatistics",
"/empajax/getjdpbalance",
"/empajax/getkefuoperationdata",
"/empajax/getlearminformationlist",
"/empajax/getlingyuefangzhousystemsettlebalance",
"/empajax/getmydayoperationdata",
"/empajax/getmyemp",
"/empajax/getmyonlinebillsummarydetailslist",
"/empajax/getmyonlinebillsummarylist",
"/empajax/getonlinebillsummarylist",
"/empajax/getoperationdata",
"/empajax/getorderconsetypebycondition",
"/empajax/getprivatephonecallloglist",
"/empajax/getrecorderranklist",
"/empajax/getsalesmanstatistics",
"/empajax/getsystembuessionoperationdata",
"/empajax/gettotalpricetrendreport",
"/empajax/moditybindalipaysettauthremarkresetauth",
"/empajax/onlinepaysetrec",
"/empajax/onlinepaysetrecgetfailresult",
"/empajax/refshplatformorderstatusbytaobao",
"/empajax/synchempordertomysystem",
"/game/commonpricesetting",
"/game/gameitemlist",
"/game/gameserver",
"/game/ordertypssetting",
"/game/pricecalculator",
"/game/pricecalculatorsetting",
"/game/projectsetting",
"/gameaccounts/accountlist",
"/gameaccounts/addeditaccount",
"/gameaccounts/importacc",
"/gameaccounts/myaccountlist",
"/gameaccounts/sellaccpreview",
"/gameaccountsajax/addeditgameaccount",
"/gameaccountsajax/changeaccremark",
"/gameaccountsajax/changegameaccountjiwei",
"/gameaccountsajax/changegameaccountprice",
"/gameaccountsajax/changegameaccountprostatus",
"/gameaccountsajax/changegameaccountusestatus",
"/gameaccountsajax/changegameaccountusetype",
"/gameaccountsajax/delgameaccountbyidx",
"/gameaccountsajax/disaddgameaccountcontent",
"/gameaccountsajax/getacctipslist",
"/gameaccountsajax/getallgameaccountusetypeselect",
"/gameaccountsajax/getgameacclist",
"/gameaccountsajax/getmygameacclist",
"/gameaccountsajax/getsellacclistbypreview",
"/gameaccountsajax/getsellacctipslist",
"/gameaccountsajax/imputgameaccbyexecl",
"/gameaccountsajax/sellaccaction",
"/gameaccountsajax/sellaccgetinfo",
"/gameajax/addeditgame",
"/gameajax/addeditproject",
"/gameajax/addmodityordertype",
"/gameajax/changegamesendsmsswitch",
"/gameajax/delgame",
"/gameajax/delgameitem",
"/gameajax/delordertype",
"/gameajax/delproject",
"/gameajax/getallordertypelist",
"/gameajax/getcalculationprice",
"/gameajax/getgameattrinfotitle",
"/gameajax/getgamedata",
"/gameajax/getgameiteminfobyitemid",
"/gameajax/getgameitemlist",
"/gameajax/getgameservermangelist",
"/gameajax/getloljinjidatalist",
"/gameajax/getpricecalculatorsettingpricedw",
"/gameajax/getpricesettpackgename",
"/gameajax/getproject",
"/gameajax/getprojectlist",
"/gameajax/pwgamebygameid",
"/gameajax/reshrefgameservercache",
"/gameajax/setgameismobliegame",
"/gameajax/topgamebygameid",
"/gameajax/updategameordernum",
"/group/addeditgroup",
"/group/grouplist",
"/group/grouplist2020",
"/group/grouplist2025",
"/group/jdppublictask",
"/group/mygroup",
"/helper/index",
"/home/addblacklistplan",
"/home/agreesystemprotocol",
"/home/blacklistappeal",
"/home/blacklistgetlist",
"/home/blacklistplan",
"/home/getblacklistmangebymy",
"/home/getmsgservicetoken",
"/home/getsystemagreeuseprotocol",
"/home/getsysteminsidenotity",
"/home/readsysteminsidenotitybyme",
"/home/revokeblacklistdata",
"/html/employeesettagreement.html",
"/index/console",
"/index/readexptimewarr",
"/jdpshop/addshopitem",
"/jdpshop/shopindex",
"/jdpshop/shopmange",
"/jdpshop/shoptype",
"/layuiadmin/layui/css/layui.css",
"/layuiadmin/lib/extend/notice.css",
"/layuiadmin/lib/formselects-v4.css",
"/layuiadmin/style/admin.css",
"/login/index.html",
"/login/index1.html",
"/login/index2.html",
"/login/index3.html",
"/login/loginout",
"/order/addorder",
"/order/clientordergenerate",
"/order/coreordercenter",
"/order/exceptionorderlog",
"/order/insiderecorderlist",
"/order/jdpshoporderlist",
"/order/myorderlist",
"/order/openwangwang",
"/order/orderlist",
"/order/orderrecycle",
"/order/pushjdp",
"/order/reccustomerchatlog",
"/order/soureorderchangepricelog",
"/order/tbsendrecordlist",
"/order/tradingorderactionloglist",
"/orderajax/addorderajax",
"/orderajax/addorderautodiskeys",
"/orderajax/addorderrefundlogs",
"/orderajax/appendalltransctionorderprice",
"/orderajax/appendtransctionorderprice",
"/orderajax/buildersellemporderlog",
"/orderajax/changeorderbusstype",
"/orderajax/changeordergamerolenamebyorderid",
"/orderajax/changeorderjiaji",
"/orderajax/changeorderlock",
"/orderajax/changeordernetreceiptsprice",
"/orderajax/changeorderprice",
"/orderajax/changeorderproject",
"/orderajax/changeorderremark",
"/orderajax/changeordershphone",
"/orderajax/changeordersoureid",
"/orderajax/changetransctionorderarbitration",
"/orderajax/changetransctionorderlock",
"/orderajax/changetransctionorderrevoke",
"/orderajax/chcekasynfailorder",
"/orderajax/clearordertogroupmanger",
"/orderajax/configmtransctionorder",
"/orderajax/copyorderlog",
"/orderajax/copyordertoneworder",
"/orderajax/delorderbyidx",
"/orderajax/detransctionallplatformorder",
"/orderajax/detransctionplatformorder",
"/orderajax/disgamenamebycontent",
"/orderajax/dismissrecplayerchat",
"/orderajax/edittransctionorderprice",
"/orderajax/generatecustomerorderajax",
"/orderajax/getbuidergamescanqrcode",
"/orderajax/getexceptionorderlogs",
"/orderajax/getgeneratecustomerorderloglist",
"/orderajax/getinternalordergrabbinglist",
"/orderajax/getmyorderlist",
"/orderajax/getorderclientorderurllink",
"/orderajax/getordercontentbyid",
"/orderajax/getordergroupmangerlog",
"/orderajax/getorderjobgrouptotal",
"/orderajax/getorderlist",
"/orderajax/getorderrecyclelist",
"/orderajax/getplatformorderlist",
"/orderajax/getplatmpushoperatereport",
"/orderajax/getpushplatfromorderactionlogmangelist",
"/orderajax/getrecempamountbyorderid",
"/orderajax/getrecplayerchatmsgdetailslist",
"/orderajax/getrecplayerchatmsgfilterkey",
"/orderajax/getrecplayerchatmsglist",
"/orderajax/getsendgroupnewordermsg",
"/orderajax/getsoureorderchangepriceloglist",
"/orderajax/gettbsendrecordlist",
"/orderajax/gettransactionorderbyorderidfunc",
"/orderajax/getuserqqbyorderid",
"/orderajax/imputaddorderbyfile",
"/orderajax/readtaobaoorderdata",
"/orderajax/recorderbyinternal",
"/orderajax/reforderrecycle",
"/orderajax/relesorderandtaskbyorderid",
"/orderajax/relesordertohomebyorderid",
"/orderajax/saveordertogroupmanger",
"/orderajax/saverecplayerchatmsgfilterkey",
"/orderajax/sendagin",
"/orderajax/sendaginbytxt",
"/orderajax/senddlorderrevpricebyorderid",
"/orderajax/sendordertomysystem",
"/orderajax/setorderjiwei",
"/orderajax/setordersta",
"/orderajax/synchtransctionorderstatus",
"/orderajax/updatedlorderrevpricebyorderid",
"/orderajax/updateorderlabel",
"/orderajax/upordertips",
"/orderajax/upsettlementorderbyidx",
"/orderajax/urgentorderbyidx",
"/orderajax/viewpic",
"/pvetaskajax/addeditpvetask",
"/pvetaskajax/changegrouppostionorderby",
"/pvetaskajax/changetaskmaininfo",
"/pvetaskajax/changetaskneedjobrecuser",
"/pvetaskajax/changetaskorderby",
"/pvetaskajax/changetaskstrarttime",
"/pvetaskajax/checkgroupfullinfo",
"/pvetaskajax/copytonewgroup",
"/pvetaskajax/delgroupaccbytaskidaccid",
"/pvetaskajax/delgroupneedjobbypid",
"/pvetaskajax/delpvetask",
"/pvetaskajax/deltaskneedjobtemplatebytid",
"/pvetaskajax/disselectfiletogroup",
"/pvetaskajax/editpveteampostionamount",
"/pvetaskajax/editpveteamproject",
"/pvetaskajax/getalltaskselectlistdata",
"/pvetaskajax/getcurrentweekdaytaskgrapneedjob",
"/pvetaskajax/getgroupjobneedlist",
"/pvetaskajax/getgrouplist",
"/pvetaskajax/getjdppublictaskcontactdata",
"/pvetaskajax/getjdppublictaskdata",
"/pvetaskajax/getmygroup",
"/pvetaskajax/getnewsgrouplist",
"/pvetaskajax/getnewsgrouporderlist",
"/pvetaskajax/gettaskneedjobtemplate",
"/pvetaskajax/gettaskneedjobtemplatebytid",
"/pvetaskajax/publicneedjobpostion",
"/pvetaskajax/publicneedjobpostioncancel",
"/pvetaskajax/savegrouplevelimg",
"/pvetaskajax/savetaskneedjobtemplate",
"/pvetaskajax/setjobneeditemlevel",
"/pvetaskajax/setpveaccgroup",
"/pvetaskajax/settaskaddpostionorder",
"/pvetaskajax/settaskcolorvalue",
"/pvetaskajax/settaskpostionmutual",
"/pvetaskajax/settaskpostionorder",
"/pvetaskajax/settaskreplacepostionorder",
"/pvetaskajax/startautomatchgroup",
"/pvetaskajax/uppvetasksta",
"/sms/smsbulkhair",
"/sms/smslogslist",
"/sms/smstemplatelist",
"/smsajax/addsmstemplate",
"/smsajax/getsmsbulkhairmobliecount",
"/smsajax/getsmssendloglist",
"/smsajax/getsmssettingmangelist",
"/smsajax/getsmstemplatelist",
"/smsajax/savemoditysmsapplyallgame",
"/smsajax/savemoditysmscontent",
"/smsajax/savemoditysmsswictht",
"/smsajax/uploadmoblietxt",
"/system/autodiscernset",
"/system/automaticadjustpriceset",
"/system/customerphoneprivatesetting",
"/system/homesystemsetting",
"/system/onlineconsultationset",
"/system/orderlabellist",
"/system/orderpushgroupmsgset",
"/system/pddshipsetting",
"/system/platformautoreply",
"/system/platformpushorderconfig",
"/system/roleauthority",
"/system/smssetting",
"/system/sourelist",
"/system/systemlog",
"/system/systemnotice",
"/system/systemsetting",
"/system/taobaoshipsetting",
"/system/tripartiteplatformsetting",
"/system/verifiaddorderkey",
"/system/wechartsetting",
"/system/wechatappmange",
"/systemajax/addedisoure",
"/systemajax/addeditlearminformation",
"/systemajax/addmodityorderlabel",
"/systemajax/addmodtifytaobaointerface",
"/systemajax/batcheditreplycontent",
"/systemajax/changepublicseachorderquestionhot",
"/systemajax/changepublicseachorderquestionsta",
"/systemajax/changesouredonotsendsms",
"/systemajax/changewehcatappshopitemisneedgroup",
"/systemajax/clearplatformpushorderconfig",
"/systemajax/clearsystemjdpbind",
"/systemajax/copyroelnewjob",
"/systemajax/delautomaticadjustpriceset",
"/systemajax/delawardbyids",
"/systemajax/deldelintegralitem",
"/systemajax/deliveraward",
"/systemajax/delorderguidetemplate",
"/systemajax/delorderlabel",
"/systemajax/delplatformautoreplyset",
"/systemajax/delpublicnewsbyids",
"/systemajax/delpublicseachorderquestion",
"/systemajax/delpushordergroupmsg",
"/systemajax/delrole",
"/systemajax/delshopitem",
"/systemajax/delsoure",
"/systemajax/delsystemnotice",
"/systemajax/deltaobaointerface",
"/systemajax/deltransfrominterface",
"/systemajax/delwechatapphydisc",
"/systemajax/delwechatappshopfuldec",
"/systemajax/delwechatappshopitemtypename",
"/systemajax/editautodiscernset",
"/systemajax/editwechatappshopitemtypename",
"/systemajax/getalllotteryawardlist",
"/systemajax/getallrolejoblist",
"/systemajax/getallrolelist",
"/systemajax/getautodiscernsetlist",
"/systemajax/getautomaticadjustpricesetlist",
"/systemajax/getintegarlexchangeiteminfobyid",
"/systemajax/getintegarliteminfobyid",
"/systemajax/getintegralcommoditybytypelist",
"/systemajax/getintegralcommodityexchangelist",
"/systemajax/getintegralcommoditylist",
"/systemajax/getlotteryawardgrantlist",
"/systemajax/getmybindhomesystemlist",
"/systemajax/getnewscontent",
"/systemajax/getonlineconsultationsetlist",
"/systemajax/getorderguidetemplatelist",
"/systemajax/getorderlabellist",
"/systemajax/getordersourelist",
"/systemajax/getordersouremangelist",
"/systemajax/getplatformautoreplysetlist",
"/systemajax/getplatformpushorderconfig",
"/systemajax/getplatformpushorderconfiglist",
"/systemajax/getpublicnews",
"/systemajax/getpublicnewslist",
"/systemajax/getpublicseachorderquestionmlist",
"/systemajax/getpushjdp_templatelist",
"/systemajax/getpushordergroupmsgsetlist",
"/systemajax/getshopiteminfobyid",
"/systemajax/getshopitemlist",
"/systemajax/getsysmteloglist",
"/systemajax/getsystemexpiretime",
"/systemajax/getsystemgrouplist",
"/systemajax/getsystemnoticelist",
"/systemajax/getsystemupdatelist",
"/systemajax/gettaobaointerfacelist",
"/systemajax/gettransfrominterfacelist",
"/systemajax/getusergrouplist",
"/systemajax/getuserlistbyonlineconsultationset",
"/systemajax/getverifiaddorderkeystrbygamelist",
"/systemajax/getwechatappshopfuldeclist",
"/systemajax/getwechatappshopitemtypelist",
"/systemajax/getwechatcustomerlist",
"/systemajax/modifyonlineconsultationset",
"/systemajax/modifyplatformautoreplysetstatus",
"/systemajax/modifyplatformpaypassword",
"/systemajax/modifysouresmssign",
"/systemajax/modifytransfrominterfacehelperswitch",
"/systemajax/modityorderlabelstatus",
"/systemajax/moditypushordergroupmsgstatus",
"/systemajax/modityshopitemsellcount",
"/systemajax/opensmssig",
"/systemajax/pddshipsetting",
"/systemajax/qsendsms",
"/systemajax/resetverifiaddorderkeystr",
"/systemajax/saveaddmodiftyautomaticadjustpriceset",
"/systemajax/saveaward",
"/systemajax/saveawardsetting",
"/systemajax/savebindhomesystemver",
"/systemajax/saveclientwriteordersetting",
"/systemajax/saveintegralcommodity",
"/systemajax/saveintegralexchangeitem",
"/systemajax/saveorderexportpwd",
"/systemajax/saveplatformautoreplysetmodify",
"/systemajax/saveplatformpushorderconfig",
"/systemajax/saveprivacyphoneservicesetting",
"/systemajax/savepublicnew",
"/systemajax/savepublicseachorderquestion",
"/systemajax/savepushordergroupmsgsetmodify",
"/systemajax/saveshopitem",
"/systemajax/savesystemnotice",
"/systemajax/savetransfrominterfaceaddmodify",
"/systemajax/savetripartitleplatform",
"/systemajax/saveverifiaddorderkeystr",
"/systemajax/savewechatapphydisc",
"/systemajax/savewechatappshopfuldec",
"/systemajax/smssetting",
"/systemajax/systemordersetting",
"/systemajax/taobaoshipsetting",
"/systemajax/unbindhomesystem",
"/systemajax/updateautomaticadjustpricesetstatus",
"/systemajax/updownintegralitem",
"/systemajax/updownshopitem",
"/systemajax/veryjdpacc",
"/systemajax/wechatchangebind",
"/systemajax/wechatsetting",
"/systemajax/wechatunbind",
"/user/adduser",
"/user/applyonboardingmange",
"/user/backuserlist",
"/user/checkinlog",
"/user/checkinstatic",
"/user/myinfo",
"/user/mymessage",
"/user/rnamecertlogandsetting",
"/user/usercontractsigning",
"/user/usergroup",
"/user/userlist",
"/user/userloginrestrict",
"/userajax/addedituser",
"/userajax/addmodiftysystemuserbacklist",
"/userajax/adduserloginrestrictbyip",
"/userajax/auditonboarding",
"/userajax/changeprohibitedvieworderphone",
"/userajax/changeprohibitedvieworderpwd",
"/userajax/changeuserbalance",
"/userajax/changeuserbusstype",
"/userajax/changeuserensureamount",
"/userajax/changeuserisautosett",
"/userajax/changeuserorderby",
"/userajax/changeuserrecorderprice",
"/userajax/checkadduseriscontainsblack",
"/userajax/creategrouporinvitation",
"/userajax/createphonenoareport",
"/userajax/deleteonboarding/",
"/userajax/delsystemuserbacklistbyid",
"/userajax/deluser",
"/userajax/deluserloginrestrict",
"/userajax/editusermark",
"/userajax/getalluserbygamename",
"/userajax/getalluserbygroupname",
"/userajax/getallusertablebygamename",
"/userajax/getcheckidenticalalipayacc",
"/userajax/getcontractwhitelist",
"/userajax/getdyplsossinfoforuploadfile",
"/userajax/getgroupmangelist",
"/userajax/getgroupuserselect",
"/userajax/gethomepagemyrecordertotaldata",
"/userajax/getjdpuidlist",
"/userajax/getmymessagelist",
"/userajax/getmyrecommendcode",
"/userajax/getmysystemaccbalance",
"/userajax/getonboardinglist",
"/userajax/getrecordertotallist",
"/userajax/getsystemuserbacklist",
"/userajax/getsysuserselect",
"/userajax/getusercheckinlist",
"/userajax/getusercheckinstaticlist",
"/userajax/getuserlist",
"/userajax/getuserloginrestrictlist",
"/userajax/getuserphonereport",
"/userajax/getuserrnamecertloglist",
"/userajax/getzprootusers",
"/userajax/queryrnamecertresult",
"/userajax/refchangepwd",
"/userajax/resetinternalneworderpushwechatmsgsetting",
"/userajax/resetrnamecert",
"/userajax/rnamecertinit",
"/userajax/savecertsetting",
"/userajax/savecontractwhitelist",
"/userajax/savemyfeaturesmyjdpset",
"/userajax/savemyfeaturesmysystemset",
"/userajax/savemyinfo",
"/userajax/savemyloginpwd",
"/userajax/savetasklistseachconfigconfig",
"/userajax/saveuserconfigforassorderbyuserid",
"/userajax/saveuserconfigformsgsoundsourebyuserid",
"/userajax/saveuserconfigformsgsoundswichtbyuserid",
"/userajax/setforbidviewordercontent",
"/userajax/setisprohibitpublicrecorder",
"/userajax/setmymessageread",
"/userajax/setuserprivatephone",
"/userajax/setuserprohibitedvieworderpwd",
"/userajax/setuserselfrecordermaxcount",
"/userajax/totalalluserordercomplaterat",
"/userajax/uploadmypic",
"/userajax/uploadqrcode",
"/userajax/upuserdissettsta",
"/userajax/upuserloginrestrictstatus",
"/userajax/upusersta",
"/userajax/upuserstabatch",
"/userajax/upuserversta"
])
