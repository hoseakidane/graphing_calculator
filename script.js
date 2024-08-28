var Calculator = /** @class */ (function () {
    function Calculator() {
        this.functionInput = document.getElementById("function");
        this.rangeInput = document.getElementById("range");
        this.canvas = document.getElementById("graph");
        this.chart = null;
    }
    Calculator.prototype.graph = function () {
        var func = this.functionInput.value;
        var _a = this.parseRange(this.rangeInput.value), min = _a[0], max = _a[1];
        if (min === null || max === null) {
            alert("Invalid range. Please enter two numbers separated by a comma.");
            return;
        }
        console.log("Graphing function: ".concat(func, " from ").concat(min, " to ").concat(max));
        var points = this.generatePoints(func, min, max);
        if (points.length === 0) {
            alert("Unable to generate points for the given function and range.");
            return;
        }
        console.log("Generated ".concat(points.length, " points"));
        console.log("First 5 points:", points.slice(0, 5));
        console.log("Last 5 points:", points.slice(-5));
        this.drawGraph(points);
    };
    Calculator.prototype.parseRange = function (range) {
        var _a = range.split(",").map(function (s) { return s.trim(); }), minStr = _a[0], maxStr = _a[1];
        var min = parseFloat(minStr);
        var max = parseFloat(maxStr);
        return [isNaN(min) ? null : min, isNaN(max) ? null : max];
    };
    Calculator.prototype.generatePoints = function (func, min, max) {
        var points = [];
        var step = (max - min) / 100;
        for (var x = min; x <= max; x += step) {
            try {
                var y = this.evaluateFunction(func, x);
                if (!isNaN(y) && isFinite(y)) {
                    points.push({ x: x, y: y });
                }
                else {
                    console.warn("Invalid y value for x=".concat(x, ": ").concat(y));
                }
            }
            catch (error) {
                console.error("Error evaluating function at x=".concat(x, ":"), error);
            }
        }
        return points;
    };
    Calculator.prototype.evaluateFunction = function (func, x) {
        var jsFunc = func.replace(/\b(sin|cos|tan|exp|log|sqrt)\b/g, "Math.$1")
            .replace(/\^/g, "**");
        try {
            var result = new Function("x", "\"use strict\"; return ".concat(jsFunc))(x);
            console.log("Evaluated ".concat(func, " at x=").concat(x, ": ").concat(result));
            return result;
        }
        catch (error) {
            console.error("Error in function evaluation:", error);
            throw error;
        }
    };
    Calculator.prototype.drawGraph = function (points) {
        if (this.chart) {
            this.chart.destroy();
        }
        var minX = Math.min.apply(Math, points.map(function (p) { return p.x; }));
        var maxX = Math.max.apply(Math, points.map(function (p) { return p.x; }));
        var minY = Math.min.apply(Math, points.map(function (p) { return p.y; }));
        var maxY = Math.max.apply(Math, points.map(function (p) { return p.y; }));
        console.log("X range: ".concat(minX, " to ").concat(maxX));
        console.log("Y range: ".concat(minY, " to ").concat(maxY));
        this.chart = new Chart(this.canvas, {
            type: "line",
            data: {
                datasets: [{
                        label: this.functionInput.value,
                        data: points.map(function (p) { return ({ x: p.x, y: p.y }); }),
                        borderColor: "rgb(75, 192, 192)",
                        fill: false,
                        pointRadius: 0,
                    }]
            },
            options: {
                responsive: true,
                scales: {
                    xAxes: [{
                            type: "linear",
                            position: "bottom",
                            scaleLabel: {
                                display: true,
                                labelString: "X"
                            },
                            ticks: {
                                min: minX,
                                max: maxX
                            }
                        }],
                    yAxes: [{
                            type: "linear",
                            position: "left",
                            scaleLabel: {
                                display: true,
                                labelString: "Y"
                            },
                            ticks: {
                                min: minY,
                                max: maxY
                            }
                        }]
                }
            }
        });
    };
    return Calculator;
}());
var calculator = new Calculator();
