    var validateForm = function(){
            var formTit = $('#title').val();
            if(formTit == null || formTit == "") {
                window.alert("Title is a must!");
            }
              else{
                $('.editor').submit();

           } 
        };
    var compileCode = function(){
        $.ajax({
            url:'/compile',
            data : {
                format : 'json'
            },
            error:function(){
              
            },
            success:function(dat){
                alert( JSON.parse(dat) );
            },
            data : {"code": $('#code').val(),"Cid": cId },
            type: 'POST'
        });

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
                alert( JSON.parse(dat) );
            },
            data : {"code": $('#code').val(),"Cid": cId },
            type: 'POST'
        });

    }

    var app = {
      CMInit : function(){
          var editors = document.getElementsByClassName("code");
          for(i=0;i<editors.length;i++){
           var editor = CodeMirror.fromTextArea(editors[i], {
            lineNumbers: true,
            mode:  'clike',
            lineWrapping: true,
            theme: 'pastel-on-dark',
            lineNumbers: true,
            viewportMargin: Infinity,
            showCursorWhenSelecting: true
          });
         }
       }
    };
    var SnipModel; 
    var cId;

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
            url:'/codes',
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
                SnipModel =  data.code;
                cId = data.CID;

                if(SnipModel.length){
                for(var i=0;i<SnipModel.length;i++){
                  var compTemplate = _.template($('#title-template').html());
                  var renTemp = compTemplate({ id : i , snip : SnipModel[i] });
                  var elem = $(renTemp);
                  $('#codes-list').append(elem);
                };
                $('#codes-list').on('click','span',function(){
                    $('#codes-list').find('span').removeClass('selected');
                    
                    var elem = $(this);
                    
                    elem.addClass('selected');
                    
                    cId = elem.attr('id');
                    var Codetemplate = _.template($('#code-template').html());
                    Codetemplate = Codetemplate(SnipModel[cId]);
                    $('#title').val($('#'+cId).text())
                    $('.codearea').empty().append(Codetemplate);
                    app.CMInit();
                });
               
                if(cId){
                  $('#'+cId ).click();
                }
                else
                  $('#0').click();
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