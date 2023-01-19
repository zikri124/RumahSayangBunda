$(function () {
  //Take the data from the TR during the event button
  $("table").on("click", "label.updateNextReservasi", function (ele) {
    //the <tr> variable is use to set the parentNode from "ele
    var tr = ele.target.parentNode.parentNode;

    //I get the value from the cells (td) using the parentNode (var tr)
    var name = tr.cells[1].textContent;
    var serviceId = tr.cells[2].textContent;
    var status = tr.cells[3].textContent;
    var tanggalReservasi = tr.cells[4].textContent;
    var waktu = tr.cells[5].textContent;
    var tanggalLahir = tr.cells[6].textContent;

    //Prefill the fields with the gathered information
    $("#name").val(name);
    $("#serviceId").val(serviceId);
    $("#status").val(status);
    $("#tanggalReservasi").val(tanggalReservasi);
    $("#waktu").val(waktu);
    $("#tanggalLahir").val(tanggalLahir);
  });
});
