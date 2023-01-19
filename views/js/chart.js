var options = {
  chart: {
    type: "bar"
  },
  colors: ["#EC4899"],
  series: [
    {
      name: "pengunjung",
      data: [30, 40, 45, 50, 49, 60, 70]
    }
  ],
  xaxis: {
    categories: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]
  },
  yaxis: {
    title: {
      text: "Jumlah Pengunjung"
    }
  }
};

var chart = new ApexCharts(document.querySelector("#chart"), options);

chart.render();
