const max = 100
primes=[]
divisors = {1:[1]}
diffs = {1:0}
function getPrimeDivisors(n) {
    return primes.filter(p => n%p == 0)
}

function calcDivisorDiffs(max) {
    for(i=2;i<max;i++) {
        var pdivs = getPrimeDivisors(i)
        var divs = pdivs
        for (e of pdivs){
            divs = divs.concat(divisors[(i/e)])
        }
        if (pdivs.length == 0)
            primes.push(i)
        divs = divs.concat([1,i])
        divs = Array.from(new Set(divs))
        divisors[i] = divs
        diffs[i] = i- divs.length  
    }
}



function buildGraph() {
    // Create a new directed graph
    var g = new dagreD3.graphlib.Graph().setGraph({});

    var svg = d3.select("svg"),
        inner = svg.select("g");

    // Create the renderer
    var render = new dagreD3.render();

    g.setNode(0, {label: 0, shape: "circle", style: "fill: #ff0000"})

    function addNode(node, instantRender){
        var isPrime = -1 != primes.indexOf(node)
        var filling = "fill: #888888"
        if (isPrime)
            filling = "fill: #ff8888"
        g.setNode(node, {label: node, style: filling, shape: "circle"});
        g.setEdge(node,diffs[node], {label:"", curve: d3.curveBasis});

        // Render the graph into svg g
        if (instantRender){
            svg.call(render, g);
        }
    }

    for (var e=1;e < max;e++) {
        const x = e;
        // setTimeout(function(){addNode(x, true)},  e*200)
        addNode(x, false)
        
    }
    g.graph().transition = function(selection) {
          return selection.transition().duration(150);
    };



    // Set up zoom support
    var zoom = d3.zoom().on("zoom", function() {
          inner.attr("transform", d3.event.transform);
        });

    svg.call(zoom)
    

    // Run the renderer. This is what draws the final graph.
    render(inner, g);

    svg.attr('height', "100%");
    svg.attr('width', "100%");

    function center() {
        // Center the graph
        var initialScale = 0.75;
        svg.call(zoom.transform, d3.zoomIdentity.translate((svg.attr("width") - g.graph().width * initialScale) / 2, 20).scale(initialScale));

    }
}
  
calcDivisorDiffs(max)
buildGraph()