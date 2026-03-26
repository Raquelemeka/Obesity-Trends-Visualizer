import define1 from "./a2e58f97fd5e8d7c@756.js";

function _1(md){return(
md`# Final Project by Raquel, Ryosuke, Kyle, and Jonathan`
)}

function _2(htl){return(
htl.html`<h2>Project Option - Exploratory Visualization</h2>`
)}

function _3(htl){return(
htl.html`<h2>Datasets:</h2>`
)}

function _4(htl){return(
htl.html`<p><a href="https://www.kaggle.com/datasets/imtkaggleteam/fast-food-restaurants-across-america">Fast Food Restaraunts Across America </a></p>
<p><a href="https://www.tfah.org/wp-content/uploads/2023/09/2021_2022-adult_obesity_rates_States.pdf">Adult Obesity Rates</a></p>
<p><a href="https://www.kaggle.com/datasets/ssskay/usadultsobesityratebystates?resource=download">Obesity Rates by State</a></p>
<p><a href="https://www2.census.gov/programs-surveys/popest/tables/2020-2024/state/totals/NST-EST2024-POP.xlsx">State Populations</a></p>`
)}

function _5(htl){return(
htl.html`<h2>Questions:</h2>
<p>1) How has obesity changed across states from 2020 to 2021? Do some states show faster increases in obesity than others? Are there any states where obesity rates have stabilized or decreased?
</p>
<p>2)Is there a relationship between fast food density and obesity rates? Do states with more fast food restaurants per capita tend to have higher obesity rates? Are there any states where fast food is common but obesity is low?</p>
<p>3)How has the number of fast food locations changed over time? Have some states seen a rapid increase in fast food outlets? Are there any states where fast food locations have declined or remained stable? </p>
<p>4)Do regions follow similar trends in obesity and fast food growth? For example, does the South show different trends compared to the West? Are urban-heavy states (e.g., California, New York) different from rural states?</p>`
)}

function _selectedYear(Inputs){return(
Inputs.radio([2020, 2021], { label: "Year" })
)}

function _maybeColor(Inputs,x11colors){return(
Inputs.select([null].concat(x11colors), {label: "Region:"})
)}

function _map(d3,YearData,selectedYear,maybeColor,northeast,midwest,south,west)
{
  //store up to 5 states
  let selectedStates = [];

  //dimensions
  const mapWidth = 1100;
  const mapHeight = 800;  // map area height
  const redBarChartHeight = 100;    // red chart: obesity data
  const goldBarChartHeight = 60;      // gold chart: restaurant data
  const bottomPadding = 20;           // extra bottom padding
  const spacingBetweenBarCharts = 20;
  const totalHeight = mapHeight + redBarChartHeight + spacingBetweenBarCharts + goldBarChartHeight + bottomPadding;
  const width = 1000;

  //data ranges
  const minX = d3.min(YearData, d => d.X);
  const minY = d3.min(YearData, d => d.Y) - 50;
  const maxX = d3.max(YearData, d => d.X);
  const maxY = d3.max(YearData, d => d.Y);
  const margin = 110; // for spacing

  //scales
  const xScale = d3.scaleLinear().domain([minX, maxX]).range([margin, width - margin]);
  const yScale = d3.scaleLinear().domain([minY, maxY]).range([margin, mapHeight - margin]);

  //svg container
  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", totalHeight)
      .style("border", "1px solid black")
      .attr("viewBox", `0 0 ${width} ${totalHeight}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

  //tooltip
  const tooltip = d3.select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "white")
      .style("padding", "5px")
      .style("border", "1px solid black")
      .style("border-radius", "5px")
      .style("pointer-events", "none")
      .style("opacity", 0);

  //tooltip position
  function updateTooltipPosition(event) {
    const offset = 10;
    const tooltipNode = tooltip.node();
    const tooltipRect = tooltipNode.getBoundingClientRect();
    let x = event.pageX - tooltipRect.width - offset;
    let y = event.pageY - tooltipRect.height - offset;
    if (x < 0) { x = event.pageX + offset; }
    if (y < 0) { y = event.pageY + offset; }
    tooltip.style("left", x + "px")
           .style("top", y + "px");
  }

  //filter data
  const filteredData = YearData.filter(d => {
    // Filter by year
    if (d.year !== selectedYear) return false;
    // Filter by region (if a region is selected)
    if (maybeColor) {
      if (maybeColor === "Northeast") return northeast.includes(d.state);
      if (maybeColor === "Midwest") return midwest.includes(d.state);
      if (maybeColor === "South") return south.includes(d.state);
      if (maybeColor === "West") return west.includes(d.state);
    }
    return true; // If no region is selected, include all states
  });

  //highlight bars for selected states
  function updateBarChartOpacity() {
    d3.selectAll(".state-bar")
      .style("opacity", d => (selectedStates.indexOf(d.state) !== -1) ? 1 : 0.2);
  }

  // map
  // for each filtered state, create a mini SVG on the map.
  filteredData.forEach(d => {
    const restaurant_num = +d.Restaurants;
    const obesityValue = +d.Obesity * 5;  // used for scaling the red rectangle

    // compute dimensions for the mini SVG.
    const originalWidth = 300;
    const scaleFactor = 0.2;
    const svgWidthLocal = originalWidth * 0.1;
    const totalHeightLocal = (restaurant_num / 100 + obesityValue) * scaleFactor;
    const scaledYellowHeight = (restaurant_num / 80) * scaleFactor;
    const scaledRedHeight = (obesityValue / 6) * scaleFactor;

    // create mini SVG.
    let stateSvg = d3.create("svg")
      .attr("width", svgWidthLocal)
      .attr("height", totalHeightLocal)
      .on("mouseover", function(event) {
        tooltip.style("opacity", 1)
          .html(`<strong>${d.state}</strong><br>Restaurants: ${d.Restaurants}<br>Obesity: ${d.Obesity}%<br>Obesity Rank: ${d.Obesity_Rank}`);
      })
      .on("mousemove", function(event) {
        updateTooltipPosition(event);
      })
      .on("mouseout", function() {
        tooltip.style("opacity", 0);
      })
      .on("click", function() {
        // Toggle the state in the selectedStates array (up to 5 states)
        if (selectedStates.indexOf(d.state) !== -1) {
          selectedStates = selectedStates.filter(s => s !== d.state);
        } else if (selectedStates.length < 5) {
          selectedStates.push(d.state);
        }
        tooltip.style("opacity", 0);
        console.log("Selected States:", selectedStates);
        updateBarChartOpacity();
      });

    // draw yellow rectangle (restaurants)
    stateSvg.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", svgWidthLocal)
      .attr("height", scaledYellowHeight)
      .attr("fill", "yellow");

    // draw gray lines in yellow rectangle
    const rank = Math.max(0, +d.Obesity_Rank);
    const numLines = Math.min(rank, 51);
    if (numLines > 0) {
      let spacing = svgWidthLocal / numLines;
      for (let i = 0; i <= numLines; i++) {
        stateSvg.append("line")
          .attr("x1", i * spacing)
          .attr("x2", i * spacing)
          .attr("y1", 0)
          .attr("y2", scaledYellowHeight)
          .attr("stroke", "gray")
          .attr("stroke-width", scaleFactor * 2)
          .attr("opacity", 0.5);
      }
    }

    // draw red rectangle (obesity)
    stateSvg.append("rect")
      .attr("x", 0)
      .attr("y", scaledYellowHeight)
      .attr("width", svgWidthLocal)
      .attr("height", scaledRedHeight)
      .attr("fill", "red");

    // position the mini SVG on the map.
    svg.append("g")
      .attr("transform", `translate(${xScale(d.X) - svgWidthLocal/2}, ${yScale(d.Y) - totalHeightLocal/2})`)
      .node().append(stateSvg.node());
  });

  //legend
  const legend = svg.append("g")
      .attr("transform", `translate(20, ${mapHeight - 150})`);
  legend.append("text")
      .attr("x", 0)
      .attr("y", 0)
      .text("Legend")
      .attr("font-size", "14px")
      .attr("font-weight", "bold");
  legend.append("rect")
      .attr("x", 0)
      .attr("y", 20)
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", "yellow");
  legend.append("text")
      .attr("x", 30)
      .attr("y", 35)
      .text("(height): Number of Restaurants")
      .attr("font-size", "12px")
      .attr("alignment-baseline", "middle");
  legend.append("rect")
      .attr("x", 0)
      .attr("y", 50)
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", "red");
  legend.append("text")
      .attr("x", 30)
      .attr("y", 65)
      .text("(height) : Obesity Rate")
      .attr("font-size", "12px")
      .attr("alignment-baseline", "middle");
  legend.append("line")
      .attr("x1", 10)
      .attr("x2", 10)
      .attr("y1", 90)
      .attr("y2", 120)
      .attr("stroke", "gray")
      .attr("stroke-width", 2)
      .attr("opacity", 0.5);
  legend.append("text")
      .attr("x", 30)
      .attr("y", 105)
      .text("# of Fries = Obesity Rank for That Year")
      .attr("font-size", "12px")
      .attr("alignment-baseline", "middle");
  svg.append("text")
      .attr("x", width - 20)
      .attr("y", mapHeight - 20)
      .attr("text-anchor", "end")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .attr("fill", "black")
      .text("*** There are many outside factors contributing to Obesity rates, which is important while comparing these stats");

  //bar charts
  const barMargin = margin;
  let barOrder = filteredData.map(d => d.state);
  const xBarScale = d3.scaleBand()
      .domain(barOrder)
      .range([barMargin, width - barMargin])
      .padding(0.1);

  // red bar chart (obesity) uses a linear scale
  const maxObesityFiltered = d3.max(filteredData, d => +d.Obesity);
  const redBarScale = d3.scaleLinear()
      .domain([0, maxObesityFiltered])
      .range([0, redBarChartHeight]);
  const redAxisScale = d3.scaleLinear()
      .domain([0, maxObesityFiltered])
      .range([redBarChartHeight, 0]);

  // gold bar chart (restaurants) uses a square‑root scale
  const maxRestaurantsFiltered = d3.max(filteredData, d => +d.Restaurants);
  const restaurantScale = d3.scalePow().exponent(0.5)
      .domain([0, maxRestaurantsFiltered])
      .range([0, goldBarChartHeight]);
  const restaurantAxisScale = d3.scalePow().exponent(0.5)
      .domain([0, maxRestaurantsFiltered])
      .range([goldBarChartHeight, 0]);

  // create groups for the two bar charts
  const barChartGroupRed = svg.append("g")
      .attr("transform", `translate(0, ${mapHeight})`);
  const barChartGroupGold = svg.append("g")
      .attr("transform", `translate(0, ${mapHeight + redBarChartHeight + spacingBetweenBarCharts})`);

  // axis for bar chart
  barChartGroupRed.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(${barMargin - 40}, 0)`)
      .call(d3.axisLeft(redAxisScale).ticks(5));
  barChartGroupGold.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(${barMargin - 40}, 0)`)
      .call(d3.axisLeft(restaurantAxisScale).ticks(5));

  //axis labels
  barChartGroupRed.append("text")
      .attr("transform", `translate(${barMargin - 90}, ${redBarChartHeight/2}) rotate(-90)`)
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .text("Obesity (%)");
  barChartGroupGold.append("text")
      .attr("transform", `translate(${barMargin - 90}, ${goldBarChartHeight/2}) rotate(-90)`)
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .text("Restaurants");

  // make bars draggable for comparison
  const dragBehavior = d3.drag()
      .on("start", function(event, d) {
          d3.select(this).raise().attr("stroke", "black");
      })
      .on("drag", function(event, d) {
          d3.select(this).attr("x", event.x);
      })
      .on("end", function(event, d) {
          d3.select(this).attr("stroke", null);
          let newX = event.x;
          const availableWidth = width - 2 * barMargin;
          let newIndex = Math.floor((newX - barMargin) / (availableWidth / barOrder.length));
          newIndex = Math.max(0, Math.min(newIndex, barOrder.length - 1));
          let oldIndex = barOrder.indexOf(d.state);
          barOrder.splice(oldIndex, 1);
          barOrder.splice(newIndex, 0, d.state);
          xBarScale.domain(barOrder);
          barChartGroupRed.selectAll(".state-bar")
              .transition().duration(500)
              .attr("x", d => xBarScale(d.state));
          barChartGroupGold.selectAll(".state-bar")
              .transition().duration(500)
              .attr("x", d => xBarScale(d.state));
      });

  // create obesity bars
  const redBars = barChartGroupRed.selectAll(".state-bar")
      .data(filteredData, d => d.state)
      .enter()
      .append("rect")
      .attr("class", "state-bar")
      .attr("x", d => xBarScale(d.state))
      .attr("y", d => redBarChartHeight - redBarScale(+d.Obesity))
      .attr("width", d => xBarScale.bandwidth())
      .attr("height", d => redBarScale(+d.Obesity))
      .attr("fill", "red")
      .style("opacity", 0.2)
      .on("mouseover", function(event, d) {
          tooltip.style("opacity", 1)
              .html(`<strong>${d.state}</strong><br>Obesity: ${d.Obesity}%`);
      })
      .on("mousemove", function(event, d) {
          updateTooltipPosition(event);
      })
      .on("mouseout", function() {
          tooltip.style("opacity", 0);
      })
      .call(dragBehavior);

  // create restaurant bars
  const goldBars = barChartGroupGold.selectAll(".state-bar")
      .data(filteredData, d => d.state)
      .enter()
      .append("rect")
      .attr("class", "state-bar")
      .attr("x", d => xBarScale(d.state))
      .attr("y", d => goldBarChartHeight - restaurantScale(+d.Restaurants))
      .attr("width", d => xBarScale.bandwidth())
      .attr("height", d => restaurantScale(+d.Restaurants))
      .attr("fill", "gold")
      .style("opacity", 0.2)
      .on("mouseover", function(event, d) {
          tooltip.style("opacity", 1)
              .html(`<strong>${d.state}</strong><br>Restaurants: ${d.Restaurants}`);
      })
      .on("mousemove", function(event, d) {
          updateTooltipPosition(event);
      })
      .on("mouseout", function() {
          tooltip.style("opacity", 0);
      })
      .call(dragBehavior);

  return svg.node();
}


function _obesityBarChart(YearData,selectedYear,maybeColor,northeast,midwest,south,west,d3)
{
  const width = 800;
  const height = 600;
  const margin = { top: 50, right: 20, bottom: 150, left: 100 };

  // Filter data for the selected year
  const filteredByYear = YearData.filter(d => d.year === selectedYear);

  // Filter data for the selected region (if a region is selected)
  const filteredData = maybeColor
    ? filteredByYear.filter(d => {
        if (maybeColor === "Northeast") return northeast.includes(d.state);
        if (maybeColor === "Midwest") return midwest.includes(d.state);
        if (maybeColor === "South") return south.includes(d.state);
        if (maybeColor === "West") return west.includes(d.state);
        return true; // If no region is selected, include all states
      })
    : filteredByYear;

  // Sort data by Obesity Rate (descending order)
  const sortedData = filteredData.slice().sort((a, b) => b.Obesity - a.Obesity);

  // X scale for states
  const xScale = d3.scaleBand()
    .domain(sortedData.map(d => d.state))
    .range([margin.left, width - margin.right])
    .padding(0.2);

  // Y scale for obesity rates
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(sortedData, d => d.Obesity)])
    .range([height - margin.bottom, margin.top]);

  // Create SVG container
  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height);

  // Add bars
  svg.append("g")
    .selectAll("rect")
    .data(sortedData)
    .join("rect")
    .attr("x", d => xScale(d.state))
    .attr("y", d => yScale(d.Obesity))
    .attr("width", xScale.bandwidth())
    .attr("height", d => yScale(0) - yScale(d.Obesity)) // Correct bar height
    .attr("fill", "red");

  // Add x-axis
  svg.append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");

  // Add y-axis
  svg.append("g")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(yScale));

  // Add chart title
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("font-weight", "bold")
    .text(`Obesity Rate per State (${selectedYear}) ${maybeColor ? `- ${maybeColor}` : ""}`);

  // Return the SVG element
  return svg.node();
}


function _restaurantBarChart(YearData,selectedYear,maybeColor,northeast,midwest,south,west,d3)
{
  const width = 800;
  const height = 600;
  const margin = { top: 50, right: 20, bottom: 150, left: 100 };

  // Filter data for the selected year
  const filteredByYear = YearData.filter(d => d.year === selectedYear);

  // Filter data for the selected region (if a region is selected)
  const filteredData = maybeColor
    ? filteredByYear.filter(d => {
        if (maybeColor === "Northeast") return northeast.includes(d.state);
        if (maybeColor === "Midwest") return midwest.includes(d.state);
        if (maybeColor === "South") return south.includes(d.state);
        if (maybeColor === "West") return west.includes(d.state);
        return true; // If no region is selected, include all states
      })
    : filteredByYear;

  // Sort data by number of restaurants (descending order)
  const sortedData = filteredData.slice().sort((a, b) => b.Restaurants - a.Restaurants);

  // X scale for states
  const xScale = d3.scaleBand()
    .domain(sortedData.map(d => d.state))
    .range([margin.left, width - margin.right])
    .padding(0.2);

  // Y scale for number of restaurants
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(sortedData, d => d.Restaurants)])
    .range([height - margin.bottom, margin.top]);

  // Create SVG container
  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height);

  // Add bars
  svg.append("g")
    .selectAll("rect")
    .data(sortedData)
    .join("rect")
    .attr("x", d => xScale(d.state))
    .attr("y", d => yScale(d.Restaurants))
    .attr("width", xScale.bandwidth())
    .attr("height", d => yScale(0) - yScale(d.Restaurants)) // Correct bar height
    .attr("fill", "yellow");

  // Add x-axis
  svg.append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");

  // Add y-axis
  svg.append("g")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(yScale));

  // Add chart title
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("font-weight", "bold")
    .text(`Number of Restaurants per State (${selectedYear}) ${maybeColor ? `- ${maybeColor}` : ""}`);

  // Return the SVG element
  return svg.node();
}


function _YearData(restaurantstatsfinal,selectedYear){return(
restaurantstatsfinal
  .filter(d=> +d.year === +selectedYear)
)}

function _x11colors(){return(
["Midwest", "Northeast", "South", "West"]
)}

function _midwest(){return(
["Illinois", "Indiana", "Michigan", "Ohio", "Wisconsin", "Iowa", "Kansas", "Minnesota", "Missouri", "Nebraska", "North Dakota", "South Dakota"]
)}

function _south(){return(
["Florida", "Georgia", "North Carolina", "South Carolina", "Virginia", "District of Columbia", "Maryland", "West Virginia", "Alabama", "Kentucky", "Mississippi", "Tennessee", "Arkansas", "Louisiana", "Oklahoma", "Texas"]
)}

function _west(){return(
["Arizona", "Colorado", "Idaho", "Montana", "Nevada", "New Mexico", "Utah", "Wyoming", "Alaska", "California", "Hawaii", "Oregon", "Washington"]
)}

function _northeast(){return(
["Connecticut", "Maine", "Massachusetts", "New Hampshire", "Rhode Island", "Vermont", "New Jersey", "New York", "Pennsylvania", "Delaware"]
)}

function _restaurantstatsfinal(__query,FileAttachment,invalidation){return(
__query(FileAttachment("RestaurantStatsFinal.csv"),{from:{table:"RestaurantStatsFinal"},sort:[],slice:{to:null,from:null},types:[{name:"restaurants_per_capita",type:"raw"}],filter:[],select:{columns:null}},invalidation)
)}

function _19(md){return(
md`- created map coords using javascript code included in files tab by using a map from the internet and clicking the coordinates into a csv (learning p5.js in DGAH)
- If you want to try it go here: https://editor.p5js.org/
- Copy and paste sketch.js into sketch.js and upload image, I just clicked middle of each state with some exceptions on east coast.
- combined 3 datasets manually
- created ranks manually`
)}

function _20(md){return(
md`

- https://stackoverflow.com/questions/14492284/d3-js-create-a-scalable-svg-map
- https://stackoverflow.com/questions/23418320/bind-click-event-listener-to-map-marker-using-d3-and-js
- https://stackoverflow.com/questions/11252753/d3-js-scaling-and-translating-elements
- https://stackoverflow.com/questions/13729422/d3-js-appending-an-svg-to-a-dom-element
- https://stackoverflow.com/questions/10805184/d3-js-how-to-add-tooltips
- https://stackoverflow.com/questions/29374602/d3-js-append-svg-with-data-driven-attributes
- https://stackoverflow.com/questions/16256459/d3-js-position-tooltips-using-element-position-not-mouse-position
- https://stackoverflow.com/questions/19121670/adding-rectangles-to-a-d3-js-svg-using-data-binding
- https://stackoverflow.com/questions/30294506/d3-js-select-and-highlight-clicked-elements
- https://stackoverflow.com/questions/44833788/making-svg-container-100-width-and-height-of-parent-container-in-d3-v4-instead
- https://stackoverflow.com/questions/44833788/making-svg-container-100-width-and-height-of-parent-container-in-d3-v4-instead
- https://stackoverflow.com/questions/46983361/how-to-select-an-existing-svg-container-in-d3-without-creating-that-container-us
- https://observablehq.com/%40observablehq/mutable
- https://d3js.org/d3-drag

- ALL of the labs, especially for interactivity

`
)}

function _regionpops(__query,FileAttachment,invalidation){return(
__query(FileAttachment("RegionPops.csv"),{from:{table:"RegionPops"},sort:[],slice:{to:null,from:null},types:[{name:"Population",type:"string"}],filter:[],select:{columns:["Region","Year","Population"]}},invalidation)
)}

function _regionpops2(regionpops){return(
regionpops.map(d => ({
  ...d,
  Population: +d.Population.replace(/,/g, "")
}))
)}

function _23(htl){return(
htl.html`function combineRegion(data) {

  let regionpops_cmp = [];
  
  

  let northeast = ["Connecticut", "Maine", "Massachusetts", "New Hampshire", "Rhode Island", "Vermont", "New Jersey", "New York", "Pennsylvania"]
  let midwest = ["Illinois", "Indiana", "Michigan", "Ohio", "Wisconsin", "Iowa", "Kansas", "Minnesota", "Missouri", "Nebraska", "North Dakota", "South Dakota"]
  let south = ["Florida", "Georgia", "North Carolina", "South Carolina", "Virginia", "District of Columbia", "Maryland", "Delaware", "West Virginia", "Alabama", "Kentucky", "Mississippi", "Tennessee", "Arkansas", "Louisiana", "Oklahoma", "Texas"]
  let west = ["Arizona", "Colorado", "Idaho", "Montana", "Nevada", "New Mexico", "Utah", "Wyoming", "Alaska", "California", "Hawaii", "Oregon","Washington"]

  for (let n = 2020; n < 2022; n++) {
    
    let resNE = 0;
    let resS = 0;
    let resW = 0;
    let resMW = 0;
    let obeNE = 0;
    let obeS = 0;
    let obeW = 0;
    let obeMW = 0;
    let countNE = 0;
    let countS = 0;
    let countW = 0;
    let countMW = 0;
    
    let state_anual = data.filter(o=>o['year'] == n);
    let region_anual = regionpops2.filter(o=>o['Year'] == n);
    
    for (let i = 0; i < state_anual.length; i++) {
      let state = state_anual[i].state;
      if (northeast.contain(state)) {
        resNE = resNE + state_anual[i].Restaurants;
        obeNE = obeNE + state_anual[i].Obesity;
        countNE++;
      } else if (midwest.contain(state)) {
        resMW = resMW + state_anual[i].Restaurants;
        obeMW = obeMW + state_anual[i].Obesity;
        countMW++;
      } else if (south.contain(state)) {
        resS = resS + state_anual[i].Restaurants;
        obeS = obeS + state_anual[i].Obesity;
        countS++;
      } else if (west.contain(state)) {
        resW = resW + state_anual[i].Restaurants;
        obeW = obeW + state_anual[i].Obesity;
        countW++;
      } else{return state} 
    }

    obeNE = obeNE / countNE;
    obeMW = obeMW / countMW;
    obeS = obeS / countS;
    obeW = obeW / countW;
     
    for (let j = 0; j < region_anual.length;) {
      if (region_anual[j].Region == "Northeast") {
        regionpops_cmp.push({ Region: region_anual[j].Region, Year: n, Population: region_anual[j].Population, Obesity: obeNE, Restaurants_Per_Capita: resNE/region_anual[j].Population});
      } else if (region_anual[j].Region == "Midwest") {
        regionpops_cmp.push({ Region: region_anual[j].Region, Year: n, Population: region_anual[j].Population, Obesity: obeMW, Restaurants_Per_Capita: resMW/region_anual[j].Population});
      } else if (region_anual[j].Region == "South") {
        regionpops_cmp.push({ Region: region_anual[j].Region, Year: n, Population: region_anual[j].Population, Obesity: obeS, Restaurants_Per_Capita: resS/region_anual[j].Population});
      } else if (region_anual[j].Region == "West") {
        regionpops_cmp.push({ Region: region_anual[j].Region, Year: n, Population: region_anual[j].Population, Obesity: obeW, Restaurants_Per_Capita: resW/region_anual[j].Population});
      }
    }
    
  }
  
  return regionpops_cmp;
}`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["RestaurantStatsFinal.csv", {url: new URL("./files/b832bdace00c563e40d9677183586a4276401970fd2083b568a88af18ce3b05cc09b3fb96fba89195196f59655b0902948b417057fb85c097f8ed1a465da9f7f.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["RegionPops.csv", {url: new URL("./files/1ea8f9a42a4300db73c1eeef1c0aa89ad6def40f7240a54b2dfef90eb7cb7401ee5626ecbee646c93776d97bc212692b4baf421120aaa76b557febc36e65be4c.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["htl"], _2);
  main.variable(observer()).define(["htl"], _3);
  main.variable(observer()).define(["htl"], _4);
  main.variable(observer()).define(["htl"], _5);
  main.variable(observer("viewof selectedYear")).define("viewof selectedYear", ["Inputs"], _selectedYear);
  main.variable(observer("selectedYear")).define("selectedYear", ["Generators", "viewof selectedYear"], (G, _) => G.input(_));
  main.variable(observer("viewof maybeColor")).define("viewof maybeColor", ["Inputs","x11colors"], _maybeColor);
  main.variable(observer("maybeColor")).define("maybeColor", ["Generators", "viewof maybeColor"], (G, _) => G.input(_));
  main.variable(observer("viewof map")).define("viewof map", ["d3","YearData","selectedYear","maybeColor","northeast","midwest","south","west"], _map);
  main.variable(observer("map")).define("map", ["Generators", "viewof map"], (G, _) => G.input(_));
  main.variable(observer("viewof obesityBarChart")).define("viewof obesityBarChart", ["YearData","selectedYear","maybeColor","northeast","midwest","south","west","d3"], _obesityBarChart);
  main.variable(observer("obesityBarChart")).define("obesityBarChart", ["Generators", "viewof obesityBarChart"], (G, _) => G.input(_));
  main.variable(observer("viewof restaurantBarChart")).define("viewof restaurantBarChart", ["YearData","selectedYear","maybeColor","northeast","midwest","south","west","d3"], _restaurantBarChart);
  main.variable(observer("restaurantBarChart")).define("restaurantBarChart", ["Generators", "viewof restaurantBarChart"], (G, _) => G.input(_));
  main.variable(observer("YearData")).define("YearData", ["restaurantstatsfinal","selectedYear"], _YearData);
  main.variable(observer("x11colors")).define("x11colors", _x11colors);
  main.variable(observer("midwest")).define("midwest", _midwest);
  main.variable(observer("south")).define("south", _south);
  main.variable(observer("west")).define("west", _west);
  main.variable(observer("northeast")).define("northeast", _northeast);
  main.variable(observer("restaurantstatsfinal")).define("restaurantstatsfinal", ["__query","FileAttachment","invalidation"], _restaurantstatsfinal);
  const child1 = runtime.module(define1);
  main.import("Table", child1);
  main.import("Select", child1);
  main.import("Search", child1);
  main.import("Range", child1);
  main.import("Checkbox", child1);
  main.import("Text", child1);
  main.variable(observer()).define(["md"], _19);
  main.variable(observer()).define(["md"], _20);
  main.variable(observer("regionpops")).define("regionpops", ["__query","FileAttachment","invalidation"], _regionpops);
  main.variable(observer("regionpops2")).define("regionpops2", ["regionpops"], _regionpops2);
  main.variable(observer()).define(["htl"], _23);
  return main;
}
