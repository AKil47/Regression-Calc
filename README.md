# Regression-Calc
A simple online tool and library that applies multiple Least-Squares Regression methods to a set of X and Y values. The tool fits a variety of well defined functions and displays a graph along with error calculations to help find the best approximation.

This tool was mainly used as a pet project for me to develop my JS skills and experiment with CSS grids.

## Usage
The tool runs in any web browser. After opening the page, the user simply needs to input a series of X values and Y values into the website. After adjusting their desired regression methods and precision, the user simply hits Calculate and the web app will compute possible regression equations and display them.

The website will also display a graph and data table for better analysis.

The tool currently supports:

 1. Linear
 2. Polynomial (Any Order)
 3. Exponential (Euler)
 4. Exponential (a*b^x)
 5. Logarithmic
 6. Power

## Getting Started
### Prerequisites
Any basic webserver should suffice. I recommend serve.

This project was written with the intention of using as few external libraries as possible. Besides the math-printing, everything else is written in Pure JS.

### Running the Application
Just fire up the webserver in the root directory and browse to the provided url in a browser. The application will auto-start.

## Built With
KaTeX for Math Formatting
Uses CSS Grids for Layout
Vanilla JS