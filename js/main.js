/* main JS file */

console.log("Hello JS world!");

// initialize variables
var all_data;
var lottery_data;
var round_1_data;
var round_2_data;


// load all data and make everything numbers
d3.csv("x_test.csv", function(error, dataCsv) {
    if (!error) {
        all_data = dataCsv;
        all_data.forEach(function(d) {
            d['3PAr'] = +d['3PAr']; // convert to number
            d['3Pp'] = +d['3Pp'];
            d.BLKP = +d.BLKP
            d.DRBP = +d.DRBP
            d.FTAr = +d.FTAr
            d.FTp = +d.FTp
            d.ORBP = +d.ORBP
            d.PER = +d.PER
            d.Predictions = +d.Predictions;
            d.STLP = +d.STLP
            d['ast/to'] = +d['ast/to'];
            d.TSP = +d.TSP
            d.TRBP = +d.TRBP
            d.USGP = +d.USGP
        });

    }
});

// load lottery data and make everything numbers
d3.csv("x_test_lottery.csv", function(error, dataCsv) {
    if (!error) {
        lottery_data = dataCsv
        lottery_data.forEach(function(d) {
            d['3PAr'] = +d['3PAr']; // convert to number
            d['3Pp'] = +d['3Pp'];
            d.BLKP = +d.BLKP;
            d.DRBP = +d.DRBP;
            d.FTAr = +d.FTAr;
            d.FTp = +d.FTp;
            d.ORBP = +d.ORBP;
            d.PER = +d.PER;
            d.Predictions = +d.Predictions;
            d.STLP = +d.STLP;
            d['ast/to'] = +d['ast/to'];
            d.TSP = +d.TSP;
            d.TRBP = +d.TRBP;
            d.USGP = +d.USGP;
        });
    }
});

// load 1st round data and make everything numbers
d3.csv("x_test_round_1.csv", function(error, dataCsv) {
    if (!error) {
        round_1_data = dataCsv
        round_1_data.forEach(function(d) {
            d['3PAr'] = +d['3PAr']; // convert to number
            d['3Pp'] = +d['3Pp'];
            d.BLKP = +d.BLKP;
            d.DRBP = +d.DRBP;
            d.FTAr = +d.FTAr;
            d.FTp = +d.FTp;
            d.ORBP = +d.ORBP;
            d.PER = +d.PER;
            d.Predictions = +d.Predictions;
            d.STLP = +d.STLP;
            d['ast/to'] = +d['ast/to'];
            d.TSP = +d.TSP;
            d.TRBP = +d.TRBP;
            d.USGP = +d.USGP;
        });
    }
});

// load 2nd round data and make everything numbers
d3.csv("x_test_round_2.csv", function(error, dataCsv) {
    if (!error) {
        round_2_data = dataCsv
        round_2_data.forEach(function(d) {
            d['3PAr'] = +d['3PAr']; // convert to number
            d['3Pp'] = +d['3Pp'];
            d.BLKP = +d.BLKP;
            d.DRBP = +d.DRBP;
            d.FTAr = +d.FTAr;
            d.FTp = +d.FTp;
            d.ORBP = +d.ORBP;
            d.PER = +d.PER;
            d.Predictions = +d.Predictions;
            d.STLP = +d.STLP;
            d['ast/to'] = +d['ast/to'];
            d.TSP = +d.TSP;
            d.TRBP = +d.TRBP;
            d.USGP = +d.USGP;
        });
    }
    makeVis();
});

// Make the visualization with scatter plot and the sliders
function makeVis() {
    ScatterPlot = new ScatterPlot("scatter_plot", all_data, lottery_data, round_1_data, round_2_data);
    Slider = new Slider('slider', all_data);

}