var l = console.log;
let observer = new MutationObserver((mutationList) => {
  for(let mutation of mutationList){
    if(mutation.type == "attributes") {
      l(mutation)
    }
  }
})

$.splitUrl = function(){
  return window.location.href.split("/")
}
$.randGen = function(len=5){
  let alphabets = "abcdefghijklmnopqrstuvwxyz";
  let allowed = alphabets+alphabets.toUpperCase()+"0123456789";
  let final = ""
  for(let i=0;i<len;i++) final+= allowed[Math.floor(Math.random()*allowed.length)];
  return final
}
$.getQuery = function(){
  let obj = {};
  let queryString = window.location.href.split("?")[1]
  for(let declaration of queryString.split('&')){
    let [key,value] = declaration.split('=');
    obj[key] = value
  }
  return obj
}
$.isQuery = function(){
  return window.location.href.split("?").length == 2
}
$.getResourceID = function(){
  let idValue = window.splitUrl().lastElem();
  let requiredSymbols = ['?','#'];
  let extractedValue = "";
  for(let i=0;i<idValue.length;i++){
    let current = idValue[i];
    if(current == '?' || current == '#') {
      extractedValue = idValue.substring(0,i);
      break
    }
  }
  extractedValue = (extractedValue == "") ? idValue : extractedValue
  return extractedValue
}
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
          elems.css('display','inline');
          sessionStorage.setItem(key,data[key])
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
  l('error in session');
  sessionStorage.clear()
})
window.activateTab = function(tabId,tabContainerId){
  let tabContainer = $(`[tab-container-id=${tabContainerId}]`);
  tabContainer.find(`.tab-panel.activeTab`).removeClass('activeTab');
  tabContainer.find(`.tab-panel[tab-id=${tabId}]`).addClass("activeTab")
}
$(() => {
  $.fn.arr = function(){
    return Array.from(this)
  }
  $.fn.ArrjQ = function(){
    return Array.from(this).map(e=>$(e))
  }
   window.initForms = function(){
    $('.form input').unbind("keydown");
    $('.form [type=submit]').unbind("click");
    $('.form').unbind("submit");
    $('.form').unbind("success");
    $('.form').unbind("error");

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
      // l('test')
      let IS_VALID = true;
      for (let k of form.find('[required]')) {
        let validationElement = $((typeof form.attr("validation-element") == 'undefined') ?  '<span class="red-prompt">': form.attr('validation-element'));
        k = $(k)
        let valid = true;
        if (k.val() == null) valid = false;
        else if (k.val().trim() == '') valid = false;
        IS_VALID = valid;
        // l(IS_VALID)
        // l(valid)
        if (!valid) {
          validationElement.html("This field is required")
          if (k.next().attr('class') != validationElement.attr('class')) validationElement.insertAfter(k)
          // break
        } else if (k.next().attr('class') == validationElement.attr('class')) k.next().remove()
      }
      for (let k of form.find('[type=email]')) {
        let validationElement = $((typeof form.attr("validation-element") == 'undefined') ?  '<span class="red-prompt">': form.attr('validation-element'));
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
      for (let k of form.find("input[type=text][min-length],input[type=password][min-length],textarea[name]")) {
        k = $(k);
        // l("min-length handler called")
        let validationElement = $((typeof form.attr("validation-element") == 'undefined') ?  '<span class="red-prompt">': form.attr('validation-element'));
        let length = (isNaN(k.attr("min-length"))) ? 0 : Number(k.attr("min-length"));
        let valid = true
        if(k.val() == null) valid=false;
        else if(k.val().length < length) valid=false;
        IS_VALID = IS_VALID ? valid: IS_VALID;
        if(!valid){
          l('inside invalid')
          validationElement.html("Minimum field length is: "+length);
          if(k.next().attr('class') == validationElement.attr('class')) k.next().html("Minimum field length is: "+length)
          else validationElement.insertAfter(k)
          // break;
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
              if (typeof elem.attr("ignore-value") == "undefined" &&  elem.parents("[ignore-value-container]").length==0) {
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
            for(let elem of form.find('input[name],select[name],textarea[name]')){
              elem = $(elem);
              if((typeof elem.attr("ignore-value") == "undefined" && elem.parents('[ignore-value-container]').length == 0)||(typeof elem.attr("read-value") != "undefined" || elem.parents("[read-value-container]").length != 0)) {
                data[elem.attr('name')] = elem.val();
              }
            }
          }
        }
        l(data)
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
        if(!(form.attr("test-only") == 'true')) {
          console.log(request.data)
          $.ajax(request)
        }
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
  }
  initForms()
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
  for(let child of elem.children()) {
    if(sibling[0] == undefined) parent.prepend(child)
    else sibling.after(child)
    // console.log(elem.parent())
  }
  elem.remove()
}
Date.prototype.getDayName = function(){
  return ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][this.getDay()]
}
Date.prototype.getMonthName = function(){
  return ['January','February','March','April','May','June','July','August','September', 'October', 'November', 'December'][this.getMonth()]
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
$.bindProps = function(obj1,obj2){
  for(let key in obj2) {
    obj1[key] = obj2[key]
  }
}
$.genPost = function(post,targetElem,sessionData,config={}){
  let defaultConfig = {comments:false,commentLength:3};
  $.bindProps(defaultConfig,config);
  config = defaultConfig
  if(!config.comments) post.comments = []
  // else {
  //   console.log(post)
  // }
    let {classID,className,content,title,posterName,dateCreated,poster,lastModified} = post;
    let postID = post.id;
    let posterType = post.posterType;
    dateCreated = new Date(dateCreated).getSemiSimpleTime();
    let ifTeacherAccountAddElementHere = (posterType == 'teacher') ? '<a class="tooltipped" data-posiion="left" data-tooltip="Teacher"><i class="material-icons nord-yellow-text">school</i></a>' : ''
    comments = "";
    let isOwnerOfPost = (poster==sessionData.id)
    // let dropDownTextEditable = (isOwnerOfPost) ? `<li class="modal-trigger edit-post-modal-trigger" href="#editModal" post-id="${postID}"><a>Edit Post</a></li>
    // <li class="warn modal-trigger delete-post-modal-trigger" href="#deletePostModal" post-id="${postID}"><a>Delete Post</a></li>` : ""
    // dropDownHTML += `<ul class="dropdown-content" id="post-dropdown-${postID}">
    //   <li><a href="/post/${postID}">Go to post</a></li>
    //   ${dropDownTextEditable}
    // </ul>`
    if(post.comments.length > 0){
      let amount = Math.min(post.comments.length,config.commentLength)
      for(let i=0;i<amount;i++){
        let comment = post.comments[i]
        let {id,dateCreated,commenter,commenterName,content} = comment;
        let isOwnerOfComment = (commenter==sessionData.id);
        let dateCommented = new Date(dateCreated).getSemiSimpleTime()
        comments+=`<div class="comment">
        <div class="comment-marker nord-darkblue"></div>
        <img class="comment-pfp" src="/api/users/${commenter}/image"/>
        <div class="comment-poster"><a href="/user/${commenter}">${commenterName}</a></div><span class="date-text">${dateCommented}
        ${(isOwnerOfComment)?
          `
          <span class="date-text small-side-margin edit-comment pointer-cursor" post-id="${id}"><a>Edit  </a></span>
          <span class="date-text modal-trigger small-side-margin delete-comment pointer-cursor" comment-id="${id}" href="#deleteCommentModal"><a>Delete</a></span>
          `:""
        }
        </span>
        <!-- <div class="comment-text more">${content}</div> -->
        ${(isOwnerOfComment)?
          `
          <div class="form comment-edit-form" action="/api/post/comment/edit" method="POST">
            <input type="hidden" name="commentID" value="${id}">
            <textarea class="materialize-textarea comment-readonly" readonly name="content">${content}</textarea>
            <div class="hidden">
            <button class="btn nord-red" type="submit">SAVE CHANGES</button>
            <button class="btn nord-blue comment-edit-cancel-button">CANCEL</button>
            </div>
          </div>
          `
          :
          `
          <textarea class="materialize-textarea comment-readonly" readonly>${content}</textarea>
          `
        }
        </div>`
      }
    }
    let attachmentContent = ""
    post.attachments = post.attachments || []
    for(let attachment of post.attachments){
      attachmentContent+=
      // `<a href="/class/${classID}/attachment/${attachment.fileName}"><i class="tiny material-icons">attach_file</i> ${attachment.originalName}</a><br>`
      `
        <li class="collection-item file"><div><a href="/class/${post.classID}/attachment/${attachment.fileName}" target="_blank">${attachment.originalName}</a><a download href="/class/${post.classID}/attachment/${attachment.fileName}" class="secondary-content"><i class="white material-icons nord-purple download_file tiny">file_download</i></a></div></li>
      `
    }
    let loadMoreContainer = (post.comments.length > 3) ? `<div class="load-more-comments">
      <a href="/post/${postID}">[Load more comments...]</a>
    </div>` : ''
    let elem = $(`<div class="post hoverable">
      <div class="post-header">
        <img class="post-pfp" src="/api/users/${poster}/image" />
      </div>
      <!--
      <a post-id="${postID}" owner="${isOwnerOfPost}" class="dropdown-trigger" data-target="post-dropdown-${postID}"><i class="material-icons post-options">more_horiz</i></a>
      -->
      <div class="poster"><a href="/user/${poster}">${posterName}</a></div>
      ${ifTeacherAccountAddElementHere}
      <a href="/class/${classID}" class="post-class">${className}</a>
      <span class="date-text">${dateCreated} ${(post.dateCreated != post.lastModified) ? "(Edited)" : ''}</span>
      <span class="date-text small-side-margins pointer-cursor"><a href="/post/${postID}">Go to post  </a></span>
      ${(isOwnerOfPost)?
      `
      <span class="date-text modal-trigger pointer small-side-margin edit-post pointer-cursor" post-id="${postID}" href="#editModal"><a>Edit  </a></span>
      <span class="date-text pointer modal-trigger small-side-margin delete-post pointer-cursor" post-id="${postID}" href="#deletePostModal"><a>Delete</a></span>

      `:""
      }
      <div class="more content-of-post">${content}</div>
      <ul class="collection files">
      ${attachmentContent}
      </ul>
      <hr />
      <h6><b>Comments</b></h6>
      <div class="form comment-form" method='POST' action="/api/post/comment/create?json=true"  on-error="console.log(response)">

        <input name="postID" type="text" value="${postID}" class="hidden comment-input"/>
        <input name="content" type="text" class="comment-input" placeholder="Comment here..."/><br>
        <button name="comment-btn" type="submit" name="button" class="right-align btn nord-red">Comment</button>
        <br /><br />
      </div>
      <div class="comments">
        ${comments}
      </div>
      ${loadMoreContainer}
    </div>`)
    targetElem.append(elem)

}

$.getDataValue = function(key){
  let desiredValue = null;
  $('backend-data').each((e,k) => {
    k = $(k);
    if(k.attr("key") == key) desiredValue=k.text()
  })
  return desiredValue
}
