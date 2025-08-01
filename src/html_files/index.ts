class DataType {
	name: string;
	trueId: string;
	hideClass: string;
	callback;
	onSingleRun: string = '';

	constructor(name='', hideClass='', trueId='', callback=(boolean) => {}, onSingleRun='') {
		this.name = name;
		this.hideClass = hideClass;
		this.trueId = trueId;
		this.callback = callback;
		this.onSingleRun = onSingleRun;
	}
}

var DataTypes: Map<string, DataType> = new Map<string, DataType>();
DataTypes.set('kernel_config', new DataType('kernel', 'kernelDiff', 'kernel-button-yes', kernelConfig, 'no'));
DataTypes.set('sysctl', new DataType('sysctl', 'sysctlDiff', 'sysctl-button-yes', sysctl, 'no'));
DataTypes.set('vmstat', new DataType('vmstat', 'vmstatHide', 'vmstat-button-yes', vmStat, ''));
DataTypes.set('disk_stats', new DataType('diskstat', 'diskstatHide', 'diskstat-button-yes', diskStats, ''));
DataTypes.set('meminfo', new DataType('meminfo', 'meminfoHide', 'meminfo-button-yes', meminfo, ''));
DataTypes.set('netstat', new DataType('netstat', 'netstatHide', 'netstat-button-yes', netStat, ''));
DataTypes.set('interrupts', new DataType('interrupts', '', '', interrupts, ''));
DataTypes.set('cpu_utilization', new DataType('cpuutilization', '', '', cpuUtilization, ''));
DataTypes.set('system_info', new DataType('systeminfo', 'landingChoice', '', systemInfo, ''));
DataTypes.set('flamegraphs', new DataType('flamegraphs', 'flamegraphsSelection', '', flamegraphs, ''));
DataTypes.set('top_functions', new DataType('topfunctions', '', '', topFunctions, ''));
DataTypes.set('processes', new DataType('processes', '', '', processes, ''));
DataTypes.set('perfstat', new DataType('perfstat', '', '', perfStat, ''));
DataTypes.set('aperfstat', new DataType('aperfstat', '', '', aperfStat, ''));
DataTypes.set('aperfrunlog', new DataType('aperfrunlog', '', '', aperfRunlog, ''));
DataTypes.set('configure', new DataType('configure', '', '', configure, ''));
DataTypes.set('hotline', new DataType('hotline', '', '', hotline, ''));

function openData(evt: Event, elem: HTMLButtonElement) {
	var tabName: string = elem.name;
	var tabcontent = document.getElementsByClassName('tabcontent');
	var tablinks = document.getElementsByClassName('tablinks');
	for (var i = 0; i < tabcontent.length; i++) {
		(tabcontent[i] as HTMLElement).style.display = "none";
	}
	for (var i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	document.getElementById(tabName).style.display = "block";
	const currentTarget = evt.currentTarget as HTMLButtonElement;
	currentTarget.className += " active";
	display_tab(tabName);
}

function display_tab(name) {
	let datatype = DataTypes.get(name);
	if (datatype.hideClass != "") {
		let queryInput = `input[name="${datatype.hideClass}"]:checked`;
		let checkedId = document.querySelector(queryInput).id;
		if (datatype.trueId != "") {
			datatype.callback(checkedId == datatype.trueId);
		} else {
			datatype.callback(checkedId);
		}
	} else {
		datatype.callback();
	}
}

// Tab button click
var elems = document.getElementsByClassName('tablinks');
for (var i=0; i < elems.length; i++) {
	elems[i].addEventListener("click", function(evt: Event) {
		openData(evt, this)
	}, false);
}

// Set Click listener
DataTypes.forEach((datatype: DataType, key: string) => {
	var button_elems = document.getElementsByClassName(`${datatype.name}-button`);
	var select_elems = document.getElementsByClassName(`${datatype.name}-select`);

	for (var j = 0; j < button_elems.length; j++) {
		button_elems[j].addEventListener("click", function (evn: Event) {
			if (this.id == datatype.trueId) {
				datatype.callback(true);
			} else {
				datatype.callback(false);
			}
		})
	}

	for (var j = 0; j < select_elems.length; j++) {
		select_elems[j].addEventListener("click", function (evn: Event) {
			datatype.callback(this.id)
		})
	}
	if (runs_raw.length == 1) {
		if (datatype.onSingleRun != '') {
			(document.getElementById(`${datatype.name}-button-${datatype.onSingleRun}`) as HTMLInputElement).checked = true;
		}
	}
});

var run_width = 100;
var float_style = "none";

function clear_and_create(datatype) {
	clearElements(`${datatype}-runs`);
	runs_raw.forEach(function (value, index, arr) {
		var datatype_div = document.createElement('div');
		datatype_div.id = `${value}-${datatype}`;
		datatype_div.style.float = float_style;
		datatype_div.style.width = `${run_width}%`;
		addElemToNode(`${datatype}-runs`, datatype_div);
		var per_run_datatype = document.createElement('div');
		per_run_datatype.id = `${value}-${datatype}-per-data`;
		addElemToNode(datatype_div.id, per_run_datatype);
	});
}

function create_runs_header() {
	var data = runs_raw;
	float_style = "none";
	if (data.length > 1) {
		float_style = "left";
	}
	run_width = 100 / data.length;
	data.forEach(function(value, index, arr) {
		var run_div = document.createElement('div');
		run_div.id = value;
		run_div.style.float = float_style;
		run_div.style.width = `${run_width}%`;
		run_div.style.border = "1px solid black";
		run_div.style.background = "lightgray";
		run_div.style.opacity = "0.95";
		addElemToNode('header', run_div);
		var run_node_id = run_div.id;

		var h3_run_name = document.createElement('h3');
		h3_run_name.innerHTML = value;
		h3_run_name.style.textAlign = "center";
		addElemToNode(run_node_id, h3_run_name);
	});
	DataTypes.forEach((datatype, key) => {
		clear_and_create(datatype.name);
	});
}

// Set Runs header
create_runs_header();

formGlobalConfig();

// Show landing page
document.getElementById("default").click();
