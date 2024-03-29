var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv")
  .then(function(csvData) {
  	console.log(csvData[0])
    // Step 1: Parse Data/Cast as numbers
    // ==============================
    csvData.forEach(function(data) {
      data.smokes = +data.smokes;
      data.age = +data.age;
    });
    //Age is X, Smokes is Y

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([20, d3.max(csvData, d => d.age)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(csvData, d => d.smokes)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);


    // Step 5: Create Circles group
    // Then add circles and text for the group.
    // ==============================

    var circlesGroup = chartGroup.selectAll("g")
		.data(csvData)
		.enter()
		.append("g");

		circlesGroup.append("circle")
    .attr("cx", d => xLinearScale(d.age))
    .attr("cy", d => yLinearScale(d.smokes))
    .attr("r", "15")
    .attr("fill", "teal")
    .attr("opacity", "0.75");

    circlesGroup.append("text")
		.attr("x", d => xLinearScale(d.age)-10)
		.attr("y", d => yLinearScale(d.smokes))
		.attr("dy", ".35em")
		.text(function(d) { return d.abbr; })
		.attr("fill", "white")


    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Smokers: ${d.smokes}%<br>Median Age: ${d.age}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2) - 30)
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Smokers (%)")
      .attr("font-size","20px")

    chartGroup.append("text")
      .attr("transform", `translate(${(width / 2)*0.85}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Age (Median)")
      .attr("font-size","20px")
  });


