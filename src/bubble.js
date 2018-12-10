// import d3Tip from 'd3-tip'

var margin = {
  top: 50,
  right: 20,
  bottom: 30,
  left: 20
}

let height = 700 - margin.top - margin.bottom

let width = 1000 - margin.left - margin.right

let svg = d3
  .select('#bubble')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')