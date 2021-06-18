////////////////////////////////////////////////////////////
//////////////////////// Set-Up ////////////////////////////
////////////////////////////////////////////////////////////

var margin = {left:2, top:2, right:2, bottom:2},
	width = Math.min(window.innerWidth, 350) - margin.left - margin.right,
    height = Math.min(window.innerWidth, 350) - margin.top - margin.bottom,
    innerRadius = Math.min(width, height) * .3,
    outerRadius = innerRadius * 1.05;
	
var Names = ["effective", "efficient", "protection", "side effect", "voluntary", "negotiate", "contract", "delivery","Orbán","Szijjártó", "Pfizer","Moderna","Astrazeneca","Sputnik","Sinopharm"]
	colors = ["olivedrab", "olivedrab", "olivedrab", "thistle", "thistle", "lightblue", "lightblue", "lightblue", "goldenrod", "goldenrod", "gainsboro", "gainsboro", "gainsboro", "gainsboro", "gainsboro"],
	opacityDefault = 0.8;

var matrix = [
[0,0,0,0,0,0,0,0,0,0,0.43,0.41,0.36,0.38,0.40],
[0,0,0,0,0,0,0,0,0,0,0.40,0.35,0.28,0.35,0.44],
[0,0,0,0,0,0,0,0,0,0,0.35,0.30,0.25,0.25,0.28],
[0,0,0,0,0,0,0,0,0,0,0.37,0.36,0.49,0.32,0.33],
[0,0,0,0,0,0,0,0,0,0,0.25,0.23,0.26,0.34,0.27],
[0,0,0,0,0,0,0,0,0,0,0.27,0.26,0.27,0.48,0.39],
[0,0,0,0,0,0,0,0,0,0,0.38,0.42,0.36,0.35,0.33],
[0,0,0,0,0,0,0,0,0,0,0.57,0.48,0.43,0.40,0.35],
[0,0,0,0,0,0,0,0,0,0,0.18,0.19,0.19,0.24,0.39],
[0,0,0,0,0,0,0,0,0,0,0.21,0.13,0.15,0.40,0.40],
[0.43,0.40,0.35,0.37,0.25,0.27,0.38,0.57,0.18,0.21,0,0,0,0,0],
[0.41,0.35,0.30,0.36,0.23,0.26,0.42,0.48,0.19,0.13,0,0,0,0,0],
[0.36,0.28,0.25,0.49,0.26,0.27,0.36,0.43,0.19,0.15,0,0,0,0,0],
[0.38,0.35,0.25,0.32,0.34,0.48,0.35,0.40,0.24,0.40,0,0,0,0,0],
[0.40,0.44,0.28,0.33,0.27,0.39,0.33,0.35,0.39,0.40,0,0,0,0,0]
];

////////////////////////////////////////////////////////////
/////////// Create scale and layout functions //////////////
////////////////////////////////////////////////////////////

var colors = d3.scale.ordinal()
    .domain(d3.range(Names.length))
	.range(colors);

var chord = d3.layout.chord()
    .padding(.55)
    .sortChords(d3.descending)
	.matrix(matrix);
		
var arc = d3.svg.arc()
    .innerRadius(innerRadius*1.01)
    .outerRadius(outerRadius);

var path = d3.svg.chord()
	.radius(innerRadius);
	
////////////////////////////////////////////////////////////
////////////////////// Create SVG //////////////////////////
////////////////////////////////////////////////////////////
	
var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	.append("g")
    .attr("transform", "translate(" + (width/2 + margin.left) + "," + (height/2 + margin.top) + ")");

////////////////////////////////////////////////////////////
/////////////// Create the gradient fills //////////////////
////////////////////////////////////////////////////////////

//Function to create the unique id for each chord gradient
function getGradID(d){ return "linkGrad-" + d.source.index + "-" + d.target.index; }

//Create the gradients definitions for each chord
var grads = svg.append("defs").selectAll("linearGradient")
	.data(chord.chords())
   .enter().append("linearGradient")
    //Create the unique ID for this specific source-target pairing
	.attr("id", getGradID)
	.attr("gradientUnits", "userSpaceOnUse")
	//Find the location where the source chord starts
	.attr("x1", function(d,i) { return innerRadius * Math.cos((d.source.endAngle-d.source.startAngle)/2 + d.source.startAngle - Math.PI/2); })
	.attr("y1", function(d,i) { return innerRadius * Math.sin((d.source.endAngle-d.source.startAngle)/2 + d.source.startAngle - Math.PI/2); })
	//Find the location where the target chord starts 
	.attr("x2", function(d,i) { return innerRadius * Math.cos((d.target.endAngle-d.target.startAngle)/2 + d.target.startAngle - Math.PI/2); })
	.attr("y2", function(d,i) { return innerRadius * Math.sin((d.target.endAngle-d.target.startAngle)/2 + d.target.startAngle - Math.PI/2); })

//Set the starting color (at 0%)
grads.append("stop")
	.attr("offset", "0%")
	.attr("stop-color", function(d){ return colors(d.source.index); });

//Set the ending color (at 100%)
grads.append("stop")
	.attr("offset", "100%")
	.attr("stop-color", function(d){ return colors(d.target.index); });
		
////////////////////////////////////////////////////////////
////////////////// Draw outer Arcs /////////////////////////
////////////////////////////////////////////////////////////

var outerArcs = svg.selectAll("g.group")
	.data(chord.groups)
	.enter().append("g")
	.attr("class", "group")
	.on("mouseover", fade(0.15))
	.on("mouseout", fade(opacityDefault));

outerArcs.append("path")
	.style("fill", function(d) { return colors(d.index); })//interaktiv
	//.style("fill", "none")//nyomtatashoz
	.attr("d", arc);
	
////////////////////////////////////////////////////////////
////////////////////// Append Names ////////////////////////
////////////////////////////////////////////////////////////

//Append the label names on the outside
outerArcs.append("text")
    .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
    .attr("dy", ".35em")
    .style("font-size", "12px")
    .style("fill", "gray")

  .attr("class", "titles")
  .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
  .attr("transform", function(d) {
		return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
		+ "translate(" + (outerRadius + 10) + ")" //interaktiv
        //+ "translate(" + (outerRadius + 0.10) + ")"//nyomtatashoz
		+ (d.angle > Math.PI ? "rotate(180)" : "");
  })
  .text(function(d,i) { return Names[i]; });
	
////////////////////////////////////////////////////////////
////////////////// Draw inner chords ///////////////////////
////////////////////////////////////////////////////////////
  
svg.selectAll("path.chord")
	.data(chord.chords)
	.enter().append("path")
	.attr("class", "chord")
	//change the fill to reference the unique gradient ID of the source-target combination
	.style("fill", "gainsboro")
	.style("opacity", opacityDefault)
	.attr("d", path);

////////////////////////////////////////////////////////////
////////////////// Extra Functions /////////////////////////
////////////////////////////////////////////////////////////

//Returns an event handler for fading a given chord group.
function fade(opacity) {
  return function(d,i) {
    svg.selectAll("path.chord")
        .filter(function(d) { return d.source.index != i && d.target.index != i; })
		.transition()
        .style("opacity", opacity);
  };
}//fade