$(function() {
  d3.csv("../resources/us-cancer.csv", function(error, allData) {
    if (error) throw error;

    var xScale;
    var yScale;
    var currentData = [];

    var sex = "Male";
    var race = "White";

    var margin = {
      top: 100,
      right: 100,
      bottom: 100,
      left: 100
    };

    var width = 1000 - margin.left - margin.right;
    var height = 800 - margin.top - margin.bottom;

    var svg = d3.select("#vis")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("width", width)
        .attr("height", height);

    var xAxisLabel = svg.append("g")
    	  .attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")")
    	  .attr("class", "axis");

    var yAxisLabel = svg.append("g")
    		.attr("class", "axis")
    		.attr("transform", "translate(" + margin.left + "," + (margin.top) + ")");

    var xAxisText = svg.append("text")
        .attr("transform", "translate(" + (margin.left + width/2) + "," + (height + margin.top + 40) + ")")
    	  .attr("class", "title");

    var yAxisText = svg.append("text")
    	  .attr("transform", "translate(" + (margin.left - 70) + "," + (margin.top + height/2) + ") rotate(-90)")
    	  .attr("class", "title");

    var setScales = function(data) {
      var xMin = d3.min(data, function(d) { return parseInt(d.Year) });
      var xMax = d3.max(data, function(d) { return parseInt(d.Year) });

      xScale = d3.scale.linear().range([0, width]).domain([xMin, xMax]);

      var yMin = d3.min(data, function(d) { return parseInt(d.Count) });
      var yMax = d3.max(data, function(d) { return parseInt(d.Count) });

      yScale = d3.scale.linear().range([height, 0]).domain([yMin, yMax]);
    };

    var setAxes = function() {
      var xAxis = d3.svg.axis()
          .scale(xScale)
          .orient("bottom");

      var yAxis = d3.svg.axis()
          .scale(yScale)
          .orient("left");

      xAxisLabel.transition().duration(1000).call(xAxis);
      yAxisLabel.transition().duration(1000).call(yAxis);

      xAxisText.text("Year");
      yAxisText.text("Incidence of All Cancers");
    };

    var filterData = function() {
      dataByState.forEach(function(state) {
        var values = state.values;
        var updateValues = values.filter(function(value) {
            return value.Sex == sex && value.Race == race;
        });

        currentData.push({"key": state.key, "values": updateValues});
      });
    };

    var dataByState = d3.nest()
        .key(function(d) { return d.State; })
        .entries(allData);

    var createLine = function(data) {
      console.log("dataPassed: ", data);
      d3.svg.line()
          .x(function(d) { return xScale(d.Year); })
          .y(function(d) { return yScale(d.Sale); })
          .interpolate("basis");
    };

    var draw = function(data) {
      setScales(data);
      setAxes();

      var titleText = g.selectAll("text");
      g.append("text")
          .attr("class", "title")
          .attr("y", -40)
          .text("Incidence of All Cancers by State");
      g.append("text")
          .attr("class", "title")
          .attr("y", -20)
          .text("Current Selection: " + sex + ", " + race);

      var paths = g.selectAll("path").data(data);
      data.forEach(function(key) {
        var valuesActual = [];
        key.values.forEach(function(values) {
          valuesActual.push({"Year": values.Year, "Count": values.Count});
        });

        console.log("valuesActual: " + key.key, valuesActual);

        paths.enter().append("path")
            .attr("d", createLine(valuesActual))
            .attr("stroke", "teal")
            .attr("stroke-width", 2)
            .attr("fill", "none");

      });


      paths.exit().remove();
      titleText.remove();
    };

    $("input").on("change", function() {
			var val = $(this).val();
			var isSex = $(this).hasClass("sex");
			if(isSex) sex = val;
			else race = val;

			filterData();
			draw(currentData);
		});

    filterData();
    draw(currentData);
  });
});
