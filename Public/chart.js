// Fetch and render chart
async function fetchAndRenderChart() {
  try {
    const response = await fetch('/getOrderCountByDate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();

    if (!data || data.length === 0) {
      console.log("No data available");
      d3.select("#chart").html("<p>No data available for the past week.</p>");
      return;
    }

    // Setup chart dimensions
    const margin = { top: 50, right: 30, bottom: 60, left: 60 },
          width = 900 - margin.left - margin.right,
          height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#chart")
      .append("svg")
      .attr("width", "100%")
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Parse the date and prepare the data
    const parseDate = d3.timeParse("%Y-%m-%d");
    const parsedData = data.map(d => ({
      date: parseDate(d._id),
      count: d.count
    }));

    // Define scales
    const x = d3.scaleBand()
      .domain(parsedData.map(d => d.date))
      .range([0, width])
      .padding(0.4);

    const y = d3.scaleLinear()
      .domain([0, d3.max(parsedData, d => d.count)])
      .range([height, 0]);

    // Add X-axis
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b %d")))
      .attr("class", "x-axis");

    // Add Y-axis
    svg.append("g")
      .call(d3.axisLeft(y).ticks(10))
      .attr("class", "y-axis");

    // Add gridlines
    svg.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(y)
        .tickSize(-width)
        .tickFormat("")
      );

    // Add bars with animation
    svg.selectAll(".bar")
      .data(parsedData)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.date))
      .attr("y", height)
      .attr("width", x.bandwidth())
      .attr("height", 0)
      .attr("rx", 8)  // Rounded corners
      .attr("fill", "url(#bar-gradient)")  // Gradient fill
      .transition()
      .duration(800)
      .attr("y", d => y(d.count))
      .attr("height", d => height - y(d.count));

    // Tooltip functionality
    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    svg.selectAll(".bar")
      .on("mouseover", function(event, d) {
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip.html(`Orders: ${d.count}<br>Date: ${d3.timeFormat("%b %d")(d.date)}`)
          .style("left", (event.pageX) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
        tooltip.transition().duration(500).style("opacity", 0);
      });

    // Add axis labels
    svg.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .text("Date");

    svg.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "middle")
      .attr("y", -margin.left + 20)
      .attr("x", -height / 2)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text("Number of Orders");

    // Gradient definition
    svg.append("defs").append("linearGradient")
      .attr("id", "bar-gradient")
      .attr("x1", "0%").attr("y1", "0%")
      .attr("x2", "0%").attr("y2", "100%")
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#69b3a2")
      .attr("stop-opacity", 1);

    svg.select("defs linearGradient")
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#407f6c")
      .attr("stop-opacity", 1);

  } catch (error) {
    console.error('Error fetching or rendering chart data:', error);
  }
}

fetchAndRenderChart();
