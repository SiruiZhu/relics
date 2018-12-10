import * as d3 from 'd3'
import fisheye from './fisheye'
import { scaleLinear, scalePow } from 'd3-scale'

let margin = { top: 60, left: 20, right: 20, bottom: 20 }

let height = 300 - margin.top - margin.bottom
let width = 1000 - margin.left - margin.right

let svg = d3
  .select('#image-wall')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

svg.append('rect')
  .attr('width', width)
  .attr('height', height)
  .attr('opacity', 0)

var xPositionScale = fisheye.scale(d3.scaleLinear)
  .range([0, width])
  .focus(width / 2)
  .distortion(4)


d3.csv(require('./data/Mingarchitecture.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready (datapoints) {
  xPositionScale.domain([0, datapoints.length])

  var holders = svg
    .selectAll('.image-holder')
    .data(datapoints)
    .enter()
    .append('g')
    .attr('class', 'image-holder')
    .attr('transform', (d, i) => {
      var xPosition = xPositionScale(i)
      return `translate(${xPosition}, 0)`
    })

  holders.append('text')
    .text(d => 'Relics name: ' + d['name_en'] + ' ' + '(' + d['province_en'] + ')')
    .attr('class', d => {
      var str = d['name_en'].replace(/'/g, '')
      var str2 = str.replace(/\(/g, '')
      var str3 = str2.replace(/\)/g, '')
      return 'textelem' + str3.replace(/\s+/g, '-').toLowerCase()
    })
    .classed('movie-text', true)
    .attr('x', 10)
    .attr('y', -40)
    .attr('text-anchor', 'star')
    .attr('fill', 'black')
    .attr('opacity', 0)

  holders.append('image')
    .attr('xlink:href', d => {
      return d.image_url
    })
    .attr('class', d => {
      return d['name_en'].replace(/\s+/g, '-').toLowerCase()
    })
    .classed('name-text', true)
    .attr('height', height)
    .on('mouseover', function (d) {
      var str = d['name_en'].replace(/'/g, '')
      var str2 = str.replace(/\(/g, '')
      var str3 = str2.replace(/\)/g, '')
      var class_selected = str3.replace(/\s+/g, '-').toLowerCase()
      d3.selectAll('.textelem' + class_selected).attr('opacity', 1)
    })
    .on('mouseout', function (d) {
      var str = d['name_en'].replace(/'/g, '')
      var str2 = str.replace(/\(/g, '')
      var str3 = str2.replace(/\)/g, '')
      var class_selected = str3.replace(/\s+/g, '-').toLowerCase()
      d3.selectAll('.textelem' + class_selected).attr('opacity', 0)
    })



  holders.append('rect')
    .attr('stroke', 'none')
    .attr('height', height)
    .attr('width', 400)
    .attr('fill', 'none')

  function clamp (num, min, max) {
    return Math.max(min, Math.min(max, num))
  }

  function redraw () {
    let [mouseX, mouseY] = d3.mouse(this)

    // focus the x axis where the mouse is
    xPositionScale.focus(mouseX)

    svg.selectAll('.image-holder')
      .attr('transform', (d, i) => {
        var xPosition = xPositionScale(i)
        return `translate(${xPosition}, 0)`
      })
  }

  var drag = d3.drag()
    .on('start', redraw)
    .on('drag', redraw)

  svg.on('mousemove', redraw)
    .on('click', redraw)
    .call(drag)
}

// play with distortion and height so images look the righ size
