class Calculator {
    private functionInput: HTMLInputElement;
    private rangeInput: HTMLInputElement;
    private canvas: HTMLCanvasElement;
    private chart: Chart | null;

    constructor() {
        this.functionInput = document.getElementById("function") as HTMLInputElement;
        this.rangeInput = document.getElementById("range") as HTMLInputElement;
        this.canvas = document.getElementById("graph") as HTMLCanvasElement;
        this.chart = null;
    }

    graph(): void {
        const func = this.functionInput.value;
        const [min, max] = this.parseRange(this.rangeInput.value);
        
        if (min === null || max === null) {
            alert("Invalid range. Please enter two numbers separated by a comma.");
            return;
        }

        console.log(`Graphing function: ${func} from ${min} to ${max}`);

        const points = this.generatePoints(func, min, max);
        
        if (points.length === 0) {
            alert("Unable to generate points for the given function and range.");
            return;
        }

        console.log(`Generated ${points.length} points`);
        console.log("First 5 points:", points.slice(0, 5));
        console.log("Last 5 points:", points.slice(-5));

        this.drawGraph(points);
    }

    private parseRange(range: string): [number | null, number | null] {
        const [minStr, maxStr] = range.split(",").map((s) => s.trim());
        const min = parseFloat(minStr);
        const max = parseFloat(maxStr);
        return [isNaN(min) ? null : min, isNaN(max) ? null : max];
    }

    private generatePoints(func: string, min: number, max: number): { x: number; y: number }[] {
        const points: { x: number; y: number }[] = [];
        const step = (max - min) / 100;

        for (let x = min; x <= max; x += step) {
            try {
                const y = this.evaluateFunction(func, x);
                if (!isNaN(y) && isFinite(y)) {
                    points.push({ x, y });
                } else {
                    console.warn(`Invalid y value for x=${x}: ${y}`);
                }
            } catch (error) {
                console.error(`Error evaluating function at x=${x}:`, error);
            }
        }

        return points;
    }

    private evaluateFunction(func: string, x: number): number {
        const jsFunc = func.replace(/\b(sin|cos|tan|exp|log|sqrt)\b/g, "Math.$1")
                           .replace(/\^/g, "**");
        
        try {
            const result = new Function("x", `"use strict"; return ${jsFunc}`)(x) as number;
            console.log(`Evaluated ${func} at x=${x}: ${result}`);
            return result;
        } catch (error) {
            console.error("Error in function evaluation:", error);
            throw error;
        }
    }

    private drawGraph(points: { x: number; y: number }[]): void {
        if (this.chart) {
            this.chart.destroy();
        }

        const minX = Math.min(...points.map(p => p.x));
        const maxX = Math.max(...points.map(p => p.x));
        const minY = Math.min(...points.map(p => p.y));
        const maxY = Math.max(...points.map(p => p.y));

        console.log(`X range: ${minX} to ${maxX}`);
        console.log(`Y range: ${minY} to ${maxY}`);

        this.chart = new Chart(this.canvas, {
            type: "line",
            data: {
                datasets: [{
                    label: this.functionInput.value,
                    data: points.map(p => ({ x: p.x, y: p.y })),
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
    }
}

const calculator = new Calculator();