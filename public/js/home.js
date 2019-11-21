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
  $.ajax({
    url:"/api/post/list/all",
    type:"GET",
    success:function(response){
      // console.log(response)
      let postContainer = $('#postContainer')
      for(let post of response){
        let {classID,className,content,title,posterName,dateCreated} = post;
        dateCreated = new Date(dateCreated).getSemiSimpleTime();

        let elem = $(`<div class="post">
          <a href="/class/${classID}" class="assignment-subject bold-text blue-text">${className}</a>
          <h5>${title}</h5>
          <h7>${posterName}</h7><br>
          <span class="grey-text small-text">${dateCreated}</span>
          <h6>${content}</h6>
        </div>`)
        postContainer.append(elem)
      }
      if(response.length == 0){
        postContainer.append($(`<center><h6 class="grey-text">No posts to be loaded</h6></center>`))
      }
    }, error:function(error){
      $('#samplePost').removeClass("hidden")
      console.error(error.responseText)
    }
  })
})