$(function() {
  d3.csv("../resources/us-cancer.csv", function(error, data) {
    var currentData;

    var year = 1999;

    var margin = {
      left: 50,
      bottom: 50,
      top: 50,
      right: 50
    };

    // set this to max vis width
    var width = 1000 - margin.left - margin.right,
    // set this to max vis height
        height = 600 - margin.bottom - margin.top;

    var svg = d3.select("#vis")
        .append("svg")
        .attr("width", 1000)
        .attr("height", 600);

    var g = svg.append("g")
    		.attr("transform", "translate(" +  margin.left + "," + margin.top + ")")
    		.attr("width", width)
        .attr("height", height);

    var xAxisLabel = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," +
            (height + margin.top) + ")")
        .attr("class", "vis-axis");

    var setScale = function(data) {
      console.log(data);

      var xMin = d3.min(data, function(d) { return d.Year - 0 });
      var xMax = d3.max(data, function(d) { return d.Year - 0 });

      xScale = d3.scale.linear().range([0, width]).domain([xMin, xMax]);
    }

    var setSlider = function() {
      var xSlider = d3.slider().axis(true);

      xAxisLabel.transition().duration(1500).call(xSlider);
    }

    var filterData = function() {
      console.log(data);

      currentData = data.filter(function(d) {
        return d.Race == "White" && d.Year == "1999"
      });
    }

    var drawMap = function() {
      // needed to position vis on svg properly
      var scaleAndTranslate = d3.geo.albersUsa()
          .scale(1000)
          .translate([width / 2, height / 2]);

      var path = d3.geo.path()
          .projection(scaleAndTranslate);

      d3.json("../resources/us.json", function(map) {

        svg.insert("path", ".graticule")
            .datum(topojson.feature(map, map.objects.land))
            .attr("class", "land")
            .attr("d", path);

        svg.insert("path", ".graticule")
            .datum(topojson.mesh(map, map.objects.states, function(a, b) { return a !== b; }))
            .attr("class", "state-boundary")
            .attr("d", path);
      });

      d3.select(self.frameElement).style("height", height + "px");
    }

    var draw = function(data) {
      console.log(data);

      setScale(data);
      setSlider();

      var rects = g.selectAll("rect").data(data);

      rects.enter().append("rect")
          .attr("width", xScale.rangeBand())
          .attr("height", 20)
          .attr("class", "bar")
          .attr("title", function(d) { return d.state });

      rects.exit().remove();

      rects.transition()
          .duration(1000)
          .attr("width", xScale.rangeBand())
          .attr("height", function(d) { return 20 - 10})
          .attr("class", "bar")
          .attr("title", function(d) { return d.state });

    };

    $("input").on("change", function() {
      var val = $(this).val();
      var isSex = $(this).hasClass("sex");
      if (isSex) sex = val;
      else type = val;

      filterData();
      draw(currentData);
    });

    drawMap();
  });
});
