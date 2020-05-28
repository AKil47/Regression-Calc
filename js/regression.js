/*
To add a new regression type
Add case in RegressionEquation class for toString and predict functions
Add method in regression object
*/
//Class for Object to hold Regression Results
let RegressionEquation = class {
	constructor(type, values) {
		this.type = type
		this.values = values
		//Hidden Property
		Object.defineProperty(this, "_precision", {
			value: 4,
			enumerable: false,
			writable: true
		});
		//set predictor f(x) based on type
		//set equation string based on type
		switch (type) {
			case "linear":
				this.predict = function(x) {
					//mx + b
					let ret = this.values[0] * x + this.values[1]
					return round(ret, this._precision)
				}
				if (this.values[1] < 0) {
					this.string = () => `y = ${this.values[0]}x - ${-(this.values[1])}`
				} else {
					this.string = () => `y = ${this.values[0]}x + ${this.values[1]}`
				}
				break;
			case "polynomial":
				this.order = values.length - 1
				this.string = function() {
					let string = ""
					for (var i = 0; i < this.order; i++) {
						string += `${this.values[i]}x^${this.order-i} + `
					}
					string += this.values[this.order]
					return string
				}
				this.predict = function(x) {
					res = 0
					for (var i = 0; i <= this.order; i++) {
						res += this.values[i] * x ** (this.order - i)
					}
					return round(res, this._precision)
				}
				break;
			case "power":
				this.predict = function(x) {
					//a * x^b
					let ret = this.values[0] * x ** this.values[1]
					return round(ret, this._precision)
				}
				this.string = () => `y = ${this.values[0]} * x^{${this.values[1]}}`
				break;
			case "ab_exponential":
				this.predict = function(x) {
					//a * b^x
					let ret = this.values[0] * this.values[1] ** x
					return round(ret, this._precision)
				}
				this.string = () => `y = ${this.values[0]} * ${this.values[1]}^x`
				break;
			case "logarithmic":
				this.predict = function(x) {
					//a + bln(x)
					let ret = this.values[0] + this.values[1] * Math.log(x)
					return round(ret, this._precision)
				}
				//this.string = () => `y = ${this.values[0]} + ${this.values[1]}ln(x)`
				this.string = () => {
					if (this.values[1] > 0) {
						return `y = ${this.values[0]} + ${this.values[1]}ln(x)`
					} else {
						return `y = ${this.values[0]} - ${this.values[1]*-1}ln(x)`
					}
				}
				break;
			case "exponential":
				this.predict = function(x) {
					let ret = Math.exp(a + b * x)
					return round(ret, this._precision)
				}
				//this.string = () => `y = e^{${this.values[0]} + ${this.values[1]}x}`
				this.string = () => {
					if (this.values[1] > 0) {
						return `y = e^{${this.values[0]} + ${this.values[1]}x}`
					} else {
						return `y = e^{${this.values[0]} - ${this.values[1]*-1}x}`
					}
				}
				break;
		}
	}
	set precision(val) {
		this._precision = val //Secret Variabel I guess
		this.values = this.values.map(x => round(x, val))
	}
	getcorrCoeff(x, y) {
		let n = x.length
		let ybar = (1 / n) * sum(y)
		const coeff = Math.sqrt(1 - ((sum(zip(y, x.map(x => this.predict(x))).map(a => (a[0] - a[1]) ** 2))) / (sum(y.map(y => (y - ybar) ** 2)))))
		return round(coeff, 3)
	}
	getcorrDet(x, y) {
		const det = this.getcorrCoeff(x, y) ** 2
		return round(det, 3)
	}
	getstdErr(x, y) {
		let n = x.length
		const err = (1 / n) * (sum(zip(y, x).map(a => Math.abs((a[0] - this.predict(a[1])) / (a[0]))))) * 100
		return round(err, 3)
	}
}
RegressionEquation.prototype.toString = function() {
	return this.string();
}
//Helper Functions for Math
const checkInput = function(x, y) {
	if (x.length != y.length) throw "Domain/Range size mismatch"
	if ((new Set(x)).size !== x.length) throw "Domain not unique"
	if (x.some(isNaN)) throw "Non-number input"
	if (y.some(isNaN)) throw "Non-number input"
}

function round(value, decimals) {
	let ret = Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
	if (isNaN(ret)) {
		ret = 0
	}
	return ret
}
const sum = function(x) {
	return x.reduce((total, num) => total + num, 0)
}
const zip = function(x, y) {
	//js implementation of python's zip
	return x.map(function(e, i) {
		return [e, y[i]];
	});
}
const ln = function(x) {
	//Math.log(x) is acutally ln(x)
	return x.map(x => Math.log(x))
}
const matrixSolver = function(A) {
	//substack github
	//returns rref matrix
	var rows = A.length;
	var columns = A[0].length;
	var lead = 0;
	for (var k = 0; k < rows; k++) {
		if (columns <= lead) return;
		var i = k;
		while (A[i][lead] === 0) {
			i++;
			if (rows === i) {
				i = k;
				lead++;
				if (columns === lead) return;
			}
		}
		var irow = A[i],
			krow = A[k];
		A[i] = krow, A[k] = irow;
		var val = A[k][lead];
		for (var j = 0; j < columns; j++) {
			A[k][j] /= val;
		}
		for (var i = 0; i < rows; i++) {
			if (i === k) continue;
			val = A[i][lead];
			for (var j = 0; j < columns; j++) {
				A[i][j] -= val * A[k][j];
			}
		}
		lead++;
	}
	return A;
};
//Regression Functions in regression Object
//Formulas obtained from planetcalc
let regression = {
	linear: function(x, y) {
		checkInput(x, y)
		let xy = zip(x, y).map(a => a[0] * a[1])
		let n = x.length
		m = (sum(x) * sum(y) - n * sum(xy)) / (sum(x) ** 2 - n * sum(x.map(x => x ** 2)))
		b = (sum(x) * sum(xy) - sum(x.map(x => x ** 2)) * sum(y)) / (sum(x) ** 2 - n * sum(x.map(x => x ** 2)))
		//return [m, b]
		return new RegressionEquation("linear", [m, b])
	},
	polynomial: function(x, y, order = 2) {
		checkInput(x, y)
		n = x.length
		matrix = []
		for (var i = order; i <= order * 2; i++) {
			row = []
			for (var j = 0; j <= order; j++) {
				row.push(i - j)
				//console.log(i + "," + j)
			}
			row.push(row[row.length - 1])
			matrix.push(row)
			//console.log(row)
		}
		for (var i = 0; i < matrix.length; i++) {
			for (var j = 0; j < matrix[i].length - 1; j++) {
				matrix[i][j] = sum(x.map(x => x ** matrix[i][j]))
			}
			matrix[i][matrix[i].length - 1] = sum(zip(x, y).map(a => a[0] ** matrix[i][matrix[i].length - 1] * a[1]))
		}
		matrix[0][order] = n
		matrix = matrixSolver(matrix)
		//return matrix
		res = []
		for (var i = 0; i < matrix.length; i++) {
			res.push(matrix[i][order + 1])
		}
		return new RegressionEquation("polynomial", res)
	},
	power: function(x, y) {
		checkInput(x, y)
		let n = x.length
		b = (n * sum(zip(x, y).map(a => Math.log(a[0]) * Math.log(a[1]))) - sum(ln(x)) * sum(ln(y))) / (n * sum(ln(x).map(x => x ** 2)) - (sum(ln(x))) ** 2)
		a = ((1 / n) * sum(ln(y))) - ((b / n) * sum(ln(x)))
		a = Math.exp(a)
		console.log("y = a*(x^b)")
		//return [a, b]
		return new RegressionEquation("power", [a, b])
	},
	ab_exponential: function(x, y) {
		checkInput(x, y)
		n = x.length
		b = (n * sum(zip(x, y).map(a => a[0] * Math.log(a[1]))) - sum(x) * sum(ln(y))) / (n * sum(x.map(x => x ** 2)) - (sum(x)) ** 2)
		b = Math.exp(b)
		a = (1 / n) * sum(ln(y)) - (Math.log(b) / n) * sum(x)
		a = Math.exp(a)
		console.log("y = a*(b^x)")
		//return [a, b]
		return new RegressionEquation("ab_exponential", [a, b])
	},
	logarithmic: function(x, y) {
		checkInput(x, y)
		n = x.length
		b = (n * sum(zip(y, x).map(a => a[0] * Math.log(a[1]))) - sum(ln(x)) * sum(y)) / (n * sum(ln(x).map(x => x ** 2)) - sum(ln(x)) ** 2)
		a = (1 / n) * sum(y) - (b / n) * sum(ln(x))
		console.log("y=a+bln(x)")
		//return [a, b]
		return new RegressionEquation("logarithmic", [a, b])
	},
	exponential: function(x, y) {
		n = x.length
		b = ((n * sum(zip(x, y).map(a => a[0] * Math.log(a[1])))) - (sum(x) * sum(y.map(y => Math.log(y))))) / ((n * sum(x.map(x => x ** 2))) - (sum(x) ** 2))
		a = ((1 / n) * sum(y.map(y => Math.log(y)))) - ((b / n) * sum(x))
		return new RegressionEquation("exponential", [a, b])
	}
}