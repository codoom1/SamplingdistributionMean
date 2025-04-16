# Sampling Distribution of the Mean Simulator

This interactive web application demonstrates the sampling distribution of the mean for educational purposes. It's designed for sophomore-level statistics classes to help students understand the Central Limit Theorem.

## Features

- Choose the population mean and standard deviation
- Adjust the sample size
- Control the number of repeated samples
- View a histogram of sample means with a normal distribution curve overlay
- See how the approximation improves as the number of samples increases
- Compare observed statistics with theoretical expectations

## Concepts Demonstrated

1. **Central Limit Theorem (CLT)**: Regardless of the shape of the original population distribution, the sampling distribution of the mean approaches a normal distribution as the sample size increases.

2. **Standard Error**: The standard deviation of the sampling distribution of the mean equals σ/√n, where σ is the population standard deviation and n is the sample size.

3. **Effect of Sample Size**: Larger sample sizes lead to sampling distributions with smaller standard errors.

4. **Effect of Number of Samples**: Increasing the number of repeated samples makes the histogram more closely approximate the theoretical normal curve.

## How to Use

1. Open `index.html` in any modern web browser
2. Adjust the population parameters:
   - Population mean (μ)
   - Population standard deviation (σ)
   - Sample size (n)
   - Number of samples
3. Click "Run Simulation" to see the results
4. Observe how changes in each parameter affect the sampling distribution

## Technical Implementation

The simulation is built using:
- HTML5
- CSS3
- JavaScript
- Chart.js for visualization

The application generates random normal samples using the Box-Muller transform method and calculates sample means to create the sampling distribution.

## Educational Use

This tool is ideal for:
- In-class demonstrations
- Interactive student exercises
- Homework assignments
- Self-directed learning 