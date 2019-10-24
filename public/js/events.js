var l = console.log;
$.initSession = () => {
  $(() => {
    $(window).trigger("sessionLoaded",["Hello sir"])
  })
}
$(() => {
  $.fn.arr = function(){
    return Array.from(this)
  }
  $.fn.ArrjQ = function(){
    return Array.from(this).map(e=>$(e))
  }
  $('.form input').on("keydown",function(e) {
    let form = $(this).parents(".form").first()
    if(e.which==13){
      form.trigger('submit')
    }
  })
  $('.form [type=submit]').on('click',function(e){
    // l($(this).parents('.form'))
    form = $(this).parents('.form').first()
    if (typeof form.attr("indirect-submit") != "undefined" && form.attr("indirect-submit") == 'true') form.trigger("confirm");
    else form.trigger("submit")
  })
  $('.form').on('submit',function(e){
    // let form = $(this).parents('.form').first();
    let form = $(this);
    let data;
    if(form.attr("method").toUpperCase() == 'POST'){
      if (typeof form.attr('multipart') != 'undefined' && form.attr('multipart').toLowerCase()=="true") {
        data = new FormData();
        // console.log("Yes this is formdata type")
        for(let elem of form.find('input')){
          elem = $(elem)
          if (typeof elem.attr("ignore-value") == "undefined" &&  elem.parents("[ignore-valu-container]").length==0) {
              if(elem.attr('type') == 'file'){
                // console.log('yes this type file')
                data.append($(elem).attr("name"),new Blob([elem.files[0]],{type:'image/jpeg'}))
              } else {
                data.append($(elem).attr("name"),$(elem).val())
              }
          }
        }
      } else {
        data = {}
        for(let elem of form.find('input[name],select[name]')){
          elem = $(elem);
          if((typeof elem.attr("ignore-value") == "undefined" && elem.parents('[ignore-value-container]').length == 0)||(typeof elem.attr("read-value") != "undefined" || elem.parents("[read-value-container]").length != 0)) {
            data[elem.attr('name')] = elem.val();
          }
        }
      }
    }
    // l(data)
    let request = {
      url:form.attr("action"),
      method:(typeof form.attr('method')=='undefined')?'GET':form.attr('method').toUpperCase(),
      data,
      success:function(response){
        form.trigger('success',[response])
        // l(form)
        // l('yoy')
      },
      error:function(error){
        // l('error occured: '+error),
        form.trigger('error',[error.responseText])
      }
    }
    if(typeof form.attr('multipart') != 'undefined' && form.attr("multipart").toLowerCase() == 'true'){
      request.contentType = false;
      request.cache = false;
      request.processData = false
    }
    $.ajax(request)
  })
  $('.form').on('success',function(event,response){
    let form = $(this);

    eval(`(function(response){${form.attr('on-success')}})`).call(form,response);
    if(form.attr("on-success-redirect") != undefined){
      window.location.href = form.attr("on-success-redirect")
    }
    if(form.attr('on-success-reload')=='true'){
      window.location.reload(true)
    }
    if(form.attr("on-error-prompt-selector") != undefined){
      form.find(form.attr("on-error-prompt-selector")).html("")
    }
  })
  $('.form').on('error',function(event,response){
    let form = $(this)
    eval(`(function(response){${form.attr('on-error')}})`).call(form,response);
    if(form.attr("on-error-prompt-selector") != undefined){
      form.find(form.attr("on-error-prompt-selector")).html(response)
    }
    l(response)
  })
})
