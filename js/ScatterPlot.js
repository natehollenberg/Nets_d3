ScatterPlot = function(_parentElement, _all_data, _lottery_data, _round_1_data, _round_2_data){
    this.parentElement = _parentElement;
    this.alldata = _all_data;
    this.lotterydata = _lottery_data;
    this.round_1_data = _round_1_data;
    this.round_2_data = _round_2_data;

    this.initVis();
};

ScatterPlot.prototype.initVis = function() {

    var vis = this;

    // create margins
    vis.margin = {top: 10, right: 20, bottom: 40, left: 60};

    // create the window and parameters for the svg
    var window_width = $("#" + vis.parentElement).width()
    var window_height = $("#" + vis.parentElement).height()
    console.log(window_height)
    console.log(window_width)

    vis.width = window_width - vis.margin.left - vis.margin.right;
    vis.height = window_height - vis.margin.top - vis.margin.bottom;
    // Creating the svg
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .attr("class", "ScatterPlot_svg");

    // x and y scale, domain established alter
    vis.x = d3.scaleLinear()
        .range([vis.margin.left, vis.width - vis.margin.right]);

    vis.y = d3.scaleLinear()
        .range([vis.height, vis.margin.top]);

    // Initialize the axis
    vis.xAxis = d3.axisBottom()
        .scale(vis.x);

    vis.yAxis = d3.axisLeft()
        .scale(vis.y);

    // axis legend
    vis.svg.append("text")
        .attr("transform", "rotate(-90)")
        .merge(vis.svg.select(".y_label"))
        .attr("class", 'y_label')
        .attr("y", 15)
        .attr("x",0 - (vis.height / 2))
        .attr("dy", "1em")
        .style("font-size", 12)
        .style("text-anchor", "middle");

    vis.svg.append("text")
        .attr("class", "x_label")
        .attr("transform",
            "translate(" + (vis.width/2 + vis.margin.left) + " ," +
            (vis.height + vis.margin.bottom) + ")")
        .style("text-anchor", "middle")
        .style("font-size", 12);

    // append axes
    vis.svg.append("g")
        .attr("class", "x_axis")
        .attr("transform", "translate(0," + vis.height + ")");

    vis.svg.append("g")
        .attr("class", "y_axis")
        .attr("transform", "translate(" + vis.margin.left + ", 0)");

    vis.wrangleData();

}

ScatterPlot.prototype.wrangleData = function() {
    var vis = this;
    // initialize slider at 0
    vis.updateVis(0);

}


ScatterPlot.prototype.updateVis = function(slider_value) {
    var vis = this;
    // Ensure correct dataset selection
    var dataset = d3.select("#data_y").property("value");

    if (dataset == "All") {
        data = vis.alldata.filter(function(d) {return d.Predictions > slider_value});
    }
    else if (dataset == "Lottery") {
        data = vis.lotterydata.filter(function(d) {return d.Predictions > slider_value});
    }
    else if (dataset == "First") {
        data = vis.round_1_data.filter(function(d) {return d.Predictions > slider_value});
    }
    else {
        data = vis.round_2_data.filter(function(d) {return d.Predictions > slider_value});
    }
    // create x domain
    vis.x.domain([slider_value, 0.9]);

    // dynamic axis
    vis.svg.select(".x_axis")
        .transition().duration(vis.transition_count)
        .call(vis.xAxis);

    // create y domain
    var stat_y = d3.select("#scatter_plot_y").property("value");

    vis.y.domain(d3.extent(data, function(d) { return d[stat_y]; }));

    // dynamic y axis
    vis.svg.select(".y_axis")
        .transition().duration(vis.transition_count)
        .call(vis.yAxis);

    // Labels for x and y axis
    var label_d = {
        'PER': 'PER',
        'TSP': 'True Shooting %',
        'USGP': 'Usage %',
        '3Pp': 'Three-Point Rate',
        '3PAr': 'Three-Point Rate',
        'ast/to': 'Assist/Turnover Ratio',
        'TRBP': 'Rebounding %',
        'ORBP': 'Offensive Rebounding %',
        'DRBP': 'Defensive Rebounding %'
    };

    // Adding the y label
    vis.svg.select('.y_label')
        .text(label_d[stat_y])
        .style("font-size", 12);

    // Adding the x label
    vis.svg.select('.x_label')
        .text('Predicted Probability for NBA Success')
        .style("font-size", 12);

    // establishing points with object constantcy
    var points = vis.svg.selectAll(".player_points")
        .data(data, function (d, i) {return d.Predictions});


    // Adding the dots
    points.enter().append("circle")
        .attr("class", "player_points")
        .merge(points)
        .transition().duration(800)
        .attr("cx", function (d) {
            return vis.x(d.Predictions);
        })
        .attr("cy", function (d) {
            return vis.y(d[stat_y]);
        })
        .attr("r", 4)
        .style("fill", "black")
        .style("opacity", .3)

    points.exit().remove();




    // Creating the tooltip and opacity combo
    function tool_tip_player_details(d, x_y) {
        // Updating the opacity
        var all_points = vis.svg.selectAll(".player_points")

        all_points.style("opacity", .1)

        var id = d.id

        // Getting the statistics
        var age = d.Age;
        var height = d.Height;
        var pos = d.Position;
        var rank = d.Ranking;
        var preds = d.Predictions



        var tip_stats = ['Player ID: ' + id, 'Age: ' + age, 'Height: ' + height + ' in.', 'Position: ' + pos,
            'Ranking: ' + rank, 'Probability: ' + preds]

        // Setting the x axis so doesn't get cut off
        x_y[0] = Math.max(x_y[0], vis.margin.left*2);
        x_y[0] = Math.min(x_y[0], vis.width - vis.margin.right * 2);

        // Tooltip above
        if (x_y[1] > vis.height*.25) {
            for (var i = 0; i < tip_stats.length; i++) {
                vis.svg.append("text")
                    .attr("class", "tooltip_text")
                    .attr("x", x_y[0])
                    .attr("y", x_y[1] - (tip_stats.length - i) * 18 + 2)
                    .attr("font-size", 12)
                    .attr("text-anchor", "left")
                    .attr("font-weight", function (d) {
                        if (i === 0) {
                            return "bold"
                        } else {
                            return "regular"
                        }
                    })
                    .html(tip_stats[i])
            }}

        // Tooltip below
        else {
            for (var i = 0; i < tip_stats.length; i++) {
                vis.svg.append("text")
                    .attr("class", "tooltip_text")
                    .attr("x", x_y[0])
                    .attr("y", x_y[1] + (tip_stats.length - i) * 18 + 10)
                    .attr("font-size", 12)
                    .attr("text-anchor", "left")
                    .attr("font-weight", function (d) {
                        if (i === tip_stats.length - 1) {
                            return "bold"
                        } else {
                            return "regular"
                        }
                    })
                    .html(tip_stats[tip_stats.length - i - 1])
            }}
    }

    vis.svg.selectAll(".player_points")
        .on('mouseover', function(d) {
            // Getting the position
            var x_y = d3.mouse(this)

            // Updating the tool tip
            tool_tip_player_details(d, x_y);

            // Ensuring the one we're on remains red and with high opacity
            d3.select(this).style("fill", "red").style("opacity", 1);
        })
        // .on('mouseout', tool_tip_player_details.hide)
        .on('mouseout', function(d) {
            // Getting all the points
            var all_points = vis.svg.selectAll(".player_points")

            // Ensuring that it is the correct color and opacity
            all_points
                .style("fill", "black")
                .style("opacity", .3)

            // Removing the text
            var text = vis.svg.selectAll(".tooltip_text")
            text.remove()
        })
        // update the stats table on click
        .on('click', function (d) {
            document.getElementById('ID').innerHTML = d.id;
            document.getElementById('Age').innerHTML = d.Age;
            document.getElementById('Rank').innerHTML = d.Ranking;
            document.getElementById('Height').innerHTML = d.Height + ' in.';
            document.getElementById('Pos').innerHTML = d.Position;
            document.getElementById('three-point-rate').innerHTML = d['3PAr'] + '%';
            document.getElementById('three-point-%').innerHTML = d['3Pp'] + '%';
            document.getElementById('Blocks').innerHTML = d.BLKP + '%';
            document.getElementById('DRB').innerHTML = d.DRBP + '%';
            document.getElementById('free-throw-rate').innerHTML =d.FTAr + '%';
            document.getElementById('free-throw-%').innerHTML =d.FTp + '%';
            document.getElementById('ORB').innerHTML =d.ORBP + '%';
            document.getElementById('PER').innerHTML = d.PER;
            document.getElementById('pred').innerHTML =d.Predictions;
            document.getElementById('Steals').innerHTML =d.STLP + '%';
            document.getElementById('AST').innerHTML =d['ast/to'] + '%';
            document.getElementById('TS').innerHTML =d.TSP + '%';
            document.getElementById('TRB').innerHTML =d.TRBP + '%';
            document.getElementById('Usage').innerHTML =d.USGP + '%';
        })





};