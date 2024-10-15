function renderChart(data) {
  // Simulate 50 orders for each date
  data = data.map(d => ({ date: new Date(d._id), count: Math.min(d.count, 50) }));

  const margin = { top: 20, right: 30, bottom: 40, left: 40 };
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  d3.select("#chart").html(""); // Clear previous chart

  const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Use scaleBand for better date alignment
  const x = d3.scaleBand()
    .domain(data.map(d => d.date))  // Array of unique dates
    .range([0, width])
    .padding(0.37);  // Space between bars

  const y = d3.scaleLinear()
    .domain([0, 10])  // Adjusted to simulate up to 50 orders per day
    .range([height, 0]);

  // Create the x-axis with dates formatted
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y-%m-%d")));

  // Create the y-axis
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add bars
  svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.date))
    .attr("y", d => y(d.count))
    .attr("width", x.bandwidth())  // Use band width for the bars
    .attr("height", d => height - y(d.count))
    .attr("fill", "steelblue");
}

// Fetch data and render chart
async function fetchData() {
const response = await fetch('/getOrderCountByDate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
});
const data = await response.json();
renderChart(data);  // Pass the data to the renderChart function
}

fetchData();
