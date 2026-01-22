
let csvData = [];
let headers = [];

document.getElementById('csvFileInput').addEventListener('change', function(event) {
    let file = event.target.files[0];
    if (file) {
        Papa.parse(file, {
            complete: function(results) {
                csvData = results.data;
                headers = csvData[0];
                csvData = csvData.slice(1);
                updateColumnSelectors();
            }
        });
    }
});

function updateColumnSelectors() {
    let container = document.getElementById('columnSelectors');
    container.innerHTML = '';

    let chartType = document.getElementById('chartType').value;
    let selectors = '';

    if (headers.length > 0) {
        selectors += `<label for='xColumn'>X-Axis:</label> <select id='xColumn'>${headers.map(h => `<option value='${h}'>${h}</option>`).join('')}</select>`;
        if (['scatter', 'line', 'bar', 'box', 'scatter3d', 'line3d', 'ribbon', 'mesh3d', 'trisurf', 'cluster3d', 'cone', 'streamtube', 'isosurface', 'polar', 'ternary'].includes(chartType)) {
            selectors += ` <label for='yColumn'>Y-Axis:</label> <select id='yColumn'>${headers.map(h => `<option value='${h}'>${h}</option>`).join('')}</select>`;
        }
        if (['scatter3d', 'line3d', 'ribbon', 'surface', 'mesh3d', 'trisurf', 'cluster3d', 'cone', 'streamtube', 'isosurface', 'ternary'].includes(chartType)) {
            selectors += ` <label for='zColumn'>Z-Axis:</label> <select id='zColumn'>${headers.map(h => `<option value='${h}'>${h}</option>`).join('')}</select>`;
        }
    }
    container.innerHTML = selectors;
}

function visualizeChart() {
    if (csvData.length < 2) {
        alert("Please upload a valid CSV file.");
        return;
    }

    let xColumn = document.getElementById("xColumn")?.value;
    let yColumn = document.getElementById("yColumn")?.value;
    let zColumn = document.getElementById("zColumn")?.value;
    let chartType = document.getElementById("chartType").value;

    let xData = csvData.map(row => row[headers.indexOf(xColumn)]);
    let yData = yColumn ? csvData.map(row => row[headers.indexOf(yColumn)]) : [];
    let zData = zColumn ? csvData.map(row => row[headers.indexOf(zColumn)]) : [];

    let trace;

    // The chart rendering logic (same as your original code)
    // [Insert all trace creation logic here as in your original script...]

    switch(chartType) {
        case 'scatter3d':
            trace = {
                x: xData, y: yData, z: zData,
                mode: 'markers',
                type: 'scatter3d',
                marker: { size: 4, color: zData, colorscale: 'Viridis', showscale: true }
            };
            break;
        // ... [rest of switch cases from original code unchanged]
        case 'box':
            trace = { y: yData, type: 'box' };
            break;
        default:
            trace = {
                x: xData,
                y: yData,
                mode: chartType === 'scatter' ? 'markers' : 'lines',
                type: chartType
            };
    }

    let layout = { title: "Scientific Chart" };
    Plotly.newPlot('chart-container', [trace], layout);
}
