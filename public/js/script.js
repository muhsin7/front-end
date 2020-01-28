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
  try {
    $('.dropdown-trigger').dropdown();
  } catch (e) {
    console.warn("Lol dropdowns don't really work, soz")
  }
})
///////////////////





// Notifications
$(window).on('sessionLoaded',(event,error,response) => {
  if(error) console.error(error)
  else {
    if(response.type != 'teacher') $('[on-student-remove]').remove()
    $.ajax({
      url:'/api/notifications/getAll',
      type:'GET',
      success:function(data){
        let notificationsContainer = $('#notificationsContainer');
        // console.log(notificationsContainer)
        notificationsContainer.after($(`<h6 id="notificationsError" class="red-text"></h6>")`))
        if(data.length == 0){
          notificationsContainer.append($(
            `
            <center>
            <h5 class="grey-text">No notifications to show</h5>
            </center>
            `
          ))
        } else {
          notificationsContainer.after($(`<center id="clearContainer">
          <a class="btn nord-red" id="clearNotif">Clear All</a>
          </center>`))
          $('#clearNotif').on('click',() => {
            $.ajax({
              url:"/api/notifications/clearAll",
              type:'GET',
              success:function(data){
                notificationsContainer.html('');
                $('#clearNotif').remove()
                notificationsContainer.append($(
                  `
                  <center>
                  <h5 class="grey-text">No notifications to show</h5>
                  </center>
                  `
                ))
              },error:function(err){
                console.error(err.responseText)
              }
            })
          })
        }
        for(let notification of data){
          let {hook,content,message,id,initiator,type,status,timeStamp} = notification;
          let classType = (['assignment','post'].includes(type)) ? type : 'assignment'
          // console.log(type)
          let path = hook
          let elem = $(`
            <span href="${path}" status="${status}" class="notificationAnchor" notification-id="${id}">
            <li class="collection-item modal-notification ${classType}-notif">
            <img src="/api/users/${initiator}/image" class="modal-notif-pfp"/>
            <div>
            <div class="truncate nord-purple-text notif-content">
            ${message} <br><span class='grey-text' style="font-size:12px">${new Date(Number(timeStamp)).getSemiSimpleTime()}
            </span>
            </div>
            <div class="truncate">
            ${content}
            </div>
            </div>
            </li>
            </span>
            `)
            notificationsContainer.append(elem)
            // console.log('sdlkfjdskljfskdljdsfkljdklfsdjflkjsd')
          }
          $('.notificationAnchor').off('click');
          $('.notificationAnchor').on('click',function(event){
            let elem = $(this)
            if (elem.attr('status') == 'read') window.location.href = elem.attr('href')
             else {
            $.ajax({
              url:"/api/notifications/markRead",
              type:'post',
              data:{id:elem.attr('notification-id')},
              success:function(data){
                console.log(data);
                window.location.href = elem.attr('href');
              },error:function(err){
                console.error(err.responseText)
              }
            })
            }
          })
        },error:function(data){
          console.error(data.responseText)
        }
      })
  }
})


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



// $(.defaulter_name).on('click', function(){
//   $('.submission-box').css('visibility', 'hidden')
//   $('.hidden-defaulter-box').addClass('defaulter-box')
//   $('.defaulter-box').css("visibility", "visible")
//   $('#defaulter_name').text("Defaulter name")
// })
//
// $(.submittor_name).on('click', function(){
//   $('.submission-box').css('visibility', 'visible')
//   $('.hidden-defaulter-box').removeClass('defaulter-box')
//   $('.defaulter-box').css("visibility", "hidden")
// })
