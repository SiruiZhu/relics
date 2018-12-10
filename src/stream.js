import * as d3 from 'd3'

const margin = { top: 20, left: 30, right: 20, bottom: 30 }
const height = 500 - margin.top - margin.bottom
const width = 900- margin.left - margin.right

const svg = d3
  .select('#stream')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Normal scales
const xPositionScale = d3
  .scaleLinear()
  .domain([-1900, 2018])
  .range([0, width])

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
const yPositionScale = d3
  .scaleLinear()
  .domain([0, 100])
  .range([height, 0])

const area = d3
  .area()
  .x(d => {
    return xPositionScale(d.data.era_year)
  })
  .y0(d => {
    return yPositionScale(d[0])
  })
  .y1(d => {
    // console.log(d)
    return yPositionScale(d[1])
  })
  .curve(d3.curveBasis)

var div = d3
  .select('body')
  .append('div')
  .attr('class', 'tooltip')
  .style('opacity', 0)

var lines = [-1900, -1500, -1000, -500, 1, 500, 1000, 1500, 1900]

  Promise.all([
    d3.csv(require('./data/era_classification_pct_completed.csv')),
    d3.csv(require('./data/architecture_completed.csv'))
  ])
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

function ready([datapoints, datapoints_all]) {
  // console.log('Datapoints look like', datapoints)
  console.log('Datapoints_all look like', datapoints_all)

  datapoints.forEach(d => {
    d.era_order = + d.era_order
    d.number_pct = + d.number_pct
    d.era_year = + d.era_year
  })

  const years = datapoints.map(function(d) {
    return d.era_year
  })
  // console.log(years)

  const wide = d3
    .nest()
    .key(d => d.era_year)
    .rollup(rows => {
      var d = {}
      d.era_year = rows[0].era_year
      rows.forEach(row => d[row.classification_en] = row.number_pct)
      return d
    })
    .entries(datapoints)
    .map(d => d.value) 


  wide.sort(function (a, b) {
    return a.era_year - b.era_year
  })
  // console.log(wide)
  
  var nested_type = d3
    .nest()
    .key(function(d) {
      return d.classification_en
    })
    .entries(datapoints)

  console.log('nested classification look like', nested_type)


  // TODO add an offset
  var keys = Object.keys(wide[0]).filter(col => col !== 'era_year')
  console.log(keys)

  var stack = d3.stack()
    .keys(keys)
    .order(d3.stackOrderDescending)  
    .offset(d3.stackOffsetSilhouette)

  // TODO stack them
  var layers = stack(wide)

  // TODO change the domain for the streamgraph
  yPositionScale.domain([
    d3.min(layers, layer => d3.min(layer, d => d[0])),
    d3.max(layers, layer => d3.max(layer, d => d[1]))
  ])

  console.log('All datapoints are', datapoints_all)


  svg
    .selectAll('path')
    .data(layers)
    .enter()
    .append('path')
    .attr('class', 'relics')
    .attr('fill', d => colorScale(d.key))
    .attr('stroke', d => colorScale(d.key))
    .attr('id', function(d, i) {
      return 'relic' + i
    })
    .attr('d', function(d) {
      // hey magic line function
      // I'm going to give you a bunch of data now
      // console.log(d)
      return area(d)
    })
    .on('mousemove', function(d) {
      div
        .html(d.key)
        .style('left', d3.event.pageX + 'px')
        .style('top', d3.event.pageY - 28 + 'px')
        .style('display', 'block')
    })
    .on('mouseover', function(d, i) {
       div
        .transition()
        .duration(200)
        .style('opacity', 1) 
      div
        .html(d.key)
        .style('left', d3.event.pageX + 'px')
        .style('top', d3.event.pageY - 28 + 'px')
      d3.select('#relic' + i)
        .transition()  
        .attr('opacity', 1)
      d3.selectAll('.relics').attr('opacity', '0.2')
      // d3.selectAll('.relics').attr('opacity', '0.5')
      // d3.select(this).attr('opacity', 1)
    })
    .on('mouseout', function(d, i) {
      div
        .transition()
        .duration(200)
        .style('opacity', 0)
      d3.selectAll('.relics').attr('opacity', '1').attr('fill', d => colorScale(d.key))
    })

//filter datapoints_all to only the first batch and architecture.
  var datapoints_filtered = datapoints_all.filter(d=> d.batch === '第一批'&& d.classification === '古建筑')  

//stack for dotplot
  var nested_year = d3
    .nest()
    .key(function(d) {
      return +d.era_year
    })
    .entries(datapoints_filtered)

  console.log('Datapoints_all nested year look like', nested_year)

    svg
       .selectAll('.circles-group')
       .data(nested_year)
       .enter()
       .append('g')
       .attr('class', 'circles-group')
       .each(function(d) {
         var g = d3.select(this)
         var datapoints = d.values  
         // console.log(datapoints) 
          g
          .selectAll('.circles')
          .data(datapoints)   
          .enter()
          .append('circle') 
          .attr('class', d=> {
            console.log(d.name_en.replace(' ', '-').toLowerCase())
            return d.name_en.replace(' ', '-').toLowerCase()
            })
          .classed('circles', true)
          .classed('firstbatch', d => {
              if (d.batch === '第一批' && d.classification === '古建筑') {
                  return true
                }
            })     
         .attr('r', 4)
         .attr('cx', xPositionScale(d.key))
         .attr('cy', (d,i) => {
           return (height/2 - i * 8)
         })
         .attr('fill', '#942121') 
       }) 
       .style('visibility', 'hidden')

    svg
       .append('circle')
       .attr('class', 'image')
       .attr('r', 60)
       .attr('cx', xPositionScale(700))
       .attr('cy', 60)
       .attr('fill', 'red')
       .style('visibility', 'hidden')

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
          g.append('rect')
            .attr('x', 10)
            .attr('y', 0)
            .attr('width', 6)
            .attr('height', 6)
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

// year reference
      svg
        .append('text')
        .text('Year in CE')
        .attr('x', xPositionScale(0))
        .attr('y', height+20)
        .attr('font-size', 11)
        .attr('fill', 'black')
        .attr('font-weight', 500)
        .attr('text-anchor','start')
        .attr('dx', '5px')

      svg
        .append('text')
        .text('Year in BC')
        .attr('x', xPositionScale(0))
        .attr('y', height+20)
        .attr('font-size', 11)
        .attr('fill', 'black')
        .attr('font-weight', 500)
        .attr('text-anchor','end')
        .attr('dx', '-5px')

//* axes part *//
      var years2 = d3.nest().key(d => d).entries(years).map(d => d.key)

      var xAxis = d3.axisBottom(xPositionScale)
           .tickValues(lines)
           .tickSize(-height)
           .tickFormat(d3.format("d"))
          //  .tickFormat(function(d,i){ 
          //   console.log('d is', d, 'i is', i)
          //   return tickLabels[i]
          // })

      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)

      svg
        .selectAll('x-axis')
        .style("text-anchor", "middle")

      svg
        .selectAll('.x-axis line')
        .attr('stroke-dasharray', '3 3')
        .attr('stroke-linecap', 'round')
        .attr('stroke', '#e6e6e6')

      svg.select('.axis').lower()

      var yAxis = d3.axisLeft(yPositionScale)
                    .tickFormat(function(d) {
                      console.log(d)
                      if (d === 60 ) {
                         return d + "%"
                      } else {
                        return Math.abs(d)
                      }
                    })
      svg
        .append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis)
      svg.selectAll('.y-axis path').attr('stroke', 'none')
      svg.selectAll('.domain').remove()

 
// SCROOLLING  PART //
  d3.select('#all-line').on('stepin', ()=> {
    svg.selectAll('.forbidden-city').style('visibility', 'hidden').transition()
       .attr('cy', 0)
    svg.selectAll('.summer-palace').style('visibility', 'hidden').transition()
       .attr('cy', 0)
    svg.selectAll('.firstbatch').style('visibility', 'hidden').transition()
       .attr('cy', 0)
    svg.selectAll('.relics').style('pointer-events', 'auto')
    svg.selectAll('.image').style('visibility', 'hidden')

  })

  d3.select('#first-batch').on('stepin', ()=> {
    // console.log('I am step into first batch')
    svg.selectAll('.relics').style('pointer-events', 'none')
    svg.selectAll('.circles-group')
       .each(function(d) {
         var g = d3.select(this)
         // console.log(datapoints) 
          g
          .selectAll('.circles')
          .style('visibility', 'visible')
          .transition()
          .duration(d=> Math.random() * 1000)
          .attr('opacity', 1)
          .attr('r',4)
          .attr('cy', (d,i) => {
           return (height/2 - i * 8)
         })
          .attr('fill', '#942121')        
       }) 

    svg.selectAll('.circles')
       .on('mouseover', function (d) {
        div.transition().style('opacity', 0.9)
        div
          .html(d.name_en + '<br>' + d.era_en)
          .style('left', d3.event.pageX + 'px')
          .style('top', d3.event.pageY - 28 + 'px')    
       })
      .on('mouseout', function(d, i) {
        div.transition().style('opacity', 0)
      }) 
   })

   d3.select('#gugong').on('stepin', ()=> {
    console.log('I am step into gugong')
    // svg.selectAll('.circles').transition().style('visibility', 'hidden')
    svg.selectAll('.relics').style('pointer-events', 'none')
    // svg.selectAll('.image').style('visibility', 'visible')
   svg.selectAll('.firstbatch')
       .attr('opacity', 0)
       .attr('cy', 0)
       .transition()  
  // svg.selectAll('.summer-palace')
  //      .attr('opacity', 0)
  //      .attr('cy', 0)
  //      .transition()       

    svg.selectAll('.forbidden-city')
       .style('visibility', 'visible')
       .raise()
       .transition()
       .attr('opacity', 1)
       .attr('cy', height/2)
       .attr('fill', '#942121')
       .attr('r', 6)

    svg.selectAll('.circles')
       .on('mouseover', function (d) {
        div.transition().style('opacity', 0.9)
        div
          .html(d.name_en + '<br>' + d.era_en)
          .style('left', d3.event.pageX + 'px')
          .style('top', d3.event.pageY - 28 + 'px')    
       })
      .on('mouseout', function(d, i) {
        div.transition().style('opacity', 0)
      })         
   })

   d3.select('#changcheng').on('stepin', ()=> {
    console.log('I am step into changcheng')

    svg.selectAll('.relics').style('pointer-events', 'none')
    svg.selectAll('.firstbatch')
       .attr('opacity', 0)
       .attr('cy', 0)
       .transition()  

    svg.selectAll('.summer-palace')
       .style('visibility', 'visible')
       .raise()
       .transition()
       .attr('opacity', 1)
       .attr('cy', height/2)
       .attr('fill', '#942121')
       .attr('r', 6)


    svg.selectAll('.forbidden-city')
       .transition() 
       .attr('opacity', 0)
       .attr('cy', 0)

    svg.selectAll('.circles')
       .on('mouseover', function (d) {
        div.transition().style('opacity', 0.9)
        div
          .html(d.name_en + '<br>' + d.era_en)
          .style('left', d3.event.pageX + 'px')
          .style('top', d3.event.pageY - 28 + 'px')    
       })
      .on('mouseout', function(d, i) {
        div.transition().style('opacity', 0)
      })         
   })

  }
