import * as d3 from 'd3'

  const margin = { top: 30, left: 50, right: 100, bottom: 30 }
  const height = 500 - margin.top - margin.bottom
  const width = 900 - margin.left - margin.right

  const svg = d3
    .select('#scatter')
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const colorScale = d3
  .scaleOrdinal()
  .range([
        '#ffffb2',
        '#fed976',
        '#feb24c',
        '#fd8d3c',
        '#f03b20',
        '#983530'
  ])

const xPositionScale = d3.scalePoint().range([0, width])

var yPositionScale = d3
  .scaleLinear()
  .domain([0, 300])
  .range([height, 0])


d3.csv(require('./data/era_classification_completed.csv'))
    .then(ready)
    .catch(function(err) {
      console.log('Failed with', err)
    })

function ready(datapoints) {
  console.log(datapoints)

  datapoints.forEach(d => {
    d.values = +d.values
  })

  var nested = d3
    .nest()
    .key(function(d) {
      return d.era_order
    })
    .entries(datapoints)

  // console.log('nested data look like', nested)

  // nest data by classification
  var nested_type = d3
    .nest()
    .key(function(d) {
      return d.classification_en
    })
    .entries(datapoints)

  // console.log('nested classification look like', nested_type)

  const eras = nested.map(function(d) {
      return + d.key
    })
  xPositionScale.domain(eras)
  // // console.log(eras)

  // console.log('nested data looks like', nested)


  svg
   .selectAll('.circle')
   .data(nested)
   .enter()
   .append('g')
   .attr('class', 'relic-dot')  
   .each(function(d) {
      var g = d3.select(this)
      // console.log('Group is', d)
      let datapoints = d.values

      console.log(datapoints)

      g.selectAll('.relic-dot')
      .data(datapoints)
      .enter()
      .append('rect')
       .attr('width', 6)
       .attr('height', 6)
       .attr('x', d=> xPositionScale(d.era_order))
       .attr('y', d=> yPositionScale(d.values))
       .attr('fill', d=> colorScale(d.classification))

  // replace era with labels
  // svg
  //  .selectAll('.era-label')
  //  .data(labels)
  //  .enter()
  //  .append('text')
  //  .text(d=> {
  //   console.log('labels are', d)
  //    return d
  //  })
  //  .attr('y', yPositionScale(0))
  
  // legend part
  let legend = svg.append('g').attr('transform', 'translate(10, 0)')

  legend
    .selectAll('.legend-entry')
    .data(nested_type)
    .enter()
    .append('g')
    .attr('transform', (d, i) => `translate(0,${i * 25})`)
    .attr('class', 'legend-entry')
    .each(function(d) {
      let g = d3.select(this)
      // let datapoints = d.values
      // console.log(datapoints[0])

      g.append('rect')
        .attr('x', 10)
        .attr('y', 0)
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', colorScale(d.key))

      g.append('text')
        .text(d.key)
        .attr('x', 15)
        .attr('y', 5)
        .attr('dx', 17)
        .attr('font-size', 10)
        .attr('fill', 'black')
        .attr('alignment-baseline', 'middle')
    })



  /* Set up axes */
  var xAxis = d3.axisBottom(xPositionScale)
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  var yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)

   }) 
}

