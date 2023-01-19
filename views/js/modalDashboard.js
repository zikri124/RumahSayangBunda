$(function () {
  //Take the data from the TR during the event button
  $("table").on("click", "label.mulaiDashboard", function (ele) {
    //the <tr> variable is use to set the parentNode from "ele
    var tr = ele.target.parentNode.parentNode;

    //I get the value from the cells (td) using the parentNode (var tr)
    var name = tr.cells[1].textContent;
    var layanan = tr.cells[2].textContent;
    var status = tr.cells[3].textContent;
    var tanggal_reservasi = tr.cells[4].textContent;
    var waktu = tr.cells[5].textContent;
    var tanggal_lahir = tr.cells[6].textContent;

    //Prefill the fields with the gathered information
    $("#name").val(name);
    $("#layanan").val(layanan);
    $("#status").val(status);
    $("#tanggal_reservasi").val(tanggal_reservasi);
    $("#waktu").val(waktu);
    $("#tanggal_lahir").val(tanggal_lahir);
  });
});
