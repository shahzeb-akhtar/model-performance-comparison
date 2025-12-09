let resizeTimer,
	mouseTimer,
	loadingDiv,
	dataTextArea,
	representationTypeSel,
	vizDiv,
	tooltipDiv,
	vizMainDiv,
	taskColName,
	modelColName,
	baseColName,
	changedColName,
	numModels,
	colorScale,
	dataArr,
	tasks,
	models,
	body;

const sampleData = `Task	Model Name	Base Model	Model With Self-Reflection
Sentiment Reversal	GPT-3.5	8.8	30.4
Dialogue Response	GPT-3.5	36.4	63.6
Code Optimization	GPT-3.5	14.8	23
Code Readability	GPT-3.5	37.4	51.3
Math Reasoning	GPT-3.5	64.1	64.1
Acronym Generation	GPT-3.5	41.6	56.4
Constrained Generation	GPT-3.5	28	37
Sentiment Reversal	ChatGPT	11.4	43.2
Dialogue Response	ChatGPT	40.1	59.9
Code Optimization	ChatGPT	23.9	27.5
Code Readability	ChatGPT	27.7	63.1
Math Reasoning	ChatGPT	74.8	75
Acronym Generation	ChatGPT	27.2	37.2
Constrained Generation	ChatGPT	44	67
Sentiment Reversal	GPT-4	3.8	36.2
Dialogue Response	GPT-4	25.4	74.6
Code Optimization	GPT-4	27.3	36
Code Readability	GPT-4	27.4	56.2
Math Reasoning	GPT-4	92.9	93.1
Acronym Generation	GPT-4	30.4	56
Constrained Generation	GPT-4	15	45`,
		currentYear = (new Date()).getFullYear(),
		intFormatter = function(num){
			val = d3.format(",d")(num)
			if(val == 'NaN'){
				return '-';
			}
			return val;
		},
		float1Formatter = function(x){
			if (isNaN(x) || isNaN(parseFloat(x))){
				return x;
			}
			return d3.format(".1f")(x);
		}; // &#9873;   9201

function bodyLoaded() {
	d3.select('.copyright_year').html(currentYear);
	dataTextArea = d3.select('.data_text');
	representationTypeSel = d3.select('#representation_type');
	loadingDiv = d3.select('#loading_div');
	inputDiv = d3.select('#input_div');
	vizMainDiv = d3.select('#viz_main_div');
	vizDiv = d3.select('#viz_div');
	tooltipDiv = d3.select('#tooltip');
	body = d3.select('body');
	
	dataTextArea.property('value', sampleData);
	d3.select('.update_button').on('click', prepareChart);
	representationTypeSel.on('change', updateRepresentation)
	
	d3.selectAll('.with_tooltip').on('mouseenter', showTooltip).on('mousemove', moveTooltip).on('mouseleave', hideTooltip);
	
	window.onerror = function(message, source, lineno, colno, error) {  
	  alert("Error occured. Please contact Shahzeb Akhtar (shahzeb.akhtar@gmail.com).");
	  loadingDiv.classed('dn', true); 
	};
	
	window.onresize = function () {

		if (resizeTimer) {
			clearTimeout(resizeTimer);
		}else{
			loadingDiv.classed('dn', false);
		}

		resizeTimer = setTimeout(function(){
			createChart();
		}, 25);
	}
	
	prepareChart();
}


function processData(dataArrStr){
	dataArr = [];
	let rows = dataArrStr.split('\n');
	let obj;
	let tasksSet = new Set();
	let modelsSet = new Set()
	rows.forEach((r, ri) => {
		rowArr = r.split('\t');
		if (ri == 0){
			taskColName = rowArr[0];
			modelColName = rowArr[1];
			baseColName = rowArr[2];
			changedColName = rowArr[3];
		}else{
			obj = {};
			tasksSet.add(rowArr[0]);
			modelsSet.add(rowArr[1]);
			obj[taskColName] = rowArr[0];
			obj[modelColName] = rowArr[1];
			obj[baseColName] = +rowArr[2];
			obj[changedColName] = +rowArr[3];
			// obj['__change'] = obj[changedColName] - obj[baseColName];
			dataArr.push(obj);
		}
	});
	tasksRollUp = d3.rollup(dataArr, v => d3.mean(v, d => d[changedColName] - d[baseColName]), d => d[taskColName]);
	tasks = Array.from(tasksSet).sort((a,b) => d3.ascending(tasksRollUp.get(a), tasksRollUp.get(b)));
	numModels = modelsSet.size;
	models = Array.from(modelsSet);
	colorScale = d3.scaleOrdinal().domain(models).range(d3.schemeCategory10);
}

function prepareChart(){ 
	processData(dataTextArea.property('value'));
	createChart();
}

function createChart(){
	vizDiv.selectAll('*').remove();
	let colorLegendDiv = vizDiv.append('div').attr('class', 'h10p w100p df');
	let circleLegendDiv = vizDiv.append('div').attr('class', 'h5p w100p df mb20');
	let innerVizDiv = vizDiv.append('div').attr('class', 'h65p w100p df');
	let taskDiv = vizDiv.append('div').attr('class', 'h10p w100p df');
	let averageDiv = vizDiv.append('div').attr('class', 'h5p w100p df');
	
	// prepare mini chart divs
	innerVizDiv.append('div').attr('class', 'f1 scale_div');
	tasks.forEach((t, ti) => {
		innerVizDiv.append('div').attr('class', 'f1 mini_chart mr5').classed('bl1slg', ti > 0).datum(t);
	});
	
	taskDiv.append('div').attr('class', 'f1 df aic jcsa fsxxs cg pt10 fwb').append('div').append('span').html(taskColName);
	averageDiv.append('div').attr('class', 'f1 df aic jcsa fsxxs cg').append('div').append('span').html('Average Change');
	
	let rect = innerVizDiv.select('.mini_chart').node().getBoundingClientRect();
	
	// prepare legends
	colorLegendDiv.append('div').style('width', `${rect.width}px`); // empty div to match the scale div
	circleLegendDiv.append('div').style('width', `${rect.width}px`); // empty div to match the scale div
	let legendDiv = colorLegendDiv.append('div').attr('class', 'f1 df fww jcsa aic'); 
	let div;
	models.forEach((m) => {
		div = legendDiv.append('div').attr('class', 'w20p p2 df aic');
		div.append('div').attr('class', 'w10 h10 mr5').style('background-color', colorScale(m));
		div.append('div').attr('class', 'word-wrap fsxxs').append('span').html(m);
	});
	
	div = circleLegendDiv.append('div').attr('class', 'f1 df jcsa aic fsxxs cg');
	let leftLegendDiv = div.append('div').attr('class', '');
	let rightLegendDiv = div.append('div').attr('class', '');
	leftLegendDiv.append('span').attr('class', 'circles fsm mr5').html('&#9675;');
	leftLegendDiv.append('span').attr('class', 'line_triangle fsm mr5 fwb').html('-');
	leftLegendDiv.append('span').attr('class', 'circles').html(`Hollow circle`); 
	leftLegendDiv.append('span').attr('class', 'line_triangle').html(`Horizontal line`);
	leftLegendDiv.append('span').attr('class', 'mr5').html(` represents ${baseColName} performance, and`); 
	rightLegendDiv.append('span').attr('class', 'circles fsm mr5').html('&#9679;');
	rightLegendDiv.append('span').attr('class', 'line_triangle fsxxs mr5').html('&#9650 / &#9660');
	rightLegendDiv.append('span').attr('class', 'circles').html(`Solid circle`); 
	rightLegendDiv.append('span').attr('class', 'line_triangle').html(`Up or down triangle`); 
	rightLegendDiv.append('span').html(` represents ${changedColName} performance`); 

	// prepare charts
	let modelWidth = rect.width/numModels;
	let circleRadius = modelWidth*0.3;
	let miniChartHeight = rect.height;
	let allVals = [];
	dataArr.forEach((d) => {
		allVals.push(d[baseColName]);
		allVals.push(d[changedColName]);
	})
	let scaleY = d3.scaleLinear().domain(d3.extent(allVals)).nice().range([miniChartHeight - circleRadius, circleRadius]);
	let miniChartDiv, svgElem, gElem;
	let taskGroups = d3.group(dataArr, d => d[taskColName]);
	let modelsArr;
	
	innerVizDiv.selectAll('.mini_chart').each(function(d, i){
		miniChartDiv = d3.select(this);
		svgElem = miniChartDiv.append('svg').attr('class', 'h100p w100p');
		taskDiv.append('div').attr('class', 'f1 word-wrap fsxxs df aic jcsa tac fwb mr5 pt10').append('span').html(d);
		modelsArr = taskGroups.get(d).slice();
		averageDiv.append('div').attr('class', 'f1 word-wrap fsxxs df aic jcsa tac mr5 cg').append('span').html(float1Formatter(d3.mean(modelsArr, d => d[changedColName] - d[baseColName])));
		modelsArr.sort((a,b) => d3.ascending(a[changedColName] - a[baseColName], b[changedColName] - b[baseColName]));
		modelsArr.forEach((m, mi) => {
			gElem = svgElem.append('g').attr("transform", `translate(${mi * modelWidth}, 0)`);
			let x1 = modelWidth*0.75, // .4
				x2 = modelWidth*0.75, // .8
				y1 = scaleY(m[baseColName]),
				y2 = scaleY(m[changedColName]),
				textY = 0;
			
			if(m[changedColName] >= m[baseColName]){
				textY = y2 - 15;
			}else{
				textY = y1 + 15;
			}
			
			let trianglePoints = [];
			if (m[changedColName] >= m[baseColName]){
				// up triangle
				trianglePoints.push([x2 - (circleRadius * 0.7),  y2 + (circleRadius * 0.7)])
				trianglePoints.push([x2,  y2 - (circleRadius * 0.7)])
				trianglePoints.push([x2 + (circleRadius * 0.7),  y2 + (circleRadius * 0.7)])
			}else{
				// down triangle
				trianglePoints.push([x2 - (circleRadius * 0.7),  y2 - (circleRadius * 0.7)])
				trianglePoints.push([x2,  y2 + (circleRadius * 0.7)])
				trianglePoints.push([x2 + (circleRadius * 0.7),  y2 - (circleRadius * 0.7)])
			}
				
			gElem.append('line')
				.attr("x1", x1).attr("y1", y1)
				.attr("x2", x2).attr("y2", y2)
				.style("stroke", colorScale(m[modelColName])).style("stroke-width", circleRadius*0.50);
				
			gElem.append('circle').attr('class', 'circles').attr("cx", x1).attr("cy", y1).attr("r", circleRadius*0.75).style("stroke", colorScale(m[modelColName])).style("stroke-width", circleRadius*0.5).attr("fill", "white");
			gElem.append('line').attr('class', 'line_triangle')
								.attr("x1", x1 - circleRadius).attr("y1", y1)
								.attr("x2", x1 + circleRadius).attr("y2", y1)
								.style("stroke", colorScale(m[modelColName])).style("stroke-width", circleRadius*0.10);
								
			gElem.append('circle').attr('class', 'circles').attr("cx", x2).attr("cy", y2).attr("r", circleRadius).attr("fill", colorScale(m[modelColName]));
			
			gElem.append("path").attr('class', 'line_triangle')
					.attr("d", `M ${trianglePoints[0][0]} ${trianglePoints[0][1]} L ${trianglePoints[1][0]} ${trianglePoints[1][1]} L ${trianglePoints[2][0]} ${trianglePoints[2][1]} Z`) // Coordinates for a triangle
					.attr("fill", colorScale(m[modelColName]));
	
	
			gElem.append('text').attr("x", ((x1 + x2)/2)).attr("y", textY)   //  - (circleRadius*1.5)
				.attr("text-anchor", "middle").attr("dominant-baseline", "middle")
				.attr("class", "fsxxs")
				.attr("fill", "gray")
				.text(float1Formatter(m[changedColName] - m[baseColName]));
		});
	});
	
	// prepare axis
	var yAxis = d3.axisLeft(scaleY);
	svgElem = innerVizDiv.select('.scale_div').append('svg').attr('class', 'h100p w100p');
    svgElem.append("g")
			.attr("class", "y axis")
            .attr("transform", `translate(${rect.width}, 0)`)
            .call(yAxis)
	
	// Select and style the axis line and ticks
	svgElem.selectAll(".y.axis line, .y.axis path")
	  .style("stroke", "gray");

	// Select and style the axis text labels
	svgElem.selectAll(".y.axis text")
	  .style("fill", "gray");
	  
	svgElem.append("text")
    .attr("class", "y label fsxxs fwb")
    .attr("text-anchor", "middle")
    .attr("y", rect.width/2)
	.attr("x", -rect.height/2)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
	.style("fill", "gray")
    .text("Performance (%)");
	
	updateRepresentation();
  
	loadingDiv.classed('dn', true);
}

function updateRepresentation(){
	vizDiv.selectAll('.circles').classed('dn', true);
	vizDiv.selectAll('.line_triangle').classed('dn', true);
	
	vizDiv.selectAll(`.${representationTypeSel.property('value')}`).classed('dn', false);
	
}

function positionElement(elem, evX, evY, preferLeft=false){
	evX = evX + 10;
	evY = evY + 10;
	topY = window.visualViewport.pageTop;
	botY = window.visualViewport.pageTop + window.visualViewport.height;
	lefX = window.visualViewport.pageLeft;
	rigX = window.visualViewport.pageLeft + window.visualViewport.width;
	rect = elem.node().getBoundingClientRect();
	elemH = rect.height;
	elemW = rect.width;
	
	if(botY - evY < elemH){
		if(evY - topY > elemH){
			evY = evY - elemH - 20;
		}else{
			evY = evY + 10;
		}
	}
	
	if(preferLeft){
		if(evX - lefX > elemW){
			evX = evX - elemW - 20;
		}else{
			evX = 10;
		}
	}else{
		if(rigX - evX < elemW){
			if(evX - lefX > elemW){
				evX = evX - elemW - 20;
			}else{
				evX = evX + 10;
			}
		}			
	}
	
	elem.style("left",evX + "px")
			.style("top",evY + "px");				
}

function showTooltip(evt, d){
	if (mouseTimer) {
		clearTimeout(mouseTimer);
	}
	evt.stopPropagation();
	let tipHtml = d3.select(this).attr('data-tip');
	let tipTimeout = +d3.select(this).attr('tip-timeout');
	if(!tipHtml) return;
	tooltipDiv.selectAll('*').remove();
	tooltipDiv.html(tipHtml);
	tooltipDiv.classed('dn', false);
	positionElement(tooltipDiv, evt.pageX, evt.pageY);
	if(tipTimeout > 0){
		mouseTimer = setTimeout(hideTooltip, tipTimeout);
	}
}

function moveTooltip(evt, d){
	if(tooltipDiv.classed('dn')) return;
	positionElement(tooltipDiv, evt.pageX, evt.pageY);
}

function hideTooltip(evt, d){
	tooltipDiv.classed('dn', true);
	if (mouseTimer) {
		clearTimeout(mouseTimer);
	}
}

function getCleanStringForHtmlId(w){
	// adding '' to convert to string
	w = w + '';
	w = w.toLowerCase();
	// replacing special characters with underscore
	// let re = new RegExp('[\s\/\.,:()\\;&?|\'\[\]]', 'ig');
	let re = /[\s\/\.,:()\\;&?|\'\[\]"]/ig;
	w = w.replace(re, '_');
	return w;
}

function downloadTable(){
	let tableHeader = ['user', 'num_docs'];
	actionCols.forEach((ac) => {
		tableHeader.push(actionKeyDict[ac]['num']);
	});
	
	actionCols.forEach((ac) => {
		tableHeader.push(actionKeyDict[ac]['avg']);
	});
	
	let allRows = [], row;
	
	tableArr.forEach((ta) => {
		row = [];
		tableHeader.forEach((th) => {
			row.push(ta[th] ? ta[th] : '');
		});
		allRows.push(row);
	});
	
	allRows.unshift(tableHeader.map(d => colsObj[d]['long_name']));
	downloadCSV(allRows);
}

function downloadCSV(arr){
	let csvContent = "";
	arr.forEach(rowArray => {
		let row = rowArray.map(cell => {
			// Convert cell to string to handle non-string values
			let stringCell = String(cell); 
			// Escape existing double quotes by doubling them
			let escapedCell = stringCell.replace(/"/g, '""'); 
			// Wrap in quotes if it contains comma, newline, or a double quote
			if (escapedCell.includes(',') || escapedCell.includes('\n') || escapedCell.includes('\r') || stringCell.includes('"')) {
				return `"${escapedCell}"`;
			}
			return escapedCell;
		}).join(',');
		csvContent += row + '\n';
	});

	let blob = new Blob([decodeURIComponent(encodeURI(csvContent))], {
					type: "text/csv;charset=utf-8;"
	});
	// For IE (tested 10+)
	if (window.navigator.msSaveOrOpenBlob) {
		navigator.msSaveBlob(blob, 'export.csv');
	} else {
		let a = window.document.createElement("a");
		a.href = window.URL.createObjectURL(blob, {type: "text/csv"});
		a.download = "export.csv";
		document.body.appendChild(a);
		a.click();  // IE: "Access is denied"; see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
		document.body.removeChild(a);
	}
}
