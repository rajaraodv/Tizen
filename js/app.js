(function() {
	window
			.addEventListener(
					'tizenhwkey',
					function(ev) {
						debugger;
						if (ev.keyName == "back") {
							var page = document
									.getElementsByClassName('ui-page-active')[0], pageid = page ? page.id
									: "";
							if (pageid === "main") {
								tizen.application.getCurrentApplication()
										.exit();
							} else if (pageid === "nextmeeting"
									|| pageid === "oldmeeting") {
								tau.changePage('index.html');
							} else {
								window.history.back();
							}
						}
					});
}());

var stop;
function startTime() {

//	 var today=new Date();
//	 var h=today.getHours();
//	 var m=today.getMinutes();
//	 var ampm = h >= 12 ? 'PM' : 'AM';
//	 h = h % 12;
//	 h = h ? h : 12;
//	    
//	 m = checkTime(m);
//	   
//	 document.getElementById('currtime').innerHTML = h+":"+m+" "+ampm;
//	 if(document.getElementById('currtime2')!=null){
//	 document.getElementById('currtime2').innerHTML = h+":"+m+" "+ampm;
//	 }
	   
	var formattedTime = moment().format('h:mm a').toUpperCase();
	try{
		document.getElementById('currtime').innerHTML = formattedTime;
		document.getElementById('currtime2').innerHTML = formattedTime;

	} catch(e) {
		
	}
	var t = setTimeout(function() {
		startTime()
	}, 500);
}
function loadScreen(divid) {
	var mh = document.getElementById(divid);
	mh.style.height = '100%';
	mh.style.width = '100%';
	var f = document.getElementById('focusid');
	if (f !== null) {
		f.scrollIntoView(true);
	}
}

function setMeetingTime(divid) {
	var today = new Date();
	var coeff = 1000 * 60 * 30;
	var date = new Date(); // or use any other date
	var rounded = new Date(Math.ceil(date.getTime() / coeff) * coeff)
	var h = rounded.getHours();
	var h = rounded.getHours();
	var ampm = h >= 12 ? 'PM' : 'AM';
	h = h % 12;
	h = h ? h : 12;
	var m = rounded.getMinutes();
	m = checkTime(m);
	document.getElementById(divid).innerHTML = h + ":" + m + " " + ampm;
}

function setDate(divid) {
	var today = new Date();

	document.getElementById(divid).innerHTML = (today.getMonth() + 1) + "/"
			+ today.getDate() + "/" + today.getFullYear();
}

function incrementMeetingTime(hrs, mins, divid) {
	var today = new Date();
	var coeff = 1000 * 60 * 30;
	var date = new Date(); // or use any other date
	var rounded = new Date(Math.ceil(date.getTime() / coeff) * coeff);
	rounded.setHours(rounded.getHours() + hrs);
	rounded.setMinutes(rounded.getMinutes() + mins);
	var h = rounded.getHours();
	var ampm = h >= 12 ? 'PM' : 'AM';
	h = h % 12;
	h = h ? h : 12;
	var m = rounded.getMinutes();
	m = checkTime(m);
	document.getElementById(divid).innerHTML = h + ":" + m + " " + ampm;

}

function checkTime(i) {
	if (i < 10) {
		i = "0" + i
	}
	; // add zero in front of numbers < 10
	return i;
}

function showTemps() {
	tau.changePage('#runningtemps');
	return false;
}

function openToastPop() {
	var m = true;
	if (m) {
		tau.openPopup("#PopupToast2");
	}

}

function selectcheckboxold(id) {
	if (document.getElementById(id).checked == true) {
		document.getElementById(id).parentNode.style.color = '#657889';
		document.getElementById(id).parentNode.style.setProperty(
				"text-decoration", "line-through");
	}
	if (document.getElementById(id).checked == false) {
		document.getElementById(id).parentNode.style.color = '#2B4257';
		document.getElementById(id).parentNode.style.setProperty(
				"text-decoration", "none");
	}
}

function changeColorOnHover(id) {
	document.getElementById(id).style.backgroundColor = "#F0F1F2";
}

function changeColorOnMouseOut(id) {
	document.getElementById(id).style.backgroundColor = "#ffffff";
}

var checkedtasks = [];

var uncheckedtasks = [];

uncheckedtasks.push('check-1', 'check-2', 'check-3', 'check-4', 'check-5',
		'check-6', 'check-7', 'check-8');

function selectcheckbox(id) {
	var pos = uncheckedtasks.indexOf(id);
	var posc = checkedtasks.indexOf(id);

	if (document.getElementById(id).checked == true) {
		if (pos > -1) {
			uncheckedtasks.splice(pos, 1);
			checkedtasks.push(id);
		}
	}

	if (document.getElementById(id).checked == false) {
		if (posc > -1) {
			checkedtasks.splice(posc, 1);
			uncheckedtasks.push(id);
		}

	}

	if (checkedtasks.indexOf(id) > -1) {
		document.getElementById(id).parentNode.style.color = '#657889';
		document.getElementById(id).parentNode.style.setProperty(
				"text-decoration", "line-through");
	}
	if (uncheckedtasks.indexOf(id) > -1) {
		document.getElementById(id).parentNode.style.color = '#2B4257';
		document.getElementById(id).parentNode.style.setProperty(
				"text-decoration", "none");
	}

	getTaskListSize();
}

function loadTaskCss(id) {
	if (uncheckedtasks.indexOf(id) > -1) {
		document.getElementById(id).parentNode.style.color = '#2B4257';
		document.getElementById(id).parentNode.style.setProperty(
				"text-decoration", "none");
	} else {
		document.getElementById(id).parentNode.style.color = '#657889';
		document.getElementById(id).parentNode.style.setProperty(
				"text-decoration", "line-through");
		document.getElementById(id).checked = true;
	}
}

function getTaskListSize() {
debugger;
	document.getElementById('tsdetails').innerHTML = uncheckedtasks.length
			+ ' Tasks';
}
