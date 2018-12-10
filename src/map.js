import * as d3 from 'd3'
import * as topojson from 'topojson'


  let margin = { top: 20, left: 80, right: -12, bottom: 20 }

  let height = 500 - margin.top - margin.bottom
  let width = 800 - margin.left - margin.right

  let svg = d3.select('#map_chart')
      .append('svg')
      .attr('height', height + margin.top + margin.bottom)
      .attr('width', width + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)

  let projection = d3.geoMercator()
  let path = d3.geoPath().projection(projection)


  // const colorScale = d3
  //   .scaleOrdinal()
  //   .range([
  //         '#ffffb2',
  //         '#fed976',
  //         '#feb24c',
  //         '#fd8d3c',
  //         '#f03b20',
  //         '#983530'
  //   ])
  // var colorScale = d3.scaleOrdinal()
  // .range(d3.schemeBrBG)

  var radiusScale = d3
    .scaleSqrt()
    .domain([10, 300])
    .range([1, 3.5])

  var div = d3
    .select('body')
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0)

  let xPositionScale = d3.scaleLinear().domain([0, 300]).range([0, width])
  let yPositionScale = d3.scaleBand().range([0, height]).padding(0.2)

  Promise.all([
    d3.json(require('./data/china_shapefile.topojson')),
    d3.csv(require('./data/province_region.csv')),
    d3.csv(require('./data/architecture_completed.csv'))
  ])
    .then(ready)
    .catch(err => console.log('Failed on', err))

  function ready([json, datapoints_number, datapoints_points]) {
    // console.log(json.objects)

  var nested_region = d3.nest()
     .key(d => d.region)
     .entries(datapoints_number)
  // console.log('nested region data look like', nested_region)

  // MAP PART
  var mapGroup = svg.append('g').attr('id', 'map').attr('transform', 'translate(-80, 0)')
  var nested_era = d3.nest()
      .key(d=> d.era_replace)
      .entries(datapoints_points)

  let mainland = topojson.feature(json, json.objects.CHN_adm1)
  let hk = topojson.feature(json, json.objects.HKG_adm1)
  let mc = topojson.feature(json, json.objects.MAC_adm1)
  let taiwan = topojson.feature(json, json.objects.TWN_adm1)

  // console.log(mainland.features)

  projection.fitSize([width, height], mainland)

  var north = ['Beijing', 'Tianjin', 'Hebei','Shanxi', 'Nei Mongol']
  var northEast = ['Liaoning', 'Jilin', 'Heilongjiang']
  var east = ['Shanghai', 'Jiangsu', 'Zhejiang','Anhui', 'Fujian', 'Jiangxi', 'Shandong']
  var southCentral = ['Henan', 'Hubei', 'Guangdong', 'Guangxi', 'Hainan', 'Hunan']
  var southWest = ['Chongqing', 'Sichuan', 'Guizhou', 'Yunnan', 'Xizang']
  var northWest = ['Shaanxi', 'Gansu', 'Ningxia Hui', 'Xinjiang Uygur','Qinghai']

  mapGroup
    .append('g')
    .selectAll('.mainland')
    .data(mainland.features)
    .enter()
    .append('path')
    .attr('class', 'mainland')
    .attr('id', function(d, i) {
      return 'province' + i
    })
    .attr('d', path)
    .attr('fill', d=> {
      // console.log(d)
      if (north.indexOf(d.properties.NAME_1) !== -1 ) {
        return '#ffffb2'
      } else if (northEast.indexOf(d.properties.NAME_1) !== -1 ) {
        return '#fed976'
      } else if (east.indexOf(d.properties.NAME_1) !== -1 ) {
        return '#feb24c'
      } else if (southCentral.indexOf(d.properties.NAME_1) !== -1 ) {
        return '#fd8d3c'
      } else if (southWest.indexOf(d.properties.NAME_1) !== -1 ) {
        return '#f03b20'
      } else if (northWest.indexOf(d.properties.NAME_1) !== -1 ) {
        return '#983530'
      }
    })
    .attr('opacity', 0.9)
    .attr('stroke', 'white')
    .attr('stroke-width', 0.1)
    .on('mousemove', function(d) {
      var provinceName = d.properties['NAME_1']
      div
        .html(provinceName)
        .style('left', d3.event.pageX + 'px')
        .style('top', d3.event.pageY - 28 + 'px')
        .style('display', 'block')
    })
    .on('mouseover', function(d, i) {
       var provinceName = d.properties['NAME_1']
      div
        .transition()
        .duration(200)
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .style('opacity', 1) 
      div
        .html(provinceName)
        .style('left', d3.event.pageX + 'px')
        .style('top', d3.event.pageY - 28 + 'px')
      d3.select('#province' + i)
        .transition()  
        .attr('opacity', 1)
      d3.selectAll('.mainland').attr('opacity', '0.3')
    })
    .on('mouseout', function(d, i) {
      div
        .transition()
        .duration(200)
        .style('opacity', 0)
      d3.selectAll('.mainland').attr('opacity', '1')
        .attr('fill', d=> {
          // console.log(d)
          if (north.indexOf(d.properties.NAME_1) !== -1 ) {
            return '#ffffb2'
          } else if (northEast.indexOf(d.properties.NAME_1) !== -1 ) {
            return '#fed976'
          } else if (east.indexOf(d.properties.NAME_1) !== -1 ) {
            return '#feb24c'
          } else if (southCentral.indexOf(d.properties.NAME_1) !== -1 ) {
            return '#fd8d3c'
          } else if (southWest.indexOf(d.properties.NAME_1) !== -1 ) {
            return '#f03b20'
          } else if (northWest.indexOf(d.properties.NAME_1) !== -1 ) {
            return '#983530'
          }
        })
    })
  mapGroup
    .append('g')
    .selectAll('.taiwan')
    .data(taiwan.features)
    .enter()
    .append('path')
    .attr('class', 'taiwan')
    .attr('d', path)
    .attr('fill', '#E0E0E0')
    .attr('stroke', 'white')
    .attr('stroke-width', 0.1)

  mapGroup
    .append('g')
    .selectAll('.mc')
    .data(mc.features)
    .enter()
    .append('path')
    .attr('class', 'mc')
    .attr('d', path)
    .attr('fill', '#E0E0E0')

  mapGroup
    .append('g')
    .selectAll('.hk')
    .data(hk.features)
    .enter()
    .append('path')
    .attr('class', 'hk')
    .attr('d', path)
    .attr('fill', '#E0E0E0')

  mapGroup
    .append('g')
    .selectAll('.province-label')
    .data(mainland.features)
    .enter()
    .append('text')
    .attr('class', 'province-label')
    .text(d => d.properties.NAME_1)
    .attr('transform', d => {
      // hey d3, find the middle of this shape
      // d3.geoCentroid(d)
      let coords = projection(d3.geoCentroid(d))
      return `translate(${coords})`
    })
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('font-size', 10)
    .attr('opacity', 0)

//draw circle on the map
  mapGroup
    .append('g')
    .selectAll('.relics')
    .data(datapoints_points)
    .enter()
    .append('circle')
    .attr('class', 'relics')
    .attr('r', 2) 
    .attr('opacity', 0.6)
    .attr('fill', '#4f2925')
    .attr('transform', d => {
      let coords = projection([d.longitude, d.latitude])
      return `translate(${coords})`
    })   

// BAR PART
// GROUP BY province and get the relics number for each province
  var nested_province = d3.nest()
    .key(d => d.province_en)
    .rollup(values => d3.sum(values, d => d.number))
    .entries(datapoints_number)

  // console.log('nested_province', nested_province)

  var provinces = nested_province.map(d => d.key)
  // console.log('provinces', provinces)

  yPositionScale.domain(provinces)

  var barsGroup = svg.append('g').attr('id', 'bars')


  barsGroup.selectAll('.bar')
      .data(nested_province)
      .enter().append('rect')
      .attr('class', d => {
        // give 'coal' a class of 'coal'
        // give 'nuclear power' a class of 'nuclear-power'
        return d.key.toLowerCase().replace(' ','')
      })
      .classed('bar', true)
      .attr('x', 0)
      .attr('y', d => yPositionScale(d.key))
      .attr('width', 0)
      .attr('height', yPositionScale.bandwidth())
      .attr('fill', '#c04033')


  d3.select('#show-province').on('click', () => {
    // Move the powerplants to where the bars start
      svg.selectAll('.relics')
        .transition()
        .duration(1000)
        .attr('transform', d => {
          var yPosition = yPositionScale(d.province_en) + yPositionScale.bandwidth() / 2
          // console.log(d.province_en)
          return `translate(80,${yPosition})`
        })
        .transition()
        .attr('opacity', 0)

      // Show the bars
      barsGroup
        .transition()
        .duration(1500)
        .style('opacity', '1')

      // Grow the bars
      svg.selectAll('.bar')
        .transition()
        .delay(1000) // delay until the dots are in place
        .duration(1500)
        .attr('width', d => xPositionScale(d.value))
  
      mapGroup
        .transition()
        .duration(1500)
        .style('opacity', '0')
        .style('pointer-events', 'none')

  // LEGEND
    var labelGroup = svg.append('g').attr('id', 'region-legend')
    
    labelGroup
      .selectAll('.region-legend')
      .data(nested_region)
      .enter()
      .append('circle')
      .attr('transform', (d, i) => `translate(0,${i * 20})`)
      .attr('class', 'region-legend')
      .each(function(d) {
        let g = d3.select(this)

        g.append('text')
          .text(d.key)
          .attr('x', 15)
          .attr('y', 5)
          .attr('dx', 17)
          .attr('font-size', 10)
          .attr('fill', 'black')
          .attr('alignment-baseline', 'middle')

        g.append('rect')
          .attr('x', 15)
          .attr('y', 5)
          .attr('width', 6)
          .attr('height', 0)
          .attr('fill', 'black')
    })
  })

  //BUTTON PART
  d3.selectAll('#draw-map').on('click', ()=> {
      barsGroup
        .transition()
        .duration(300)
        .style('opacity', '0') 

      mapGroup
        .transition()
        .style('opacity', '0.9')  
        .style('pointer-events', 'auto') 

      svg
        .selectAll('.relics')
        .transition()
        .duration(300)
        .attr('transform', d => {
            let coords = projection([d.longitude, d.latitude])
            return `translate(${coords})`
        })  
        .transition()
        .attr('opacity', 1) 


      svg
        .selectAll('.province-label')
        .transition()
        .duration(200)
        .attr('opacity', 0) 
  })



  d3.selectAll('#draw-map-region').on('click', ()=> {
      barsGroup
        .transition()
        .duration(1500)
        .style('opacity', '0')

      mapGroup
        .transition()
        .duration(1500)
        .style('opacity', '1')
        .style('pointer-events', 'none')

      svg
        .selectAll('.relics')
        .transition()
        .duration(200)
        .attr('transform', d => {
            let coords = projection([d.longitude, d.latitude])
            return `translate(${coords})`
        })  
        .attr('opacity', 0) 

      svg
        .selectAll('.province-label')
        .transition()
        .duration(200)
        .attr('opacity', 1) 



  })

    const xAxis = d3.axisBottom(xPositionScale)
    barsGroup
      .append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)

    const yAxis = d3.axisLeft(yPositionScale)
    barsGroup
      .append('g')
      .attr('class', 'axis y-axis')
      .call(yAxis)

    barsGroup.style('opacity', '0')
}

  function topFunction() {
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
          location.reload()
      }

d3.select('#myBtn').on('click', topFunction)