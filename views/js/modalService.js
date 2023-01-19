$(function () {
  //Take the data from the TR during the event button
  $("table").on("click", "label.updateService", function (ele) {
    //the <tr> variable is use to set the parentNode from "ele
    var tr = ele.target.parentNode.parentNode;

    //I get the value from the cells (td) using the parentNode (var tr)
    var name = tr.cells[1].textContent;
    var price = tr.cells[2].textContent;
    var room = tr.cells[3].textContent;
    var description = tr.cells[4].textContent;

    //Prefill the fields with the gathered information
    $("#name").val(name);
    $("#price").val(price);
    $("#room").val(room);
    $("#description").val(description);
  });
});
