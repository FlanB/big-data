let data = "https://ressources.data.sncf.com/api/records/1.0/search/?dataset=objets-trouves-restitution&q=&rows=1000&sort=date&facet=gc_obo_date_heure_restitution_c&facet=gc_obo_type_c&facet=gc_obo_nature_c"
//créer les contextes pour les graphiques
const ctx = document.getElementById("myChart").getContext("2d")
const ctx2 = document.getElementById("myChart2").getContext("2d")

// récupérer les données de l'API de SNCF
fetch(data).then(res => res.json()).then(res => {
    // enlève le loader
    document.querySelector("#loading").style.display = "none"
    // affiche toutes les données récupérées
    console.log(res)
    let zoom = false
    let labels = res.facet_groups[1].facets.map(item => item.name)
    let data = res.facet_groups[1].facets.map(item => item.count)
    let recoveredItems = res.records.filter(item => item.fields.gc_obo_date_heure_restitution_c != null)

    // créer le premier graphique
    const chart = new Chart(ctx, {
        type: "bar", data: {
            labels: labels, datasets: [{
                label: "Nombre d'objets perdus selon le type et la nature",
                data: data,
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1
            }]
        }, options: {
            // récupérer les données de l'item cliqué
            onClick: (e, index) => {
                // détecter si on clique sur le graphique
                if (index.length) {
                    // détecter si le graphique est zoomé
                    if (zoom) {
                        //le graphique est dézoomé
                        chart.data.labels = labels
                        chart.data.datasets[0].data = data
                        chart.update()
                    } else {
                        // le graphique est zoomé
                        const registrable = chart.data.labels
                        // vider le tableau
                        chart.data.labels = []
                        // récupère les objets qui correspondent au type clické
                        res.records.filter(item => item.fields.gc_obo_type_c === registrable[index[0].index])
                            .forEach(item => {
                                //insérer les labels des objets filter dans le tableau
                                chart.data.labels = [...chart.data.labels, item.fields.gc_obo_nature_c]
                            })
                        //supprimer les doublons
                        chart.data.labels = [...new Set(chart.data.labels)]
                        // associer les données aux labels
                        chart.data.datasets[0].data = chart.data.labels.map(label => {
                            return res.facet_groups[2].facets.filter(item => item.name === label)[0] ? res.facet_groups[2].facets.filter(item => item.name === label)[0]?.count : 0

                        })
                        chart.update()
                    }
                    zoom = !zoom
                }
            }, scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })
    new Chart(ctx2, {
        type: "doughnut", data: {
            labels: ["Objets perdus (%)", "Objets retrouvés (%)"], datasets: [{
                label: "Nombre d'objets trouvés (en %)",
                data: [(res.records.length - recoveredItems.length) * 100 / res.records.length, recoveredItems.length * 100 / res.records.length],
                backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"],
                borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
                borderWidth: 1
            }]

        }
    })
})