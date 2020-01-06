const containerArray = ['teacher','student']

$(document).ready(function(){
  $('.modal').modal();
});
///////////////////


//////DROPDOWN//////

  $(() => {
    try {
      $('.dropdown-trigger').dropdown();
    } catch (e) {
      console.warn("Lol dropdowns don't work soz")
    }
  })
///////////////////


//////FLOATING BUTTON//////
$(document).ready(function(){
    $('.fixed-action-btn').floatingActionButton();
  })
//////////////////////////

$(window).on("sessionLoaded",(event,error,response) => {
  // l(response)
  if (error) {
    $(window).trigger("sessionError")
  } else {
    let {type} = response;
    $(`${type}-container`).dissolve();
    containerArray.splice(containerArray.indexOf(type),1)
    for(let container of containerArray) $(`${container}-container`).remove()
  }
})

//////SELECT//////
  $(document).ready(function(){
    $('select').formSelect();
  });
////////////////////


/////AUTOCOMPLETE/////
 $(document).ready(function(){
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
 });
//////////////////////




// NON MATERIALISE STUFF:

window.splitUrl = function(){
  return window.location.href.split("/")
}
Array.prototype.lastElem = function(){
  return this[this.length-1]
}

/*console.log(`
%c
  ███ ██ ██ ██ ██ ██ ██ █ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ █ ██ ██ ██ ██ ██ ██ ██ █
  █░░ ░░ ░░ ░░ ░░ ░░ ░░ █ ░░ ░░ ░░ ██ ██ ██ ██ ██ ░░ ░░ ░░ █ ░░ ░░ ░░ ░░ ░░ ░░ ░░ █
  █░░ ▄▀ ▄▀ ▄▀ ▄▀ ▄▀ ░░ █ ░░ ▄▀ ░░ ██ ██ ██ ██ ██ ░░ ▄▀ ░░ █ ░░ ▄▀ ▄▀ ▄▀ ▄▀ ▄▀ ░░ █
  █░░ ▄▀ ░░ ░░ ░░ ▄▀ ░░ █ ░░ ▄▀ ░░ ██ ██ ██ ██ ██ ░░ ▄▀ ░░ █ ░░ ▄▀ ░░ ░░ ░░ ▄▀ ░░ █
  █░░ ▄▀ ░░ ██ ░░ ▄▀ ░░ █ ░░ ▄▀ ░░ ██ ██ ██ ██ ██ ░░ ▄▀ ░░ █ ░░ ▄▀ ░░ ██ ░░ ▄▀ ░░ █
  █░░ ▄▀ ░░ ██ ░░ ▄▀ ░░ █ ░░ ▄▀ ░░ ██ ░░ ░░ ░░ ██ ░░ ▄▀ ░░ █ ░░ ▄▀ ░░ ██ ░░ ▄▀ ░░ █
  █░░ ▄▀ ░░ ██ ░░ ▄▀ ░░ █ ░░ ▄▀ ░░ ██ ░░ ▄▀ ░░ ██ ░░ ▄▀ ░░ █ ░░ ▄▀ ░░ ██ ░░ ▄▀ ░░ █
  █░░ ▄▀ ░░ ██ ░░ ▄▀ ░░ █ ░░ ▄▀ ░░ ██ ░░ ▄▀ ░░ ██ ░░ ▄▀ ░░ █ ░░ ▄▀ ░░ ██ ░░ ▄▀ ░░ █
  █░░ ▄▀ ░░ ██ ░░ ▄▀ ░░ █ ░░ ▄▀ ░░ ░░ ░░ ▄▀ ░░ ░░ ░░ ▄▀ ░░ █ ░░ ▄▀ ░░ ██ ░░ ▄▀ ░░ █
  █░░ ▄▀ ░░ ░░ ░░ ▄▀ ░░ █ ░░ ▄▀ ▄▀ ▄▀ ▄▀ ▄▀ ▄▀ ▄▀ ▄▀ ▄▀ ░░ █ ░░ ▄▀ ░░ ░░ ░░ ▄▀ ░░ █
  █░░ ▄▀ ▄▀ ▄▀ ▄▀ ▄▀ ░░ █ ░░ ▄▀ ░░ ░░ ░░ ▄▀ ░░ ░░ ░░ ▄▀ ░░ █ ░░ ▄▀ ▄▀ ▄▀ ▄▀ ▄▀ ░░ █
  █░░ ░░ ░░ ░░ ░░ ░░ ░░ █ ░░ ░░ ░░ ██ ░░ ░░ ░░ ██ ░░ ░░ ░░ █ ░░ ░░ ░░ ░░ ░░ ░░ ░░ █
  ███ ██ ██ ██ ██ ██ ██ █ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ █ ██ ██ ██ ██ ██ ██ ██ █
  `,'font-size:15px')*/
