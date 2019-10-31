
$(document).ready(function(){
  $('.modal').modal();
});
///////////////////


//////DROPDOWN//////
  $('.dropdown-trigger').dropdown();
///////////////////


//////FLOATING BUTTON//////
$(document).ready(function(){
    $('.fixed-action-btn').floatingActionButton();
  })
//////////////////////////



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
$(window).on('sessionLoaded',(event,err,session) => {
  if (err) console.error(err);
  else {
    $(`${session.type}-container`).css('display','initial')
  }
})
