const salesData = [
    { month: 'January', sales: 200 },
    { month: 'February', sales: 450 },
    { month: 'March', sales: 300 },
    { month: 'April', sales: 600 },
    { month: 'May', sales: 500 },
    { month: 'June', sales: 700 }
];


const data = [
    { month: 'January', sales: 200 },
    { month: 'February', sales: 450 },
    { month: 'March', sales: 300 },
    { month: 'April', sales: 600 },
    { month: 'May', sales: 500 },
    { month: 'June', sales: 700 }
];

// Set up dimensions
const margin = { top: 30, right: 30, bottom: 70, left: 60 };
const width = 500 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create an SVG container
const svg = d3.select("#chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// X axis: scale and draw
const x = d3.scaleBand()
  .range([0, width])
  .domain(data.map(d => d.month))
  .padding(0.2);

svg.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(x))
  .selectAll("text")
  .attr("transform", "translate(-10,0)rotate(-45)")
  .style("text-anchor", "end");

// Y axis: scale and draw
const y = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.sales)])
  .range([height, 0]);

svg.append("g")
  .call(d3.axisLeft(y));

// Bars
svg.selectAll("bars")
  .data(data)
  .enter()
  .append("rect")
    .attr("x", d => x(d.month))
    .attr("y", d => y(d.sales))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d.sales))
    .attr("class", "bar");
