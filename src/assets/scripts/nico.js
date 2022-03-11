import { Chart, registerables } from "chart.js";
Chart.register(...registerables);
import json from "../data/objets-trouves-restitution-nicolas.json";
import randomColor from "./utils/randomColor";

// Récupérer les années pour les mettre en abscisses sur le chart
const getLabels = () => {
  let labels = [];
  fetch(
    "https://data.sncf.com/api/records/1.0/search/?dataset=objets-trouves-restitution&q=&lang=fr&rows=2000&sort=gc_obo_type_c&facet=date&facet=gc_obo_date_heure_restitution_c&facet=gc_obo_gare_origine_r_name&facet=gc_obo_nature_c&facet=gc_obo_type_c&facet=gc_obo_nom_recordtype_sc_c&refine.gc_obo_gare_origine_r_name=Agen"
  )
    .then((res) => res.json())
    .then((data) => {
      data.facet_groups[0].facets.map((item) => {
        labels.push(item.name);
      });
    });
  return labels;
};

/* format des données souhaité :
  data = [{
    object: "Pièces d'identités et papiers personnels",
    count: {
      2014: 120,
      2015: 34,
      ...
    },
    ...
  ]
*/

const getData = () => {
  // initie data avec 1 élément pour lancer la boucle foreach
  let data = [
    {
      object: "Pièces d'identités et papiers personnels",
      count: {
        2019: 0,
      },
    },
  ];
  let isInData;
  let date;
  json.forEach((item) => {
    isInData = false;
    data.forEach((row, index) => {
      // si data contient une propriété object de même valeur
      if (row.object === item.fields.gc_obo_type_c) {
        // récupère l'année uniquement (donnée sous la forme : "2019-08-27T10:17:58+02:00")
        // transforme la date pour récupérer uniquement l'année
        date = item.fields.date.split("-")[0];
        // si count de data contient la propriété liée à l'année
        if (row.count.hasOwnProperty(date)) {
          row.count[date] += 1;
          isInData = true;
        } else {
          // sinon l'ajoute manuellement et lui attribut 1
          data[index].count[date] = 1;
          isInData = true;
        }
      }
      // si la donnée n'est pas dans data, l'ajoute dans data
      if (!isInData && index === data.length - 1) {
        data.push({ object: item.fields.gc_obo_type_c, count: { date: 1 } });
      }
    });
  });
  return data;
};

const labels = getLabels();
// récupère les années
const [data] = await Promise.all([getData()]);
// récupère les data
console.log(data);

// associe les labels et data pour ChartJS
const datasets = {
  labels: labels,
  datasets: data.map((item) => {
    return {
      label: item.object,
      data: Object.values(item.count),
      borderColor: randomColor(),
      borderWidth: 1,
    };
  }),
};

const createChart = (data, type) => {
  // crée un graphique
  const chartContainer = document.getElementById("chart");
  const ctx = document.createElement("canvas");
  ctx.id = "myChart";
  ctx.getContext("2d");
  chartContainer.appendChild(ctx);
  console.log(chartContainer);
  const MyChart = new Chart(ctx, {
    type: type,
    data: data,
  });
  return MyChart;
};
const [MyChart] = await Promise.all([createChart(datasets, "line")]);

const removeChart = () => {
  // enlève le graphique
  const chart = document.getElementById("myChart");
  const chartContainer = document.getElementById("chart");
  chartContainer.removeChild(chart);
};

const changeChartBtn = document.getElementById("change-chart");

function changeChart(chartSelect) {
  // change le graphique en fonction de la valeur du select
  console.log(chartSelect.value);
  removeChart();
  createChart(datasets, chartSelect.value);
}

changeChartBtn.addEventListener("click", () => {
  // change le graphique au click
  const chartSelect = document.getElementById("charts-select");
  changeChart(chartSelect);
});

// Update le chart pour le faire apparaître une fois que les données sont récupérés
setTimeout(function () {
  MyChart.update();
}, 3000);
