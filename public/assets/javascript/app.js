$(document).ready(function(){
  $(".add-comment").on("click", function(){
    var articleId = $(this).data("id");
    var baseURL = window.location.origin;
    var frm = $("#form-add-" + articleId);

    $.ajax({
      url: baseURL + "/add/comment/" + articleId,
      type: "POST",
      data: frm.serialize()
    })
    .done(function() {
      location.reload();
    });
    return false;
  });

  $(".delete-comment").on("click", function(){
    var commentId = $(this).data("id");
    var baseURL = window.location.origin;

    $.ajax({
      url: baseURL + "/remove/comment/" + commentId,
      type: "POST",
    })
    .done(function() {
      location.reload();
    });
    return false;
  });
});