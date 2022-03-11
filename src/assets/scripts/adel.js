// On importe la librairie Chart.js
import {Chart, registerables} from "chart.js";

Chart.register(...registerables)

// Ici, on procède au traitement du formulaire lors du chargement de la page
// Lors du déclenchement du bouton 'submit', on passe en paramètres l'event pour l'utiliser et on déclenche une fonction
document.querySelector('#formStart').addEventListener('submit', function(e) {
   // On empêche que la page recharge lors du déclenchement de l'événement
    e.preventDefault()

    // On fait disparaître le formulaire pour faire apparaître l'article
    document.querySelector('#formStart').style.display = 'none';
    document.querySelector('.container').style.display = 'flex';

    const queriesRequested = document.querySelector('.nbQueries').value;
    // On passe en paramètres la valeur passée par l'utilisateur dans l'input
    startGraph(queriesRequested)
});

// C'est une fonction asynchrone pour pouvoir gérer correctement l'arrivée des données et l'ordre d'exécution du code
const startGraph = async (queries) =>
{
    const nbQueries = queries;

    // On stocke les liens de requêtes pour les deux différentes API
    const data =
        "https://ressources.data.sncf.com/api/records/1.0/search/?dataset=objets-trouves-restitution&q=&rows=" + nbQueries + "&facet=date";
    const geoloc =
        "http://api.positionstack.com/v1/forward?access_key=01fee3c0e98cbce078e2d7d9556ee68a&query=";
// const geoloc = "https://api-adresse.data.gouv.fr/search/?q=";

    /**
     * Modèle de ce qu'il me faut:
     * data = [
     * north: {
     *     count: 100
     * },
     * south: {
     *     count: 300
     * }
     * ]
     */

    // Dans cette fonction, on va faire une requête à l'API de SNCF pour nous retourner les data dont nous avons besoin
    const getSncfData = async () => {
        let allCities = [];
        await fetch(data)
            .then((res) => res.json())
            .then((data) =>
                // On boucle dans chacun des 'records' pour obtenir chaque nom de ville stockées dans le tableau allCities
                data.records.forEach((item) => {
                    allCities.push(item.fields.gc_obo_gare_origine_r_name);
                })
            );
        // On retourne toutes les villes obtenues
        return allCities;
    };

    const getGeolocData = async () => {
        // On établie le modèle de l'objet qu'on utilisera plus tard
        let geolocData = {
            north: 0,
            south: 0,
        };

        // On récupère toutes les villes obtenues. Grâce au 'async', on passera à la suite après avoir terminé
        const dataSncf = await getSncfData();

        let i = 0;
        // On utilise une boucle do while pour exécuter au moins une fois la boucle
        do {
            i++;

            // Ici, grâce au nom de la ville, on fait une requête à l'API PositionStack pour
            // obtenir les coordonnées (longitude, latitude) grâce au nom de la gare
            await fetch(geoloc + dataSncf[i])
                .then((res) => res.json())
                .then((data) => {
                    // Condition ternaire pour incrémenter le compteur de chaque partie de la France
                    data.data[0].latitude < 46.3
                        ? (geolocData.south += 1)
                        : (geolocData.north += 1);
                    console.log(data);
                });

            // Gestion du chargement pour l'affichage utilisateur et l'informer de l'avancement du traitement
            document.querySelector('#loading').textContent = 'Chargement : ' + Math.round((i * 100)/nbQueries) + '%'
            console.log("end await");
        } while (i < dataSncf.length);

        return geolocData;
    };

    // On récupère la data et on l'utilisera par la suite uniquement quand ce sera terminé
    const finalData = await getGeolocData();
    const ctx = document.getElementById('myChart').getContext('2d');

    // Initialisation et construction du graphe
    const myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['north', 'south'],
            datasets: [{
                label: 'france',
                data: [finalData.north, finalData.south],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,

        }
    });

    // Lorsque tout a été établi, on retire l'affichage du chargement
    document.querySelector('#loading').style.display = 'none';
    console.log(finalData);
}




