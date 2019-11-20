var l = console.log;

let observer = new MutationObserver((mutationList) => {
  for(let mutation of mutationList){
    if(mutation.type == "attributes") {
      l(mutation)
    }
  }
})
$.initSession = () => {
  $(() => {
    // $(window).trigger("sessionLoaded",["Hello sir"])
    $.ajax ({
      url:"/api/session/get",
      type:"GET",
      success:function(data){
        $(window).trigger("sessionLoaded",[null,data]);
        for(let key in data){
          let elems = $(`session-data[prop=${key}]`)
          elems.html(data[key]);
          elems.css('display','inline')
        }
        $('session-onload').css('display','inline')
      }, error:function(err) {
        $(window).trigger("sessionLoaded",[new Error("Session failed to load")])
        $(window).trigger("sessionError")
      }
    })
  })
}
$(window).on('sessionError',() => {
  $('session-error').dissolve()
  l('error in session')
})
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
      // form.trigger('submit')
      let condition = (typeof form.attr("custom-validation") != "undefined" && form.attr("custom-validation") == 'true');
      if (condition) form.trigger("confirm");
      else form.trigger("submit")
    }
  })
  $('.form [type=submit]').on('click',function(e){
    // l($(this).parents('.form'))
    // l('Submit button has been clicked')
    form = $(this).parents('.form').first();
    let condition = (typeof form.attr("custom-validation") != "undefined" && form.attr("custom-validation") == 'true');
    if (condition) form.trigger("confirm");
    else form.trigger("submit")
  })
  $('.form').on('submit',function(e){
    // let form = $(this).parents('.form').first();
    let form = $(this);
    let IS_VALID = true;
    for (let k of form.find('[required]')) {
      let validationElement = $((typeof form.attr("validation-element") == 'undefined') ?  '<span class="red-prompt">': form.attr('required-element'));
      k = $(k)
      let valid = true;
      if (k.val() == null) valid = false;
      else if (k.val().trim() == '') valid = false;
      IS_VALID = valid;
      l(IS_VALID)
      l(valid)
      if (!valid) {
        validationElement.html("This field is required")
        if (k.next().attr('class') != validationElement.attr('class')) validationElement.insertAfter(k)
        break
      } else if (k.next().attr('class') == validationElement.attr('class')) k.next().remove()
    }
      for (let k of form.find('[type=email]')) {
        let validationElement = $((typeof form.attr("required-element") == 'undefined') ?  '<span class="red-prompt">': form.attr('required-element'));
        k = $(k);
        let valid = true;
        let emailValidationExpression = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if (k.val() == null) valid = false;
        else if(!emailValidationExpression.test(k.val())) valid = false;
        l('email is '+emailValidationExpression.test(k.val()))
        IS_VALID = IS_VALID ? valid: false;
        if(!valid){
          validationElement.html("Invalid email provided");
          if(k.next().attr('class') == validationElement.attr('class')) k.next().html('Invalid email provided')
          else validationElement.insertAfter(k)
          break;
        } else if(k.next().attr('class') == validationElement.attr('class')) k.next().remove();
      }
      for (let k of form.find("input[type=text][min-length],input[type=password][min-length]")) {
        k = $(k);
        // l("min-length handler called")
        let validationElement = $((typeof form.attr("required-element") == 'undefined') ?  '<span class="red-prompt">': form.attr('required-element'));
        let length = (isNaN(k.attr("min-length"))) ? 0 : Number(k.attr("min-length"));
        let valid = true
        if(k.val() == null) valid=false;
        else if(k.val().length < length) valid=false;
        IS_VALID = IS_VALID ? valid: IS_VALID;
        if(!valid){
          validationElement.html("Minimum field length is: "+length);
          if(k.next().attr('class') == validationElement.attr('class')) k.next().html("Minimum field length is: "+length)
          else validationElement.insertAfter(k)
          break;
        } else if(k.next().attr('class') == validationElement.attr('class')) k.next().remove()
      }
    if (IS_VALID) {
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
      if(form.attr('output-body') != null) console.log(request.data)
    }

  })
  $('.form').on('success',function(event,response){
    let form = $(this);
    l('why is this a success')
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




$.fn.toArr = function(){
  return Array.from(this)
}
$.fn.tojQArr = function(){
  return this.toArr().map(e=>$(e))
}
$.fn.dissolve = function(){
  let elem = $(this);
  let parent = elem.parent();
  let sibling = elem.prev();
  elem.detach();
  for(let child of elem.children()) {
    if(sibling[0] == undefined) parent.prepend(child)
    else sibling.after(child)
  }
  elem.remove()
}
Date.prototype.resolveDate = function(){
  let date = this.getDate();
  let lastDigit = date%10;
  let concatString = ""
  switch (lastDigit) {
    case 1:
      concatString = "st"
      break;
    case 2:
      concatString = "nd"
      break;
    case 3:
      concatString = "rd"
      break;
    default:
      concatString = "th"
      break
  }
  return date+concatString
}
Date.prototype.getSemiSimpleTime = function() {
  return `${this.getSimpleTime()}  ${this.getHours()}:${this.getMinutes()}:${this.getSeconds()}`  
}
Date.prototype.getSimpleTime = function(){
  let days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  let months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  let day = days[this.getDay()];
  let month = months[this.getMonth()];
  return `${day}, ${month} ${this.resolveDate()}, ${this.getFullYear()}`
}
