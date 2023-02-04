var max_fields = 100;
var wrapper = $(".input_fields_wrap");
var doneWrapper = $(".done_fields");
var add_button = $(".add_field_button");
var done_button = $(".done_button");
let i = 0;
let check = true;

$(add_button).click(function (e) {
  e.preventDefault();
  var total_fields = wrapper[0].childNodes.length;
  i++;
  if (check && total_fields < max_fields) {
    $(wrapper).append(
      `<div class="card lg:w-96 bg-base-100 shadow-2xl mb-4 w-72">
         <div class="card-body">
           <div class="card-actions justify-end -mt-6 -mb-8">
             <button class="btn btn-square btn-sm remove_field_button bg-pink-500 border-none hover:bg-pink-900" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
             </div>
             <label class="label w-24"> Deskripsi </label>
             <input name=${"chargeDesc" + i} type="text" placeholder="Ketik Disini" class="input input-bordered w-full max-w-xs"/>
             <label class="label"> Biaya </label>
             <input name=${"addCharge" + i} type="text" placeholder="Ketik Disini" class="input input-bordered w-full max-w-xs amount"/>
             </div>
      </div>`
    );
  }
});

// $(remove_button).click(function (e) {
//   e.preventDefault();
//   var total_fields = wrapper[0].childNodes.length;
//   if (total_fields > 1) {
//     wrapper[0].childNodes[total_fields - 1].remove();
//     console.log("hapus");
//   }
// });

$(done_button).click(function (e) {
  e.preventDefault();
  var total_fields_done = doneWrapper[0].childNodes.length;
  if (total_fields_done < 1) {
    $(doneWrapper).append(
      `<input value=${i} name="nCharge" type="text" placeholder="Ketik Disini" class="input hidden input-bordered w-full max-w-xs"/>`,
      `<button class="btn btn-md max-w-md btn-wide mt-4 bg-pink-500 border-none hover:bg-pink-900"  type="submit"><a href=uri>Submit</a></button>`
    );
    check = false;
  }
});

$(document).ready(function () {
  //===== delete the form fieed row
  $("body").on("click", ".remove_field_button", function () {
    var total_fields = wrapper[0].childNodes.length;
    if (total_fields > 0 && check) {
      wrapper[0].childNodes[total_fields - 1].remove();
      console.log("success");
    }
  });
});

$(document).on("change", ".amount", function () {
  var sum = Number($(".hargaService").val());
  $(".amount").each(function () {
    sum += Number($(this).val());
  });
  $(".total").val(sum);
});

// var total_amount = function () {
//   var sum = 0;

//   $(".amount").each(function () {
//     var num = $(this).val();

//     if (num != 0) {
//       sum += parseFloat(num);
//     }
//   });

//   $("#total_amount").val(sum.toFixed(2));
// };

// $(".amount").keyup(function () {
//   total_amount();
// });
