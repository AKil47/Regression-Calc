# Regression-Calc
A simple online tool and library that applies multiple Least-Squares Regression methods to a set of X and Y values. The tool fits a variety of well defined functions and displays a graph along with error calculations to help find the best approximation.

The mathematics and logic of the application can be used separately through the included `regression` library (see below).

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

The application's main UI is located in the index.html page. Depending on the webserver, you might need to browse to [URL:port]/index.html.

## Built With
KaTeX for Math Formatting
Uses CSS Grids for Layout
Vanilla JS

# Regression Library
Inside of the `js` folder, `regression.js` takes care of all of the math behind the application. The library is written in Pure Vanilla JS and functions can be used independently without the front-end application.

## Usage
In order to use any of the regression methods, a `domain` and `range` must be provided. The domain must have unique values and needs to be the same length as the range.

After including the library (either through a JS Import or a script tag), the user can use any of the methods in the `regression` object. Currently these are:

 1. `regression.linear(domain, range)`
 2. `regression.polynomial(domain, range, order)`
 3. `regression.logarithmic(domain, range)`
 4. `regression.exponential(domain, range)`
 5. `regression.ab_exponential(domain, range)`
 
 All of the methods will return a `RegressionEquation` object which will have the relevant details of the fitted equation.

## Library Objects
 ### `regression`
 This object holds the methods for different models to fit the data.
 #### Methods:
  1. `regression.linear(domain, range)`
 2. `regression.polynomial(domain, range, order)`
 3. `regression.logarithmic(domain, range)`
 4. `regression.exponential(domain, range)`
 5. `regression.ab_exponential(domain, range)`

All of the methods return a `RegressionEquation` object.

### `RegressionEquation`
 This object holds the properties of each model  after it has been fitted to the data.
#### Properties:
 1. `Type` - The Type of Regression
 2. `Values` - The Coefficients of the Equation
 3. `precision` - The Precision of the Values. **IMPORTANT** do not modify the `_precision` attribute in order to change the models accuracy. Instead modify the `precision` attribute which will trigger a setter function.

#### Methods:
 1. `predict(x)` - Uses the model to predict the y-value from a given x as an input
 2. `string() or toString()`  - Calling either method will return the equation in string form. This form can be piped into a LaTeX based compiler to properly format the expression.
 3. `getCorrCoeff(domain, range)` - Tests the model against a given domain and range and returns the Correlation Coefficient
 4. `getCorrDet(domain, range)` - Tests the model against a given domain and range and returns the Correlation Determinant
 5. `getstdErr(domain, range)` - Tests the model against a given domain and range and returns the Standard Error in a Percentage.
 
The corrCoeff, corrDet, and stdErr can be used on different datasets than the one provided. This means that you could potentially fit the model with a set of training data and then later test it with new data.

## Examples
Run a linear regression on a dataset and return the equation in LaTeX string form

    linEq = regression.linear(domain, range)
    console.log(linEq.toString())
Run an exponential regression on a dataset and set the precision to 3 decimal places. Then test the function for x = 4

    expEq = regression.exponential(domain, range)
    expEq.precision = 3
    console.log(expEq.predict(4))
Get a quadratic and cubic function estimate from the dataset and then calculate the standard error.

    //Create the Equations
    quadEq = regression.polynomial(domain, range, 2)
    cubEq = regression.polynomial(domain, range, 3)
    //log the errors when used against the same domain and range
    console.log(`Quadratic ${quadEq.getstdErr(domain, range)}`)
    console.log(`Cubic ${cubEq.getstdErr(domain, range)}`)

# Contributions
All pull requests are welcome!
Please try to limit the use of external libraries such as JS/CSS frameworks for the time being. 
If you are implementing a new regression method, please comment the formula and be sure to include the methods prediction, toString, and error functions if appropriate.