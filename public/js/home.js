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
    }, error:function(e){
      console.error(e)
    }
  })
})
