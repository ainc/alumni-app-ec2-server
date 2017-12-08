#size of canvas
width = 1000
height = 500
centered = undefined
#projection of the svg
projection = d3.geo.albersUsa().scale(1100).translate([
  width / 2
  height / 2
])
#lines for projection
path = d3.geo.path().projection(projection).pointRadius(1.5)
#scalable object svg
svg = d3.select('#usa').append('svg').attr('width', width).attr('height', height)
#elements of the svgs
# Run 'ready' when JSONs are loaded

ready = (error, usa, alumni) ->
  if error
    throw error
  console.log usa
  console.log alumni.Form1
  g.append('g').attr('id', 'states').selectAll('path').data(topojson.feature(usa, usa.objects.states).features).enter().append('path').attr('d', path).on 'click', clicked
  g.selectAll('g').append('path').datum(topojson.mesh(usa, usa.objects.states, (a, b) ->
    a != b
  )).attr('id', 'state-borders').attr 'd', path
  # appends circles to the map converted from lat and long coords
  # based on the location of the json data
  g.append('g').selectAll('svg').data(alumni.Form1).enter().append('svg:circle').attr('cx', (d) ->
    c = [
      d.lng
      d.lat
    ]
    p = projection(c)
    console.log p
    p[0]
  ).attr('r', 1.5).attr('cy', (d) ->
    c = [
      d.lng
      d.lat
    ]
    p = projection(c)
    p[1]
  ).attr('class', 'incident').on('click', (d) ->
    temp = []
    i = 0
    while i < alumni.Form1.length
      if alumni.Form1[i].lng == d.lng and alumni.Form1[i].lat == d.lat
        temp.push alumni.Form1[i]
      i++
    d3.select(this).attr 'class', 'incident hover'
    j = 0
    while j < temp.length
      $('#display').append '<div class = "display text-center">' + '<div class = "text-center display-group-header " >' + '<img  class = "awesome-img" src = "' + temp[j].picture + '"/>' + '<div class = "awesome-name" >' + temp[j].name + '</div>' + '<div class = "awesome-location" >' + temp[j].location + '</div>' + '</div>' + '<div class = "text-left display-group-description ">' + '<div>' + '<i class = "fa fa-briefcase">' + '</i>: ' + temp[j].current_company + ' </div>' + '<div>' + '<i class = "fa fa-group">' + '</i>: ' + temp[j].current_position + '</div>' + '<div>' + '<i class = "fa fa-twitter">' + '</i>: ' + temp[j].personal_handles + '</div>' + '<div>' + '<i class = "fa fa-linkedin-square"> ' + '</i>: ' + temp[j].linkedin + '</div>' + '<div>' + '<i class = "fa fa-user">' + '</i> ' + temp[j].favorite_memory + '</div>' + '<div>' + '</div>'
      j++
    console.log temp
    d3.select(this).attr 'class', 'incident hover'
    return
  ).on 'mouseover', (d) ->
    d3.select('#display').text ''
    d3.select(this).attr 'class', 'incident'
    return
  return

clicked = (d) ->
  x = undefined
  y = undefined
  z = undefined
  console.log d
  if d and centered != d
    centroid = path.centroid(d)
    x = centroid[0]
    y = centroid[1]
    z = 2.5
    centered = d
  else
    x = width / 2
    y = height / 2
    z = .95
    centered = null
  g.selectAll('path').classed 'active', centered and (d) ->
    d == centered
  g.transition().duration(850).attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')scale(' + z + ')translate(' + -x + ',' + -y + ')').style 'stroke-width', 1.5 / z + 'px'
  return

svg.append('rect').attr('class', 'background').attr('width', width).attr('height', height).on 'click', clicked
#for click to zoom function
#adds a group class for the svg
g = svg.append('g')
#queues json files to load
queue().defer(d3.json, 'https://gist.githubusercontent.com/mbostock/4090846/raw/d534aba169207548a8a3d670c9c2cc719ff05c47/us.json').defer(d3.json, 'http://18.220.189.65/api/getAlumni').await ready
