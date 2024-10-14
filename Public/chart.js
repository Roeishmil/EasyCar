const apiUrl = '/getCurrentStock'; // כתובת ה-API שלך

// קבלת נתונים מה-API
d3.json(apiUrl).then(response => {
    if (response.success) {
        const data = response.data; // הנתונים שהתקבלו מהשרת

        // הגדרות גודל הגרף
        const width = 600;
        const height = 400;
        const margin = { top: 20, right: 30, bottom: 40, left: 40 };

        // יצירת קנבס SVG
        const svg = d3.select("#chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        // הגדרת סקלת X לפי שמות המוצרים
        const x = d3.scaleBand()
            .domain(data.map(d => d.name)) // שימוש בשם המוצר כערך ציר ה-X
            .range([margin.left, width - margin.right])
            .padding(0.1);

        // הגדרת סקלת Y לפי כמות המוצרים
        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.quantity)]).nice()
            .range([height - margin.bottom, margin.top]);

        // הוספת עמודות לגרף
        svg.append("g")
            .selectAll("rect")
            .data(data)
            .enter().append("rect")
                .attr("class", "bar")
                .attr("x", d => x(d.name))
                .attr("y", d => y(d.quantity)) // גובה העמודה לפי כמות
                .attr("height", d => y(0) - y(d.quantity))
                .attr("width", x.bandwidth());

        // הוספת ציר X
        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x))
            .attr("class", "axis");

        // הוספת ציר Y
        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y))
            .attr("class", "axis");

    } else {
        console.error('Failed to fetch data:', response.message);
    }
}).catch(error => {
    console.error('Error fetching data:', error);
});