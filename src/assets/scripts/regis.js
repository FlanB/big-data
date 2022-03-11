import Chart from 'chart.js/auto';

function DrawCharts(data1, data2)
{
    // Nombre de bagages abandonnés
    {
        const ctx = document.getElementById("chart1").getContext('2d');

        const set = {
            labels: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"],
            datasets: [{
                label: "Bagages abandonnés",
                data: data1,
                fill: true,
                backgroundColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        };

        const chart = new Chart(ctx, {
            type: 'line',
            data: set
        });
    }

    // Cout des interventions de déminage
    {
        const ctx = document.getElementById("chart2").getContext('2d');

        const set = {
            labels: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"],
            datasets: [{
                label: "Cout des interventions",
                data: data2,
                fill: false,
                backgroundColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        };

        const chart = new Chart(ctx, {
            type: 'bar',
            data: set
        });
    }
}

{
    let interruption_par_mois = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let cout_interruption_par_mois = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    fetch("https://ressources.data.sncf.com/api/records/1.0/search/?dataset=objets-trouves-restitution&q=&rows=10000&sort=date&refine.date=2018&refine.gc_obo_nature_c=Valise%2C+sac+sur+roulettes").then(response => response.text())
    .then(raw => {
        const data = JSON.parse(raw);
        console.log(data);

        let records = data.facet_groups[0].facets[0].facets;
        for(let i = 0; i < records.length; i++) {
            interruption_par_mois[i] = records[i].count;
            cout_interruption_par_mois[i] = records[i].count * 6500;
        }
        
        DrawCharts(interruption_par_mois, cout_interruption_par_mois);

    })
    .catch(error => console.log(error));
}