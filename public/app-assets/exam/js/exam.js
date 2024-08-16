var SITE_URL = '';
let QuesArr = [];
let tabContentIds = [];
let addedLevel = [];
let quessIds = [];
let secDifId = []
let secQuesId ={};
let lostArr =[];
let taggersId =[];
let ExistTriggerDiffId = [];
let selectSecIds=[]
let saveSubjectIds =[]
let dubId = [];
$(() => {
    
    setTimeout(() => {
        let activeTab = $("#activeTab").val();
        //console.log('activeTab', activeTab);
        if (activeTab == 'finished') {
            $(".topic-selection-select").trigger('change');

            let questionId = $('#questionids').val().split('],[')
            let i = 0;
            for (const qArr of questionId) {

                QuesArr[i++] = qArr.replace(/[\[\]']+/g, '').split(',');
            }


            setTimeout(() => {
                $(".question-selected").trigger('click');

            }, 1000);
           // console.log("QuesArr==",QuesArr);
        }
    }, 1000);


    $('input[type="checkbox"]').on('click keyup keypress keydown', function (event) {
        if ($(this).is('[readonly]')) { return false; }
    });

})

let selectLevel = function (e, selectId, subjectId, dificultyId, questionType, courseId, sid) {
    let hrefId = $(e).attr('href');
    let topicId = $("#selectSection_" + selectId).val();
    let section = selectId.split('_')[0]
    let subjectName = selectId.split('_')[1]
    let diffId = "#difficulties_" + subjectName + '_' + section.toUpperCase();
    var oldValue = $(diffId).val();
    var arr =[];
    if(oldValue != undefined && oldValue !=''){
        arr= oldValue === "" ? [] : oldValue.split(',');
    }
   
    arr.push(dificultyId);
    var newValue = arr.join(',');
    $(diffId).val(newValue);
    var selectQid = JSON.stringify(QuesArr);
    let section_select_ques = $("#section_select_ques").val();
    let subIds = $("#subject_ids").val().split(',');
    let sectionwise_total_ques =   $("#sectionwise_total_ques").val()?.split(",")
    let section_select_exiting_ques = $("#section_select_exit_ques").val()
    // console.log("section_select_exiting_ques==========",section_select_exiting_ques)
    section_select_exiting_ques= section_select_exiting_ques.split(',')
    let totalQCnt=  section_select_exiting_ques.length;
    let currentSecQcnt = parseInt(sectionwise_total_ques[sid-1].replace(/[\[\]]/g, '').replace('"',''));
   // console.log("sectionwise_total_ques======",sectionwise_total_ques);
    if(saveSubjectIds.length <= 0 ){
        saveSubjectIds.push(subIds[0]);
    }
    //console.log("saveSubjectIds First time==",saveSubjectIds)
    //console.log("saveSubjectIds",saveSubjectIds,"Subject Sequence===",subIds,"sectionwise_total_ques===",sectionwise_total_ques)
    let secCount =0
    console.log
    for(let i =0 ; i <  sid ; i++){
        secCount +=  parseInt(sectionwise_total_ques[i].replace(/[\[\]]/g, '').replace('"',''));
        
    }
     let startIndex = secCount -  currentSecQcnt ;
    let endIndx = secCount 
    let SecWsQ =  section_select_exiting_ques.slice(startIndex,endIndx)
    // console.log("startIndex==",startIndex,"endIndx==",endIndx,"SecWsQ==",SecWsQ);
    // console.log("section_select_exiting_ques===",section_select_exiting_ques,"sectionwise_total_ques==",sectionwise_total_ques,"totalQCnt==",totalQCnt,"sid==",sid,"currentSecQcnt==",currentSecQcnt)
    SecWsQ = [... new Set(section_select_exiting_ques)];
    //console.log("SecWsQ=====",SecWsQ)
    let save_subject =  $("#save_subject").val();
    let exam_id = $("#exam_id").val();
    let content = '';
    $.ajax({
        url: SITE_URL + 'DyanamicTest/getQuestionList',
        type: "POST",
        cache: false,
        data: { COURSE_ID: courseId, selectionId: hrefId, subject_id: subjectId, section: section, subjectName: subjectName, topic_ids: topicId, dificultyId: dificultyId, secType: questionType, selectQid: selectQid, sid: sid, section_select_ques: section_select_ques,SecWsQ:SecWsQ,save_subject ,exam_id},
        beforeSend: function () {
            //  $("body").addClass("kun_loading");
        },
        success: function (data) {

            let idd = `selectQuestion_` + dificultyId + `_` + selectId.toUpperCase();
            // console.log("dsdsdsd====",$('#' + idd).html().trim());  
           if (  $('#' + idd).html().trim() == '' || $('#' + idd).html().trim().includes('No Question Available...') ) {
                $('#' + idd).html("<h4 class='text-center mt-3'>Please wait...!</h4>")
                setTimeout(() => {
                    typeset(() => {
                        const math = document.querySelector('#' + idd);
                        math.innerHTML = data;
                        return [math];
                    });
                }, 400);
               
                $('input:checkbox[class=questionclass]').each(function(){
                    //console.log('this',this)
                    if ($(this).prop('checked')) {
                    //console.log("======",$(this).val())
                    }
                })
                if(lostArr.length > 0){ 
                setTimeout(() => {
                    $("input:checkbox").each(function(){
                        var idds = $(this);
                        let valQ= $(this).val();
                        
                        if(lostArr.includes(valQ)){
                           
                           $("#" + this.id).prop("checked",true)  
                           selectQuestion(this,subjectName,sid);
                           lostArr = lostArr.filter(ele=> ele != valQ);
                           if(!QuesArr.includes(valQ)){
                                QuesArr.push(valQ);
                           }
                           //console.log("After lost slect ques",QuesArr)
                        }

                       
                    })
                
                }, 2000);
                }
            }
           
            // $("body").removeClass("kun_loading");

        },
        complete: async function (data) {
            // sid
      
            if(!ExistTriggerDiffId.includes(dificultyId+'_'+sid)){
                    // $("body").addClass("kun_loading");

                    let qIdds =  await getSelectedQuestion();
                    // console.log(qIdds,"=========")
                    // $("body").removeClass("kun_loading");

                    ExistTriggerDiffId.push(dificultyId+'_'+sid)
                
            }
           // console.table("ExistTriggerDiffId===",dificultyId+'_'+sid)
        }
    });

};


 function getSelectedQuestion(){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
           
            var values = $('input:checkbox:checked.questionclass').map(function () {
                if(!taggersId.includes(this.id)){
                    $("#" + this.id).trigger('change');
                    if(!quessIds.includes(this.value)){
                        quessIds.push(this.value)
                    }
                    taggersId.push(this.id)
                }
                //console.log("taggers calls")
                return this.id;
              }).get(); 
              
              if(values){
                resolve(values)
              }else{
                resolve([])
              }
            return ""
              
        }, 5000)
    })
}


let selectLevelGrp = function (e, selectId, subjectId, dificultyId, questionType, courseId, sid, type = '') {
    let hrefId = $(e).attr('href');
    let topicId = $("#selectSection_" + selectId).val();
    let section = selectId.split('_')[0]
    let subjectName = selectId.split('_')[1]
    let diffId = "#difficulties_" + subjectName + '_' + section.toUpperCase();
    let no_of_ques = parseInt($("#" + subjectName + "_tol_quest_" + sid).html());
    let select_no_of_ques = parseInt($("#" + subjectName + "select_tot_ques_" + sid).html());
    let idd1 = `selectQuestion_` + dificultyId + `_` + selectId.toUpperCase();
    //$('#' + idd1).html("<h4 class='text-center mt-3'>Please wait...!</h4>");
    let selSecid = dificultyId + '_' + section + '_' + subjectName;
    // console.log(no_of_ques ,">=", select_no_of_ques)
    // console.log("================",no_of_ques == select_no_of_ques && ( (no_of_ques != 0 && select_no_of_ques != 0) && (!secDifId.includes(selSecid) || secDifId.length == 0)))
    if (no_of_ques == select_no_of_ques && ((no_of_ques != 0 && select_no_of_ques != 0) && (!secDifId.includes(selSecid) || secDifId.length == 0))) {

        $('#' + idd1).html("<h4 class='text-center mt-3'>Question Already Selected..!</h4>");

        return false;
    } else {

        if (!secDifId.includes(selSecid)) {
            secDifId.push(selSecid);
        }
        //console.log("Section Selece@@@@@@@@@", selSecid);
    }

    var oldValue = $(diffId).val();
    var arr =[];
    if(oldValue != undefined && oldValue !=''){
        arr= oldValue === "" ? [] : oldValue.split(',');
        
    }
    let dId = [];
    if (dificultyId == 'Low') {
        dId = dId.concat([1, 2, 3, 4]);
    }
    else if (dificultyId == 'Moderate') {
        dId = dId.concat([5, 6, 7, 8]);
    } else if (dificultyId == 'High') {
        dId = dId.concat([9, 10, 11]);
    }

    var newValue = arr.join(',');
    $(diffId).val(dificultyId);
    var selectQid = JSON.stringify(QuesArr);

    let totalQues = $("#" + subjectName + "_tol_quest_" + sid).html();
    let section_select_ques = $("#section_select_ques").val();
    // $("body").addClass("kun_loading");
    let content = '';
    $.ajax({
        url: SITE_URL + 'DyanamicTest/getQuestionListGrp',
        type: "POST",
        cache: false,
        data: { COURSE_ID: courseId, selectionId: hrefId, subject_id: subjectId, section: section, subjectName: subjectName, topic_ids: topicId, dificultyId: dId, secType: questionType, selectQid: selectQid, sid: sid, totalQues: totalQues, section_select_ques: section_select_ques },
        beforeSend: function () {
            //  $("body").addClass("kun_loading");
        },
        success: function (data) {

            let idd = `selectQuestion_` + dificultyId + `_` + selectId.toUpperCase();

            if ($('#' + idd).html().trim() == '') {

                setTimeout(() => {
                    typeset(() => {
                        const math = document.querySelector('#' + idd);
                        math.innerHTML = data;
                        return [math];
                    });
                }, 400);
            }

            setTimeout(() => {

                let qId = [];
                var searchIDs = $('input:checked').map(function () {

                    if (this.id != '') {

                        // console.log("Status", $("#" + this.id).is(':checked'));
                        if ($("#" + this.id).is(':checked')) {
                            // quessIds
                            //console.log("Ques Tigger Call")
                            //console.log($("#" + this.id).val())
                            let qId = $("#" + this.id).val();
                           
                            if (!quessIds.includes(qId)) {
                                //console.log("ClickEvent")
                                $("#" + this.id).trigger('change');
                            }

                        }
                    }


                });

            }, 1000);
            // $("body").removeClass("kun_loading");

        },
        complete: function (data) {
            // $("body").removeClass("kun_loading");
        }
    });

};

let changeLevelTopic = function (id, sect, subjectid, questionType, courseId, sid) {
    $('#lev_' + sect).html('');
    var topicIds = "" + $("#" + id.id).val();
    let section = sect.split('_')[0]

    let subjectName = sect.split('_')[1]

    let activeTab = $("#activeTab").val();
    //console.log("quessIds  :::  Clea",quessIds)
  
    let selctSecQ =[];
     selctSecQ = secQuesId[subjectName+'_'+sid];
    //console.log(selctSecQ,"secQuesId[subjectName+'_'+sid].length")
  
   if( selctSecQ!= undefined && selctSecQ.length > 0){
        Swal.fire({
            title: "Are you sure..!, Your selected questions will be lost?",
            text: "If yes! You need to select questions again.",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes,setup it!",
            confirmButtonClass: "btn btn-primary",
            cancelButtonClass: "btn btn-danger ml-1",
            buttonsStyling: false
        }).then(function (result) {
              $("#" + subjectName + "select_tot_ques_" + sid).html(0);
              $("#section_select_ques").val('')
              
            for(let i =0 ; i <= 13; i++){
                // console.log("#selectQuestion_"+i+"_"+section+'_'+subjectName.toUpperCase())
               
                $("#selectQuestion_"+i+"_"+section.toUpperCase()+'_'+subjectName.toUpperCase()).find('input[type=checkbox]').each(function () {
                    if(this.checked){
                       
                        quessIds = quessIds.filter(ele=> ele != this.value);
                        if(lostArr.includes(this.value)){
                            lostArr.push(this.value);
                        }
                        //console.log("====Lst===",lostArr)
                        //console.log("Before Filter==",QuesArr)
                        QuesArr = QuesArr.filter(ele=> ele != this.value);
                        //console.log("After Filter==",QuesArr)
                    }            
                });
                $("#selectQuestion_"+i+"_"+section+'_'+subjectName.toUpperCase()).find('input[type=checkbox]').each(function () {
                    if(this.checked){
                       
                        quessIds = quessIds.filter(ele=> ele != this.value);
                        lostArr.push(this.value);
                        //console.log("====Lst===",lostArr)
                        //console.log("Before Filter==",QuesArr)
                        QuesArr = QuesArr.filter(ele=> ele != this.value);
                        //console.log("After Filter==",QuesArr)

                    }            
                });

              
                $("#selectQuestion_"+i+"_"+section.toUpperCase()+'_'+subjectName.toUpperCase()).html('');
                $("#selectQuestion_"+i+"_"+section+'_'+subjectName.toUpperCase()).html('');
              
               $("section_select_ques").val('')
            }
        });
    }
    //console.log("lost  arr==",lostArr)
    //console.log("selected===",quessIds)
    
    // $("body").addClass("kun_loading");
    if (activeTab == 'finished') {
        $("#" + subjectName + "select_tot_ques_" + sid).html($("#" + subjectName + "_tol_quest_" + sid).html());
    }

    if (topicIds) {
        $.ajax({
            url: SITE_URL + 'DyanamicTest/getDificultiesIdTopic',
            type: "POST",
            cache: false,
            data: { ids: topicIds },
            beforeSend: function () {
                // $("body").addClass("kun_loading");
            },
            success: function (data) {

                let obj = JSON.parse(data);
                let i = 0;
                let content = ``;
                let tabContent = ``;
                var levelId = '';

                for (const level of obj) {
                    let active = (i == 0) ? '' : '';
                    //   if(QuesArr)

                    if ($("#is_auto").val() == 1) {

                        levelId = parseInt(level);
                        levelNo = parseInt(level);

                        if (levelNo >= 1 && levelNo <= 4) {
                            levelId = 'Low';
                           // console.log("addedLevel.includes(levelId + subjectid + sect)", addedLevel.includes(levelId + subjectid + sect))
                            if (addedLevel.includes(levelId + subjectid + sect) == false) {

                                content = content + ` <li class="nav-item mt-0 mr-3 def-level" id="li-selction-dif_` + sect + `_` + levelId + `" "  >
                            <a class="nav-link `+ active + ` question-selected select-lvel-ques"  data-toggle="tab" href="#level_` + levelId + `_` + sect.toUpperCase() + `"  id="level_` + level + `_` + subjectName.toUpperCase() + `_`+ sid +`" role="tab" style="width:110%; margin-left:6px;" onClick="selectLevelGrp(this ,'` + sect + `',` + subjectid + `,` + `'Low'` + `,'` + questionType + `',` + courseId + `,` + sid + `)"  > ` + levelId + ` </a>
                            </li>`;
                                addedLevel.push(levelId + subjectid + sect);
                            }

                            //console.log("addedLevel", addedLevel)
                        }
                        else if (levelNo >= 5 && levelNo <= 9) {
                            levelId = 'Moderate';
                            if (!addedLevel.includes(levelId + subjectid + sect)) {

                                content = content + ` <li class="nav-item mt-0 mr-3 def-level" id="li-selction-dif_` + sect + `_` + levelId + `" "  >
                            <a class="nav-link `+ active + ` question-selected select-lvel-ques"  data-toggle="tab" href="#level_` + levelId + `_` + sect.toUpperCase() + `"  id="level_` + level + `_` + subjectName.toUpperCase() + `_`+ sid +`" role="tab" style="width:110%; margin-left:6px;" onClick="selectLevelGrp(this ,'` + sect + `',` + subjectid + `,` + `'Moderate'` + `,'` + questionType + `',` + courseId + `,` + sid + `)"  > ` + levelId + ` </a>
                            </li>`;
                                addedLevel.push(levelId + subjectid + sect);
                            }

                        } else if (levelNo >= 9 && levelNo <= 11) {
                            levelId = 'High';
                            if (!addedLevel.includes(`` + levelId + subjectid + sect)) {
                                content = content + ` <li class="nav-item mt-0 mr-3 def-level" id="li-selction-dif_` + sect + `_` + levelId + `" "  >
                            <a class="nav-link `+ active + ` question-selected select-lvel-ques"   data-toggle="tab" href="#level_` + levelId + `_` + sect.toUpperCase() + `"  id="level_` + level + `_` + subjectName.toUpperCase() + `_`+ sid +`"  role="tab" style="width:110%; margin-left:6px;" onClick="selectLevelGrp(this ,'` + sect + `',` + subjectid + `,` + `'High'` + `,'` + questionType + `',` + courseId + `,` + sid + `)"  > ` + levelId + ` </a>
                            </li>`;
                                addedLevel.push(levelId + subjectid + sect);
                            }

                        }




                    } else {
                        content = content + ` <li class="nav-item mt-0 mr-3 def-level"  id="li-selction-dif_` + sect + `_` + level + `"  >
                    <a class="nav-link `+ active + ` question-selected select-lvel-ques"  data-toggle="tab" href="#level_` + level + `_` + sect.toUpperCase() + `" id="level_` + level + `_` + subjectName.toUpperCase() + `_`+ sid +`" role="tab"  style="width:110%; margin-left:6px;" onClick="selectLevel(this ,'` + sect + `',` + subjectid + `,` + level + `,'` + questionType + `',` + courseId + `,` + sid + `)"  >` + level + `</a>
                     </li>`;
                        levelId = level;
                    }

                    if (tabContentIds.includes(`level_` + levelId + `_` + sect.toUpperCase()) == false) {
                        tabContent = tabContent + `<div class="exam-tab tab-pane ` + active + ` " id="level_` + levelId + `_` + sect.toUpperCase() + `">  <h3 class="accordian-sublabels">Select questions Difficulty Level - ` + levelId + `</h3>
                 <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 pb-2 pl-0 pr-0 topic-selection-box  question-selection-box">
                <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 pl-0 pr-0">
                     <input type="text" id="Search" onkeyup="myFunction()" placeholder="Please enter a search term.." title="Type here" class="from-control hide">
                   
                </div>
                <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 pl-0 pr-0">
                    <div id="selectQuestion_` + levelId + `_` + sect.toUpperCase() + `" name="selectQuestion[` + levelId + `][` + subjectName + `][` + section + `]"
                        class="selectpicker topic-selection-select" multiple
                        data-live-search="true" data-placeholder="Select topic">
                      
                    
                    </div>
                </div>
            </div> </div>`;
                        tabContentIds.push(`level_` + levelId + `_` + sect.toUpperCase())
                    }

                    // console.log("tabContentIds ========", tabContentIds)
                    i++;
                }
                if ($("#is_auto").val() == 1) {

                    $('#lev_' + sect).append(content);
                } else {
                    $('#lev_' + sect).html(content);
                }
                $("#deficulti_tab_section_" + sect).append(tabContent);

                $(".selectpicker").selectpicker('refresh');
                // $("body").removeClass("kun_loading");

            },
            complete: function (data) {
                // $("body").removeClass("kun_loading");
            }
        });
    } else {

        $(".question-listed").html('');
        $(".nitin-list").html('');
        addedLevel = [];
        quessIds = [];
        tabContentIds = [];
        // $("body").removeClass("kun_loading");
    }

}


let changeLevelSubTopic = function (id, sect, subjectid, questionType, courseId, sid) {


    //  ===
    let secDifId = []
    var topicIds = "" + $("#" + id.id).val();
    let section = sect.split('_')[0]
    let tabContentIds = [];

    let subjectName = sect.split('_')[1]

    let activeTab = $("#activeTab").val();
    addedLevel = [];
    quessIds = [];
    levelId = [];
    // $("body").addClass("kun_loading");
    if (activeTab == 'finished') {
        $("#" + subjectName + "select_tot_ques_" + sid).html($("#" + subjectName + "_tol_quest_" + sid).html());
    }
    if (topicIds) {
        $.ajax({
            url: SITE_URL + 'DyanamicTest/getDificultiesIdSubTopic',
            type: "POST",
            cache: false,
            data: { ids: topicIds },
            beforeSend: function () {
                // $("body").addClass("kun_loading");
            },
            success: function (data) {

                let obj = JSON.parse(data);
                let i = 0;
                let content = ``;
                let tabContent = ``;
                for (const level of obj) {
                    let active = (i == 0) ? '' : '';

                    if ($("#is_auto").val() == 1) {
                        levelId = parseInt(level);
                        levelNo = parseInt(level);

                        if (levelNo >= 1 && levelNo <= 4) {
                            levelId = 'Low';
                            //console.log("addedLevel.includes(levelId + subjectid + sect)", addedLevel.includes(levelId + subjectid + sect))
                            if (addedLevel.includes(levelId + subjectid + sect) == false) {

                                content = content + ` <li class="nav-item mt-0 mr-3 def-level" id="li-selction-dif_` + sect + `_` + levelId + `" "  >
                            <a class="nav-link `+ active + ` question-selected select-lvel-ques" data-toggle="tab" href="#level_` + levelId + `_` + sect.toUpperCase() + `" role="tab" style="width:110%; margin-left:6px;" onClick="selectLevelGrp(this ,'` + sect + `',` + subjectid + `,` + `'Low'` + `,'` + questionType + `',` + courseId + `,` + sid + `)"  > ` + levelId + ` </a>
                            </li>`;
                                addedLevel.push(levelId + subjectid + sect);
                            }

                           // console.log("addedLevel", addedLevel)
                        }
                        else if (levelNo >= 5 && levelNo <= 9) {
                            levelId = 'Moderate';
                            if (!addedLevel.includes(levelId + subjectid + sect)) {

                                content = content + ` <li class="nav-item mt-0 mr-3 def-level" id="li-selction-dif_` + sect + `_` + levelId + `" "  >
                            <a class="nav-link `+ active + ` question-selected select-lvel-ques" data-toggle="tab" href="#level_` + levelId + `_` + sect.toUpperCase() + `" role="tab" style="width:110%; margin-left:6px;" onClick="selectLevelGrp(this ,'` + sect + `',` + subjectid + `,` + `'Moderate'` + `,'` + questionType + `',` + courseId + `,` + sid + `)"  > ` + levelId + ` </a>
                            </li>`;
                                addedLevel.push(levelId + subjectid + sect);
                            }

                        } else if (levelNo >= 9 && levelNo <= 11) {
                            levelId = 'High';
                            if (!addedLevel.includes(`` + levelId + subjectid + sect)) {
                                content = content + ` <li class="nav-item mt-0 mr-3 def-level" id="li-selction-dif_` + sect + `_` + levelId + `" "  >
                            <a class="nav-link `+ active + ` question-selected select-lvel-ques" data-toggle="tab" href="#level_` + levelId + `_` + sect.toUpperCase() + `" role="tab" style="width:110%; margin-left:6px;" onClick="selectLevelGrp(this ,'` + sect + `',` + subjectid + `,` + `'High'` + `,'` + questionType + `',` + courseId + `,` + sid + `)"  > ` + levelId + ` </a>
                            </li>`;
                                addedLevel.push(levelId + subjectid + sect);
                            }

                        }



                    } else {
                        content = content + ` <li class="nav-item mt-0 mr-3 def-level"  id="li-selction-dif_` + sect + `_` + level + `"  >
                    <a class="nav-link `+ active + ` question-selected  select-lvel-ques" data-toggle="tab" href="#level_` + level + `_` + sect.toUpperCase() + `" role="tab"  style="width:110%; margin-left:6px;" onClick="selectLevel(this ,'` + sect + `',` + subjectid + `,` + level + `,'` + questionType + `',` + courseId + `,` + sid + `)"  >` + level + `</a>
                     </li>`;
                        levelId = level;
                    }
                    if (tabContentIds.includes(`level_` + levelId + `_` + sect.toUpperCase()) == false) {
                        tabContent = tabContent + `<div class="exam-tab tab-pane ` + active + ` " id="level_` + levelId + `_` + sect.toUpperCase() + `">  <h3 class="accordian-sublabels">Select questions Difficulty Level - ` + levelId + `</h3>
                 <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 pb-2 pl-0 pr-0 topic-selection-box  question-selection-box">
                <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 pl-0 pr-0">
                     <input type="text" id="Search" onkeyup="myFunction()" placeholder="Please enter a search term.." title="Type here" class="from-control hide">
                   
                </div>
                <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 pl-0 pr-0">
                    <div id="selectQuestion_` + levelId + `_` + sect.toUpperCase() + `" name="selectQuestion[` + levelId + `][` + subjectName + `][` + section + `]"
                        class="selectpicker topic-selection-select" multiple
                        data-live-search="true" data-placeholder="Select topic">
                      
                    
                    </div>
                </div>
            </div> </div>`;
                        tabContentIds.push(`level_` + levelId + `_` + sect.toUpperCase())
                    }
                    i++;
                }
                if ($("#is_auto").val() == 1) {
                    $('#lev_' + sect).html(content);
                } else {
                    $('#lev_' + sect).html(content);
                }
                $("#deficulti_tab_section_" + sect).append(tabContent);

                $(".selectpicker").selectpicker('refresh');

            },
            complete: function (data) {
                // $("body").removeClass("kun_loading");
            }
        });
    } else {

        $(".question-listed").html('');
        $(".nitin-list").html('');
        // $("body").removeClass("kun_loading");
    }


}

let changeLevelConcept = function (id, sect, subjectid, questionType, courseId, sid) {

    var topicIds = "" + $("#" + id.id).val();
    let section = sect.split('_')[0]

    let subjectName = sect.split('_')[1]

    let activeTab = $("#activeTab").val();
    addedLevel = [];
    quessIds = [];
    levelId = [];
    if (activeTab == 'finished') {
        $("#" + subjectName + "select_tot_ques_" + sid).html($("#" + subjectName + "_tol_quest_" + sid).html());
    }
    // $("body").addClass("kun_loading");
    if (topicIds) {
        $.ajax({
            url: SITE_URL + 'DyanamicTest/getDificultiesIdConcept',
            type: "POST",
            cache: false,
            data: { ids: topicIds },
            beforeSend: function () {
                // $("body").addClass("kun_loading");
            },
            success: function (data) {

                let obj = JSON.parse(data);
                let i = 0;
                let content = ``;
                let tabContent = ``;
                for (const level of obj) {
                    let active = (i == 0) ? '' : '';
                    //   if(QuesArr)
                    if ($("#is_auto").val() == 1) {
                        levelId = parseInt(level);
                        levelNo = parseInt(level);

                        if (levelNo >= 1 && levelNo <= 4) {
                            levelId = 'Low';
                           // console.log("addedLevel.includes(levelId + subjectid + sect)", addedLevel.includes(levelId + subjectid + sect))
                            if (addedLevel.includes(levelId + subjectid + sect) == false) {

                                content = content + ` <li class="nav-item mt-0 mr-3 def-level" id="li-selction-dif_` + sect + `_` + levelId + `" "  >
                            <a class="nav-link `+ active + ` question-selected select-lvel-ques" data-toggle="tab" href="#level_` + levelId + `_` + sect.toUpperCase() + `" role="tab" style="width:110%; margin-left:6px;" onClick="selectLevelGrp(this ,'` + sect + `',` + subjectid + `,` + `'Low'` + `,'` + questionType + `',` + courseId + `,` + sid + `)"  > ` + levelId + ` </a>
                            </li>`;
                                addedLevel.push(levelId + subjectid + sect);
                            }

                            //console.log("addedLevel", addedLevel)
                        }
                        else if (levelNo >= 5 && levelNo <= 9) {
                            levelId = 'Moderate';
                            if (!addedLevel.includes(levelId + subjectid + sect)) {

                                content = content + ` <li class="nav-item mt-0 mr-3 def-level" id="li-selction-dif_` + sect + `_` + levelId + `" "  >
                            <a class="nav-link `+ active + ` question-selected select-lvel-ques" data-toggle="tab" href="#level_` + levelId + `_` + sect.toUpperCase() + `" role="tab" style="width:110%; margin-left:6px;" onClick="selectLevelGrp(this ,'` + sect + `',` + subjectid + `,` + `'Moderate'` + `,'` + questionType + `',` + courseId + `,` + sid + `)"  > ` + levelId + ` </a>
                            </li>`;
                                addedLevel.push(levelId + subjectid + sect);
                            }

                        } else if (levelNo >= 9 && levelNo <= 11) {
                            levelId = 'High';
                            if (!addedLevel.includes(`` + levelId + subjectid + sect)) {
                                content = content + ` <li class="nav-item mt-0 mr-3 def-level" id="li-selction-dif_` + sect + `_` + levelId + `" "  >
                            <a class="nav-link `+ active + ` question-selected select-lvel-ques" data-toggle="tab" href="#level_` + levelId + `_` + sect.toUpperCase() + `" role="tab" style="width:110%; margin-left:6px;" onClick="selectLevelGrp(this ,'` + sect + `',` + subjectid + `,` + `'High'` + `,'` + questionType + `',` + courseId + `,` + sid + `)"  > ` + levelId + ` </a>
                            </li>`;
                                addedLevel.push(levelId + subjectid + sect);
                            }

                        }



                    } else {
                        content = content + ` <li class="nav-item mt-0 mr-3 def-level"  id="li-selction-dif_` + sect + `_` + level + `"  >
                    <a class="nav-link `+ active + ` question-selected select-lvel-ques" data-toggle="tab" href="#level_` + level + `_` + sect.toUpperCase() + `" role="tab"  style="width:110%; margin-left:6px;" onClick="selectLevel(this ,'` + sect + `',` + subjectid + `,` + level + `,'` + questionType + `',` + courseId + `,` + sid + `)"  >` + level + `</a>
                     </li>`;
                        levelId = level;
                    }
                    if (tabContentIds.includes(`level_` + levelId + `_` + sect.toUpperCase()) == false) {
                        tabContent = tabContent + `<div class="exam-tab tab-pane ` + active + ` " id="level_` + levelId + `_` + sect.toUpperCase() + `">  <h3 class="accordian-sublabels">Select questions Difficulty Level - ` + levelId + `</h3>
                 <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 pb-2 pl-0 pr-0 topic-selection-box  question-selection-box">
                <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 pl-0 pr-0">
                     <input type="text" id="Search" onkeyup="myFunction()" placeholder="Please enter a search term.." title="Type here" class="from-control hide">
                   
                </div>
                <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 pl-0 pr-0">
                    <div id="selectQuestion_` + levelId + `_` + sect.toUpperCase() + `" name="selectQuestion[` + levelId + `][` + subjectName + `][` + section + `]"
                        class="selectpicker topic-selection-select" multiple
                        data-live-search="true" data-placeholder="Select topic">
                      
                    
                    </div>
                </div>
            </div> </div>`;
                        tabContentIds.push(`level_` + levelId + `_` + sect.toUpperCase())
                    }
                    i++;
                }
                if ($("#is_auto").val() == 1) {
                    $('#lev_' + sect).html(content);
                } else {
                    $('#lev_' + sect).html(content);
                }
                $("#deficulti_tab_section_" + sect).append(tabContent);

                $(".selectpicker").selectpicker('refresh');

            },
            complete: function (data) {
                // $("body").removeClass("kun_loading");
            }
        });
    } else {

        $(".question-listed").html('');
        $(".nitin-list").html('');
        // $("body").removeClass("kun_loading");
    }

}


let changeLevelSubConcept = function (id, sect, subjectid, questionType, courseId, sid) {

    var topicIds = "" + $("#" + id.id).val();
    let section = sect.split('_')[0]

    let subjectName = sect.split('_')[1]

    let activeTab = $("#activeTab").val();
    addedLevel = [];
    quessIds = [];
    levelId = [];
    if (activeTab == 'finished') {
        $("#" + subjectName + "select_tot_ques_" + sid).html($("#" + subjectName + "_tol_quest_" + sid).html());
    }
    if (topicIds) {
        $.ajax({
            url: SITE_URL + 'DyanamicTest/getDificultiesIdSubConcept',
            type: "POST",
            cache: false,
            data: { ids: topicIds },
            beforeSend: function () {
                // $("body").addClass("kun_loading");
            },
            success: function (data) {

                let obj = JSON.parse(data);
                let i = 0;
                let content = ``;
                let tabContent = ``;
                for (const level of obj) {
                    let active = (i == 0) ? '' : '';
                    //   if(QuesArr)
                    if ($("#is_auto").val() == 1) {
                        levelId = parseInt(level);
                        levelNo = parseInt(level);

                        if (levelNo >= 1 && levelNo <= 4) {
                            levelId = 'Low';
                            //console.log("addedLevel.includes(levelId + subjectid + sect)", addedLevel.includes(levelId + subjectid + sect))
                            if (addedLevel.includes(levelId + subjectid + sect) == false) {

                                content = content + ` <li class="nav-item mt-0 mr-3 def-level" id="li-selction-dif_` + sect + `_` + levelId + `" "  >
                            <a class="nav-link `+ active + ` question-selected select-lvel-ques" data-toggle="tab" href="#level_` + levelId + `_` + sect.toUpperCase() + `" role="tab" style="width:110%; margin-left:6px;" onClick="selectLevelGrp(this ,'` + sect + `',` + subjectid + `,` + `'Low'` + `,'` + questionType + `',` + courseId + `,` + sid + `)"  > ` + levelId + ` </a>
                            </li>`;
                                addedLevel.push(levelId + subjectid + sect);
                            }

                           // console.log("addedLevel", addedLevel)
                        }
                        else if (levelNo >= 5 && levelNo <= 9) {
                            levelId = 'Moderate';
                            if (!addedLevel.includes(levelId + subjectid + sect)) {

                                content = content + ` <li class="nav-item mt-0 mr-3 def-level" id="li-selction-dif_` + sect + `_` + levelId + `" "  >
                            <a class="nav-link `+ active + ` question-selected select-lvel-ques" data-toggle="tab" href="#level_` + levelId + `_` + sect.toUpperCase() + `" role="tab" style="width:110%; margin-left:6px;" onClick="selectLevelGrp(this ,'` + sect + `',` + subjectid + `,` + `'Moderate'` + `,'` + questionType + `',` + courseId + `,` + sid + `)"  > ` + levelId + ` </a>
                            </li>`;
                                addedLevel.push(levelId + subjectid + sect);
                            }

                        } else if (levelNo >= 9 && levelNo <= 11) {
                            levelId = 'High';
                            if (!addedLevel.includes(`` + levelId + subjectid + sect)) {
                                content = content + ` <li class="nav-item mt-0 mr-3 def-level" id="li-selction-dif_` + sect + `_` + levelId + `" "  >
                            <a class="nav-link `+ active + ` question-selected select-lvel-ques" data-toggle="tab" href="#level_` + levelId + `_` + sect.toUpperCase() + `" role="tab" style="width:110%; margin-left:6px;" onClick="selectLevelGrp(this ,'` + sect + `',` + subjectid + `,` + `'High'` + `,'` + questionType + `',` + courseId + `,` + sid + `)"  > ` + levelId + ` </a>
                            </li>`;
                                addedLevel.push(levelId + subjectid + sect);
                            }

                        }


                    } else {
                        content = content + ` <li class="nav-item mt-0 mr-3 def-level"  id="li-selction-dif_` + sect + `_` + level + `"  >
                    <a class="nav-link `+ active + ` question-selected select-lvel-ques" data-toggle="tab" href="#level_` + level + `_` + sect.toUpperCase() + `" role="tab"  style="width:110%; margin-left:6px;" onClick="selectLevel(this ,'` + sect + `',` + subjectid + `,` + level + `,'` + questionType + `',` + courseId + `,` + sid + `)"  >` + level + `</a>
                     </li>`;
                        levelId = level;
                    }
                    if (tabContentIds.includes(`level_` + levelId + `_` + sect.toUpperCase()) == false) {
                        tabContent = tabContent + `<div class="exam-tab tab-pane ` + active + ` " id="level_` + levelId + `_` + sect.toUpperCase() + `">  <h3 class="accordian-sublabels">Select questions Difficulty Level - ` + levelId + `</h3>
                 <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 pb-2 pl-0 pr-0 topic-selection-box  question-selection-box">
                <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 pl-0 pr-0">
                     <input type="text" id="Search" onkeyup="myFunction()" placeholder="Please enter a search term.." title="Type here" class="from-control hide">
                   
                </div>
                <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 pl-0 pr-0">
                    <div id="selectQuestion_` + levelId + `_` + sect.toUpperCase() + `" name="selectQuestion[` + levelId + `][` + subjectName + `][` + section + `]"
                        class="selectpicker topic-selection-select" multiple
                        data-live-search="true" data-placeholder="Select topic">
                      
                    
                    </div>
                </div>
            </div> </div>`;
                        tabContentIds.push(`level_` + levelId + `_` + sect.toUpperCase())
                    }
                    i++;
                }
                if ($("#is_auto").val() == 1) {
                    $('#lev_' + sect).html(content);
                } else {
                    $('#lev_' + sect).html(content);
                }
                $("#deficulti_tab_section_" + sect).append(tabContent);

                $(".selectpicker").selectpicker('refresh');

            },
            complete: function (data) {
                // $("body").removeClass("kun_loading");
            }
        });
    }

}


let changeLevelSourceOfQues = function (id, sect, subjectid, questionType, courseId, sid) {
    addedLevel = [];
    quessIds = [];
    var topicIds = "" + $("#" + id.id).val();
    //    topicIds = topicIds.trim();
    let section = sect.split('_')[0]

    let subjectName = sect.split('_')[1]
   
    let tIds = $("#selectSection_" + sect).val();
    let activeTab = $("#activeTab").val();
    levelId = [];
    if (activeTab == 'finished') {
        $("#" + subjectName + "select_tot_ques_" + sid).html($("#" + subjectName + "_tol_quest_" + sid).html());
    }
    
    if (topicIds) {
        $.ajax({
            url: SITE_URL + 'DyanamicTest/getSourceOfQuestion',
            type: "POST",
            cache: false,
            data: { ids: topicIds,tIds: tIds  },
            beforeSend: function () {
                // $("body").addClass("kun_loading");
            },
            success: function (data) {

                let obj = JSON.parse(data);
                let i = 0;
                let content = ``;
                let tabContent = ``;
                for (const level of obj) {
                    let active = (i == 0) ? '' : '';
                    //   if(QuesArr)
                    if ($("#is_auto").val() == 1) {
                        levelId = parseInt(level);
                        levelNo = parseInt(level);

                        if (levelNo >= 1 && levelNo <= 4) {
                            levelId = 'Low';
                            //console.log("addedLevel.includes(levelId + subjectid + sect)", addedLevel.includes(levelId + subjectid + sect))
                            if (addedLevel.includes(levelId + subjectid + sect) == false) {

                                content = content + ` <li class="nav-item mt-0 mr-3 def-level" id="li-selction-dif_` + sect + `_` + levelId + `" "  >
                            <a class="nav-link `+ active + ` question-selected select-lvel-ques" data-toggle="tab" href="#level_` + levelId + `_` + sect.toUpperCase() + `" role="tab" style="width:110%; margin-left:6px;" onClick="selectLevelGrp(this ,'` + sect + `',` + subjectid + `,` + `'Low'` + `,'` + questionType + `',` + courseId + `,` + sid + `)"  > ` + levelId + ` </a>
                            </li>`;
                                addedLevel.push(levelId + subjectid + sect);
                            }

                            //console.log("addedLevel", addedLevel)
                        }
                        else if (levelNo >= 5 && levelNo <= 9) {
                            levelId = 'Moderate';
                            if (!addedLevel.includes(levelId + subjectid + sect)) {

                                content = content + ` <li class="nav-item mt-0 mr-3 def-level" id="li-selction-dif_` + sect + `_` + levelId + `" "  >
                            <a class="nav-link `+ active + ` question-selected select-lvel-ques" data-toggle="tab" href="#level_` + levelId + `_` + sect.toUpperCase() + `" role="tab" style="width:110%; margin-left:6px;" onClick="selectLevelGrp(this ,'` + sect + `',` + subjectid + `,` + `'Moderate'` + `,'` + questionType + `',` + courseId + `,` + sid + `)"  > ` + levelId + ` </a>
                            </li>`;
                                addedLevel.push(levelId + subjectid + sect);
                            }

                        } else if (levelNo >= 9 && levelNo <= 11) {
                            levelId = 'High';
                            if (!addedLevel.includes(`` + levelId + subjectid + sect)) {
                                content = content + ` <li class="nav-item mt-0 mr-3 def-level" id="li-selction-dif_` + sect + `_` + levelId + `" "  >
                            <a class="nav-link `+ active + ` question-selected select-lvel-ques" data-toggle="tab" href="#level_` + levelId + `_` + sect.toUpperCase() + `" role="tab" style="width:110%; margin-left:6px;" onClick="selectLevelGrp(this ,'` + sect + `',` + subjectid + `,` + `'High'` + `,'` + questionType + `',` + courseId + `,` + sid + `)"  > ` + levelId + ` </a>
                            </li>`;
                                addedLevel.push(levelId + subjectid + sect);
                            }

                        }



                    } else {
                        content = content + ` <li class="nav-item mt-0 mr-3 def-level"  id="li-selction-dif_` + sect + `_` + level + `"  >
                    <a class="nav-link `+ active + ` question-selected select-lvel-ques" data-toggle="tab" href="#level_` + level + `_` + sect.toUpperCase() + `" role="tab"  style="width:110%; margin-left:6px;" onClick="selectLevel(this ,'` + sect + `',` + subjectid + `,` + level + `,'` + questionType + `',` + courseId + `,` + sid + `)"  >` + level + `</a>
                     </li>`;
                        levelId = level;
                    }
                    if (tabContentIds.includes(`level_` + levelId + `_` + sect.toUpperCase()) == false) {
                        tabContent = tabContent + `<div class="exam-tab tab-pane ` + active + ` " id="level_` + levelId + `_` + sect.toUpperCase() + `">  <h3 class="accordian-sublabels">Select questions Difficulty Level - ` + levelId + `</h3>
                 <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 pb-2 pl-0 pr-0 topic-selection-box  question-selection-box">
                <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 pl-0 pr-0">
                     <input type="text" id="Search" onkeyup="myFunction()" placeholder="Please enter a search term.." title="Type here" class="from-control hide">
                   
                </div>
                <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 pl-0 pr-0">
                    <div id="selectQuestion_` + levelId + `_` + sect.toUpperCase() + `" name="selectQuestion[` + levelId + `][` + subjectName + `][` + section + `]"
                        class="selectpicker topic-selection-select" multiple
                        data-live-search="true" data-placeholder="Select topic">
                      
                    
                    </div>
                </div>
            </div> </div>`;
                        tabContentIds.push(`level_` + levelId + `_` + sect.toUpperCase())
                    }
                    i++;
                }

                if ($("#is_auto").val() == 1) {
                    $('#lev_' + sect).html(content);
                } else {
                    
                    $('#lev_' + sect).html(content);
                }
                $("#deficulti_tab_section_" + sect).append(tabContent);

                $(".selectpicker").selectpicker('refresh');

            },
            complete: function (data) {
                // $("body").removeClass("kun_loading");
            }
        });
    } else {

        $(".question-listed").html('');
        $(".nitin-list").html('');
    }

}

let promise = Promise.resolve();
function typeset(code) {
    promise = promise.then(() => MathJax.typesetPromise(code()))
        .catch((err) => console.log('Typeset failed: ' + err.message));
    return promise;
}



function myFunction() {
    var input = document.getElementById("Search");
    var filter = input.value.toLowerCase();
    var nodes = document.getElementsByClassName('questionbox-width');

    for (i = 0; i < nodes.length; i++) {
        if (nodes[i].innerText.toLowerCase().includes(filter)) {
            nodes[i].parentNode.style.display = "block";
        } else {
            nodes[i].parentNode.style.display = "none";
        }
    }
}


function selectQuestion(e, subjectName, sid) {
    //console.log(e, subjectName, sid)
    // $('.exceed').remove();
    let no_of_ques = parseInt($("#" + subjectName + "_tol_quest_" + sid).html());
    let select_no_of_ques = parseInt($("#" + subjectName + "select_tot_ques_" + sid).html());
    if ($(e).prop('checked') == true) {
        //console.log(no_of_ques, "selec11: " + select_no_of_ques);
        if (no_of_ques > select_no_of_ques) {
            if(!quessIds.includes(e.value)){
                quessIds.push(e.value)
                
               
            }
            if(!QuesArr.includes(e.value)){
                QuesArr.push(e.value) 
            }
            let keys = subjectName+'_'+sid;
            //console.log("=======keys",keys)
            if (secQuesId.hasOwnProperty(keys)){
             if(!secQuesId[keys].includes(e.value)){
                secQuesId[keys].push(e.value)
             }
            }else{
                secQuesId[keys]=[e.value]
            }
            $("#usr_select_ids").val(JSON.stringify(secQuesId))
           //console.log(secQuesId,"========================secQuesId")
        
           quessIds = quessIds.filter(ele=> ele != e.value)
            $("#section_select_ques").val(quessIds);
            select_no_of_ques = select_no_of_ques + 1;
            $("#" + subjectName + "select_tot_ques_" + sid).html(select_no_of_ques);
            $(e).after(`<span class="select-cnt exceed" >` + select_no_of_ques + `</span>`);
           
            //console.log("selectQuestion::: Ques", quessIds);

        } else {
            $(e).after(`<span class="exceed" >Limit exceed</span>`);
            $(e).prop('checked', false);
            return false;
        }
        
        // if($("#total_no_ques").val() == quessIds.length ){

        //     $("#create-ques").removeAttr('disabled');
        // }else{
        
        //     $("#create-ques").attr('disabled','disabled');
        // }
    } else {
        //console.log("UNCHECK QUESTION====")
        $("#"+e.id).next("span").remove()
        let keys = subjectName+'_'+sid;
       //console.log("keys=====",keys)
        secQuesId[keys] = secQuesId[keys] .filter(ele=> ele != e.value)
       // console.log("After Unselect  ",secQuesId)
        QuesArr = QuesArr.filter(ele=> ele != e.value)
        quessIds = quessIds.filter(ele=> ele != e.value)
        $("#usr_select_ids").val(JSON.stringify(secQuesId))
       // console.log("After Remove;;;;;;;",quessIds)
        $("#section_select_ques").val(quessIds);
       // console.log("Else::::" + "#" + subjectName + "select_tot_ques_" + sid + "noo" + select_no_of_ques);
        if (select_no_of_ques > 0) {
            select_no_of_ques = parseInt(select_no_of_ques);
            select_no_of_ques = select_no_of_ques - 1;
            $("#" + subjectName + "select_tot_ques_" + sid).html(select_no_of_ques);
           

        }
        
        // if($("#total_no_ques").val() == quessIds.length ){
        //     $("#create-ques").removeAttr('disabled');
        // }else{
        
        //     $("#create-ques").attr('disabled','disabled');
        // }
    }
}

function selectQuestionGrp(e, subjectName, sid) {

    $('.exceed').remove();
    let no_of_ques = parseInt($("#" + subjectName + "_tol_quest_" + sid).html());
    let select_no_of_ques = parseInt($("#" + subjectName + "select_tot_ques_" + sid).html());
    if ($(e).prop('checked') == true) {
        if (no_of_ques > select_no_of_ques) {
            if(!quessIds.includes(e.value)){
                quessIds.push(e.value)
            }
            if(!dubId.includes(e.value)){
               
                dubId.push(e.value);
                let keys = subjectName+'_'+sid;
                //console.log("=======keys",keys)
                // if (secQuesId.hasOwnProperty(keys)){
                // if(!secQuesId[keys].includes(e.value)){
                //     secQuesId[keys].push(e.value)
                // }
                // }else{
                //     secQuesId[keys]=[e.value]
                // }
                //console.log("secQuesId======",secQuesId)
                //$("#usr_select_ids").val(JSON.stringify(secQuesId))
                $("#section_select_ques").val(quessIds);
                //console.log("selectQuestionGrp Ques", quessIds);
                select_no_of_ques = select_no_of_ques + 1;
                $("#" + subjectName + "select_tot_ques_" + sid).html(select_no_of_ques);
                $(e).after(`<span class="select-cnt exceed" >` + select_no_of_ques + `</span>`);
            }

        } else {
            $(e).after(`<span class="exceed" >Limit exceed</span>`);
            $(e).prop('checked', false);
            return false;
        }
        // if($("#total_no_ques").val() == quessIds.length ){
        //     $("#create-ques").removeAttr('disabled');
        // }else{
        
        //     $("#create-ques").attr('disabled','disabled');
        // }
    } else {
        let keys = subjectName+'_'+sid;
        //console.log("=======keys",keys)
        if (secQuesId.hasOwnProperty(keys)){
            if(!secQuesId[keys].includes(e.value)){
            secQuesId[keys].push(e.value)
            }
        }else{
            secQuesId[keys]=[e.value]
        }
        secQuesId[keys] =secQuesId[keys].filter((ele)=> {
           // console.log("ele======",ele)
            return ele != e.value
        })
        //console.log("uncheck valu",e.value)
       // console.log("secQuesId====After Remove;;;;;;;====== ",secQuesId)
        $("#usr_select_ids").val(JSON.stringify(secQuesId))
        quessIds = quessIds.filter(ele=> ele != e.value)
       // console.log("After Remove;;;;;;;",quessIds)
        $("#section_select_ques").val(quessIds);
        //console.log("Else::::" + "#" + subjectName + "select_tot_ques_" + sid + "noo" + select_no_of_ques);
        if (select_no_of_ques > 0) {
            select_no_of_ques = parseInt(select_no_of_ques);
            select_no_of_ques = select_no_of_ques - 1;
            $("#" + subjectName + "select_tot_ques_" + sid).html(select_no_of_ques);
           

        }

    }
}

var subjectCount= {};
function subjectData(ele){
    //Chemistry_tol_quest_3  //Chemistry_tol_quest_1
    // let subjectListArr = $("#subject_list").val();
    // console.log("subjectListArr",subjectListArr)
    //console.log("ele.id=====",ele.id)
    $("body").addClass("kun_loading");
    let noOfSec=  $("#no_of_section").val();
    let subjectArr = $("#subjectidsss").val().split(',');
    
    let subjectId =  ele.id.split('_')[4] ?? ''
    let subject =  ele.id.split('_')[3] ?? ''
    let indexOf = subjectArr.indexOf(subjectId);
    let subjectList = $("#subjectlist").val().split(',');
    let subjectIDList = $("#subjectidsss").val().split(',');
    let nextSubject = '';
    let nextSubjectId = ''
    let nextActiveTab = '';
    let sectionwise_total_question = $("#sectionwise_total_question").val();
    let total_no_ques = $("#total_no_ques").val();
    if($("#total_no_ques").val() == quessIds.length){
        $("#is_save_status").val('finished');
    }else{
        $("#is_save_status").val('in-progress');
    }
    
    if(indexOf != subjectList.length){
        nextSubject =  subjectList[indexOf+1];
        nextSubjectId =  subjectIDList[indexOf+1];
        nextActiveTab = "#subject_tab_"+nextSubject+"_"+nextSubjectId;
    }
    
    //console.log(ele.id,"noOfSec==",noOfSec,"subject==",subject,"subjectArr===",subjectArr,"subjectId==",subjectId,"indexOf==",indexOf,"nextSubject==",nextSubject);
    let noOfQue = 0;
    let select_no_of_ques = 0 ;
    // 
    let inti = 1;
    let len = noOfSec;
    if(indexOf != 0){
        inti = indexOf * noOfSec + 1;
        len = parseInt(noOfSec) + parseInt(inti) -1 ;
    }
  //console.log("inti======",inti,"Len=====",len)
    for(let  i =inti; i <= len; i++){
        let ids = subject+'_'+'tol_quest_'+i;
       // console.log("ids=========",ids)
        
        // let count = Object.values(subjectCount);
        // let cnt =  count.reduce((acc,curr)=> acc+curr)
        // console.log("subjectCount val==",cnt)
        noOfQue =noOfQue+ parseInt($("#"+ids).text());
        select_no_of_ques = select_no_of_ques+ parseInt($("#" + subject + "select_tot_ques_" + i).html());
      

    }
    noOfQue = (isNaN(noOfQue)) ? 0 : noOfQue;
    select_no_of_ques = (isNaN(select_no_of_ques)) ? 0 : select_no_of_ques;
    //console.log("noOfQue===",noOfQue,"select_no_of_ques==",select_no_of_ques)
    //console.log("subjectCount==",subjectCount)
    if( (noOfQue ==0 && select_no_of_ques==0)  || noOfQue != select_no_of_ques ){
        setTimeout(()=>{
            $("body").removeClass("kun_loading");
            Swal.fire({
                title: "Warning..!",
                text: "Please select remaining "+(noOfQue -  select_no_of_ques)+" number of question for subject "+ subject,
                allowOutsideClick: true,
                confirmButtonClass: "btn btn-danger",
                buttonsStyling: false
            });
        },2000)
        return false;
    }
    
    var fromData = $("#ques-selc").serializeArray();
    let is_save_status = $("#is_save_status").val()
    let save_ques_length = $("#save_ques_id").val().split(',').length;
    is_save_status = (total_no_ques == (save_ques_length +select_no_of_ques )) ? 'finished' : 'In-progress'
    //console.log("is_save_status===",is_save_status)
    fromData.push({ name: "is_save_status", value: is_save_status });
    $.ajax({
        url: SITE_URL + 'DyanamicTest/saveSubjectWiseData',
        type: "POST",
        cache: false,
        data: fromData,
        beforeSend: function () {
              $("body").addClass("kun_loading");
        },
        success: function (data) {
           
            data = JSON.parse(data);
            //console.log("Success Data",data);
            if(data.status == 'success'){
                setTimeout(()=>{
                    if(nextActiveTab != ""){
                        $(nextActiveTab).removeClass('disabled');
                    }
                    $("body").removeClass("kun_loading");
                    Swal.fire({
                        title: "Success..!",
                        text: "Question successfully added.",
                        allowOutsideClick: true,
                        confirmButtonClass: "btn btn-primary",
                        buttonsStyling: false
                    }).then(function(){ 
                    location.reload();
                    });
                    
                },2000)

                
              
               
            }else{
                setTimeout(()=>{
                    $("body").removeClass("kun_loading");
                    Swal.fire({
                        title: "Failed..!",
                        text: "Question insertion failed",
                        allowOutsideClick: true,
                        confirmButtonClass: "btn btn-danger",
                        buttonsStyling: false
                    });
                },2000)
                
            }
        }

    })
}


function loadTabData(ele){
   
}


function getSectionData(ele){
    let lvlId ="";
   
    // let selectSid =  ele.id.split('_')[4] || 0;
   let subject =  ele.id.split('_')[3] || '';
    // sect_tab_A_Maths_5
    let subjectId = parseInt($("#subjectlist").val().split(',').indexOf(subject));
    let sid =  $("#subjectidsss").val().split(',');
    let subArr = []
    let save_subject =  $("#save_subject").val();
    let save_subjectArr = (save_subject !='') ? save_subject.split(',') : [];
   // console.log("save_subjectArr====",save_subjectArr)
    if(save_subjectArr.length == 0){
           // console.log("===",sid,subjectId )
           // console.log(sid[subjectId])
         save_subjectArr.push(sid[subjectId]);
        $("#save_subject").val(save_subjectArr.join(','));
    }else{
        //console.log("===",sid,subjectId )
        
        if(!save_subject.includes(sid[subjectId])){
            save_subjectArr.push(sid[subjectId]);
        }
       
        $("#save_subject").val(save_subjectArr.join(','));
    }
   // console.log("new save_subject======",save_subjectArr.join(','))
    // Un use code
    // save_subject = (save_subject) ? save_subject.split(',') : [];
    // let isSave =  $("#is_save").val();
    // console.log("=============================","save_subject===",save_subject,"isSave====",isSave)
    // console.log("level_1_"+ele.id.replace("sect_tab_",'').trim().replace(/[\[\]']+/g, ''))
    // if(isSave==1 && save_subject.length !=0){
    //     if(save_subject.includes(selectSid))
    //     for (let index = 0; index <= 11; index++) {
    //             setTimeout(()=>{
    //                 lvlId = "level_"+index+"_"+ele.id.replace("sect_tab_",'').trim().replace(/[\[\]']+/g, '').toUpperCase();
    //                 //$("a#" + lvlId).trigger('click');
    //             },2000)

               
    //     }
    // }
   
    // $("a#level_2_A_PHYSICS_1").trigger('click')
    
    //level_2_A_PHYSICS_1
}

// $("body").addClass("kun_loading");

setTimeout(()=>{
    $("body").addClass("kun_loading");

},0)

function webLoad(){
    let isSave = $("#is_save").val();
    let interval =(isSave==1) ? 6000 : 5000;
    setTimeout(()=>{
        $("body").removeClass("kun_loading");

    },interval)
}
webLoad()
 function load_examData(){
  
    let res =  selectLevelLoadata();
  
   
   
}



  function selectLevelLoadata(){

        console.time("FETCH TIME::")
      
            
            let isSave =  $("#is_save").val();
            let subjectList = $("#subjectlist").val().split(',');
            let noOfSec=  $("#no_of_section").val();
            let subIds =  $("#subjectidsss").val().split(',');
            let saveSubject =  $("#save_subject").val().split(',');
            let sectionNameList =  $("#section_name").val().split(',').flat();
            let secArr= sectionNameList.map((ele,i)=>{
                return ele.replace(/[\[\]']+/g, '');
            })
            // console.log("subjectList======",saveSubject)
            //Chemistry_tol_quest_3
            // parseInt($("#" + subjectName + "select_tot_ques_" + sid).html());
            
            let k =0 ;
            let secNo =1;
            for(let subject  of subjectList){
                let s1 = subIds[k];
                if(saveSubject.includes(s1)){
                    for(let s=0 ; s < noOfSec ; s++){
                        let ids= "#" + subject + "select_tot_ques_" + secNo;
                        let totalId =  "#"+subject+  "_tol_quest_"+ secNo;
                        $(ids).html($(totalId).html().trim());
                        // console.log("=============ids===",ids)
                        secNo++;
                        
                    
                    }
                }
                k ++;
               // console.log("Finished")
            }

         

       // console.timeEnd("FETCH TIME::")
   
}


setTimeout(()=>{
   // console.log("======::::Load Data Start::::======")
    load_examData();
    

}, 5000)


setTimeout(()=>{
    
    $(".is-disabled").attr('disabled','disabled');
   // console.log("okkkk")
    let save_ques_id = $("#save_ques_id").val().split(',');
    if($("#total_no_ques").val() == save_ques_id.length ){

        $("#create-ques").removeAttr('disabled');
        $("#create-ques").removeClass('bg-light');
        $("#create-ques").addClass('btn-success');
        
    }else{
    
        $("#create-ques").attr('disabled','disabled');
        $("#create-ques").addClass('bg-light');
        $("#create-ques").removeClass('btn-success');
    }
    // alert("Please proceed")
    $("body").removeClass("kun_loading");
},5000)


function checkDuplicate(ele){
    let noOfSec =  $("#no_of_section").val();
    let sectionNo =  ele.id.split('_')[2]
    let elsId = ele.id.split("_")
    let idName = "section_"+elsId[1]
    $(".danger").remove();
    
    $("#"+ele.id).on("keydown", function (e) {
    return e.which !== 32;
    });
   
    if(  sectionNo < noOfSec && sectionNo ==1 ){
        if(sectionNo == 1){
            let currVal = ele.value
            id =  idName+'_'+ (parseInt(sectionNo) + 1)
            let val =  $("#"+id).val()
            if(currVal == val){
                
                $("#"+ele.id).val('')
                $("#"+ele.id).after('<span  class="danger">Section name duplicate,Please provide unique name </span>')
            }

           
        }else{
            let currVal = ele.value
            id =  idName+'_'+ (parseInt(sectionNo) -1 )
            let val =  $("#"+id).val()
            if(currVal == val){
                
                $("#"+ele.id).val('')
                $("#"+ele.id).after('<span  class="danger">Section name duplicate,Please provide unique name </span>')
            }
        }

    }else{
        if(sectionNo > 1){
            let currVal = ele.value
            id =  idName+'_'+ (parseInt(sectionNo) -1 )
            let val =  $("#"+id).val()
            if(currVal == val){
                
                $("#"+ele.id).val('')
                $("#"+ele.id).after('<span  class="danger">Section name duplicate,Please provide unique name </span>')
            }

        }

    }


}
