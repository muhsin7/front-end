$(() => {
  $(window).on("sessionError",() => {
    $('input.autocomplete').autocomplete({
      data: {
        "Chemistry HL": null,
        "Physics HL": null,
        "Mathematics AA HL": null,
        "Spanish Ab HL": null,
        "Language and Literature SL": null,
        "Economics SL": null
      },
    });
    $('#writePostButton').removeClass('hidden')
    let classList = $('#class-list').children("li.truncate").tojQArr().map(e=>e.children('a').eq(0).text());
    let classSelect = $('#classSelect');
    for(let i=0;i<classList.length;i++){
      let option = $(`<option value="${i}">${classList[i]}</option>`);
      classSelect.append(option)
    }
    classSelect.formSelect()
  })
  // l("Home.js is working")
  $.ajax({
    url:"/api/class/list/classes",
    type:"GET",
    success:function(e){
      // <a href="/class/"><li class="truncate">Chemistry HL</li></a>
      // l(e)
      let autoCompleteObject = {};
      let classList = $('#class-list');
      let classSelect = $('#classSelect');
      for(let classGroup of e){
        let classElem = $(`<a href="/class/${classGroup._id}"><li class="truncate">${classGroup.name}</li></a>`);
        classList.append(classElem);
        let optionElem = $(`<option value="${classGroup._id}">${classGroup.name}</option>`)
        classSelect.append(optionElem)
        autoCompleteObject[classGroup.name] = null;
      }
      l(autoCompleteObject)
      classSelect.formSelect()
      $('input.autocomplete').autocomplete({
        data:autoCompleteObject
      })
      if(e.length == 0){
        classList.append(`<center><h6 class="grey-text">No classes, join one.</h6></center>`)
        $('#writePostButton').remove()
      } else $('#createPostButton').removeClass('hidden')

    }, error:function(e){
      console.error(e)
    }
  })
  $(window).on("sessionLoaded",(event,error,sessionData) => {
    $('.session-info-username').text(sessionData.user)
    $('.login-info').removeClass('hidden')
    $.ajax({
    url:"/api/post/list/all",
    type:"GET",
    success:function(response){
      // console.log(response)
      let postContainer = $('#postContainer');
      $('#samplePost').addClass('hidden')
      // for(let post of response){
      //   let {classID,className,content,title,posterName,dateCreated} = post;
      //   dateCreated = new Date(dateCreated).getSemiSimpleTime();
      //
      //   let elem = $(`<div class="post">
      //     <a href="/class/${classID}" class="assignment-subject bold-text blue-text">${className}</a>
      //     <h5>${title}</h5>
      //     <h7>${posterName}</h7><br>
      //     <span class="grey-text small-text">${dateCreated}</span>
      //     <h6>${content}</h6>
      //   </div>`)
      //   postContainer.append(elem)
      // }
      // response = response.reverse();
      response = response.sort((a,b)=>b.dateCreated-a.dateCreated)
      // let dropDownHTML = ""
      /*for(let post of response){
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
          let amount = (post.comments.length>3)? 3:post.comments.length
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
        postContainer.append(elem)
      }*/
      for(let post of response){
        $.genPost(post,postContainer,sessionData,{comments:true})
      }
      if(response.length == 0){
        postContainer.append($(`<center><h6 class="grey-text">No posts to be loaded</h6></center>`))
      }
      $('.dropdown-trigger').dropdown();
      // $('#dropdown-container').html(dropDownHTML);
      $('#deleteProxy').on('click',() => {
        $('#deleteClass').click()
        // l('sdlkfjdsiklfj')
      })
      $('.delete-post').on('click',function() {
        let elem = $(this);
        let parentPost = elem.parents('.post').eq(0);
        // l("lsdkjfldsjkf"+elem.attr("post-id"))
        $('#deletePostId').val(elem.attr("post-id"))
      })
      $('.edit-post').on('click',function(){
        let elem = $(this);
        let parentPost = elem.parents('.post').eq(0);
        let editPostContent = parentPost.find(".content-of-post");
        // l(editPostContent)
        // l(elem.attr('post-id'))
        $('#edit-old-file-container').html('')
        $('#edit-new-file-container').html('')
        $('#editPostContent').val(editPostContent.text())
        $('#edit-postID').val(elem.attr('post-id'))
        $('#edit-postID').trigger("fetchready",[elem.attr('post-id')])
      })
      $('.edit-comment').on('click',function(){
        let elem = $(this);
        let form = elem.parents(".comment").eq(0).find(".comment-edit-form");
        // l(form)
        let textarea = form.find('[name=content]')
        let hiddenDiv = form.find("div.hidden")
        hiddenDiv.removeClass('hidden');
        textarea.removeAttr("readonly");
        textarea.focus()
        textarea.attr("initial-value",textarea.val())
        elem.addClass('hidden');
        form.find('.comment-edit-cancel-button').eq(0).off("click")
        form.find('.comment-edit-cancel-button').eq(0).on("click",function(){
          textarea.val(textarea.attr("initial-value"));
          hiddenDiv.addClass('hidden');
          elem.removeClass('hidden')
        })
        form.on('success',function(){
          hiddenDiv.addClass("hidden");
          textarea.attr("readonly","")
          textarea.attr("initial-value",textarea.val());
          elem.removeClass('hidden')
        })
        form.on('error',function(event,err){
          l(err)
        })
      })
      $('.delete-comment').on("click",function(){
        let elem = $(this);
        $('#deleteCommentId').attr("value",elem.attr('comment-id'))
      })
      // $('.post-dropdown-button').on('click',function() {
      //   let elem = $(this);
      //   $('#dropdownPostLink a').attr('href',`/post/${elem.attr("post-id")}`)
      //   if(elem.attr("owner") == 'true') {
      //     // $('#hiddenDropdown').removeClass('hidden')
      //     $('#editPostButton').removeClass('hidden')
      //     $('#deletePostButton').removeClass('hidden')
      //   }
      //   else {
      //     $('#editPostButton').addClass('hidden')
      //     $('#deletePostButton').addClass('hidden')
      //     // $('#hiddenDropdown').addClass('hidden')
      //   }
      // })
      initForms()
      $('.comment-form').on("success", function(event,response){
        let elem = $(this);
        let commentID = response.comment.id
        let commentInput = elem.children(`.comment-input`).eq(1);
        let commentValue = commentInput.val()
        commenter = sessionStorage.id
        let user = sessionStorage.getItem("user")
        // l(elem.parent().children(".comments").eq(0));
        let commentElem = elem.parent().children('.comments').eq(0);
        let comment = $(`
          <div class="comment">
            <div class="comment-marker nord-darkblue"></div>
            <img class="comment-pfp" src="/api/users/${commenter}/image"/>
            <div class="comment-poster">${user}</div><span class="date-text">${new Date().getSemiSimpleTime()}</span>
            <span class="date-text small-side-margin edit-comment pointer-cursor"><a>Edit  </a></span>
            <span class="date-text modal-trigger small-side-margin delete-comment pointer-cursor" comment-id="${commentID}" href="#editModal"><a>Delete</a></span>
            <div class="form comment-edit-form" action="/api/post/comment/edit" method="POST">
              <input type="hidden" name="commentID" value="${commentID}">
              <textarea class="materialize-textarea comment-readonly" readonly name="content">${commentValue}</textarea>
              <div class="hidden">
              <button class="btn nord-red" type="submit">SAVE CHANGES</button>
              <button class="btn nord-blue comment-edit-cancel-button">CANCEL</button>
              </div>
            </div>
          </div>
        `)
        commentElem.append(comment);
        commentInput.val("")
        $('.delete-comment').off('click')
        $('.edit-comment').off('click');
        $('.edit-comment').on('click',function(){
          let elem = $(this);
          let form = elem.parents(".comment").eq(0).find(".comment-edit-form");
          // l(form)
          let textarea = form.find('[name=content]')
          let hiddenDiv = form.find("div.hidden")
          hiddenDiv.removeClass('hidden');
          textarea.removeAttr("readonly");
          textarea.attr("initial-value",textarea.val())
          elem.addClass('hidden');
          form.find('.comment-edit-cancel-button').eq(0).off("click")
          form.find('.comment-edit-cancel-button').eq(0).on("click",function(){
            textarea.val(textarea.attr("initial-value"));
            hiddenDiv.addClass('hidden');
            elem.removeClass('hidden')
          })
          form.on('success',function(){
            hiddenDiv.addClass("hidden");
            textarea.attr("readonly","")
            textarea.attr("initial-value",textarea.val());
            elem.removeClass('hidden')
          })
          form.on('error',function(event,err){
            l(err)
          })
        })
        $('.delete-comment').on("click",function(){
          let elem = $(this);
          $('#deleteCommentId').attr("value",elem.attr('comment-id'))
        })
      })

    }, error:function(error){
      $('#samplePost').removeClass("hidden")
      console.error(error.responseText)
    }
  });
});





  // FILE UPLOAD FOR EDITING
  $('#edit-postID').on("fetchready",(event,postID) => {
    $.ajax({
      url:"/api/post/get/"+postID,
      type:"GET",
      success:function(response){
        // l(response)
        let {attachments} = response;
        $('#edit-old-file-container').html('')
        for(let attachment of attachments){
          $('#edit-old-file-container').append(
            $(
              `<li class="collection-item" class="file"><div><a href="#">${attachment.originalName}</a><a class="secondary-content"><i  file-name="${attachment.originalName}" file-id="${attachment.fileName}" class="white edit-remove-file material-icons nord-red remove_file tiny">close</i></a></div></li>`
            )
          )
        }
        $('#edit-old-file-container .edit-remove-file').on('click',function(){
          let elem = $(this);
          let originalName = elem.attr("file-name");
          let fileName = elem.attr("file-id");
          $("#edit-attach-file")[0].removedFiles = $("#edit-attach-file")[0].removedFiles || [];
          $("#edit-attach-file")[0].removedFiles.push({fileName,originalName})
          elem.parents(".collection-item").eq(0).remove()
          // l($("#edit-attach-file")[0].removedFiles)
        })

      }
    })
  })
  $('#edit-attach-file-button').on('click',() => {
    $('#edit-attach-file').click()
  })
  $('#edit-attach-file').on('change',() => {
    let elem = $('#edit-attach-file')[0];
    elem.fileList = elem.fileList || [];
    for(let file of elem.files){
      elem.fileList.push(file);
      $('#edit-new-file-container').append(
        $(
          `<li class="collection-item" class="file"><div><a href="#">${file.name}</a><a class="secondary-content"><i  file-name="${file.name}" class="white edit-remove-file material-icons nord-red remove_file tiny">close</i></a></div></li>`
        )
      )
    }
    $('#edit-new-file-container .edit-remove-file').off('click')
    $('#edit-new-file-container .edit-remove-file').on('click',function() {
      let button = $(this)
      for (let i = 0; i < elem.fileList.length; i++) {
        let file = elem.fileList[i];
        if(file.name == button.attr("file-name")) elem.fileList.splice(i,1)
      }
      button.parents('.collection-item').eq(0).remove()
      l(elem.fileList)
    })
  })
  $('#edit-submit').on('click',() => {
    let postID = $('#edit-postID').val();
    let content = $('#editPostContent').val();
    let fileUpload = $('#edit-attach-file')[0]
    fileUpload.removedFiles = fileUpload.removedFiles || []
    fileUpload.fileList = fileUpload.fileList || []
    let formData = new FormData();
    formData.append("postID",postID);
    formData.append("content",content);
    for(let removedFile of fileUpload.removedFiles){
      formData.append('removedFiles',JSON.stringify(removedFile))
    }
    for(let addedFile of fileUpload.fileList){
      formData.append('additionalFiles',new Blob([addedFile]),addedFile.name)
    }
    $.ajax({
        url:"/api/post/edit?json=true&postFiles=true",
        type:"POST",
        data:formData,
        contentType:false,
        processData:false,
        cache:false,
        success:function(data){
          window.location.reload(true)
        },error:function(data){
          console.error(data)
        }
      })
  })


  // FILE UPLOAD FOR POSTING
  $('#post-attach-files-button').on('click',() => {
    $('#post-files').click()
    // l('why is this a thing')
  })
  $('#writePostButton').on('click',function(){
    $('#post-files')[0].fileList = [];
    $('#post-file-collection').html("")
  })
  $('#post-files').on('change',function(){
    let elem = $(this)[0];
    elem.fileList = elem.fileList || [];
    for(let file of elem.files) {
      $('#post-file-collection').append(
        $(
          `<li class="collection-item" class="file"><div><a href="#">${file.name}</a><a href="#" class="secondary-content"><i  file-name="${file.name}" class="white post-remove-file material-icons nord-red remove_file tiny">close</i></a></div></li>`
        )
      )
      $('#post .post-remove-file').off('click')
      $('#post .post-remove-file').on('click',function(){
        // l($(this).parents(".collection-item").eq(0))
        for(let i=0;i<elem.fileList.length;i++) {
          let file = elem.fileList[i];
          if(file.name == $(this).attr('file-name')) elem.fileList.splice(i,1)
        }
        $(this).parents(".collection-item").eq(0).remove();
        l(elem.fileList)
      })
      elem.fileList.push(file)
    }
  })
  $('#post-submit').on("click",() => {
    let classID = $('#classSelect').val();
    let content = $('#post-content').val();
    let validationMessage = ""
    if (classID == "null" || classID == null) {
      validationMessage += "Class required<br>"
    } if(content.trim().length < 6) {
      validationMessage += "Min content length has to be more than 6<br>"
    } else {
      let postFiles = $('#post-files');
      let formData = new FormData();
      formData.append("classID",classID);
      formData.append("content",content);
      postFiles[0].fileList = postFiles[0].fileList || []
      for(let file of postFiles[0].fileList) formData.append("additionalFiles",new Blob([file]),file.name)
      $.ajax({
        url:"/api/post/create?uploadingFile=true",
        type:"POST",
        data:formData,
        processData:false,
        contentType:false,
        cache:false,
        success:function(data){
          console.log(data);
          window.location.reload(true)
        },error:function(err){
          // console.log(err)
          $('#post-error').text(err)
        }
      })
    }
    $("#post-error").html(validationMessage)
  })
})
