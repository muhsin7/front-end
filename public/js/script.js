// const l = console.log;
var l = console.log;
l("Why the hell are you checking console you fool work on the front end.  ");


/////////////////////READ MORE////////////////////////
      $(document).ready(function() {
    // Configure/customize these variables.
    var showChar = 100;  // How many characters are shown by default
    var ellipsestext = "...";
    var moretext = "Read more";
    var lesstext = "Read less";


    $('.more').each(function() {
        var content = $(this).html();

        if(content.length > showChar) {

            var c = content.substr(0, showChar);
            var h = content.substr(showChar, content.length - showChar);

            var html = c + '<span class="moreellipses">' + ellipsestext+ '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink">' + moretext + '</a></span>';

            $(this).html(html);
        }

    });

    $(".morelink").click(function(){
        if($(this).hasClass("less")) {
            $(this).removeClass("less");
            $(this).html(moretext);
        } else {
            $(this).addClass("less");
            $(this).html(lesstext);
        }
        $(this).parent().prev().toggle();
        $(this).prev().toggle();
        return false;
    });
});
//////////////////////////////////////////////////////////////




//////////////HOVER SHADOW ON FOCUS///////////////////////////
$(".comment-input").on("focus", function(){
  $(".post").addClass("post-active-comment")
})
$(".comment-input").on("blur", function(){
  $(".post").removeClass("post-active-comment")
})
/////////////////////////////////////////////////////////////




///////////////////////MISC./////////////////////////////////

  // $('#classDropdown').mouseout(function(){
  //     var isntance = M.Dropdown.getInstance('#classDropdown');
  //     instance.close();
  //   }
  // );
/////////////////////////////////////////////////////////////




///////////////////MATERIALIZE///////////////////////////////
//////DROPDOWN//////
$(() => {

  $('.dropdown-trigger').dropdown();
})
///////////////////

//////MODALS///////
$(document).ready(function(){
  $('.modal').modal();
});
///////////////////


    //////SELECT//////
      $(document).ready(function(){
        $('select').formSelect();
      });
    ////////////////////

//////////TOOLTIP///////////////////
    $(document).ready(function(){
  $('.tooltipped').tooltip();
});
///////////////////////////////////


////////////////////////////////////////////////////////////
