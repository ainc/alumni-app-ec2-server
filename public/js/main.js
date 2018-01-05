(function() {
  var centered, clicked, g, height, path, projection, ready, svg, width;

  width = 1000;

  height = 500;

  centered = void 0;

  projection = d3.geo.albersUsa().scale(1100).translate([width / 2, height / 2]);

  path = d3.geo.path().projection(projection).pointRadius(1.5);

  svg = d3.select('#usa').append('svg').attr('width', width).attr('height', height);

  ready = function(error, usa, alumni) {
    if (error) {
      throw error;
    }
    console.log(usa);
    console.log(alumni.Form1);
    g.append('g').attr('id', 'states').selectAll('path').data(topojson.feature(usa, usa.objects.states).features).enter().append('path').attr('d', path).on('click', clicked);
    g.selectAll('g').append('path').datum(topojson.mesh(usa, usa.objects.states, function(a, b) {
      return a !== b;
    })).attr('id', 'state-borders').attr('d', path);
    g.append('g').selectAll('svg').data(alumni.Form1).enter().append('svg:circle').attr('cx', function(d) {
      var c, p;
      c = [d.lng, d.lat];
      p = projection(c);
      console.log(p);
      return p[0];
    }).attr('r', 1.5).attr('cy', function(d) {
      var c, p;
      c = [d.lng, d.lat];
      p = projection(c);
      return p[1];
    }).attr('class', 'incident').on('click', function(d) {
      var i, j, temp;
      temp = [];
      i = 0;
      while (i < alumni.Form1.length) {
        if (alumni.Form1[i].lng === d.lng && alumni.Form1[i].lat === d.lat) {
          temp.push(alumni.Form1[i]);
        }
        i++;
      }
      d3.select(this).attr('class', 'incident hover');
      j = 0;
      while (j < temp.length) {
        $('#display').append('<div class = "display text-center">' + '<div class = "text-center display-group-header " >' + '<img  class = "awesome-img" src = "' + temp[j].picture + '"/>' + '<div class = "awesome-name" >' + temp[j].name + '</div>' + '<div class = "awesome-location" >' + temp[j].location + '</div>' + '</div>' + '<div class = "text-left display-group-description ">' + '<div>' + '<i class = "fa fa-briefcase">' + '</i>: ' + temp[j].current_company + ' </div>' + '<div>' + '<i class = "fa fa-group">' + '</i>: ' + temp[j].current_position + '</div>' + '<div>' + '<i class = "fa fa-twitter">' + '</i>: ' + temp[j].personal_handles + '</div>' + '<div>' + '<i class = "fa fa-linkedin-square"> ' + '</i>: ' + temp[j].linkedin + '</div>' + '<div>' + '<i class = "fa fa-user">' + '</i> ' + temp[j].favorite_memory + '</div>' + '<div>' + '</div>');
        j++;
      }
      console.log(temp);
      d3.select(this).attr('class', 'incident hover');
    }).on('mouseover', function(d) {
      d3.select('#display').text('');
      d3.select(this).attr('class', 'incident');
    });
  };

  clicked = function(d) {
    var centroid, x, y, z;
    x = void 0;
    y = void 0;
    z = void 0;
    console.log(d);
    if (d && centered !== d) {
      centroid = path.centroid(d);
      x = centroid[0];
      y = centroid[1];
      z = 2.5;
      centered = d;
    } else {
      x = width / 2;
      y = height / 2;
      z = .95;
      centered = null;
    }
    g.selectAll('path').classed('active', centered && function(d) {
      return d === centered;
    });
    g.transition().duration(850).attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')scale(' + z + ')translate(' + -x + ',' + -y + ')').style('stroke-width', 1.5 / z + 'px');
  };

  svg.append('rect').attr('class', 'background').attr('width', width).attr('height', height).on('click', clicked);

  g = svg.append('g');

  queue().defer(d3.json, 'https://gist.githubusercontent.com/mbostock/4090846/raw/d534aba169207548a8a3d670c9c2cc719ff05c47/us.json').defer(d3.json, 'http://ec2-18-221-88-190.us-east-2.compute.amazonaws.com/api/getAlumni').await(ready);

}).call(this);
