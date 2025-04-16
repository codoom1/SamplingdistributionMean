// DOM Elements
const populationMeanInput = document.getElementById('population-mean');
const populationSDInput = document.getElementById('population-sd');
const sampleSizeInput = document.getElementById('sample-size');
const numSamplesInput = document.getElementById('num-samples');
const numSamplesValue = document.getElementById('num-samples-value');
const populationContextSelect = document.getElementById('population-context');
const populationDescription = document.getElementById('population-description');
const distributionTypeSelect = document.getElementById('distribution-type');
const runSimulationBtn = document.getElementById('run-simulation');
const histogramChart = document.getElementById('histogram-chart');
const populationChart = document.getElementById('population-chart');
const fullscreenChart = document.getElementById('fullscreen-chart');
const fullscreenModal = document.getElementById('fullscreen-modal');
const closeModal = document.querySelector('.close-modal');
const modalTitle = document.getElementById('modal-title');
const fullscreenButtons = document.querySelectorAll('.fullscreen-btn');

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
const theoreticalMeanValue = document.getElementById('theoretical-mean');
const theoreticalMeanUnits = document.getElementById('theoretical-mean-units');

// Chart instances
let histogramChartInstance;
let populationChartInstance;
let fullscreenChartInstance;
let currentFullscreenChartType = '';

// Fullscreen Mode Functionality
fullscreenButtons.forEach(button => {
    button.addEventListener('click', () => {
        const chartType = button.getAttribute('data-chart');
        openFullscreenChart(chartType);
    });
});

closeModal.addEventListener('click', closeFullscreenChart);

// Close modal when clicking outside the content
window.addEventListener('click', (event) => {
    if (event.target === fullscreenModal) {
        closeFullscreenChart();
    }
});

// Handle ESC key to close modal
window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && fullscreenModal.style.display === 'block') {
        closeFullscreenChart();
    }
});

function openFullscreenChart(chartType) {
    currentFullscreenChartType = chartType;
    
    // Set the title based on chart type
    if (chartType === 'population') {
        modalTitle.textContent = 'Population Distribution - Fullscreen View';
    } else if (chartType === 'histogram') {
        modalTitle.textContent = 'Sampling Distribution of the Mean - Fullscreen View';
    }
    
    // Display the modal
    fullscreenModal.style.display = 'block';
    
    // Clone the chart for fullscreen view
    recreateFullscreenChart();
}

function closeFullscreenChart() {
    fullscreenModal.style.display = 'none';
    
    // Destroy the fullscreen chart instance
    if (fullscreenChartInstance) {
        fullscreenChartInstance.destroy();
        fullscreenChartInstance = null;
    }
}

function recreateFullscreenChart() {
    // Destroy existing chart if any
    if (fullscreenChartInstance) {
        fullscreenChartInstance.destroy();
    }
    
    const populationMean = parseFloat(populationMeanInput.value);
    const populationSD = parseFloat(populationSDInput.value);
    const sampleSize = parseInt(sampleSizeInput.value);
    const distributionType = distributionTypeSelect.value;
    
    if (currentFullscreenChartType === 'population') {
        // Clone population chart
        const populationData = generatePopulationData(distributionType, populationMean, populationSD, 20000);
        
        // Create population chart in fullscreen
        const populationHistogram = createHistogramBins(populationData, 50);
        const histogramData = populationHistogram.binCenters.map((center, i) => ({
            x: center,
            y: populationHistogram.bins[i]
        }));
        
        // Calculate theoretical PDF curve points
        const range = 4 * populationSD;
        const min = populationMean - range;
        const max = populationMean + range;
        const step = range / 200;
        
        const pdfCurvePoints = [];
        for (let x = min; x <= max; x += step) {
            let y;
            if (distributionType === 'normal') {
                y = normalPDF(x, populationMean, populationSD);
            } else if (distributionType === 'uniform') {
                y = uniformPDF(x, populationMean, populationSD);
            } else {
                y = normalPDF(x, populationMean, populationSD);
            }
            
            pdfCurvePoints.push({
                x: x,
                y: y
            });
        }
        
        // Set chart title based on distribution type
        let title = '';
        let curveLabel = '';
        if (distributionType === 'normal') {
            title = 'Normal Population Distribution';
            curveLabel = 'Normal Distribution';
        } else if (distributionType === 'uniform') {
            title = 'Uniform Population Distribution';
            curveLabel = 'Uniform Distribution';
        }
        
        // Define colors
        const histogramColor = 'rgba(75, 192, 192, 0.5)';
        const histogramBorderColor = 'rgba(75, 192, 192, 1)';
        const curveColor = 'rgba(153, 102, 255, 1)';
        
        fullscreenChartInstance = new Chart(fullscreenChart, {
            type: 'scatter',
            data: {
                datasets: [
                    {
                        label: 'Population Data',
                        data: histogramData,
                        type: 'bar',
                        backgroundColor: histogramColor,
                        borderColor: histogramBorderColor,
                        borderWidth: 1,
                        barPercentage: 1.0,
                        categoryPercentage: 1.0
                    },
                    {
                        label: curveLabel,
                        data: pdfCurvePoints,
                        type: 'line',
                        borderColor: curveColor,
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
                            text: 'Value',
                            font: {
                                size: 16
                            }
                        },
                        ticks: {
                            font: {
                                size: 14
                            }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Density',
                            font: {
                                size: 16
                            }
                        },
                        beginAtZero: true,
                        ticks: {
                            font: {
                                size: 14
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            title: function(tooltipItems) {
                                return `Value: ${tooltipItems[0].parsed.x.toFixed(2)}`;
                            }
                        },
                        titleFont: {
                            size: 16
                        },
                        bodyFont: {
                            size: 14
                        }
                    },
                    legend: {
                        position: 'top',
                        labels: {
                            font: {
                                size: 14
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: title,
                        font: {
                            size: 18
                        }
                    }
                }
            }
        });
    } else if (currentFullscreenChartType === 'histogram') {
        // Generate sample means with more samples for better visualization
        const numSamples = 5000; // Use more samples for better visualization in fullscreen
        const sampleMeans = generateSampleMeans(populationMean, populationSD, sampleSize, numSamples);
        
        // Calculate statistics
        const { mean, stdDev } = calculateSampleMeanStats(sampleMeans);
        
        // Create histogram bins with more bins for detail
        const numBins = Math.min(80, Math.ceil(Math.sqrt(numSamples)));
        const histogram = createHistogramBins(sampleMeans, numBins);
        
        // Calculate normal distribution curve points
        const theoreticalMean = populationMean;
        const theoreticalStdDev = populationSD / Math.sqrt(sampleSize);
        
        const range = 4 * theoreticalStdDev;
        const min = theoreticalMean - range;
        const max = theoreticalMean + range;
        const step = range / 200;
        
        const curvePoints = [];
        for (let x = min; x <= max; x += step) {
            curvePoints.push({
                x: x,
                y: normalPDF(x, theoreticalMean, theoreticalStdDev)
            });
        }
        
        // Create proper datasets for Chart.js
        const histogramData = histogram.binCenters.map((center, i) => ({
            x: center,
            y: histogram.bins[i]
        }));
        
        // Create chart subtitle based on distribution type
        let subtitle = '';
        if (distributionType === 'normal') {
            subtitle = `Sample Size (n) = ${sampleSize}`;
        } else if (distributionType === 'uniform') {
            subtitle = `Sample Size (n) = ${sampleSize} ${sampleSize >= 30 ? '(n ≥ 30 ✓)' : '(n < 30 ⚠️)'}`;
        }
        
        fullscreenChartInstance = new Chart(fullscreenChart, {
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
                            text: 'Sample Mean Value',
                            font: {
                                size: 16
                            }
                        },
                        ticks: {
                            font: {
                                size: 14
                            }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Density',
                            font: {
                                size: 16
                            }
                        },
                        beginAtZero: true,
                        ticks: {
                            font: {
                                size: 14
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            title: function(tooltipItems) {
                                return `Mean: ${tooltipItems[0].parsed.x.toFixed(2)}`;
                            }
                        },
                        titleFont: {
                            size: 16
                        },
                        bodyFont: {
                            size: 14
                        }
                    },
                    legend: {
                        position: 'top',
                        labels: {
                            font: {
                                size: 14
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: ['Sampling Distribution of the Mean', subtitle],
                        font: {
                            size: 18
                        }
                    }
                }
            }
        });
    }
}

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
distributionTypeSelect.addEventListener('change', runSimulation);

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
    theoreticalMeanUnits.textContent = context.units;
    
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

// Context definitions
const contexts = {
    'test-scores': {
        description: 'We are studying a population of student test scores.',
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
        description: 'We are studying a population of student heights.',
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
        description: 'We are studying a population of product weights.',
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
        description: 'We are studying a population of response times.',
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
        description: 'You are studying a custom population.',
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

// Initialize the simulation
function init() {
    updateStatistics();
    runSimulation();
    
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
    theoreticalMeanValue.textContent = populationMean;
    
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

// Generate random samples from a uniform distribution
function generateUniformSample(mean, stdDev) {
    // For uniform distribution on [a,b], mean = (a+b)/2 and stdDev = (b-a)/sqrt(12)
    // So b-a = sqrt(12) * stdDev
    // And if mean = (a+b)/2, then a = mean - (b-a)/2 and b = mean + (b-a)/2
    
    const range = Math.sqrt(12) * stdDev;
    const min = mean - range / 2;
    const max = mean + range / 2;
    
    return min + Math.random() * (max - min);
}

// Generate a sample based on the selected distribution type
function generateSample(mean, stdDev) {
    const distributionType = distributionTypeSelect.value;
    
    if (distributionType === 'normal') {
        return generateNormalSample(mean, stdDev);
    } else if (distributionType === 'uniform') {
        return generateUniformSample(mean, stdDev);
    }
    
    // Default to normal
    return generateNormalSample(mean, stdDev);
}

// Generate a single sample of size n and calculate its mean
function generateSampleMean(populationMean, populationSD, sampleSize) {
    let sum = 0;
    for (let i = 0; i < sampleSize; i++) {
        sum += generateSample(populationMean, populationSD);
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

// Calculate uniform distribution PDF values
function uniformPDF(x, mean, stdDev) {
    // For uniform distribution on [a,b]
    const range = Math.sqrt(12) * stdDev;
    const min = mean - range / 2;
    const max = mean + range / 2;
    
    // PDF is 1/(b-a) if x is in [a,b], and 0 otherwise
    if (x >= min && x <= max) {
        return 1 / range;
    } else {
        return 0;
    }
}

// Generate population data for visualization
function generatePopulationData(distributionType, mean, stdDev, numPoints = 10000) {
    const data = [];
    for (let i = 0; i < numPoints; i++) {
        if (distributionType === 'normal') {
            data.push(generateNormalSample(mean, stdDev));
        } else if (distributionType === 'uniform') {
            data.push(generateUniformSample(mean, stdDev));
        }
    }
    return data;
}

// Run the simulation
function runSimulation() {
    const populationMean = parseFloat(populationMeanInput.value);
    const populationSD = parseFloat(populationSDInput.value);
    const sampleSize = parseInt(sampleSizeInput.value);
    const numSamples = parseInt(numSamplesInput.value);
    const distributionType = distributionTypeSelect.value;
    
    // Generate population data for visualization
    const populationData = generatePopulationData(distributionType, populationMean, populationSD, 10000);
    
    // Update population distribution chart
    updatePopulationChart(populationData, populationMean, populationSD, distributionType);
    
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
    updateHistogramChart(histogram, curvePoints, populationMean, populationSD, sampleSize, mean, stdDev, distributionType);
    
    // If we have a fullscreen chart open, update it as well
    if (fullscreenChartInstance && fullscreenModal.style.display === 'block') {
        recreateFullscreenChart();
    }
}

// Update population distribution chart
function updatePopulationChart(populationData, populationMean, populationSD, distributionType) {
    if (populationChartInstance) {
        populationChartInstance.destroy();
    }
    
    // Create histogram bins for population data
    const populationHistogram = createHistogramBins(populationData, 30);
    
    // Create proper datasets for Chart.js
    const histogramData = populationHistogram.binCenters.map((center, i) => ({
        x: center,
        y: populationHistogram.bins[i]
    }));
    
    // Calculate theoretical PDF curve points
    const range = 4 * populationSD;
    const min = populationMean - range;
    const max = populationMean + range;
    const step = range / 100;
    
    const pdfCurvePoints = [];
    for (let x = min; x <= max; x += step) {
        let y;
        if (distributionType === 'normal') {
            y = normalPDF(x, populationMean, populationSD);
        } else if (distributionType === 'uniform') {
            y = uniformPDF(x, populationMean, populationSD);
        } else {
            y = normalPDF(x, populationMean, populationSD);
        }
        
        pdfCurvePoints.push({
            x: x,
            y: y
        });
    }
    
    // Set chart title based on distribution type
    let title = '';
    let curveLabel = '';
    if (distributionType === 'normal') {
        title = 'Normal Population Distribution';
        curveLabel = 'Normal Distribution';
    } else if (distributionType === 'uniform') {
        title = 'Uniform Population Distribution';
        curveLabel = 'Uniform Distribution';
    }
    
    // Define colors
    const histogramColor = 'rgba(75, 192, 192, 0.5)';
    const histogramBorderColor = 'rgba(75, 192, 192, 1)';
    const curveColor = 'rgba(153, 102, 255, 1)';
    
    populationChartInstance = new Chart(populationChart, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Population Data',
                    data: histogramData,
                    type: 'bar',
                    backgroundColor: histogramColor,
                    borderColor: histogramBorderColor,
                    borderWidth: 1,
                    barPercentage: 1.0,
                    categoryPercentage: 1.0
                },
                {
                    label: curveLabel,
                    data: pdfCurvePoints,
                    type: 'line',
                    borderColor: curveColor,
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
                        text: 'Value'
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
                            return `Value: ${tooltipItems[0].parsed.x.toFixed(2)}`;
                        }
                    }
                },
                legend: {
                    position: 'top'
                },
                title: {
                    display: true,
                    text: title
                }
            }
        }
    });
}

// Update histogram chart
function updateHistogramChart(histogram, curvePoints, populationMean, populationSD, sampleSize, observedMean, observedStdDev, distributionType) {
    if (histogramChartInstance) {
        histogramChartInstance.destroy();
    }
    
    // Create proper datasets for Chart.js
    const histogramData = histogram.binCenters.map((center, i) => ({
        x: center,
        y: histogram.bins[i]
    }));
    
    // Create chart subtitle based on distribution type
    let subtitle = '';
    if (distributionType === 'normal') {
        subtitle = `Sample Size (n) = ${sampleSize}`;
    } else if (distributionType === 'uniform') {
        subtitle = `Sample Size (n) = ${sampleSize} ${sampleSize >= 30 ? '(n ≥ 30 ✓)' : '(n < 30 ⚠️)'}`;
    }
    
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
                    text: ['Sampling Distribution of the Mean', subtitle],
                    font: {
                        size: 14
                    }
                }
            }
        }
    });
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init); 