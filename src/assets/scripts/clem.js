let data = "https://ressources.data.sncf.com/api/records/1.0/search/?dataset=objets-trouves-restitution&q=&sort=gc_obo_type_c&facet=gc_obo_date_heure_restitution_c&facet=gc_obo_type_c&facet=gc_obo_nature_c"

const ctx = document.getElementById("myChart").getContext("2d")

fetch(data).then(res => res.json()).then(res => {
    console.log(res)
    let labels = res.facet_groups[1].facets.map(item => item.name)
    let data = res.facet_groups[1].facets.map(item => item.count)
    let natureLabels = res.facet_groups[2].facets.map(item => item.name)
    let natureData = res.facet_groups[2].facets.map(item => item.count)
    let recoveredItems = res.records.filter(item => item.fields.gc_obo_date_heure_restitution_c != null)
    console.log([res.records.length, recoveredItems.length])

    const chart = new Chart(ctx, {
        type: "bar", data: {
            labels: labels, datasets: [{
                label: "Nombre d'objets trouvés",
                data: data,
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1
            }]
        }, options: {
            onClick: (e, index) => {
                if (index.length) {
                    index = index[0].index
                    chart.data.labels = natureLabels
                    console.log(chart.data.datasets[0].data = natureData)
                    chart.update()
                    res.records.forEach(item => {
                        if (item.fields.gc_obo_type_c === res.facet_groups[1].facets[index].name) {
                        }
                    })
                }
            }, scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })
})
// const container = d3.select("svg").classed("container", true)
// fetch(data).then(response => response.json()).then(res => {
//     console.log(res)
//     const xScale = d3.scaleBand().domain([res.facet_groups[1].facets]).rangeRound([0, 750]).padding(0.1)
//     const yScale = d3.scaleLinear().domain([res.facet_groups[1].facets[0].count, 0]).range([750, 0])
//     let prev = 0
//
//     container
//         .selectAll()
//         .data(res.facet_groups[1].facets)
//         .enter()
//         .append("circle")
//         .classed("bar", true)
//         .attr("fill", "red")
//         .attr("r", (d) => d.count / 1000)
//         .attr("cx", (d, i) => {
//            i !== 0 ? prev += d.count / 1000 : null
//             return  prev + d.count / 1000
//         })
//         .attr("cy", d => d.count / 1000)
//         .text(d => d.name)
// }).catch(err => console.log(err))

//
// const root = pack(data)
// let focus = root
// let view
//
// const svg = d3.create("svg")
//     .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
//     .style("display", "block")
//     .style("margin", "0 -14px")
//     .style("background", color(0))
//     .style("cursor", "pointer")
//     .on("click", (event) => zoom(event, root))
//
// const node = svg.append("g")
//     .selectAll("circle")
//     .data(root.descendants().slice(1))
//     .join("circle")
//     .attr("fill", d => d.children ? color(d.depth) : "white")
//     .attr("pointer-events", d => !d.children ? "none" : null)
//     .on("mouseover", function () { d3.select(this).attr("stroke", "#000") })
//     .on("mouseout", function () { d3.select(this).attr("stroke", null) })
//     .on("click", (event, d) => focus !== d && (zoom(event, d), event.stopPropagation()))
//
// const label = svg.append("g")
//     .style("font", "10px sans-serif")
//     .attr("pointer-events", "none")
//     .attr("text-anchor", "middle")
//     .selectAll("text")
//     .data(root.descendants())
//     .join("text")
//     .style("fill-opacity", d => d.parent === root ? 1 : 0)
//     .style("display", d => d.parent === root ? "inline" : "none")
//     .text(d => d.data.name)
//
// zoomTo([root.x, root.y, root.r * 2])
//
// function zoomTo (v) {
//     const k = width / v[2]
//
//     view = v
//
//     label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`)
//     node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`)
//     node.attr("r", d => d.r * k)
// }
//
// function zoom (event, d) {
//     const focus0 = focus
//
//     focus = d
//
//     const transition = svg.transition()
//         .duration(event.altKey ? 7500 : 750)
//         .tween("zoom", d => {
//             const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2])
//             return t => zoomTo(i(t))
//         })
//
//     label
//         .filter(function (d) { return d.parent === focus || this.style.display === "inline" })
//         .transition(transition)
//         .style("fill-opacity", d => d.parent === focus ? 1 : 0)
//         .on("start", function (d) { if (d.parent === focus) this.style.display = "inline" })
//         .on("end", function (d) { if (d.parent !== focus) this.style.display = "none" })
// }
//
// return svg.node()