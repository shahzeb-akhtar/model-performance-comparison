let resizeTimer,
	mouseTimer,
	loadingDiv,
	dataTextArea,
	vizDiv,
	tooltipDiv,
	projectionSel,
	vizMainDiv,
	entityColName,
	yearColName,
	valueColName,
	numIntervals,
	yearRange,
	colorScale,
	dataArr,
	entityYearMap,
	entityDataMap,
	entities,
	entityNumObj,
	lineStrokeWidth,
	lineFn,
	body;

const sampleData = `Entity	Year	GDP
China	1980	7.91
China	1981	5.1
China	1982	9
China	1983	10.8
China	1984	15.2
China	1985	13.501
China	1986	8.9
China	1987	11.7
China	1988	11.2
China	1989	4.2
China	1990	3.888
China	1991	10.203
China	1992	14.277
China	1993	13.936
China	1994	13.102
China	1995	11.016
China	1996	9.968
China	1997	9.319
China	1998	7.934
China	1999	7.757
China	2000	8.572
China	2001	8.319
China	2002	9.214
China	2003	10.121
China	2004	10.115
China	2005	11.437
China	2006	12.665
China	2007	14.154
China	2008	9.638
China	2009	9.445
China	2010	10.587
China	2011	9.451
China	2012	7.848
China	2013	7.771
China	2014	7.491
China	2015	7.018
China	2016	6.776
China	2017	6.891
China	2018	6.759
China	2019	6.065
China	2020	2.337
China	2021	8.556
China	2022	3.112
China	2023	5.377
China	2024	5.003
China	2025	4.796
China	2026	4.163
China	2027	4.186
China	2028	3.965
China	2029	3.7
China	2030	3.362
Germany	1980	1.272
Germany	1981	0.11
Germany	1982	-0.788
Germany	1983	1.555
Germany	1984	2.826
Germany	1985	2.192
Germany	1986	2.417
Germany	1987	1.469
Germany	1988	3.736
Germany	1989	3.913
Germany	1990	5.723
Germany	1991	5.011
Germany	1992	2.017
Germany	1993	-0.98
Germany	1994	2.597
Germany	1995	1.512
Germany	1996	1.031
Germany	1997	1.854
Germany	1998	2.102
Germany	1999	2.127
Germany	2000	2.879
Germany	2001	1.64
Germany	2002	-0.234
Germany	2003	-0.53
Germany	2004	1.165
Germany	2005	0.889
Germany	2006	3.857
Germany	2007	2.892
Germany	2008	0.888
Germany	2009	-5.55
Germany	2010	4.144
Germany	2011	3.758
Germany	2012	0.466
Germany	2013	0.395
Germany	2014	2.177
Germany	2015	1.663
Germany	2016	2.217
Germany	2017	2.806
Germany	2018	1.133
Germany	2019	0.973
Germany	2020	-4.127
Germany	2021	3.913
Germany	2022	1.807
Germany	2023	-0.872
Germany	2024	-0.496
Germany	2025	0.191
Germany	2026	0.944
Germany	2027	1.473
Germany	2028	1.203
Germany	2029	0.98
Germany	2030	0.679
Japan	1980	3.181
Japan	1981	4.261
Japan	1982	3.28
Japan	1983	3.63
Japan	1984	4.411
Japan	1985	5.16
Japan	1986	3.294
Japan	1987	4.649
Japan	1988	6.662
Japan	1989	4.926
Japan	1990	4.841
Japan	1991	3.523
Japan	1992	0.901
Japan	1993	-0.459
Japan	1994	1.083
Japan	1995	2.631
Japan	1996	3.134
Japan	1997	0.981
Japan	1998	-1.27
Japan	1999	-0.334
Japan	2000	2.765
Japan	2001	0.386
Japan	2002	0.042
Japan	2003	1.535
Japan	2004	2.186
Japan	2005	1.804
Japan	2006	1.372
Japan	2007	1.484
Japan	2008	-1.224
Japan	2009	-5.693
Japan	2010	4.098
Japan	2011	0.024
Japan	2012	1.375
Japan	2013	2.005
Japan	2014	0.296
Japan	2015	1.561
Japan	2016	0.754
Japan	2017	1.675
Japan	2018	0.643
Japan	2019	-0.402
Japan	2020	-4.169
Japan	2021	2.697
Japan	2022	0.96
Japan	2023	1.245
Japan	2024	0.104
Japan	2025	1.076
Japan	2026	0.633
Japan	2027	0.634
Japan	2028	0.551
Japan	2029	0.524
Japan	2030	0.496
United States	1980	-0.257
United States	1981	2.537
United States	1982	-1.803
United States	1983	4.584
United States	1984	7.236
United States	1985	4.169
United States	1986	3.463
United States	1987	3.455
United States	1988	4.177
United States	1989	3.672
United States	1990	1.886
United States	1991	-0.109
United States	1992	3.522
United States	1993	2.752
United States	1994	4.029
United States	1995	2.685
United States	1996	3.773
United States	1997	4.447
United States	1998	4.483
United States	1999	4.788
United States	2000	4.078
United States	2001	0.956
United States	2002	1.7
United States	2003	2.796
United States	2004	3.848
United States	2005	3.483
United States	2006	2.785
United States	2007	2.004
United States	2008	0.114
United States	2009	-2.576
United States	2010	2.695
United States	2011	1.564
United States	2012	2.289
United States	2013	2.118
United States	2014	2.524
United States	2015	2.946
United States	2016	1.82
United States	2017	2.458
United States	2018	2.967
United States	2019	2.584
United States	2020	-2.081
United States	2021	6.152
United States	2022	2.524
United States	2023	2.935
United States	2024	2.793
United States	2025	2.017
United States	2026	2.102
United States	2027	2.055
United States	2028	2.093
United States	2029	1.881
United States	2030	1.753`,
		currentYear = (new Date()).getFullYear(),
		chartMargins = {'top':20, 'left':30, 'right':20, 'bottom':20},
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
	loadingDiv = d3.select('#loading_div');
	inputDiv = d3.select('#input_div');
	vizMainDiv = d3.select('#viz_main_div');
	vizDiv = d3.select('#viz_div');
	tooltipDiv = d3.select('#tooltip');
	projectionSel = d3.select('#projections_start');
	body = d3.select('body');
	
	dataTextArea.property('value', sampleData);
	d3.select('.update_button').on('click', prepareChart);
	projectionSel.on('change', updateChart);
	
	d3.selectAll('input.projections_option').on('change', updateChart);
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
	let entitySet = new Set();
	let allYears = [];
	rows.forEach((r, ri) => {
		rowArr = r.split('\t');
		if (ri == 0){
			entityColName = rowArr[0];
			yearColName = rowArr[1];
			valueColName = rowArr[2];
		}else{
			obj = {};
			entitySet.add(rowArr[0]);
			allYears.push(+rowArr[1]);
			obj[entityColName] = rowArr[0];
			obj[yearColName] = +rowArr[1];
			obj[valueColName] = +rowArr[2];
			dataArr.push(obj);
		}
	});
	yearRange = d3.extent(allYears);
	numIntervals = yearRange[1] - yearRange[0];
	entities = Array.from(entitySet).sort();
	entityNumObj = {}
	
	entities.forEach((en, ei) => {entityNumObj[en] = ei});
	colorScale = d3.scaleOrdinal().domain(entities).range(d3.schemeCategory10);
	entityYearMap = d3.group(dataArr, d=>d[entityColName], d=> d[yearColName]);
	entityDataMap = d3.group(dataArr, d=>d[entityColName]);
}

function prepareChart(){ 
	processData(dataTextArea.property('value'));
	createChart();
}

function createChart(){
	vizDiv.selectAll('*').remove();
	
	// fix projection options
	let i = yearRange[0];
	projectionSel.selectAll('*').remove();
	while( i <= yearRange[1]){
		projectionSel.append('option').attr('value', i).html(i);
		i = i + 1;
	}
	if ((currentYear > yearRange[0]) && (currentYear < yearRange[1])){
		d3.select('input.apply_projections').property('checked', true);
		projectionSel.property('value', currentYear);
	}
	
	let colorLegendDiv = vizDiv.append('div').attr('class', 'h10p w100p df color_legend_div');
	let iconLegendDiv = vizDiv.append('div').attr('class', 'h5p w100p df mb20 icon_legend_div');
	let svgElem = vizDiv.append('div').attr('class', 'h80p w100p').append('svg').attr('class', 'h100p w100p');
	
	// prepare legends
	colorLegendDiv.append('div').attr('class', 'w25'); // empty div to match the scale space
	iconLegendDiv.append('div').attr('class', 'w25'); // empty div to match the scale space
	let legendDiv = colorLegendDiv.append('div').attr('class', 'f1 df fww jcsa aic'); 
	let div;
	entities.forEach((m) => {
		div = legendDiv.append('div').attr('class', 'w20p p2 df aic');
		div.append('div').attr('class', `w10 h10 mr5 color_legend_box color_box_${entityNumObj[m]}`).datum(m).style('background-color', colorScale(m)).on('mouseover', entityMOver).on('mouseout', entityMOut);
		div.append('div').attr('class', 'word-wrap fsxxs').append('span').html(m);
	});
	
	div = iconLegendDiv.append('div').attr('class', 'f1 df jcsa aic fsxxs cg');
	let leftLegendDiv = div.append('div').attr('class', 'df aic');
	let rightLegendDiv = div.append('div').attr('class', 'df aic');
	leftLegendDiv.append('span').attr('class', 'fsxxs mr5').html('—');
	leftLegendDiv.append('span').attr('class', '').html(`Solid line represents actual values, and`);
	rightLegendDiv.append('span').attr('class', 'fsxxs mr5').html('---');
	rightLegendDiv.append('span').attr('class', '').html(`Dashed line represents projected values`); 
	
	
	let rect = svgElem.node().getBoundingClientRect();	

	// prepare charts
	let allVals = [];
	dataArr.forEach((d) => {
		allVals.push(d[valueColName]);
	})
	let scaleY = d3.scaleLinear().domain(d3.extent(allVals)).nice().range([rect.height - chartMargins['bottom'], chartMargins['top']]);
	let scaleX = d3.scaleLinear().domain(yearRange).range([chartMargins['left'], rect.width - chartMargins['right']]);
	lineStrokeWidth = rect.height * 0.01;
	if(lineStrokeWidth > 3){
		lineStrokeWidth = 3;
	}
	if(lineStrokeWidth < 1.5){
		lineStrokeWidth = 1.5;
	}
	
	lineFn = d3.line().x((d) => scaleX(d[yearColName])).y((d) => scaleY(d[valueColName])).defined(d=>d[valueColName]);
	appendLines(svgElem);	

	// prepare axis
	let yAxis = d3.axisLeft(scaleY);
    svgElem.append("g")
			.attr("class", "y axis")
            .attr("transform", `translate(${chartMargins['left']}, 0)`)
            .call(yAxis);
	
	// Select and style the axis line and ticks
	svgElem.selectAll(".y.axis line, .y.axis path")
	  .style("stroke", "gray");

	// Select and style the axis text labels
	svgElem.selectAll(".y.axis text")
	  .style("fill", "gray");
	  
	let xAxis = d3.axisBottom(scaleX).tickFormat(d3.format("d"));
    svgElem.append("g")
			.attr("class", "x axis")
            .attr("transform", `translate(0, ${rect.height - chartMargins['bottom']})`)
            .call(xAxis);
	
	// Select and style the axis line and ticks
	svgElem.selectAll(".x.axis line, .x.axis path")
	  .style("stroke", "gray");

	// Select and style the axis text labels
	svgElem.selectAll(".x.axis text")
	  .style("fill", "gray");
	  
	svgElem.append("text")
    .attr("class", "y label fsxxs fwb")
    .attr("text-anchor", "middle")
    .attr("y", 5)
	.attr("x", -rect.height/2)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
	.style("fill", "gray")
    .text(valueColName);
  
	loadingDiv.classed('dn', true);
}

function appendLines(elem){
	elem.selectAll('.entity_line').remove();
	entities.forEach((en) => {
		if (! entityYearMap.has(en))return;
		lineData = [];
		for (i = yearRange[0]; i<= yearRange[1]; i++){
			if (entityYearMap.get(en).has(i)){
				lineData.push(entityYearMap.get(en).get(i)[0]);
			}else{
				let obj = {};
				obj[yearColName] = i;
				obj[valueColName] = null;
				lineData.push(obj);
			}
		}
		if (d3.select('input.apply_projections').property('checked')){
			let cutoff = +projectionSel.property('value') - 1;
			solidArr = [];
			dashedArr = [];
			lineData.forEach((ld) => {
				if(ld[yearColName]<=cutoff){
					solidArr.push(ld);
				}
				if(ld[yearColName]>=cutoff){
					dashedArr.push(ld);
				}
			});
			elem.append("path").attr('class', `entity_line line_${entityNumObj[en]}`).datum(en).attr("d", lineFn(solidArr)).style("stroke", colorScale(en)).style("stroke-width", lineStrokeWidth).attr("fill", "none").on('mouseover', entityMOver).on('mouseout', entityMOut);
			elem.append("path").attr('class', `entity_line line_${entityNumObj[en]}`).datum(en).attr("d", lineFn(dashedArr)).style("stroke", colorScale(en)).style("stroke-width", lineStrokeWidth).attr("fill", "none").style("stroke-dasharray", "4,2").on('mouseover', entityMOver).on('mouseout', entityMOut);
		}else{
			elem.append("path").attr('class', `entity_line line_${entityNumObj[en]}`).datum(en).attr("d", lineFn(lineData)).style("stroke", colorScale(en)).style("stroke-width", lineStrokeWidth).attr("fill", "none").on('mouseover', entityMOver).on('mouseout', entityMOut);
		}
	});
	
	
}

function entityMOver(evt, d){
	vizDiv.selectAll('.entity_line').style("stroke", "lightgray");
	vizDiv.selectAll('.color_legend_box').style("background-color", "lightgray");
	vizDiv.selectAll(`.color_box_${entityNumObj[d]}`).style("background-color", colorScale(d));
	vizDiv.selectAll(`.line_${entityNumObj[d]}`).style("stroke", colorScale(d)).raise();
}

function entityMOut(evt, d){
	vizDiv.selectAll('.entity_line').style("stroke", (dIn) => colorScale(dIn));
	vizDiv.selectAll('.color_legend_box').style("background-color", (dIn) => colorScale(dIn));
}
	
function updateChart(){
	let svgElem = vizDiv.select('svg');
	appendLines(svgElem);
	showHideLegend();
}

function showHideLegend(){
	if (d3.select('input.apply_projections').property('checked')){
		vizDiv.select('.icon_legend_div').classed('dn', false);
	}else{
		vizDiv.select('.icon_legend_div').classed('dn', true); 
	}
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
