// DOM Elements
const populationMeanInput = document.getElementById('population-mean');
const populationSDInput = document.getElementById('population-sd');
const sampleSizeInput = document.getElementById('sample-size');
const numSamplesInput = document.getElementById('num-samples');
const numSamplesValue = document.getElementById('num-samples-value');
const populationContextSelect = document.getElementById('population-context');
const populationDescription = document.getElementById('population-description');
const runSimulationBtn = document.getElementById('run-simulation');
const histogramChart = document.getElementById('histogram-chart');

// Context-related elements
const contextDescription = document.getElementById('context-description');
const variableDescription = document.getElementById('variable-description');
const sampleSizeText = document.getElementById('sample-size-text');
const numSamplesText = document.getElementById('num-samples-text');
const meanUnits = document.getElementById('mean-units');
const sdUnits = document.getElementById('sd-units');
const statsMeanUnits = document.getElementById('stats-mean-units');
const statsSDUnits = document.getElementById('stats-sd-units');
const statsSEUnits = document.getElementById('stats-se-units');
const statsObservedMeanUnits = document.getElementById('stats-observed-mean-units');
const statsObservedSEUnits = document.getElementById('stats-observed-se-units');

// Statistics Display Elements
const popMeanValue = document.getElementById('pop-mean-value');
const popSDValue = document.getElementById('pop-sd-value');
const sampleSizeValue = document.getElementById('sample-size-value');
const expectedSE = document.getElementById('expected-se');
const observedMean = document.getElementById('observed-mean');
const observedSE = document.getElementById('observed-se');

// Chart instances
let histogramChartInstance;

// Context definitions
const contexts = {
    'test-scores': {
        description: 'We are studying a population of student test scores, which are normally distributed.',
        variable: 'test scores',
        units: 'points',
        defaultMean: 50,
        defaultSD: 15,
        minMean: 0,
        maxMean: 100,
        minSD: 1,
        maxSD: 30
    },
    'heights': {
        description: 'We are studying a population of student heights, which are normally distributed.',
        variable: 'heights',
        units: 'cm',
        defaultMean: 170,
        defaultSD: 10,
        minMean: 120,
        maxMean: 220,
        minSD: 1,
        maxSD: 30
    },
    'weights': {
        description: 'We are studying a population of product weights, which are normally distributed.',
        variable: 'weights',
        units: 'grams',
        defaultMean: 500,
        defaultSD: 25,
        minMean: 100,
        maxMean: 1000,
        minSD: 1,
        maxSD: 100
    },
    'times': {
        description: 'We are studying a population of response times, which are normally distributed.',
        variable: 'response times',
        units: 'ms',
        defaultMean: 350,
        defaultSD: 75,
        minMean: 100,
        maxMean: 1000,
        minSD: 10,
        maxSD: 200
    },
    'custom': {
        description: 'You are studying a custom population with a normal distribution.',
        variable: 'values',
        units: 'units',
        defaultMean: 50,
        defaultSD: 15,
        minMean: 0,
        maxMean: 1000,
        minSD: 1,
        maxSD: 500
    }
};

// Update displayed values
numSamplesInput.addEventListener('input', () => {
    numSamplesValue.textContent = numSamplesInput.value;
    numSamplesText.textContent = numSamplesInput.value;
});

sampleSizeInput.addEventListener('input', () => {
    sampleSizeText.textContent = sampleSizeInput.value;
    updateStatistics();
});

populationMeanInput.addEventListener('input', updateStatistics);
populationSDInput.addEventListener('input', updateStatistics);

// Handle context change
populationContextSelect.addEventListener('change', updateContext);

function updateContext() {
    const selectedContext = populationContextSelect.value;
    const context = contexts[selectedContext];
    
    // Update descriptions
    populationDescription.textContent = context.description;
    contextDescription.textContent = context.variable;
    variableDescription.textContent = context.variable;
    
    // Update units
    meanUnits.textContent = context.units;
    sdUnits.textContent = context.units;
    statsMeanUnits.textContent = context.units;
    statsSDUnits.textContent = context.units;
    statsSEUnits.textContent = context.units;
    statsObservedMeanUnits.textContent = context.units;
    statsObservedSEUnits.textContent = context.units;
    
    // Update input ranges
    populationMeanInput.min = context.minMean;
    populationMeanInput.max = context.maxMean;
    populationMeanInput.value = context.defaultMean;
    
    populationSDInput.min = context.minSD;
    populationSDInput.max = context.maxSD;
    populationSDInput.value = context.defaultSD;
    
    // Update statistics
    updateStatistics();
    
    // Run simulation with new context
    runSimulation();
}

// Initialize the simulation
function init() {
    updateContext(); // Initialize with default context
    updateStatistics();
    runSimulation();
    
    // Update text elements
    sampleSizeText.textContent = sampleSizeInput.value;
    numSamplesText.textContent = numSamplesInput.value;
    
    // Event listeners
    runSimulationBtn.addEventListener('click', runSimulation);
}

// Update the statistics display
function updateStatistics() {
    const populationMean = parseFloat(populationMeanInput.value);
    const populationSD = parseFloat(populationSDInput.value);
    const sampleSize = parseInt(sampleSizeInput.value);
    
    // Update displayed values
    popMeanValue.textContent = populationMean;
    popSDValue.textContent = populationSD;
    sampleSizeValue.textContent = sampleSize;
    
    // Calculate and display expected standard error
    const theoreticalSE = populationSD / Math.sqrt(sampleSize);
    expectedSE.textContent = theoreticalSE.toFixed(2);
}

// Generate random samples from a normal distribution using Box-Muller transform
function generateNormalSample(mean, stdDev) {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return z * stdDev + mean;
}

// Generate a single sample of size n and calculate its mean
function generateSampleMean(populationMean, populationSD, sampleSize) {
    let sum = 0;
    for (let i = 0; i < sampleSize; i++) {
        sum += generateNormalSample(populationMean, populationSD);
    }
    return sum / sampleSize;
}

// Generate multiple sample means
function generateSampleMeans(populationMean, populationSD, sampleSize, numSamples) {
    const sampleMeans = [];
    for (let i = 0; i < numSamples; i++) {
        sampleMeans.push(generateSampleMean(populationMean, populationSD, sampleSize));
    }
    return sampleMeans;
}

// Calculate statistics for sample means
function calculateSampleMeanStats(sampleMeans) {
    const n = sampleMeans.length;
    const mean = sampleMeans.reduce((sum, value) => sum + value, 0) / n;
    
    const squaredDiffs = sampleMeans.map(value => Math.pow(value - mean, 2));
    const variance = squaredDiffs.reduce((sum, value) => sum + value, 0) / n;
    const stdDev = Math.sqrt(variance);
    
    return { mean, stdDev };
}

// Create histogram bins
function createHistogramBins(data, numBins = 20) {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const binWidth = (max - min) / numBins;
    
    const bins = Array(numBins).fill(0);
    const binEdges = Array(numBins + 1);
    
    for (let i = 0; i <= numBins; i++) {
        binEdges[i] = min + i * binWidth;
    }
    
    data.forEach(value => {
        const binIndex = Math.min(Math.floor((value - min) / binWidth), numBins - 1);
        bins[binIndex]++;
    });
    
    // Normalize bins for density
    const totalCount = data.length;
    const normalizedBins = bins.map(count => count / (totalCount * binWidth));
    
    return {
        bins: normalizedBins,
        binEdges,
        binCenters: binEdges.slice(0, -1).map((edge, i) => edge + binWidth / 2)
    };
}

// Calculate normal distribution PDF values
function normalPDF(x, mean, stdDev) {
    return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * 
           Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
}

// Run the simulation
function runSimulation() {
    const populationMean = parseFloat(populationMeanInput.value);
    const populationSD = parseFloat(populationSDInput.value);
    const sampleSize = parseInt(sampleSizeInput.value);
    const numSamples = parseInt(numSamplesInput.value);
    
    // Generate sample means
    const sampleMeans = generateSampleMeans(populationMean, populationSD, sampleSize, numSamples);
    
    // Calculate statistics
    const { mean, stdDev } = calculateSampleMeanStats(sampleMeans);
    
    // Update observed statistics
    observedMean.textContent = mean.toFixed(2);
    observedSE.textContent = stdDev.toFixed(2);
    
    // Create histogram bins
    const numBins = Math.min(50, Math.ceil(Math.sqrt(numSamples)));
    const histogram = createHistogramBins(sampleMeans, numBins);
    
    // Calculate normal distribution curve points
    const theoreticalMean = populationMean;
    const theoreticalStdDev = populationSD / Math.sqrt(sampleSize);
    
    const range = 4 * theoreticalStdDev;
    const min = theoreticalMean - range;
    const max = theoreticalMean + range;
    const step = range / 100;
    
    const curvePoints = [];
    for (let x = min; x <= max; x += step) {
        curvePoints.push({
            x: x,
            y: normalPDF(x, theoreticalMean, theoreticalStdDev)
        });
    }
    
    // Create or update the histogram chart
    updateHistogramChart(histogram, curvePoints);
}

// Update histogram chart
function updateHistogramChart(histogram, curvePoints) {
    if (histogramChartInstance) {
        histogramChartInstance.destroy();
    }
    
    // Create proper datasets for Chart.js
    const histogramData = histogram.binCenters.map((center, i) => ({
        x: center,
        y: histogram.bins[i]
    }));
    
    histogramChartInstance = new Chart(histogramChart, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Sample Means Frequency',
                    data: histogramData,
                    type: 'bar',
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    barPercentage: 1.0,
                    categoryPercentage: 1.0
                },
                {
                    label: 'Normal Distribution',
                    data: curvePoints,
                    type: 'line',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    fill: false,
                    pointRadius: 0,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'linear',
                    title: {
                        display: true,
                        text: 'Sample Mean Value'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Density'
                    },
                    beginAtZero: true
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            return `Mean: ${tooltipItems[0].parsed.x.toFixed(2)}`;
                        }
                    }
                },
                legend: {
                    position: 'top'
                },
                title: {
                    display: true,
                    text: 'Sampling Distribution of the Mean'
                }
            }
        }
    });
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init); 