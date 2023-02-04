let dataAppoinment = [];
for (let i = 8; i > 1; i--) {
  var element = document.getElementsByName("totalAppoinment" + i)[0];
  let valueAppoinment = element.childNodes[0].nodeValue;
  let valueInt = parseInt(valueAppoinment);
  dataAppoinment.push(valueInt);
}
console.log(dataAppoinment[0]);

let dataDay = [];
for (let i = 8; i > 1; i--) {
  var element = document.getElementsByName("date" + i)[0];
  let value = element.childNodes[0].nodeValue;
  let valueDayString = getDayName(value);
  dataDay.push(valueDayString);
}

function getDayName(dateStr) {
  var date = new Date(dateStr);
  return date.toLocaleDateString("in-IN", { weekday: "long" });
}

var options = {
  chart: {
    type: "bar",
  },
  colors: ["#EC4899"],
  series: [
    {
      name: "pengunjung",
      data: [dataAppoinment[6], dataAppoinment[5], dataAppoinment[4], dataAppoinment[3], dataAppoinment[2], dataAppoinment[1], dataAppoinment[0]],
    },
  ],
  xaxis: {
    categories: [dataDay[6], dataDay[5], dataDay[4], dataDay[3], dataDay[2], dataDay[1], dataDay[0]],
  },
  yaxis: {
    title: {
      text: "Jumlah Pengunjung",
    },
  },
};

var chart = new ApexCharts(document.querySelector("#chart"), options);

chart.render();
