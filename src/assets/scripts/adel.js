import * as d3 from 'd3';
import * as d3Scale from 'd3-scale'
import departements from '../data/departements.json'

const data = 'https://ressources.data.sncf.com/api/records/1.0/search/?dataset=objets-trouves-restitution&q=&rows=200&facet=date'
const geoloc = 'http://api.positionstack.com/v1/forward?access_key=01fee3c0e98cbce078e2d7d9556ee68a&query='
/**
 * ce qu'il me faut:
 * data = [
 * north: {
 *     count: 100
 * },
 * south: {
 *     count: 300
 * }
 * ]
 */
let cityInfos = {}
let i = 0;
let cityNorth = {}
let citySouth = {}
let queue = []


const getFilteredData = async () =>
{


    const response = await fetch(data);
    const newData = await response.json();
    return newData;
    // newData.then((res) =>
    // {
    //

    // return {cityNorth, citySouth};
}

getFilteredData().then((res) =>
{

    const getNewData = async () =>
    {
        const city = res.records.fields.gc_obo_gare_origine_r_name;
        const response = await fetch(geoloc + city + ',%20France')
        const newData = await response.json();
        return newData;
    }

    getNewData().then(res => {
        console.log(res)
        // for (let i = 0; i < res.records.length ; i++)
        // {
        //         queue.push({
        //             cityName: res.data[0].name,
        //             longitude: res.data[0].longitude,
        //             latitude: res.data[0].latitude
        //         });
        // }
    })

    filterData();

})

const filterData = () =>
{
    console.log(queue)
}


// res.records.forEach((item) =>
// {
//
//         if (cityInfos[i].latitude > 46.3)
//         {
//             cityNorth[i] = cityInfos[i]
//             console.log(cityNorth)
//
//         }
//         //South
//         else
//         {
//             citySouth[i] = cityInfos[i]
//             console.log(citySouth)
//
//         }
//         i++
//
//     }).catch(err => console.log(err));
//
// })




    //
    //
    // const xScale = d3.scaleBand()
    //     .domain(labels)
    //     .rangeRound([0, 250])
    //     .padding(0.1);
    //
    // const yScale = d3.scaleLinear()
    //     .domain([0, 15])
    //     .range([200, 0]);
    //
    // const container = d3.select('#data')
    //     .classed('container', true);
    //
    // const bars = container
    //     .selectAll('.bar')
    //     .data(labels)
    //     .enter()
    //     .append('rect')
    //     .classed('bar', true)
    //     .attr('width', xScale.bandwidth())
    //     .attr('height', (data) => 200 - yScale(data.value))
    //     .attr('x', data => xScale(data.region))
    //     .attr('y', data => yScale(data.value));
    //
