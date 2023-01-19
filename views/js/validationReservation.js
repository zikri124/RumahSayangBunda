$(document).ready(function () {
  $("#form").validate({
    rules: {
      no_hp: {
        number: true
      }
    }
  });
});
