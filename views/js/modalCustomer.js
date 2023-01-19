$(function () {
  //Take the data from the TR during the event button
  $("table").on("click", "label.updateCustomer", function (ele) {
    //the <tr> variable is use to set the parentNode from "ele
    var tr = ele.target.parentNode.parentNode;

    //I get the value from the cells (td) using the parentNode (var tr)
    var name = tr.cells[1].textContent;
    var wa = tr.cells[2].textContent;
    var sex = tr.cells[3].textContent;
    var dateOfBirth = tr.cells[4].textContent;

    //Prefill the fields with the gathered information
    $("#name").val(name);
    $("#wa").val(wa);
    $("#sex").val(sex);
    $("#dateOfBirth").val(dateOfBirth);
  });
});
