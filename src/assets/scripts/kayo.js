import Chart from 'chart.js/auto';

const year = document.getElementById("year-select").value;

let final_entries = [];
let frequentation_gares = [];

function DrawChart()
{
    const ctx = document.getElementById("chart").getContext('2d');
    
    let gares = [];
    let nb_objets_perdus = [];
    final_entries.forEach(entry => {
        gares.push(entry.nom_gare);
        nb_objets_perdus.push(entry.frequentation/entry.pertes_objets);

    });

    const set = {
        labels: gares,
        datasets: [{
            label: "Nombre d'objets perdus",
            data: nb_objets_perdus,
            fill: false,
            backgroundColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };

    const chart = new Chart(ctx, {
        type: 'pie',
        data: set
    });
}

fetch("https://ressources.data.sncf.com/api/records/1.0/search/?dataset=frequentation-gares&q=&rows=2900").then(response => response.text())
.then(raw => {
    const data = JSON.parse(raw);

    for(let i = 0; i < data.records.length; i++)
    {
        const item = data.records[i].fields;

        frequentation_gares[i] = {
            nom_gare: item.nom_gare,
            frequentation: item["total_voyageurs_"+year]
        }
    }

    Next();
});

function Next()
{
    console.log("Next");

    fetch("https://ressources.data.sncf.com/api/records/1.0/search/?dataset=objets-trouves-restitution&q=&rows=10&sort=date&facet=gc_obo_gare_origine_r_name&refine.date=" + year + "&exclude.count=0").then(response => response.text())
    .then(raw => {
        const data = JSON.parse(raw);

        data.facet_groups["0"].facets.forEach(set => {
            frequentation_gares.forEach(entry => {
                if(set.count > 0 && entry.nom_gare === set.name)
                {
                    if(final_entries.length < 20) {
                        final_entries.push({
                            nom_gare: entry.nom_gare,
                            frequentation: entry.frequentation,
                            pertes_objets: set.count
                        });
                    }
                }
            });
        });

        console.log(final_entries);
        DrawChart();
    });
}
