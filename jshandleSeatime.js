/*=========================================================================== JQuery Ajax Begin ======================================================================*/
var LID_S_R = "";
var LID_S_T = "";
var pm_S = [1, '', 'r', 0, 0, 'EN-US', 0];

var $tb_S_R = null; //Running table
var $tb_S_T = null; //Today table
var $tb_S_S = null;
var _urlSR = null;
var _urlST = null;

var selR = "R";
var selCssR = "_R";
var selT = "T";
var selCssT = "";

var _timerR = null;
var _timerT = null;
var timeR = 25; //Default Running Refresh Time (Seconds)
var timeT = 40; //Default Today Refresh Time (Seconds)

function ajaxRun(url) {
    _urlSR = _urlSR || url;
    url = url || _urlSR;
    jQuery.ajax({
        async: true, cache: false, url: url + '&LID=' + LID_S_R, complete: function (_ort) {
            try {
                initDB_S_R(_ort.responseText);
                timerRun(url);
            }
            catch (e) {
                window.location.reload();
            }
            HideLoading();
        }
    });
};

function ajaxToday(url) {
    _urlST = _urlST || url;
    url = url || _urlST;
    jQuery.ajax({
        async: true, cache: false, url: url + '&LID=' + LID_S_T, complete: function (_ort) {
            try {
                initDB_S_T(_ort.responseText);
                timerToday(url);
            }
            catch (e) {
                window.location.reload();
            }
            HideLoading();
        }
    });
};

function SetDomEven_S() {
    $(document).ready(function () {
        //Running
        $tb_S_R = $('#tableRun');
        $tb_S_R.on("mouseover", ".M_Item", function () {
            $(this).css('background-color', (C_Mcl[0] || '#FFFFFF'));
        });
        $tb_S_R.on("mouseout", ".GridRunItem", function () {
            $(this).css('background-color', (C_Mcl[3] || '#E9FBDB'));
        });
        $tb_S_R.on("mouseout", ".GridAltRunItem", function () {
            $(this).css('background-color', (C_Mcl[4] || '#E9FBDB'));
        });
        $tb_S_R.on("click", ".btnRefresh", function () {
            pm_S[3] == 1 && ShowLoading() && ajaxRun();;
            return false;
        });

        //Today
        $tb_S_T = $('#tableToday');
        $tb_S_T.on("mouseover", ".M_Item", function () {
            $(this).css('background-color', (C_Mcl[0] || '#FFFFFF'));
        });
        $tb_S_T.on("mouseout", ".GridItem", function () {
            $(this).css('background-color', (C_Mcl[1] || '#E8FDEA'));
        });
        $tb_S_T.on("mouseout", ".GridAltItem", function () {
            $(this).css('background-color', (C_Mcl[2] || '#D3FAD5'));
        });
        $tb_S_T.on("click", ".btnRefresh", function () {
            pm_S[3] == 1 && ShowLoading() && ajaxToday();
            return false;
        });

        //Separator
        $tb_S_S = $('#tableSeparator');
    });
};
SetDomEven_S();
// timerRun('RMOdds1Gen.ashx?ot=r&sort=0&at=MY&r=847273726', 25, 25);
function timerRun(url, _t) {
    if (_t != null) 
        timeR = _t;

    if (_timerR != null)
        clearTimeout(_timerR);

    _timerR = setTimeout(function () { ajaxRun(url); }, timeR * 1000);
};

function timerToday(url, _t) {
    if (_t != null)
        timeT = _t;

    if (_timerT != null)
        clearTimeout(_timerT);

    _timerT = setTimeout(function () { ajaxToday(url); }, timeT * 1000);
};

function initDB_S_R(_cbstr) {
    try {
        if (_cbstr == "IgNoReReQuEsT") //TimeFilter
        {
            return;
        }
        var _data = eval("(" + _cbstr + ")");
        var _ot = _data[0][2];
        var title = RS_Running;
        if ($tb_S_R && $tb_S_R.length > 0) {
            updTB_S(_data, $tb_S_R, title, true, _ot);
        } else {
            $(document).ready(function () {
                updTB_S(_data, $tb_S_R, title, true, _ot);
            });
        }
        LID_S_R = _data[0][1];
    }
    catch (err) {
        //alert(err.message);
    }
}

function initDB_S_T(_cbstr) {
    try {
        if (_cbstr == "IgNoReReQuEsT") //TimeFilter
        {
            return;
        }
        var _data = eval("(" + _cbstr + ")");
        var _ot = _data[0][2];
        var title = (_ot == "e") ? RS_Early : RS_TodayEvents;

        if ($tb_S_T && $tb_S_T.length > 0) {
            updTB_S(_data, $tb_S_T, title, false, _ot);
        } else {
            $(document).ready(function () {
                updTB_S(_data, $tb_S_T, title, false, _ot);
            });
        }
        LID_S_T = _data[0][1];
    }
    catch (err) {
        //alert(err.message);
    }
}

function updTB_S(_data, _$tb, _hdtxt, _isRun, _ot) {
    pm_S = _data[0];
    if (_data[0][0] == 1) {
        //Draw Table
        drawHd_S(_$tb, _hdtxt, _data[4], _isRun);
        //Add All
        for (var i = 0, len = _data[2].length; i < len; i++) {
            addL_S(_data[2][i], true, _$tb, _isRun, _ot);
        }
    }
    else {

        //process "1" = Add New SocOdds
        //process "2" = Update SocOdds
        var process = "";

        //New Add
        for (var i = 0, len = _data[2].length; i < len; i++) {
            process = "1";
            addL_S(_data[2][i], false, _$tb, _isRun, _ot, process);
        }
        //Update
        for (var i = 0, len = _data[3].length; i < len; i++) {
            process = "2";
            addL_S(_data[3][i], false, _$tb, _isRun, _ot, process);
        }
        //Delete
        for (var i = 0, len = _data[1].length; i < len; i++) {
            delM_S(_data[1][i], _$tb, _ot);
        }
    }

    //Remove blink effect after refresh
    _$tb.find(".NewOdds").each(function () {
        _$this = $(this);
        var _tms = _$this.attr("chgTms") || 0;
        _tms++;
        if (_tms > 1) { _$this.removeClass("NewOdds"); _$this.css("background", ""); _tms = 0; }
        _$this.attr("chgTms", _tms);
    });

    //if is sortbytime, if is Add and Delete process
    if (_data[0][6] == 1 && (_data[2].length > 0 || _data[1].length > 0)) {
        var _$tbL = _$tb.find("tbody[soclid]");
        for (var i = _$tbL.length; i >= 1; i--) {
            if (_$tbL.eq(i).attr('soclid') == _$tbL.eq(i - 1).attr('soclid')) {
                var _$trM = _$tbL.eq(i).find("tr[oddsid]");

                if (_$trM.length > 0) {
                    for (var j = 0; j < _$trM.length; j++) {
                        _$tbL.eq(i - 1).find("tr[oddsid]").last().after(_$trM.eq(j));
                    }
                    _$tbL.eq(i).remove();
                    adjTb(_$tbL.eq(i - 1), true); //Adjust Row Color
                }
            }
        }
    }

    //Get Announcement Status
    var curAn = GetST('_PgInfo', 'An');
    //Extra Checking for running when click live tab will display NoOdds Msg when no odds available
    //Today & Early
    if (ot != "r") {
        if (_isRun) {
            if (_$tb.find(".M_Item").length <= 0) {
                _$tb.hide();
                $tb_S_S.hide();

                if (UTL_IsShowAnnouncement == 'True' && curAn != 1) {
                    SetST('_PgInfo', 'An', 1);
                    setTimeout(function () {
                        var _announcement = $tb_S_T.find(".announcement");
                        _announcement.show();
                        setTimeout(function () {
                            _announcement.hide();
                        }, 7000);
                    }, 1800);
                }
            }
            else {
                _$tb.show();
                $tb_S_S.show();

                if (UTL_IsShowAnnouncement == 'True' && curAn != 1) {
                    SetST('_PgInfo', 'An', 1);
                    setTimeout(function () {
                        var _announcement = $tb_S_R.find(".announcement");
                        _announcement.show();
                        setTimeout(function () {
                            _announcement.hide();
                        }, 7000);
                    }, 1800);
                }
            }
        }
        else {
            if (_$tb.find(".M_Item").length <= 0) {
                var _$tbL = _$tb.find("tbody[soclid='0']");
                if (_$tbL.find(".NOEVENT").length <= 0)
                    _$tbL.append(NoOddsDisplay(RS_NoEvents, 10, "GridItem"));
            }
        }
    }
    //Extra Checking for running when click live tab will display NoOdds Msg when no odds available
    //Running
    else {
        if (_$tb.find(".M_Item").length <= 0) {
            var _$tbL = _$tb.find("tbody[soclid='0']");
            if (_$tbL.find(".NOEVENT").length <= 0)
                _$tbL.append(NoOddsDisplay(RS_NoEvents, 9, "GridRunItem"));
        }
    }
};

/* Create the table and header */
function drawHd_S(_$tb, _hdtxt, _E_Sel, _isRun) {
    var _sel = selR;
    var _selCss = selCssR;
    if (_isRun) {
        _sel = selT;
        _selCss = selCssT;
    }

    var sb = new StringBuilder();

    //for whole table
    sb.append("<table width='100%' border='0' cellpadding='0' cellspacing='0'>");
    sb.append("<tbody>");
    sb.append("<tr>");
    if (_hdtxt != "") {
        sb.append("<td width='20px' align='left' background='../Images/barL.png'><img src='../Images/icoleft.png' width='15' height='15' align='absmiddle' /></td>");
        sb.append("<td background='../Images/barC.png'><table width='100%' height='25px' cellpadding='0' cellspacing='0'>");
        sb.append("<tr>");
        sb.append("<td><span class='GridTitle'>" + _hdtxt + "</span></td>");
    }
    else {
        sb.append("<td><table border='0' cellpadding='2' cellspacing='0' width='100%'>");
        sb.append("<tr><td align='left'>&nbsp;&nbsp;&nbsp;");
        sb.append("</td>");
    }
    //subButton
    sb.append("<td align='right'>");
    sb.append("<div style='float:right;'>");
    //STEP
    if (CFG_CompType == "17" || CFG_CompType == "16") {
        if (ot != "e" && ot != "r")
            sb.append("<div style='float:left; background-color: #745A29; border-radius: 3px; height: 19px; padding: 0px 15px;'><a href='RMOddsPar_WFH.aspx?ot=" + ot + "' class='btnStep'>" + RS_Step + "</a></div>");
    }
    //sortBy
    if (ACC_SortBy == 1)
        sb.append("<div style='float:left;'><a class='btnGrey' href='RMOdds2.aspx?ot=" + ot + "&sort=0'><span>" + RS_SortbyLeague + "</span></a></div>");
    else
        sb.append("<div style='float:left;'><a class='btnGrey' href='RMOdds2.aspx?ot=" + ot + "&sort=1'><span>" + RS_SortbyTime + "</span></a></div>");
    //selectLeague
    sb.append("<div style='float:left;'><a class='btnGrey btnSelectLeague' href='selectleague.aspx?ot=" + ot + "' target='_iSelectLeague' onclick='_$SelectLeague(this);'><span>" + RS_SelectLeague2 + "</span></a></div>");
    //double single line
    sb.append("<div style='width:90px; float:left;' class='divOddsSel' onclick=\"toggleOddsSel('divPT_" + _sel + "')\">");
    sb.append("<span>" + (ACC_PageType == 0 ? RS_Single : ACC_PageType == 1 ? RS_Double : RS_Odds_Simple) + "</span>");
    sb.append("<div class='OddsSel' id='divPT_" + _sel + "' style='width:90px; position:absolute; display:none;'>");
    sb.append("<div class='OddsSel2Bg' onclick=\"window.open('RMOdds1.aspx?ot=" + ot + "&pt=0', 'fraMain')\"><a href='RMOdds1.aspx?ot=" + ot + "&pt=0' target='fraMain' class='OddsSel2'>" + RS_Single + "</a><br /></div>");
    sb.append("<div class='OddsSel2Bg' onclick=\"window.open('RMOdds2.aspx?ot=" + ot + "&pt=1', 'fraMain')\"><a href='RMOdds2.aspx?ot=" + ot + "&pt=1' target='fraMain' class='OddsSel2'>" + RS_Double + "</a><br /></div>");
    if (CFG_CompType == "14" || CFG_CompType == "16" || CFG_CompType == "22")
        sb.append("<div class='OddsSel2Bg' onclick=\"window.open('RMOdds1Sim.aspx?ot=" + ot + "&pt=2', 'fraMain')\"><a href='RMOdds1Sim.aspx?ot=" + ot + "&pt=2' target='fraMain' class='OddsSel2'>" + RS_Odds_Simple + "</a><br /></div>");
    sb.append("</div></div>");
    //accType
    sb.append("<div style='width:50px; float:left;' class='divOddsSel' onclick=\"toggleOddsSel('divAT_" + _sel + "')\">");
    sb.append("<span>" + (ACC_AccType == "MY" ? RS_Malay : ACC_AccType == "HK" ? RS_HK : ACC_AccType == "ID" ? RS_ID : RS_EU) + "</span>");
    sb.append("<div class='OddsSel' id='divAT_" + _sel + "' style='width:50px; position:absolute; display:none;'>");
    sb.append("<div class='OddsSel2Bg' onclick=\"window.open('RMOdds2.aspx?ot=" + ot + "&at=MY', 'fraMain')\"><a href='RMOdds2.aspx?ot=" + ot + "&at=MY' target='fraMain' class='OddsSel2'>" + RS_Malay + "</a><br /></div>");
    sb.append("<div class='OddsSel2Bg' onclick=\"window.open('RMOdds2.aspx?ot=" + ot + "&at=HK', 'fraMain')\"><a href='RMOdds2.aspx?ot=" + ot + "&at=HK' target='fraMain' class='OddsSel2'>" + RS_HK + "</a><br /></div>");
    sb.append("<div class='OddsSel2Bg' onclick=\"window.open('RMOdds2.aspx?ot=" + ot + "&at=ID', 'fraMain')\"><a href='RMOdds2.aspx?ot=" + ot + "&at=ID' target='fraMain' class='OddsSel2'>" + RS_ID + "</a><br /></div>");
    sb.append("<div class='OddsSel2Bg' onclick=\"window.open('RMOdds2.aspx?ot=" + ot + "&at=EU', 'fraMain')\"><a href='RMOdds2.aspx?ot=" + ot + "&at=EU' target='fraMain' class='OddsSel2'>" + RS_EU + "</a><br /></div>");
    sb.append("</div></div>");
    //refresh
    sb.append("<div style='float:left;'><a class='btnGrey btnRefresh' href='#'><span>" + RS_btnRefresh + "</span></a></div>");
    sb.append("</div>");
    sb.append("</td>");
    //subButton END
    sb.append("</tr>");
    sb.append("</table></td>");
    sb.append("<td width='10px' background='../Images/barR.png'>&nbsp;</td>");
    sb.append("</tr>");
    sb.append("</tbody>");
    sb.append("</table>");
    //Announcement
    if (UTL_IsShowAnnouncement == 'True') {
        sb.append("<div class='announcement' style='display: none;'>");
        sb.append("<table width='100%' height='262' border='0' cellspacing='0' cellpadding='0'>");
        sb.append("<tbody>");
        sb.append("<tr><td>");
        sb.append("<img src='" + ("../Images/" + ACC_PreferedCulture + "/Announcement.gif") + "' border='0' align='absmiddle' width='100%' height='252'>");
        sb.append("</td></tr>");
        sb.append("</tbody>");
        sb.append("</table>");
        sb.append("</div>")
    }

    //Early Selection
    if (ot == 'e')
        sb.append(GetjsOdds_EM(_E_Sel));

    //Running Table Without OE
    if (_isRun) {
        sb.append("<table width='100%' border='1' cellpadding='0' cellspacing='0' class='GridBorder'>");
        sb.append("<colgroup>");
        sb.append("<col style='width: 45px;'></col>");
        sb.append("<col style='width: auto;'></col>");
        sb.append("<col style='width: 82px;'></col>");
        sb.append("<col style='width: 82px;'></col>");
        sb.append("<col style='width: 40px;'></col>");
        sb.append("<col style='width: 82px;'></col>");
        sb.append("<col style='width: 82px;'></col>");
        sb.append("<col style='width: 40px;'></col>");
        sb.append("<col style='width: 20px;'></col>");
        sb.append("</colgroup>");
        sb.append("<tbody soclid='0' border='0'>");
        //start table items
        sb.append("<tr class='GridHeader' style='display:none;'><td></td></tr>"); //To avoid disappear from sort by time
        sb.append("<tr class='GridHeader'>");
        sb.append("<td class='table_th1" + _selCss + "' align='center' nowrap='nowrap' style='width:45px;' title='" + RS_Odds_Time + "'>" + RS_Odds_Time_2 + "</td>");
        sb.append("<td class='table_th2" + _selCss + "' align='center' style='width:302px;' title='" + RS_Event + "'>" + RS_Event_2 + "</td>");
        sb.append("<td class='table_th1" + _selCss + "' align='center' nowrap='nowrap' style='width:82px;' title='" + RS_Odds_FTHDP + "'>" + RS_Odds_FTHDP_2 + "</td>");
        sb.append("<td class='table_th1" + _selCss + "' align='center' nowrap='nowrap' style='width:82px;' title='" + RS_Odds_FTOU + "'>" + RS_Odds_FTOU_2 + "</td>");
        sb.append("<td class='table_th1" + _selCss + "' align='center' nowrap='nowrap' style='width:40px;' title='" + RS_Odds_FT1X2 + "'>" + RS_Odds_FT1X2_2 + "</td>");
        sb.append("<td class='table_th2" + _selCss + "' align='center' nowrap='nowrap' style='width:82px;' title='" + RS_Odds_1HHDP + "'>" + RS_Odds_1HHDP_2 + "</td>");
        sb.append("<td class='table_th2" + _selCss + "' align='center' nowrap='nowrap' style='width:82px;' title='" + RS_Odds_1HOU + "'>" + RS_Odds_1HOU_2 + "</td>");
        sb.append("<td class='table_th2" + _selCss + "' align='center' nowrap='nowrap' style='width:60px;' colspan='2' title='" + RS_Odds_1H1X2 + "'>" + RS_Odds_1H1X2_2 + "</td>");
        sb.append("</tr>");
        sb.append("</tbody>");
        sb.append("</table>");
    }
    //Today and Early Table With OE
    else {
        sb.append("<table width='100%' border='1' cellpadding='0' cellspacing='0' class='GridBorder'>");
        sb.append("<colgroup>");
        sb.append("<col style='width: 45px;'></col>");
        sb.append("<col style='width: auto;'></col>");
        sb.append("<col style='width: 82px;'></col>");
        sb.append("<col style='width: 82px;'></col>");
        sb.append("<col style='width: 40px;'></col>");
        sb.append("<col style='width: 50px;'></col>");
        sb.append("<col style='width: 82px;'></col>");
        sb.append("<col style='width: 82px;'></col>");
        sb.append("<col style='width: 40px;'></col>");
        sb.append("<col style='width: 20px;'></col>");
        sb.append("</colgroup>");
        sb.append("<tbody soclid='0' border='0'>");
        //start table items
        sb.append("<tr class='GridHeader' style='display:none;'><td></td></tr>"); //To avoid disappear from sort by time
        sb.append("<tr class='GridHeader'>");
        sb.append("<td class='table_th1" + _selCss + "' align='center' nowrap='nowrap' style='width:45px;' title='" + RS_Odds_Time + "'>" + RS_Odds_Time_2 + "</td>");
        sb.append("<td class='table_th2" + _selCss + "' align='center' style='width:252px;' title='" + RS_Event + "'>" + RS_Event_2 + "</td>");
        sb.append("<td class='table_th1" + _selCss + "' align='center' nowrap='nowrap' style='width:82px;' title='" + RS_Odds_FTHDP + "'>" + RS_Odds_FTHDP_2 + "</td>");
        sb.append("<td class='table_th1" + _selCss + "' align='center' nowrap='nowrap' style='width:82px;' title='" + RS_Odds_FTOU + "'>" + RS_Odds_FTOU_2 + "</td>");
        sb.append("<td class='table_th1" + _selCss + "' align='center' nowrap='nowrap' style='width:40px;' title='" + RS_Odds_FT1X2 + "'>" + RS_Odds_FT1X2_2 + "</td>");
        sb.append("<td class='table_th1" + _selCss + "' align='center' nowrap='nowrap' style='width:50px;' title='" + RS_OE + "'>" + RS_OE_2 + "</td>");
        sb.append("<td class='table_th2" + _selCss + "' align='center' nowrap='nowrap' style='width:82px;' title='" + RS_Odds_1HHDP + "'>" + RS_Odds_1HHDP_2 + "</td>");
        sb.append("<td class='table_th2" + _selCss + "' align='center' nowrap='nowrap' style='width:82px;' title='" + RS_Odds_1HOU + "'>" + RS_Odds_1HOU_2 + "</td>");
        sb.append("<td class='table_th2" + _selCss + "' align='center' nowrap='nowrap' style='width:60px;' colspan='2' title='" + RS_Odds_1H1X2 + "'>" + RS_Odds_1H1X2_2 + "</td>");
        sb.append("</tr>");
        sb.append("</tbody>");
        sb.append("</table>");
    }

    _$tb.empty().html(sb.toString());
}

function addL_S(_rL, updAll, _$tb, _isRun, _ot, process) {
    var sb = new StringBuilder();
    var _$tbL;
    var _IsNewL = false;
    var _$tbNew = null;

    if (updAll) {
        _$tbL = $("<tbody class='GridBg2' soclid='" + _rL[0][0] + "'></tbody> ");
        _IsNewL = true;
    } else {
        _$tbL = _$tb.find("[soclid='" + _rL[0][0] + "']");

        //Only handle when SortByTime
        if (pm_S[6] == 1) {
            var _$curTm = _$tbL.find("[oddsid='" + _rL[1][0][0] + "']"); // Current Odds
            var _$curTbL = _$curTm.parents("tbody[soclid]:first");
            var _$preTm = _$tb.find("[oddsid='" + _rL[1][0][67] + "']"); // Get the Presocdds
            var _$preTbL = _$preTm.parents("tbody[soclid]:first"); // Get the Whole tbody by PreSocOdds

            if (process == 1) {
                if (_$curTm.length == 0) {
                    if (_$preTbL.attr('soclid') != _rL[0][0]) {
                        _IsNewL = true;
                        _$tbL = $("<tbody class='GridBg2' soclid='" + _rL[0][0] + "'></tbody> ");
                    }
                }
            }
        }

        if (_$tbL.length == 0) {
            _IsNewL = true;
            _$tbL = $("<tbody class='GridBg2' soclid='" + _rL[0][0] + "'></tbody> ");
        }
    }
    if (_IsNewL) {
        sb.append("<tr class='Event" + (_isRun ? "R" : "") + "' align='Center'>");
        sb.append("<td>&nbsp;</td>");
        sb.append("<td colspan='" + (_isRun ? "6" : "7") + "' align='left' style='height:20px; padding-left:5px; width:*;' class='L_Name btnRefresh'>" + _rL[0][1]);
        if (_rL[0][2] != "") {
            sb.append("(" + _rL[0][2] + ")");
        }
        sb.append("</td>");
        sb.append("<td width='15px' align='right'>");
        sb.append("<a href='#' onclick=\"SetFavAll(this,'" + _ot + "');return false;\");return false;\" style='padding-bottom:3px;'><img title='Add All' src='../Images/FavAdd.gif' border='0' align='absmiddle'/></a>");
        sb.append("</td>");
        sb.append("<td width='20px' align='center'>");
        sb.append("<a href='#' class='btnRefresh'><img src='" + ("../Images/or" + RS_LangCol + ".gif") + "' border='0' align='absmiddle'></a>");
        sb.append("</td>");
        sb.append("</tr>");

        _$tbL.html(sb.toString());
        if (updAll) {
            _$tb.find("tbody[soclid]:last").after(_$tbL);
        }
        else {
            var _$preTm = _$tb.find("[oddsid='" + _rL[1][0][67] + "']");
            if (_$preTm == null || _$preTm.length <= 0) {
                if (_isRun) { LID_S_R = ''; ajaxRun(); } else { LID_S_T = ''; ajaxToday(); } return;
            }
            else {
                //Only handle when SortByTime and New league (tbody)
                if (pm_S[6] == 1 && _IsNewL) {
                    var _$next = _$preTm.next();
                    if (_$next.hasClass("GridRM"))
                        _$preTm = _$next;
                    var _$nextAll = _$preTm.nextAll();
                    if (_$nextAll.length > 0) {
                        _$tbNew = _$preTm.parents("tbody[soclid]:first").clone();
                        _$tbNew.children("tr[oddsid]").remove();
                        _$tbNew.append(_$nextAll);
                        _$preTm.nextAll().remove();
                        adjTb(_$tbNew, true);
                    }
                }
            }
            _$preTm.parents("tbody[soclid]:first").after(_$tbL);
            if (_$tbNew != null)
                _$tbL.after(_$tbNew);
        }
    }
    var _isAlt = true;
    for (var i = 0, len = _rL[1].length; i < len; i++) {
        if (_rL[1][i][69]) { _isAlt = !_isAlt; }
        addM_S(_rL[1][i], _isAlt, _isRun, _rL[0][0], _rL[0][1], _$tbL, _IsNewL, _ot, process);
        setDtM(_ot, _rL[1][i]);
    }
};

function addM_S(_rM, _isAlt, _isRun, _LId, _LTitle, _$tbL, _IsNewL, _ot, process) {
    var _FavId = _LId + "," + _rM[14] + "," + _rM[15];
    var key = _rM[0] + "E" + _LId + "|" + _rM[14] + "|" + _rM[15];
    //Draw Odds Row
    var visible = false;
    var parOt = _ot; //param Ot for showBetBoxRU funct

    var sb = new StringBuilder();
    var mouseOutColor = "";
    var itemClass = "";
    var HDPBG = "";
    if (_isRun) {
        if (_isAlt) {
            itemClass = "GridAltRunItem";
            mouseOutColor = C_Mcl[4];// jsRec.AltRunMouseOutColor;
            HDPBG = "HDPBG_GridAltRunItem";
        }
        else {
            itemClass = "GridRunItem";
            mouseOutColor = C_Mcl[3];// jsRec.RunMouseOutColor;
            HDPBG = "HDPBG_GridRunItem";
        }
    }
    else {
        if (_isAlt) {
            itemClass = "GridAltItem";
            mouseOutColor = C_Mcl[2];// jsRec.AltMouseOutColor;
            HDPBG = "HDPBG_GridAltItem";
        }
        else {
            itemClass = "GridItem";
            mouseOutColor = C_Mcl[1];//jsRec.MouseOutColor;
            HDPBG = "HDPBG_GridItem";
        }
    }
    var mouseOverColor = C_Mcl[0];// jsRec.MouseOverColor;

    var OddsBg = (_isRun ? (_isAlt ? "../Images/altrunitemnew.gif" : "../Images/runitemnew.gif") : (_isAlt ? "../Images/altitemnew.gif" : "../Images/itemnew.gif"));

    if (_rM[69]) {
        //Time Content
        sb.append("<td align='Center' style='width:45px;'>");
        sb.append(_rM[4] ? "<table width='100%' height='100%' style='background: url(" + OddsBg + ");' border='0' cellspacing='0' cellpadding='0'><tr><td align='center' class='StrStyleSoc'>" : "");
        sb.append("<div class='Heading5'>");
        sb.append(_rM[5]);
        sb.append(_rM[5] != "" ? "<br>" : "");
        sb.append(_rM[6] ? "<span class='" + (ACC_PreferedCulture.toUpperCase() == "EN-GB" ? "HeadingLIVE_ENGB" : "HeadingLIVE") + "'>" + RS_LIVE2 + "</span><br />" : "");
        sb.append(((_rM[7] && _rM[8] && _rM[0] != -1) ? ("<span class='HalfTime'>" + RS_HTIME + "</span>") : ""));
        sb.append(((_rM[0] != -1) && !_rM[9] && !_rM[7]) ? _rM[10] : "");
        sb.append(((_rM[0] != -1) && _rM[9] && !_rM[7]) ? "<img alt='' src='../Images/lastcall.gif'>" : "");
        sb.append("</div>");
        sb.append("<span class='Heading7'>");

        if (_rM[0] != -1 && _rM[11] != 0 && _rM[12] >= 0) {
            var strInjuryTime = "";
            if (_rM[13] > 0)
                strInjuryTime = "<span class='OddsInjTime'>" + "+" + _rM[13] + "</span>";
            sb.append("<span class='HeadingTime'>");
            if (_rM[11] == 1)
                sb.append((_rM[12] > 45) ? ("1H 45") : ("1H " + _rM[12]));
            else if (_rM[11] == 2)
                sb.append((_rM[12] > 45) ? ("2H 45") : ("2H " + _rM[12]));
            else if (_rM[11] == 3)
                sb.append((_rM[12] > 15) ? ("1E 15") : ("1E " + _rM[12]));
            else if (_rM[11] == 4)
                sb.append((_rM[12] > 15) ? ("2E 15") : ("2E " + _rM[12]));
            sb.append(strInjuryTime);
            sb.append("</span>");
        }
        else {
            if (_rM[7]) {
                sb.append((_rM[8] ? "" : ("<span class='" + (ACC_PreferedCulture.toUpperCase() == "EN-GB" ? "HeadingLIVE_ENGB" : "HeadingLIVE") + "'>" + RS_LIVE2 + "</span>")));
            }
        }
        sb.append("</span>");
        //------------------------------ Time CONTENT
        sb.append(_rM[4] ? "</td></tr></table>" : "");
        sb.append("</td>");
        //Home Away (Event)
        sb.append("<td align='left' style='padding-left:5px; width:*;'>");
        sb.append("<table width='100%' height='100%' cellpadding='0' cellspacing='0' border='0' class='StrStyleSoc'>");

        //Home Away_Home
        sb.append("<tr>");
        sb.append("<td align='left'>");
        //------------------------------ Event_Home CONTENT
        visible = (_rM[16] && _rM[17] && pm_S[3] && SocOddsIsAvailable3(_rM[32], _rM[33], _rM[18]));
        if (visible)
            sb.append("<span class='" + (_rM[20] && _rM[19] != 0 && _rM[19] != -1 ? (RS_LangClass + "Give") : (RS_LangClass + "Take")) + "'>" + _rM[21] + "</span>");
        sb.append(((_rM[17] && SocOddsIsAvailable3(_rM[32], _rM[33], _rM[18]) && (!pm_S[3] || !_rM[16])) ? "<span class='" + (_rM[20] && _rM[19] != 0 && _rM[19] != -1 ? (RS_LangClass + "Give") : (RS_LangClass + "Take")) + "'>" + _rM[21] + "</span>" : ""));
        sb.append(((!_rM[17] || !SocOddsIsAvailable3(_rM[32], _rM[33], _rM[18])) ? "<span class='" + (_rM[20] && _rM[19] != 0 && _rM[19] != -1 ? (RS_LangClass + "Give") : (RS_LangClass + "Take")) + "'>" + _rM[21] + "</span>" : ""));
        sb.append("&nbsp;");
        sb.append((_rM[22] > 0) ? "<img alt='' class='CssImgRC' src='../Images/redcard" + _rM[22] + ".gif'>" : "");
        //------------------------------ Event_Home CONTENT
        sb.append("</td>");
        if (_rM[63] > 0 && !pm_S[4]) {
            sb.append("<td rowspan='3' width='15px' align='center' valign='middle'>");
            if (isMobileBrowser() || CFG_CompType == "12") { // API or Mobile Browser
                sb.append("<img src='../Images/tv.gif' border='0' align='absmiddle' " + (_isRun ? "style='cursor:pointer' onclick=\"showTVLarge('LiveTVGLS.aspx?Channel=" + _rM[63] + "&ClosingDate=" + _rM[62] + "&h=" + sjson(_rM[21]) + "&a=" + sjson(_rM[23]) + "&mt=" + sjson(_LTitle) + "&pid=" + _rM[68] + "&isShow=1&view=l'); \"" : "") + " width='13px' height='13px' />");
            }
            else {
                sb.append("<img src='../Images/tv.gif' border='0' align='absmiddle' " + (_isRun ? "style='cursor:pointer;' onclick=\"toggleMenu('divTVMenu', 'divTVMenu" + key + "')\"" : "") + " width='13px' height='13px' />");
                sb.append("<div name='divTVMenu' id='divTVMenu" + key + "' class='SelMenu' style='width:70px; position:absolute; display:none;'>");
                sb.append("<div class='SelMenuItemBg'><span onclick=\"toggleMenu('divTVMenu', 'divTVMenu" + key + "'); showTVLarge('LiveTVGLS.aspx?Channel=" + _rM[63] + "&ClosingDate=" + _rM[62] + "&h=" + sjson(_rM[21]) + "&a=" + sjson(_rM[23]) + "&mt=" + sjson(_LTitle) + "&pid=" + _rM[68] + "&isShow=1&view=l'); \" >" + RS_LargeView + "</span></div>");
                sb.append("<div class='SelMenuItemBg'><span onclick=\"toggleMenu('divTVMenu', 'divTVMenu" + key + "'); showTVSide('LiveTVGLS.aspx?Channel=" + _rM[63] + "&ClosingDate=" + _rM[62] + "&h=" + sjson(_rM[21]) + "&a=" + sjson(_rM[23]) + "&mt=" + sjson(_LTitle) + "&pid=" + _rM[68] + "&isShow=1&view=s'); \" >" + RS_SideView + "</span></div>");
                sb.append("</div>");
            }
            sb.append("</td>");
        }
        if (_rM[64] > 0) {
            sb.append("<td rowspan='3' width='15px' align='center' valign='middle'>");
            if (isMobileBrowser() || CFG_CompType == "12") { // API or Mobile Browser
                sb.append("<img src='../Images/LiveCast.gif' border='0' align='absmiddle'  " + (_isRun ? "style='cursor:pointer' onclick=\"showLCLarge('LiveCenterWithOdds.aspx?LCId=" + _rM[64] + "&h=" + sjson(_rM[21]) + "&a=" + sjson(_rM[23]) + "&socOddsId=" + _rM[0] + "&isShow=1&view=l'); \"" : "") + " width='13px' height='13px' />");
            }
            else {
                sb.append("<img src='../Images/LiveCast.gif' border='0' align='absmiddle' " + (_isRun ? "style='cursor:pointer;' onclick=\"toggleMenu('divLCMenu', 'divLCMenu" + key + "')\"" : "") + " width='13px' height='13px' />");
                sb.append("<div name='divLCMenu' id='divLCMenu" + key + "' class='SelMenu' style='width:70px; position:absolute; display:none;'>");
                sb.append("<div class='SelMenuItemBg'><span onclick=\"toggleMenu('divLCMenu', 'divLCMenu" + key + "'); showLCLarge('LiveCenterWithOdds.aspx?LCId=" + _rM[64] + "&h=" + sjson(_rM[21]) + "&a=" + sjson(_rM[23]) + "&socOddsId=" + _rM[0] + "&isShow=1&view=l'); \" >" + RS_LargeView + "</span></div>");
                sb.append("<div class='SelMenuItemBg'><span onclick=\"toggleMenu('divLCMenu', 'divLCMenu" + key + "'); showLCSide('LiveCenterWithOdds.aspx?LCId=" + _rM[64] + "&h=" + sjson(_rM[21]) + "&a=" + sjson(_rM[23]) + "&socOddsId=" + _rM[0] + "&isShow=1&view=s'); \" >" + RS_SideView + "</span></div>");
                sb.append("</div>");
            }
            sb.append("</td>");
        }
        sb.append("<td rowspan='3' width='15px' align='center'>");
        sb.append("<a href='#' onclick=\"SetFavOne(this,'" + _ot + "');return false;\"><img fav='" + _rM[25] + "' src='.." + (_rM[25] == 1 ? "/Images/FavAdd.gif" : "/Images/FavOri.gif") + "' border='0' align='absmiddle' width='13px' height='13px' /></a>");
        sb.append("</td>");
        sb.append("</tr>");

        //Home Away_Away
        sb.append("<tr>");
        sb.append("<td align='left'>");
        //------------------------------ Event_Away CONTENT
        visible = (_rM[16] && _rM[17] && pm_S[3] && SocOddsIsAvailable3(_rM[32], _rM[33], _rM[18]));
        if (visible)
            sb.append("<span class='" + (!_rM[20] && _rM[19] != 0 && _rM[19] != -1 ? (RS_LangClass + "Give") : (RS_LangClass + "Take")) + "'>" + _rM[23] + "</span>");
        sb.append(((_rM[17] && SocOddsIsAvailable3(_rM[32], _rM[33], _rM[18]) && (!pm_S[3] || !_rM[16])) ? "<span class='" + (!_rM[20] && _rM[19] != 0 && _rM[19] != -1 ? (RS_LangClass + "Give") : (RS_LangClass + "Take")) + "'>" + _rM[23] + "</span>" : ""));
        sb.append(((!_rM[17] || !SocOddsIsAvailable3(_rM[32], _rM[33], _rM[18])) ? "<span class='" + (!_rM[20] && _rM[19] != 0 && _rM[19] != -1 ? (RS_LangClass + "Give") : (RS_LangClass + "Take")) + "'>" + _rM[23] + "</span>" : ""));
        sb.append("&nbsp;");
        sb.append((_rM[24] > 0) ? "<img alt='' class='CssImgRC' src='../Images/redcard" + _rM[24] + ".gif'>" : "");
        //------------------------------ Event_Away CONTENT
        sb.append("</td>");
        sb.append("</tr>");

        //Home Away_Draw
        sb.append("<tr>");
        sb.append("<td align='left' class='Draw'>" + RS_Draw + "</td>");
        sb.append("</tr>");

        sb.append("</table>");
        sb.append("</td>");
    }
    else {
        sb.append("<td align='Center' style='width:45px;'>&nbsp;</td>"); //Time
        sb.append("<td align='left' style='padding-left:5px; width:*;'>&nbsp;</td>"); //Home Away (Event)
    }
    /*------------------------------ SAME Event appear once END ------------------------------*/

    //Join 1X2, HDP, O/U in one table BEGIN
    sb.append("<td colspan='" + (_isRun ? "3" : "4") + "'><table width='100%' style='height:100%' border='0' cellpadding='0' cellspacing='0'><tr>");
    ////content BEGIN

    //HDP
    sb.append("<td style='width:82px;'>");
    sb.append("<table width='100%' border='0' cellpadding='0' cellspacing='0' class='StrStyleSoc'>");
    //HomeOdds
    sb.append("<tr>");
    sb.append("<td width='41px' align='left' class='Heading8'>&nbsp;" + ((_rM[17] && _rM[20]) ? UtilGetDisplayHdp(_rM[19]) : "&nbsp;") + "</td>");
    sb.append("<td align='right' style='width:41px;'>");

    //ReadOnly
    if (SocOddsIsAvailable3(_rM[32], _rM[33], _rM[18]) && _rM[17] && (!_rM[16] || !pm_S[3]))
        sb.append("<span class='" + (_rM[32] < 0 ? "NegOdds" : "PosOdds") + "'>" + "<label style='cursor:text;'>" + UtilGetDisplayOdds(_rM[32]) + "</label>" + "</span>");
    //Betable
    else if (SocOddsIsAvailable3(_rM[32], _rM[33], _rM[18]) && _rM[17] && _rM[16] && pm_S[3])
        sb.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer;' class='" + (_rM[32] < 0 ? "NegOdds" : "PosOdds") + "' onclick=\"showBetBoxRU('JRecPanel.aspx?b=home&oId=" + _rM[0] + "&gType=" + _rM[34] + "&gType2=" + _rM[35] + "', " + key + ", 'home', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds(_rM[32]) + "</label>" + "</span>");
    //Hide
    else
        sb.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer; display:none;' class='" + (_rM[32] < 0 ? "NegOdds" : "PosOdds") + "' onclick=\"showBetBoxRU('JRecPanel.aspx?b=home&oId=" + _rM[0] + "&gType=" + _rM[34] + "&gType2=" + _rM[35] + "', " + key + ", 'home', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds(_rM[32]) + "</label>" + "</span>");
    //------------------------------ Odds CONTENT
    sb.append("&nbsp;</td>");
    sb.append("</tr>");
    //AwayOdds
    sb.append("<tr>");
    sb.append("<td align='left' class='Heading8'>&nbsp;" + ((_rM[17] && !_rM[20]) ? UtilGetDisplayHdp(_rM[19]) : "&nbsp;") + "</td>");
    sb.append("<td align='right'>");

    //ReadOnly
    if (SocOddsIsAvailable3(_rM[32], _rM[33], _rM[18]) && _rM[17] && (!_rM[16] || !pm_S[3]))
        sb.append("<span class='" + (_rM[33] < 0 ? "NegOdds" : "PosOdds") + "'>" + "<label style='cursor:text;'>" + UtilGetDisplayOdds(_rM[33]) + "</label>" + "</span>");
    //Betable
    else if (SocOddsIsAvailable3(_rM[32], _rM[33], _rM[18]) && _rM[17] && _rM[16] && pm_S[3])
        sb.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer;' class='" + (_rM[33] < 0 ? "NegOdds" : "PosOdds") + "' onclick=\"showBetBoxRU('JRecPanel.aspx?b=away&oId=" + _rM[0] + "&gType=" + _rM[34] + "&gType2=" + _rM[35] + "', " + key + ", 'away', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds(_rM[33]) + "</label>" + "</span>");
    //Hide
    else
        sb.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer; display:none;' class='" + (_rM[33] < 0 ? "NegOdds" : "PosOdds") + "' onclick=\"showBetBoxRU('JRecPanel.aspx?b=away&oId=" + _rM[0] + "&gType=" + _rM[34] + "&gType2=" + _rM[35] + "', " + key + ", 'away', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds(_rM[33]) + "</label>" + "</span>");
    //------------------------------ Odds CONTENT
    sb.append("&nbsp;</td>");
    sb.append("</tr>");
    //HDP_Draw
    sb.append("<tr><td colspan='2'>&nbsp;</td></tr>");
    sb.append("</table>");
    sb.append("</td>");

    //OU
    sb.append("<td style='width:82px;'>");
    sb.append("<table width='100%' border='0' cellpadding='0' cellspacing='0' class='StrStyleSoc'>");
    //OverOdds
    sb.append("<tr>");
    sb.append("<td width='45px' align='left' class='Heading8'>&nbsp;" + (_rM[37] ? UtilGetDisplayHdp(_rM[38]) : "") + "</td>");
    sb.append("<td nowrap='nowrap' style='width:37px;' align='right'>");

    //ReadOnly
    if (SocOddsIsAvailable3(_rM[39], _rM[40], _rM[41]) && _rM[37] && (!_rM[16] || !pm_S[3]))
        sb.append("<span class='" + (_rM[39] < 0 ? "NegOdds" : "PosOdds") + "'>" + "<label style='cursor:text;'>" + UtilGetDisplayOdds(_rM[39]) + "</label>" + "</span>");
    //Betable
    else if (SocOddsIsAvailable3(_rM[39], _rM[40], _rM[41]) && _rM[37] && _rM[16] && pm_S[3])
        sb.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer;' class='" + (_rM[39] < 0 ? "NegOdds" : "PosOdds") + "' onclick=\"showBetBoxRU('JRecPanel.aspx?b=over&oId=" + _rM[0] + "&gType=" + _rM[34] + "&gType2=" + _rM[35] + "', " + key + ", 'over', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds(_rM[39]) + "</label>" + "</span>");
    //Hide
    else
        sb.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer; display:none;' class='" + (_rM[39] < 0 ? "NegOdds" : "PosOdds") + "' onclick=\"showBetBoxRU('JRecPanel.aspx?b=over&oId=" + _rM[0] + "&gType=" + _rM[34] + "&gType2=" + _rM[35] + "', " + key + ", 'over', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds(_rM[39]) + "</label>" + "</span>");
    //------------------------------ Odds CONTENT
    sb.append("</td>");
    sb.append("</tr>");
    //UnderOdds
    sb.append("<tr>");
    sb.append("<td>&nbsp;" + (_rM[37] ? "<span class='HeadingOU_U'>u</span>" : "") + "</td>");
    sb.append("<td align='right'>");

    //ReadOnly
    if (SocOddsIsAvailable3(_rM[39], _rM[40], _rM[41]) && _rM[37] && (!_rM[16] || !pm_S[3]))
        sb.append("<span class='" + (_rM[40] < 0 ? "NegOdds" : "PosOdds") + "'>" + "<label style='cursor:text;'>" + UtilGetDisplayOdds(_rM[40]) + "</label>" + "</span>");
    //Betable
    else if (SocOddsIsAvailable3(_rM[39], _rM[40], _rM[41]) && _rM[37] && _rM[16] && pm_S[3])
        sb.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer;' class='" + (_rM[40] < 0 ? "NegOdds" : "PosOdds") + "' onclick=\"showBetBoxRU('JRecPanel.aspx?b=under&oId=" + _rM[0] + "&gType=" + _rM[34] + "&gType2=" + _rM[35] + "', " + key + ", 'under', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds(_rM[40]) + "</label>" + "</span>");
    //Hide
    else
        sb.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer; display:none;' class='" + (_rM[40] < 0 ? "NegOdds" : "PosOdds") + "' onclick=\"showBetBoxRU('JRecPanel.aspx?b=under&oId=" + _rM[0] + "&gType=" + _rM[34] + "&gType2=" + _rM[35] + "', " + key + ", 'under', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds(_rM[40]) + "</label>" + "</span>");
    //------------------------------ Odds CONTENT
    sb.append("</td>");
    sb.append("</tr>");
    //OU_Draw
    sb.append("<tr><td colspan='2'>&nbsp;</td></tr>");
    sb.append("</table>");
    sb.append("</td>");

    //1X2
    sb.append("<td align='Center' style='width:40px;'>");
    sb.append("<table width='100%' border='0' cellpadding='0' cellspacing='0' class='StrStyleSoc'>");
    //X12_1Odds
    sb.append("<tr><td nowrap='nowrap' style='width:40px;' align='Center'>");

    //ReadOnly
    if (SocOddsIsAvailableX12(_rM[28], _rM[30], _rM[29]) && _rM[27] && (!_rM[16] || !pm_S[3]))
        sb.append("<span class='PosOdds'>" + "<label style='cursor:text;'>" + UtilGetDisplayOdds2(_rM[28]) + "</label>" + "</span>");
    //Betable
    else if (SocOddsIsAvailableX12(_rM[28], _rM[30], _rM[29]) && _rM[27] && _rM[16] && pm_S[3])
        sb.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer;' class='PosOdds' onclick=\"showBetBoxRU('JRecPanel.aspx?g=OE1X2_" + parOt.toUpperCase() + "&b=1&oId=" + _rM[0] + "&gType=" + _rM[34] + "&gType2=" + _rM[35] + "', " + key + ", '_1', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds2(_rM[28]) + "</label>" + "</span>");
    //Hide
    else
        sb.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer; display:none;' class='PosOdds' onclick=\"showBetBoxRU('JRecPanel.aspx?g=OE1X2_" + parOt.toUpperCase() + "&b=1&oId=" + _rM[0] + "&gType=" + _rM[34] + "&gType2=" + _rM[35] + "', " + key + ", '_1', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds2(_rM[28]) + "</label>" + "</span>&nbsp;");
    //------------------------------ Odds CONTENT
    sb.append("</td></tr>");
    //X12_2Odds
    sb.append("<tr><td nowrap='nowrap' style='width:40px;' align='Center'>");

    //ReadOnly
    if (SocOddsIsAvailableX12(_rM[28], _rM[30], _rM[29]) && _rM[27] && (!_rM[16] || !pm_S[3]))
        sb.append("<span class='PosOdds'>" + "<label style='cursor:text;'>" + UtilGetDisplayOdds2(_rM[29]) + "</label>" + "</span>");
    //Betable
    else if (SocOddsIsAvailableX12(_rM[28], _rM[30], _rM[29]) && _rM[27] && _rM[16] && pm_S[3])
        sb.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer;' class='PosOdds' onclick=\"showBetBoxRU('JRecPanel.aspx?g=OE1X2_" + parOt.toUpperCase() + "&b=2&oId=" + _rM[0] + "&gType=" + _rM[34] + "&gType2=" + _rM[35] + "', " + key + ", '_2', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds2(_rM[29]) + "</label>" + "</span>");
    //Hide
    else
        sb.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer; display:none;' class='PosOdds' onclick=\"showBetBoxRU('JRecPanel.aspx?g=OE1X2_" + parOt.toUpperCase() + "&b=2&oId=" + _rM[0] + "&gType=" + _rM[34] + "&gType2=" + _rM[35] + "', " + key + ", '_2', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds2(_rM[29]) + "</label>" + "</span>&nbsp;");
    //------------------------------ Odds CONTENT
    sb.append("</td></tr>");
    //X12_XOdds
    sb.append("<tr><td nowrap='nowrap' style='width:40px;' align='Center'>");

    //ReadOnly
    if (SocOddsIsAvailableX12(_rM[28], _rM[30], _rM[29]) && _rM[27] && (!_rM[16] || !pm_S[3]))
        sb.append("<span class='PosOdds'>" + "<label style='cursor:text;'>" + UtilGetDisplayOdds2(_rM[30]) + "</label>" + "</span>");
    //Betable
    else if (SocOddsIsAvailableX12(_rM[28], _rM[30], _rM[29]) && _rM[27] && _rM[16] && pm_S[3])
        sb.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer;' class='PosOdds' onclick=\"showBetBoxRU('JRecPanel.aspx?g=OE1X2_" + parOt.toUpperCase() + "&b=X&oId=" + _rM[0] + "&gType=" + _rM[34] + "&gType2=" + _rM[35] + "', " + key + ", '_X', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds2(_rM[30]) + "</label>" + "</span>");
    //Hide
    else
        sb.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer; display:none;' class='PosOdds' onclick=\"showBetBoxRU('JRecPanel.aspx?g=OE1X2_" + parOt.toUpperCase() + "&b=X&oId=" + _rM[0] + "&gType=" + _rM[34] + "&gType2=" + _rM[35] + "', " + key + ", '_X', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds2(_rM[30]) + "</label>" + "</span>&nbsp;");
    //------------------------------ Odds CONTENT
    sb.append("</td></tr>");
    sb.append("</table>");
    sb.append("</td>");

    //Only show in today table
    if (!_isRun) {
        //ODD/EVEN
        sb.append("<td align='Center' style='width:50px;'>");
        sb.append("<table width='100%' border='0' cellpadding='0' cellspacing='0' class='StrStyleSoc'>");
        //Odd
        sb.append("<tr>");
        sb.append("<td align='left' class='Heading6'>&nbsp;");
        sb.append((_rM[73] && SocOddsIsAvailable3(_rM[71], _rM[72], _rM[75])) ? ("<span class'=" + RS_LangClass + "Heading6'>" + "<label>" + RS_O + "</label>" + "</span>") : "");
        sb.append("</td>");
        sb.append("<td align='right'>");

        //ReadOnly
        if (SocOddsIsAvailable3(_rM[71], _rM[72], _rM[75]) && (_rM[73] && (!_rM[16] || !pm_S[3])))
            sb.append("<span class='" + (_rM[71] < 0 ? "NegOdds" : "PosOdds") + "'>" + "<label style='cursor:text;'>" + UtilGetDisplayOdds(_rM[71]) + "</label>" + "</span>");
        //Betable
        else if (SocOddsIsAvailable3(_rM[71], _rM[72], _rM[75]) && _rM[73] && _rM[16] && pm_S[3])
            sb.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer;' class='" + (_rM[71] < 0 ? "NegOdds" : "PosOdds") + "' onclick=\"showBetBoxRU('JRecPanel.aspx?b=odd&oId=" + _rM[0] + "&gType=" + _rM[34] + "&gType2=" + _rM[35] + "', " + key + ", 'odd', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds(_rM[71]) + "</label>" + "</span>");
        //Hide
        else
            sb.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer; display:none;' class='" + (_rM[71] < 0 ? "NegOdds" : "PosOdds") + "' onclick=\"showBetBoxRU('JRecPanel.aspx?b=odd&oId=" + _rM[0] + "&gType=" + _rM[34] + "&gType2=" + _rM[35] + "', " + key + ", 'odd', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds(_rM[71]) + "</label>" + "</span>");
        //------------------------------ Odds CONTENT
        sb.append("&nbsp;</td>");
        sb.append("</tr>");
        //Even
        sb.append("<tr>");
        sb.append("<td class='Heading6'>&nbsp;");
        sb.append((_rM[73] && SocOddsIsAvailable3(_rM[71], _rM[72], _rM[75])) ? ("<span class='" + RS_LangClass + "Heading6'>" + "<label>" + RS_E + "</label>" + "</span>") : "");
        sb.append("</td>");
        sb.append("<td align='right'>");

        //ReadOnly
        if (SocOddsIsAvailable3(_rM[71], _rM[72], _rM[75]) && (_rM[73] && (!_rM[16] || !pm_S[3])))
            sb.append("<span class='" + (_rM[72] < 0 ? "NegOdds" : "PosOdds") + "'>" + "<label style='cursor:text;' id='lblEvenOdds_T" + key + "'>" + UtilGetDisplayOdds(_rM[72]) + "</label>" + "</span>");
        //Betable
        else if (SocOddsIsAvailable3(_rM[71], _rM[72], _rM[75]) && _rM[73] && _rM[16] && pm_S[3])
            sb.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer;' class='" + (_rM[72] < 0 ? "NegOdds" : "PosOdds") + "' onclick=\"showBetBoxRU('JRecPanel.aspx?b=even&oId=" + _rM[0] + "&gType=" + _rM[34] + "&gType2=" + _rM[35] + "', " + key + ", 'even', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds(_rM[72]) + "</label>" + "</span>");
        //Hide
        else
            sb.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer; display:none;' class='" + (_rM[72] < 0 ? "NegOdds" : "PosOdds") + "' onclick=\"showBetBoxRU('JRecPanel.aspx?b=even&oId=" + _rM[0] + "&gType=" + _rM[34] + "&gType2=" + _rM[35] + "', " + key + ", 'even', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds(_rM[72]) + "</label>" + "</span>");
        //------------------------------ Odds CONTENT
        sb.append("&nbsp;</td>");
        sb.append("</tr>");
        //OE_Draw
        sb.append("<tr><td colspan='2'>&nbsp;</td></tr>");
        sb.append("</table>");
        sb.append("</td>");
    }

    ////content END
    sb.append("</tr></table></td>");
    //Join 1X2, HDP, O/U in one table END

    //----------------------------------------------------------------------- FH -----------------------------------------------------------------------
    //Join HDP_FH, O/U_FH in one table BEGIN
    sb.append("<td colspan='3'><table width='100%' style='height:100%' border='0' cellpadding='0' cellspacing='0'><tr>");
    ////content BEGIN

    //HDP_FH
    sb.append("<td style='width:82px;'>");
    sb.append("<table width='100%' border='0' cellpadding='0' cellspacing='0' class='StrStyleSoc'>");
    //HomeOdds_FH
    sb.append("<tr>");
    sb.append("<td width='41px' align='left' class='Heading8'>&nbsp;" + ((_rM[48] && _rM[50]) ? UtilGetDisplayHdp(_rM[49]) : "&nbsp;") + "</td>");
    sb.append("<td align='right' nowrap='nowrap' style='width:41px;'>");

    //ReadOnly
    if (SocOddsIsAvailable3(_rM[53], _rM[54], _rM[52]) && _rM[48] && (!_rM[51] || !pm_S[3]))
        sb.append("<span class='" + (_rM[53] < 0 ? "NegOdds" : "PosOdds") + "'>" + "<label style='cursor:text;'>" + UtilGetDisplayOdds(_rM[53]) + "</label>" + "</span>");
    //Betable
    else if (SocOddsIsAvailable3(_rM[53], _rM[54], _rM[52]) && _rM[48] && _rM[51] && pm_S[3])
        sb.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer;' class='" + (_rM[53] < 0 ? "NegOdds" : "PosOdds") + "' onclick=\"showBetBoxRU('JRecPanel.aspx?b=home&oId=" + _rM[1] + "&gType=" + _rM[34] + "&gType2=" + _rM[35] + "', " + key + ", 'homefh', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds(_rM[53]) + "</label>" + "</span>");
    //Hide
    else
        sb.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer; display:none;' class='" + (_rM[53] < 0 ? "NegOdds" : "PosOdds") + "' onclick=\"showBetBoxRU('JRecPanel.aspx?b=home&oId=" + _rM[1] + "&gType=" + _rM[34] + "&gType2=" + _rM[35] + "', " + key + ", 'homefh', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds(_rM[53]) + "</label>" + "</span>");
    //------------------------------ Odds CONTENT
    sb.append("&nbsp;</td>");
    sb.append("</tr>");
    //AwayOdds_FH
    sb.append("<tr>");
    sb.append("<td align='left' class='Heading8'>&nbsp;" + ((_rM[48] && !_rM[50]) ? UtilGetDisplayHdp(_rM[49]) : "&nbsp;") + "</td>");
    sb.append("<td align='right'>");

    //ReadOnly
    if (SocOddsIsAvailable3(_rM[53], _rM[54], _rM[52]) && _rM[48] && (!_rM[51] || !pm_S[3]))
        sb.append("<span class='" + (_rM[54] < 0 ? "NegOdds" : "PosOdds") + "'>" + "<label style='cursor:text;'>" + UtilGetDisplayOdds(_rM[54]) + "</label>" + "</span>");
    //Betable
    else if (SocOddsIsAvailable3(_rM[53], _rM[54], _rM[52]) && _rM[48] && _rM[51] && pm_S[3])
        sb.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer;' class='" + (_rM[54] < 0 ? "NegOdds" : "PosOdds") + "' onclick=\"showBetBoxRU('JRecPanel.aspx?b=away&oId=" + _rM[1] + "&gType=" + _rM[34] + "&gType2=" + _rM[35] + "', " + key + ", 'awayfh', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds(_rM[54]) + "</label>" + "</span>");
    //Hide
    else
        sb.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer; display:none;' class='" + (_rM[54] < 0 ? "NegOdds" : "PosOdds") + "' onclick=\"showBetBoxRU('JRecPanel.aspx?b=away&oId=" + _rM[1] + "&gType=" + _rM[34] + "&gType2=" + _rM[35] + "', " + key + ", 'awayfh', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds(_rM[54]) + "</label>" + "</span>");
    //------------------------------ Odds CONTENT
    sb.append("&nbsp;</td>");
    sb.append("</tr>");
    //HDP_FH_Draw_FH
    sb.append("<tr><td colspan='2'>&nbsp;</td></tr>");
    sb.append("</table>");
    sb.append("</td>");

    //OU_FH
    sb.append("<td style='width:82px;'>");
    sb.append("<table width='100%' border='0' cellpadding='0' cellspacing='0' class='StrStyleSoc'>");
    //OverOdds_FH
    sb.append("<tr>");
    sb.append("<td width='45px' align='left' class='Heading8'>&nbsp;" + ((_rM[56]) ? UtilGetDisplayHdp(_rM[57]) : "") + "</td>");
    sb.append("<td nowrap='nowrap' style='width:37px;' align='right'>");

    //ReadOnly
    if (SocOddsIsAvailable3(_rM[58], _rM[59], _rM[60]) && _rM[56] && (!_rM[51] || !pm_S[3]))
        sb.append("<span class='" + (_rM[58] < 0 ? "NegOdds" : "PosOdds") + "'>" + "<label style='cursor:text;'>" + UtilGetDisplayOdds(_rM[58]) + "</label>" + "</span>");
    //Betable
    else if (SocOddsIsAvailable3(_rM[58], _rM[59], _rM[60]) && _rM[56] && _rM[51] && pm_S[3])
        sb.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer;' class='" + (_rM[58] < 0 ? "NegOdds" : "PosOdds") + "' onclick=\"showBetBoxRU('JRecPanel.aspx?b=over&oId=" + _rM[1] + "&gType=" + _rM[34] + "&gType2=" + _rM[35] + "', " + key + ", 'overfh', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds(_rM[58]) + "</label>" + "</span>");
    //Hide
    else
        sb.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer; display:none;' class='" + (_rM[58] < 0 ? "NegOdds" : "PosOdds") + "' onclick=\"showBetBoxRU('JRecPanel.aspx?b=over&oId=" + _rM[1] + "&gType=" + _rM[34] + "&gType2=" + _rM[35] + "', " + key + ", 'overfh', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds(_rM[58]) + "</label>" + "</span>");
    //------------------------------ Odds CONTENT
    sb.append("</td>");
    sb.append("</tr>");
    //UnderOdds_FH
    sb.append("<tr>");
    //sb.append("<td>&nbsp;</td>");
    sb.append("<td>&nbsp;" + (_rM[56] ? "<span class='HeadingOU_U'>u</span>" : "") + "</td>");
    sb.append("<td align='right'>");

    //ReadOnly
    if (SocOddsIsAvailable3(_rM[58], _rM[59], _rM[60]) && _rM[56] && (!_rM[51] || !pm_S[3]))
        sb.append("<span class='" + (_rM[59] < 0 ? "NegOdds" : "PosOdds") + "'>" + "<label style='cursor:text;'>" + UtilGetDisplayOdds(_rM[59]) + "</label>" + "</span>");
    //Betable
    else if (SocOddsIsAvailable3(_rM[58], _rM[59], _rM[60]) && _rM[56] && _rM[51] && pm_S[3])
        sb.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer;' class='" + (_rM[59] < 0 ? "NegOdds" : "PosOdds") + "' onclick=\"showBetBoxRU('JRecPanel.aspx?b=under&oId=" + _rM[1] + "&gType=" + _rM[34] + "&gType2=" + _rM[35] + "', " + key + ", 'underfh', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds(_rM[59]) + "</label>" + "</span>");
    //Hide
    else
        sb.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer; display:none;' class='" + (_rM[59] < 0 ? "NegOdds" : "PosOdds") + "' onclick=\"showBetBoxRU('JRecPanel.aspx?b=under&oId=" + _rM[1] + "&gType=" + _rM[34] + "&gType2=" + _rM[35] + "', " + key + ", 'underfh', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds(_rM[59]) + "</label>" + "</span>");
    //------------------------------ Odds CONTENT
    sb.append("</td>");
    sb.append("</tr>");
    //OU_FH_Draw_FH
    sb.append("<tr><td colspan='2'>&nbsp;</td></tr>");
    sb.append("</table>");
    sb.append("</td>");

    //1X2_FH
    sb.append("<td style='width:40px;'>");
    sb.append("<table width='100%' border='0' cellpadding='0' cellspacing='0' class='StrStyleSoc'>");
    //X12_1Odds_FH
    sb.append("<tr><td nowrap='nowrap' style='width:40px;' align='Center'>");

    //ReadOnly
    if (SocOddsIsAvailableX12(_rM[44], _rM[46], _rM[45]) && _rM[43] && (!_rM[51] || !pm_S[3]))
        sb.append("<span class='PosOdds'>" + "<label style='cursor:text;'>" + UtilGetDisplayOdds2(_rM[44]) + "</label>" + "</span>");
    //Betable
    else if (SocOddsIsAvailableX12(_rM[44], _rM[46], _rM[45]) && _rM[43] && _rM[51] && pm_S[3])
        sb.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer;' class='PosOdds' onclick=\"showBetBoxRU('JRecPanel.aspx?g=OE1X2_" + parOt.toUpperCase() + "&b=1&oId=" + _rM[1] + "&gType=" + _rM[34] + "&gType2=" + _rM[35] + "', " + key + ", '_1fh', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds2(_rM[44]) + "</label>" + "</span>");
    //Hide
    else
        sb.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer; display:none;' class='PosOdds' onclick=\"showBetBoxRU('JRecPanel.aspx?g=OE1X2_" + parOt.toUpperCase() + "&b=1&oId=" + _rM[1] + "&gType=" + _rM[34] + "&gType2=" + _rM[35] + "', " + key + ", '_1fh', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds2(_rM[44]) + "</label>" + "</span>&nbsp;");
    //------------------------------ Odds CONTENT
    sb.append("</td></tr>");
    //X12_2Odds_FH
    sb.append("<tr><td nowrap='nowrap' style='width:40px;' align='Center'>");

    //ReadOnly
    if (SocOddsIsAvailableX12(_rM[44], _rM[46], _rM[45]) && _rM[43] && (!_rM[51] || !pm_S[3]))
        sb.append("<span class='PosOdds'>" + "<label style='cursor:text;'>" + UtilGetDisplayOdds2(_rM[45]) + "</label>" + "</span>");
    //Betable
    else if (SocOddsIsAvailableX12(_rM[44], _rM[46], _rM[45]) && _rM[43] && _rM[51] && pm_S[3])
        sb.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer;' class='PosOdds' onclick=\"showBetBoxRU('JRecPanel.aspx?g=OE1X2_" + parOt.toUpperCase() + "&b=2&oId=" + _rM[1] + "&gType=" + _rM[34] + "&gType2=" + _rM[35] + "', " + key + ", '_2fh', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds2(_rM[45]) + "</label>" + "</span>");
    //Hide
    else
        sb.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer; display:none;' class='PosOdds' onclick=\"showBetBoxRU('JRecPanel.aspx?g=OE1X2_" + parOt.toUpperCase() + "&b=2&oId=" + _rM[1] + "&gType=" + _rM[34] + "&gType2=" + _rM[35] + "', " + key + ", '_2fh', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds2(_rM[45]) + "</label>" + "</span>&nbsp;");
    //------------------------------ Odds CONTENT
    sb.append("</td></tr>");
    //X12_XOdds_FH
    sb.append("<tr><td nowrap='nowrap' style='width:40px;' align='Center'>");

    //ReadOnly
    if (SocOddsIsAvailableX12(_rM[44], _rM[46], _rM[45]) && _rM[43] && (!_rM[51] || !pm_S[3]))
        sb.append("<span class='PosOdds'>" + "<label style='cursor:text;'>" + UtilGetDisplayOdds2(_rM[46]) + "</label>" + "</span>");
    //Betable
    else if (SocOddsIsAvailableX12(_rM[44], _rM[46], _rM[45]) && _rM[43] && _rM[51] && pm_S[3])
        sb.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer;' class='PosOdds' onclick=\"showBetBoxRU('JRecPanel.aspx?g=OE1X2_" + parOt.toUpperCase() + "&b=X&oId=" + _rM[1] + "&gType=" + _rM[34] + "&gType2=" + _rM[35] + "', " + key + ", '_Xfh', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds2(_rM[46]) + "</label>" + "</span>");
    //Hide
    else
        sb.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer; display:none;' class='PosOdds' onclick=\"showBetBoxRU('JRecPanel.aspx?g=OE1X2_" + parOt.toUpperCase() + "&b=X&oId=" + _rM[1] + "&gType=" + _rM[34] + "&gType2=" + _rM[35] + "', " + key + ", '_Xfh', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds2(_rM[46]) + "</label>" + "</span>&nbsp;");
    //------------------------------ Odds CONTENT
    sb.append("</td></tr>");
    sb.append("</table>");
    sb.append("</td>");
    sb.append("</tr></table>");

    if (_rM[69]) {
        //More Bets
        sb.append("<td align='center' nowrap='nowrap' style='width:20px;'>");
        sb.append("<table border='0' width='100%' height='100%' cellpadding='1' cellspacing='0' class='StrStyleSoc'>");
        //Statistic
        if (_rM[61] > 0) {
            sb.append("<tr><td align='center' valign='middle'>");
            sb.append("<img src='../Images/Info.gif' width='14px' height='14px' border='0' align='absmiddle' style='cursor:pointer' onclick=\"window.open('" + CFG_StatsPath + "/" + _rM[61] + ".html', 'Statistic', 'width=1000,height=750,top=50,left=100,toolbars=no,scrollbars=yes,status=no,resizable=yes').focus();\" />");
            sb.append("</td></tr>");
        }
        //More Bets
        sb.append("<tr><td align='center' valign='middle'>");
        sb.append("<A title='More bets' style='cursor: pointer;' onclick=\"showMB('" + _rM[0] + "', '" + _FavId + "', '" + _ot + "', 'MoreBets2.aspx?ot=" + _ot + "&oId=" + _rM[0] + "&home=" + sjson2(_rM[21]) + "&away=" + sjson2(_rM[23]) + "&moduleTitle=" + sjson2(_LTitle) + "&date=" + _rM[10] + "&lang=" + pm_S[5] + "&isHomeGive=" + _rM[20] + "&workingDate=" + _rM[66] + "');\"><img src='../Images/MoreBets.gif' border='0' align='absmiddle' width='14px' height='14px' /></a>");
        sb.append("</td></tr>");

        sb.append("</table>");
        sb.append("</td>");
    }
    else {
        sb.append("<td align='center' nowrap='nowrap' style='width:20px;'>&nbsp;</td>");
    }

    var _trMhtml = "<tr oddsid='" + _rM[0] + "' preoddsid='" + _rM[67] + "' favid='" + _FavId + "' class='M_Item " + itemClass + "'>" + sb.toString() + "</tr>";
    if (_IsNewL) {
        if (process == null) {
            _$tbL.append(_trMhtml);
        }
        else if (process != null && process == "1") {
            var _$oldTr = _$tbL.find("[oddsid='" + _rM[0] + "']");
            //To ensure that no duplicate odds will appear
            if (_$oldTr == null || _$oldTr.length <= 0) {
                _$tbL.append(_trMhtml);
            }
        }
    }
    else {
        var _$oldTr = _$tbL.find("[oddsid='" + _rM[0] + "']");
        //new add row 
        if (_$oldTr == null || _$oldTr.length <= 0) {
            var _$preTm = _$tbL.find("[oddsid='" + _rM[67] + "']");
            var _$curTm;
            if (_$preTm == null || _$preTm.length <= 0) {
                _$curTm = _$tbL.find(".L_Name").parents("tr:first").after(_trMhtml);
            } else {
                var _$mbTm = _$preTm.next();
                if (_$mbTm.length > 0 && _$mbTm.hasClass('GridRM') && _$preTm.attr("favId") != _FavId)
                    _$curTm = _$mbTm.after(_trMhtml);
                else
                    _$curTm = _$preTm.after(_trMhtml);
            }
            var _$curtbL = _$curTm.parents("tbody[soclid]:first");
            adjTb(_$curtbL, true); //Adjust Row Color
        }
        else {//update row
            var _Oldtds = _$oldTr.clone().children();
            var _$newTrTm = _$oldTr;
            _$newTrTm.attr('preoddsid', _rM[67]);
            _$newTrTm.empty().append(sb.toString());
            var _Newtds = _$newTrTm.children();

            //Compare with label value "odds"
            _Oldtds = _Oldtds.find('label');
            _Newtds = _Newtds.find('label');

            if (_Oldtds.length == _Newtds.length) {
                for (var i = 0, len = _Oldtds.length; i < len; i++) {
                    if (_Newtds[i].innerHTML != _Oldtds[i].innerHTML) {
                        $(_Newtds[i]).closest('td').addClass("NewOdds").css('background', "url(" + OddsBg + ")").attr("chgTms", 0);
                    }
                }
            }
        }
    }
};

//Delete
function delM_S(_oddsid, _$tb, _ot) {
    var _$trM = _$tb.find("[oddsid='" + _oddsid + "']");
    var _$trMB = _$tb.find("[oddsid='" + _oddsid + "MB']");
    if (_$trM.length > 0) {
        var _$tbL = _$trM.parents("tbody:first");
        if (_$trMB.length > 0)
            _$trMB.remove();
        _$trM.remove();
        if (_$tbL.children().length <= 1) {
            _$tbL.remove();
        }
        adjTb(_$tbL, true); //Adjust Row Color
    }
    delDtM(_ot, _oddsid); //Delete Row
};

function closeMB(_ot) {
    var _$tb = $tb_S_R;
    if (_ot != 'r')
        _$tb = $tb_S_T;
    _$tb.find(".GridRM").remove();
}

function showMB(oid, favId, _ot, url) {
    var _$tb = $tb_S_R;
    if (_ot != 'r')
        _$tb = $tb_S_T;

    var _$tbA = $tb_S_R.parents("table:first");
    var _$trA = _$tbA.find("[oddsid]");
    var _$trA_MB = _$trA.nextAll('.GridRM:first');
    if (_$trA_MB.length > 0 && _$trA_MB.hasClass('GridRM'))
        _$trA_MB.remove();

    var _trMB = "<tr oddsid='" + oid + "MB' favid='" + favId + "' class='GridRM'><td colspan='10'><iframe id='ifMB' scrolling='no' frameBorder='0' src='" + url + "' width='767px' height='0px' style='display: block;' /></td></tr>";
    _$tb.find("tr[favid='" + favId + "']:last").after(_trMB);
}