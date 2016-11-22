
    var compileCode = function(){
        $.ajax({
            url:'/compile',
            data : {
                format : 'json'
            },
            error:function(){
              
            },
            success:function(dat){
                // alert(dat);
                if(JSON.parse(dat)["compile_status"] =="OK"){
                  alert("Compilation Successful!");
                }
                else{
                  alert(JSON.parse(dat)["compile_status"]);
                } 
                // alert( JSON.parse(dat) );// More functionality here
            },
            data : {"code": Editor.getValue(),"Cid": cId },
            type: 'POST'
        });

    };
    var saveCode = function(){
        var formTit = $('#title').val();
        if(formTit == null || formTit == "") {
          window.alert("Roll number  is a must!");
        }
        else{

        $.ajax({
            url:'/codes',
            data : {
                format : 'json'
            },
            error:function(){
              
            },
            success:function(dat){
                console.log(dat);
            },
            data : {"code": Editor.getValue(),"Cid": cId ,"user_id":$('#title').val()},
            type: 'POST'
        });
      }
    };
    var runCode = function(){
        $.ajax({
            url:'/run',
            data : {
                format : 'json'
            },
            error:function(){
              
            },
            success:function(dat){
                if(dat==true){
                  alert("Submission for Problem "+(Number(cId)+1)+" accepted!");
                }
                else{
                  alert("Wrong answer!");
                } 
            },
            data : {"code": Editor.getValue(),"Cid": cId },
            type: 'POST'
        });

    }
    var Editor;

    var app = {
      CMInit : function(){
          var dit = document.getElementById("code");
          Editor = CodeMirror.fromTextArea(dit, {
            lineNumbers: true,
            mode:  'clike',
            lineWrapping: true,
            theme: 'pastel-on-dark',
            lineNumbers: true,
            viewportMargin: Infinity,
            showCursorWhenSelecting: true
          });
       }
    };
    var ProblemModel; 
    var codeModel = [];

    var cId = 0;
    var $loading = $('#spinner').hide();
    $(document)
    .ajaxStart(function(){
      $loading.show();
      $('.overlay').show();
    })
    .ajaxStop(function(){
      $loading.hide();
      $('.overlay').hide();
    });
    

    $(function(){
           
           $.ajax({
            url:'/problems',
            data : {
                format : 'json'
            },
            error:function(){
                var Codetemplate = _.template($('#code-template').html());
                    Codetemplate = Codetemplate({code :"//Write Code Here..."});
                    $('.codearea').empty().append(Codetemplate);
                app.CMInit();
            },
            success:function(data){
                
                ProblemModel =  data;
                
                app.CMInit();
                cId = 0 ;

                if(ProblemModel.length){
                
                for(var i=0;i<ProblemModel.length;i++){
                  
                  var compTemplate = _.template($('#title-template').html());
                  
                  var renTemp = compTemplate({ id : i , problem : ProblemModel[i] });
                  
                  var elem = $(renTemp);

                  var headCTemplate = _.template($('#heading-template').html());

                  var renHeadTemplate = headCTemplate({problem : ProblemModel[i]}); 

                  var descTemplate = _.template($('#description-template').html());
                  
                  descTemplate = descTemplate({problem: ProblemModel[i]});

                  $('#description').empty().append(descTemplate);
                  
                  $('#heading').empty().append($(renHeadTemplate));

                  $('#problem-list').append(elem);

                };

                // -----------WORK ON THIS!!!-----------------------
                
                $('#problem-list').on('click','span',function(){

                    // Handling code

        //            if(Editor)
                    codeModel[cId] = Editor.getValue();

                    $('#problem-list').find('span').removeClass('selected');
                    
                    var elem = $(this);
                    
                    elem.addClass('selected');
                    
                    cId = elem.attr('id');

                    var headTemplate = _.template($('#heading-template').html());
                    headTemplate = headTemplate({problem : ProblemModel[cId]});

                      var descTemplate = _.template($('#description-template').html());
                    descTemplate = descTemplate({problem: ProblemModel[cId]});


                    $('#description').empty().append(descTemplate);
                    $('#heading').empty().append($(headTemplate));
                    
                    //var Codetemplate = _.template($('#code-template').html());
                    if(codeModel[cId])
                        Editor.getDoc().setValue(codeModel[cId]);
                    else
                        Editor.getDoc().setValue("//Write Code Here...");
                    
                    //$('.codearea').empty().append(Codetemplate);
                    //app.CMInit();
                });

                // Initialisation
               $('#0').click();
                   //app.CMInit();
              }
              else{
                // Write this.
                var Codetemplate = _.template($('#code-template').html());
                Codetemplate = Codetemplate({code :"//Write Code Here..."});
                $('.codearea').empty().append(Codetemplate);
                app.CMInit();
              }
            },
            type: 'GET'
           });
    });