import Chart from 'chart.js/auto';

function DrawChart(data)
{
    const ctx = document.getElementById("chart-gaby").getContext('2d');
    
    const set = {
        labels: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"],
        datasets: [{
            label: "Objets redistribués",
            data: data,
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

function IsSpentOneMonth(date)
{
    let time_difference = new Date(Date.now()) - date.getTime();
    let days_difference = time_difference / (1000 * 60 * 60 * 24);
    return days_difference >= 30;
}

function FetchData(city, year, callback)
{
    const endpoint = "https://ressources.data.sncf.com/api/records/1.0/search/?dataset=objets-trouves-restitution&q=&lang=fr&rows=10000&sort=date&refine.date=" + year + "&refine.gc_obo_gare_origine_r_name=" + city;
    
    fetch(endpoint).then(response => response.text())
    .then(raw => {
        const data = JSON.parse(raw);
        let objets_par_mois = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let debug_list = [];

        for (let i = 0; i < data.records.length; i++)
        {
            const record = data.records[i].fields;

            if(typeof record.gc_obo_date_heure_restitution_c === 'undefined') // si obj n'a pas été rendus
            {
                let date_perte = new Date(record.date);

                if(IsSpentOneMonth(date_perte)) // si obj a été perdue il y a plus d'un mois
                {
                    objets_par_mois[date_perte.getMonth()]++;

                    // for debugging
                    if(debug_list.length < 1000){
                        debug_list.push({
                            nom_gare: record.gc_obo_gare_origine_r_name,
                            date_perte: record.date,
                            nature_obj: record.gc_obo_nature_c
                        });
                    }
                }
            }
        }

        callback(objets_par_mois);
        // console.log(debug_list);
    })
    .catch(error => console.log(error));
}

const citySelect = document.getElementById("city-select-gaby");
const yearSelect = document.getElementById("year-select-gaby");

function createElem(tag, id, parent)
{
    const elem = document.createElement(tag);
    elem.id = id;

    if(parent)
        parent.appendChild(elem);

    return elem;
}

function removeElem(elem)
{
    if(elem != null)
        elem.parentNode.removeChild(elem);
}

document.getElementById("start-btn").addEventListener("click", () => {
    // Create a new canvas for next graph
    removeElem(document.getElementById("chart-gaby"));
    createElem("canvas", "chart-gaby", document.querySelector("div#gaby-canvas-container"));

    FetchData(citySelect.value, yearSelect.value, (data) => DrawChart(data));
});