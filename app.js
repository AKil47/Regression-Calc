let domain_input = document.getElementById("domain-input");
let range_input = document.getElementById("range-input");

let calculate_button = document.getElementById("calculate-button");
let precision_input = document.getElementById("precision-input")
let precision_input_view = document.getElementById("precision-input-view")
let regression_type_input = document.getElementById("regression-type-input");

let reg_result = document.getElementById("reg-result");
let reg_table = document.getElementById("reg-table");
let reg_table_container = document.getElementById("reg-table-container")
let reg_graphs = document.getElementById("reg-graphs");
let reg_graphs_container = document.getElementById("reg-graphs-container")

let fab_main = document.getElementById("fab-main");
let fab_options = document.getElementById("fab-options")

let error_notif = document.getElementById("error-notif")
//Error Listener
window.addEventListener("error", event => {
    error_notif.innerHTML = `
    <span class="closebtn" onclick="this.parentElement.style.display='none';">&times</span>
    ${event.message}
`
    error_notif.style.display = "block"
})
//Event listener for fab
menuActive = false
fab_options.style.display = "none"
fab_main.onclick = function() {
    if (menuActive == false) {
        fab_options.classList.remove("slide-out-bottom")
        /*
        setTimeout(function(){
            fab_options.style.display = 'inline';
        }, 500);
        */
       fab_options.style.display = 'inline'
        fab_options.classList.add("slide-in-bottom")
        menuActive = true
    } else {
        fab_options.classList.remove("slide-in-bottom")
        fab_options.classList.add("slide-out-bottom")
        setTimeout(function(){
            fab_options.style.display = 'none';
        }, 500);
        menuActive = false
    }
}
//Event listener for enter key
domain_input.addEventListener("keyup", ({
	keyCode
}) => {
	if (keyCode === 13) {
		calculate_button.click();
	}
});
range_input.addEventListener("keyup", ({
	keyCode
}) => {
	if (keyCode === 13) {
		calculate_button.click();
	}
});
precision_input.oninput = function() {
    precision_input_view.value = precision_input.value
}
//Function for each regression type create element
let createRegressionElement = function(domain, range, regEq) {
	let container = document.createElement("div")
	//container.classList.add("reg-detail-container")
	container.id = `${regEq.type}-details-container`
	/*
	let equation = document.createElement("strong")
	equation.innerText = regEq.toString()
	*/
	let label = document.createElement("h4")
	label.innerText = regEq.type
	let equation = document.createElement("span")
	katex.render(regEq.toString(), equation);
	let stdError = document.createElement("p")
	//stdError.innerText = "Std Error: " + regEq.getstdErr(domain, range)
	stdError.innerHTML = `Std Error: <b>${regEq.getstdErr(domain, range)}%</b>`
	let corrCoeff = document.createElement("p")
	//corrCoeff.innerText = "Corr Coeff: " + regEq.getcorrCoeff(domain, range)
	corrCoeff.innerHTML = `Corr Coeff: <b>${regEq.getcorrCoeff(domain, range)}</b>`
	container.appendChild(label)
	container.appendChild(equation)
	container.appendChild(corrCoeff)
	container.appendChild(stdError)
	return container
}
let createRegressionGraph = function(domain, range, regEqs) {
	//Colors taken from learnui.design/tools/data-color-picker
	colors = ['#003f5c', '#374c80', '#7a5195', '#bc5090', '#ef5675', '#ff764a', '#ffa600']
	config = {
		type: "scatter",
		options: {
			scales: {
				xAxes: [{
					ticks: {
						suggestedMin: domain[0],
						max: domain[domain.length - 1]
					}
				}],
				yAxes: [{
					ticks: {
						suggestedMin: range[0],
						suggestedMax: range[range.length - 1]
					}
				}]
			}
		},
		data: {
			datasets: [{
				//Uses zip from regression.js
				data: zip(domain, range).map(a => ({
					x: a[0],
					y: a[1]
				})),
				fill: false,
				label: "Actual Data",
				backgroundColor: colors[0],
				borderColor: colors[0],
				order: 0,
				pointStyle: "cross",
				radius: 10
			}]
		}
	}
	for (var i = 0; i < regEqs.length; i++) {
		dataset = {
			data: domain.map(x => ({
				x,
				y: regEqs[i].predict(x)
			})),
			fill: false,
			label: regEqs[i].type,
			backgroundColor: colors[i + 1],
			borderColor: colors[i + 1],
			showLine: true
		}
		config.data.datasets.push(dataset)
	}
	return config
}
//List all regression options with checboxes
for (type in regression) {
	let container = document.createElement("div")
	let checkbox = document.createElement("input")
	checkbox.type = "checkbox"
	checkbox.id = type + "-input"
	checkbox.checked = true
	let label = document.createElement("label")
	label.innerText = type
	label.htmlFor = type
	container.appendChild(checkbox)
	container.appendChild(label)
	/*
	regression_type_input.appendChild(checkbox)
	regression_type_input.appendChild(label)
	*/
	regression_type_input.append(container)
}
//Calculate Button Event Handler
calculate_button.onclick = function(event) {
	domain = domain_input.value.split(",").map(x => +x);
	range = range_input.value.split(",").map(x => +x);
    precision = +precision_input.value
    
	//Initialize Function Table
    reg_table.innerHTML = ""
    reg_table_container.children[1].innerHTML=""
	let headRow = reg_table.createTHead().insertRow(0);
	let cell = headRow.insertCell(0)
	cell.outerHTML = "<th>x</th>"
	cell = headRow.insertCell(1)
    cell.outerHTML = "<th>actual</th>"
    
    let bodyRow = reg_table.createTBody();
	for (var x = 0; x < domain.length; x++) {
		bodyRow.insertRow(x)
		bodyRow.rows[x].insertCell(0)
		bodyRow.rows[x].cells[0].innerText = domain[x]
		bodyRow.rows[x].insertCell(1)
		bodyRow.rows[x].cells[1].innerText = range[x]
    }
    
	reg_result.innerHTML = ""
	regEqs = []
	for (type in regression) {
		if (document.getElementById(type + "-input").checked) {
			//List Equations
			let regEq = regression[type](domain, range)
			regEq.precision = precision
			regEqs.push(regEq)
            reg_result.appendChild(createRegressionElement(domain, range, regEq))
            
			//Create function table column
			//Column Header
			cell = headRow.insertCell(-1)
			cell.outerHTML = `<th>${type}</th>`
			//Populate Column Values
			for (var x = 0; x < domain.length; x++) {
				index = bodyRow.rows[x].cells.length
				bodyRow.rows[x].insertCell(index)
				bodyRow.rows[x].cells[index].innerText = regEq.predict(domain[x])
			}
		}
	}
    //Draw Graph
    reg_graphs_container.children[1].innerHTML = ""
	let lineChart = new Chart(reg_graphs, createRegressionGraph(domain, range, regEqs))
}