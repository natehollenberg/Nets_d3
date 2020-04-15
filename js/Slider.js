Slider = function(_parentElement, _alldata){
    this.parentElement = _parentElement;
    this.alldata = _alldata;
    this.count = 0;
    this.d;

    this.initVis();
};

Slider.prototype.initVis = function() {
    var vis = this;


    // Create the slider for predicted probability
    var slider = document.getElementById('slider-Predictions');

    noUiSlider.create(slider, {
        start: [0],
        range: {
            min: [0],
            max: [1]
        },
        step: 0.001,
        behaviour: 'drag',
        tooltips: [true]
    });



    vis.wrangleData();
};

Slider.prototype.wrangleData = function() {
    var vis = this
    // update scatter plot when moving slider and store the slider value
    var slider = document.getElementById('slider-Predictions');
    slider.noUiSlider.on("update", function(d) {
        if (vis.count > 0) {
            ScatterPlot.updateVis(slider.noUiSlider.get())

        }
    })
    vis.updateVis();
};


// update the sliders given the slider information
Slider.prototype.updateVis = function() {
    var vis = this;
    vis.count += 1;
};


