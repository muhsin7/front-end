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
      }
    }, error:function(e){
      console.error(e)
    }
  })
  $(window).on("sessionLoaded",(event,error,sessionData) => {
    $.ajax({
    url:"/api/post/list/all",
    type:"GET",
    success:function(response){
      response = response.reverse()
      console.log(response)
      let postContainer = $('#postContainer')
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
      response = response.reverse()
      for(let post of response){
        let {classID,className,content,title,posterType,posterName,dateCreated,comments,poster} = post;
        let postID = post.id;
        dateCreated = new Date(dateCreated).getSemiSimpleTime();
        let ifTeacherAccountAddElementHere = (posterType == 'teacher') ? '<a class="tooltipped" data-posiion="left" data-tooltip="Teacher"><i class="material-icons nord-yellow-text">school</i></a>' : ''
        comments = "";
        let isOwnerOfPost = (poster==sessionData.id)
        if(post.comments.length > 0){
          let amount = (post.comments.length>3)? 3:post.comments.length
          for(let i=0;i<amount;i++){
            let comment = post.comments[i]
            let {id,dateCreated,commenter,commenterName,content} = comment;
            let dateCommented = new Date(dateCreated).getSemiSimpleTime()
            comments+=`<div class="comment">
            <div class="comment-marker nord-darkblue"></div>
            <img class="comment-pfp" src="../images/default.jpg"/>
            <div class="comment-poster">${commenterName}</div><span class="date-text">${dateCommented}</span>
            <div class="comment-text more">${content}</div>
            </div>`
          }
        }
        let loadMoreContainer = (post.comments.length > 3) ? `<div class="load-more-comments">
          <a href="/post/${postID}">[Load more comments...]</a>
        </div>` : ''
        let elem = $(`<div class="post hoverable">
          <div class="post-header">
            <img class="post-pfp" src="../images/default.jpg" />
          </div>
          <div class="poster">${posterName}<a href="#" post-id="${postID}" owner="${isOwnerOfPost}" class="post-dropdown-button dropdown-trigger" data-target="post-dropdown"><i class="material-icons post-options">more_horiz</i></a></div>
          ${ifTeacherAccountAddElementHere}
          <a href="/class/${classID}" class="post-class">${className}</a>
          <span class="date-text">${dateCreated} </span>
          <span class="date-text side-margins"><a href="/post/${postID}">Go to post  </a></span>
          ${(isOwnerOfPost)?
          `
          <span class="date-text modal-trigger pointer side-margins edit-post" post-id="${postID}" href="#editModal"><a>Edit  </a></span>
          <span class="date-text pointer modal-trigger side-margins delete-post" post-id="${postID}" href="#deletePostModal"><a>Delete</a></span>

          `:""
          }
          <div class="more content-of-post">${content}</div>
          <hr />
          <h6><b>Comments</b></h6>
          <div class="form comment-form" method='POST' action="/api/post/comment/create" on-success-reload="true" on-error="console.log(response)">

          <input name="postID" type="text" value="${postID}" class="hidden comment-input"/>
            <input name="content" type="text" class="comment-input" placeholder="Comment here..."/>
            <button name="comment-btn" type="submit" name="button" class="right-align btn nord-red">Comment</button>
            <br /><br />
          </div>
          <div class="comments">
            ${comments}
          </div>
          ${loadMoreContainer}
        </div>`)
        postContainer.append(elem)

      }

      if(response.length == 0){
        postContainer.append($(`<center><h6 class="grey-text">No posts to be loaded</h6></center>`))
      }
      initEvents()
      $('.dropdown-trigger').dropdown();
      $('#deleteProxy').on('click',() => {
        $('#deleteClass').click()
        l('sdlkfjdsiklfj')
      })
      $('.delete-post').on('click',function() {
        let elem = $(this);
        let parentPost = elem.parents('.post').eq(0);
        l("lsdkjfldsjkf"+elem.attr("post-id"))
        $('#deletePostId').val(elem.attr("post-id"))
      })
      $('.edit-post').on('click',function(){
        let elem = $(this);
        let parentPost = elem.parents('.post').eq(0);
        let editPostContent = parentPost.find(".content-of-post");
        // l(editPostContent)
        l(elem.attr('post-id'))
        $('#editPostContent').val(editPostContent.text())
        $('#editPostIDVAlue').attr("value",elem.attr('post-id'))
      })
      $('.post-dropdown-button').on('click',function() {
        let elem = $(this);
        $('#dropdownPostLink a').attr('href',`/post/${elem.attr("post-id")}`)
        if(elem.attr("owner") == 'true') {
          // $('#hiddenDropdown').removeClass('hidden')
          $('#editPostButton').removeClass('hidden')
          $('#deletePostButton').removeClass('hidden')
        }
        else {
          $('#editPostButton').addClass('hidden')
          $('#deletePostButton').addClass('hidden')
          // $('#hiddenDropdown').addClass('hidden')
        }
      })
    }, error:function(error){
      $('#samplePost').removeClass("hidden")
      console.error(error.responseText)
    }
  })
  })

})
