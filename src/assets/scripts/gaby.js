let objets_redistribues = [];

function IsSpentOneMonth(date1, date2)
{
    let time_difference = date2.getTime() - date1.getTime();
    let days_difference = time_difference / (1000 * 60 * 60 * 24);
    return days_difference >= 10;
}

// Noms des gares et frequentation
fetch("https://ressources.data.sncf.com/api/records/1.0/search/?dataset=objets-trouves-restitution&q=&rows=3000&sort=date").then(response => response.text())
.then(raw => {
    const data = JSON.parse(raw);
    for (let i = 0; i < data.records.length; i++) {
        const record = data.records[i].fields;

        if(typeof record.gc_obo_date_heure_restitution_c === 'undefined')
        {
            objets_redistribues[i] = {
                nom_gare: record.gc_obo_gare_origine_r_name,
                date_perte: record.date,
                redistribue: IsSpentOneMonth(new Date(record.date), new Date(Date.now()))
            };
        }
    }

    console.log(objets_redistribues);
})
.catch(error => console.log(error));

// Visualize datas with Char.js
/*
const ctx = document.getElementById('chart').getContext('2d');
const data = {
    labels: frequentation,
    datasets: [{
    label: "Objets trouvés",
    data: frequentation,
    fill: false,
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
    }]
};

const chart = new Chart(ctx, {
    type: 'line',
    data: data
});




// Trash code
let tableau2 = [];
for (let i = 0; i < 10; i++) {
    let occur = -1;
    for(let y = 0; y < tableau2.length; y++){
        if(tableau2[y].nom_gare === objets[i]) {
            occur = y;
        }
    }

    if(occur == -1) {
        tableau2[tableau2.length] = {
            gare_nom: objets[i],
            count: 1
        }
    }
    else {
        tableau2[y].count++;
    }
}

console.log(tableau2);
*/