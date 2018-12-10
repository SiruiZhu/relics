import * as d3 from 'd3'

const margin = { top: 20, left: 70, right: 20, bottom: 80 }
const height = 400 - margin.top - margin.bottom
const width = 900 - margin.left - margin.right

const container = d3.select('#line')
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
  .domain([0, 100])
  .range([height, 0])

var line = d3
  .line()
  .x(d => xPositionScale(d.era_order))
  .y(d => yPositionScale(d.number_pct))

d3.csv(require('./data/classification_pct_completed.csv'))
    .then(ready)
    .catch(function(err) {
      console.log('Failed with', err)
    })

function ready(datapoints) {
  // console.log(datapoints)
  datapoints.forEach(d => {
    d.number = +d.number
    d.number_pct = +d.number_pct
    d.era_order = +d.era_order
  })
  //nest data by  classification
  var nested = d3
    .nest()
    .key(function(d) {
      return d.classification_en
    })
    .entries(datapoints)

  nested.sort(function (b, a) {
    return a.key - b.key
  })
  
  //nest data by era order
  var nested_year = d3
    .nest()
    .key(function(d) {
      return d.era_order
    })
    .entries(datapoints)

  nested_year.sort(function (a, b) {
    return a.key - b.key
  })

  // console.log('Nested data look like', nested)
  // console.log('Nested year data look like', nested_year)

  const eras = nested_year.map(function(d) {
      return + d.key
    })
  xPositionScale.domain(eras)

  container
    .selectAll('.relics-graph')
    .data(nested)
    .enter()
    .append('svg')
    .attr('class', 'relics-graph')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .each(function(d) {
      var svg = d3.select(this) 
      var datapoints = d.values
      datapoints.sort(function(a, b) {
        return a.era_order - b.era_order
      })
      // console.log(d)
      svg
        .append('path')
        .datum(datapoints)
        .attr('stroke-width', 2)
        // .attr('stroke', '#980043')
        .attr('fill', 'none')
        .attr('d', line)
        .attr('stroke', function(d,i) {
          var i = 0; i < nested.length; i ++
          console.log(i)
          return colorScale(d[i].classification_en)
        })  

      //add classification label
      svg
        .append('text')
        .text(d.key)
        .attr('x', width / 2)
        .attr('y', 0)
        .attr('font-size', 14)
        .attr('dy', -10)
        .attr('text-anchor', 'middle')
        .attr('font-weight', 600)

      var ticks = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21];
      var tickLabels = [
          'Geological age',
          'Paleolithic age',
          'Neolithic',
          'Bronze Age',
          'Xia dynasty',
          'Shang dynasty',
          'Zhou dynasty',
          'Qin dynasty',
          'Han dynasty',
          'Three Kingdoms',
          'Jin dynasty',
          'Southern and Northern dynasties',
          'Sui dynasty',
          'Tang dynasty',
          'Five Dynasties and Ten Kingdoms',
          'Song dynasty',
          'Yuan dynasty',
          'Ming dynasty',
          'Qing dynasty',
          'Republic of China',  
          'Chinese People‘s Republic']

      /* Set up axes */
      var xAxis = d3.axisBottom(xPositionScale)
           .tickValues(ticks)
           .tickFormat(function(d,i){ return tickLabels[i]});
      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)
        .selectAll('text')
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-25)");

      var yAxis = d3.axisLeft(yPositionScale)
      svg
        .append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis)

    })

}