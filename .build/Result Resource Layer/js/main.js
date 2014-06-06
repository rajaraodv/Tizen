/*    
 * Copyright (c) 2014 Samsung Electronics Co., Ltd.   
 * All rights reserved.   
 *   
 * Redistribution and use in source and binary forms, with or without   
 * modification, are permitted provided that the following conditions are   
 * met:   
 *   
 *     * Redistributions of source code must retain the above copyright   
 *        notice, this list of conditions and the following disclaimer.  
 *     * Redistributions in binary form must reproduce the above  
 *       copyright notice, this list of conditions and the following disclaimer  
 *       in the documentation and/or other materials provided with the  
 *       distribution.  
 *     * Neither the name of Samsung Electronics Co., Ltd. nor the names of its  
 *       contributors may be used to endorse or promote products derived from  
 *       this software without specific prior written permission.  
 *  
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS  
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT  
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR  
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT  
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,  
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT  
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,  
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY  
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT  
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE  
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var SAAgent = null;
var SASocket = null;
var CHANNELID = 104;
var ProviderAppName = "HelloAccessoryProvider";
var ACTION_FETCH_MEETINGS = "fetch_meetings";
var ACTION_LOG_A_CALL = "log_a_call";

//store meetings list from Salesforce
var Salesforce = {meetingsList: []};

function updateMeetings(data) {
	var jsonData = JSON.parse(data);
	var len = jsonData.totalSize;
	Salesforce.meetingsList = jsonData.records;

	var t1 = $('#meetingsSummary').html();
	Mustache.parse(t1); // optional, speeds up future uses
	var meetingsText = len > 1 ? "meetings" : "meeting";
	var rendered = Mustache.render(t1, {
		totalMeetings : len,
		meetingsText : meetingsText
	});
	$('#meetingsListDiv').append(rendered);

	// iterate for each meeting item
	var template = $('#meetingsListItem').html();
	Mustache.parse(template); // optional, speeds up future uses
	for ( var i = 0; i < len; i++) {

		var record = Salesforce.meetingsList[i];
		var startTime = moment(record.ActivityDateTime, "YYYY-MM-DDThh (mm) a")
				.format("hh:mm A");
		//cache formatted startTime for future use
		Salesforce.meetingsList[i].formattedStartTime = startTime;
		
		var rendered = Mustache.render(template, {
			startTime : startTime,
			duration : record.DurationInMinutes,
			title : record.Subject,
			description : record.Description,
			meetingId : record.Id
		});
		$('#meetingsListDiv').append(rendered);
	}
}

function updateMeetingDetails(meetingId) {
	var attendeesHTML = getMeetingAttendeesHTML(meetingId);
	var meeting = getMeetingById(meetingId);
	var template = $('#meetingsDetailsTempl').html();
	Mustache.parse(template);
	var rendered = Mustache.render(template, {
		startTime: meeting.formattedStartTime,
		title : meeting.Subject,
		duration: meeting.DurationInMinutes,
		description: meeting.Description,
		location: meeting.Location,
		attendeesHTML: attendeesHTML
	});
	$('#meetingDetailsPage').append(rendered);
	
}

function getMeetingAttendeesHTML(meetingId) {
	var html;
	var meeting = getMeetingById(meetingId);
	var eventRelations = meeting.EventRelations;
	
	var attendees = eventRelations.records;
	var len = attendees.length;
	html = len > 0 ? html = "" : "<p>No Attendees</p>";

	var template = $('#attendeesListTmpl').html();
	Mustache.parse(template);
	for(var i = 0; i < len; i++) {
		var attendee = attendees[i];
		html += Mustache.render(template, {Name: attendee.Relation.Name});
	}

	return html;
	
}


function getMeetingById(meetingId) {
	var len = Salesforce.meetingsList.length;
	for (var i = 0; i < len; i++) {
		var record = Salesforce.meetingsList[i];
		if(record.Id == meetingId) {
			return record;
		}
	}
	return;
}

function createHTML(log_string) {
	// var log = document.getElementById('resultBoard');
	// log.innerHTML = log.innerHTML + "<br> : " + log_string;
	console.log("CreateHTML: " + log_string);
}

function onerror(err) {
	console.log(err);
}

var agentCallback = {
	onconnect : function(socket) {
		SASocket = socket;
		// alert("HelloAccessory Connection established with RemotePeer");
		createHTML("startConnection");

		SASocket.setSocketStatusListener(function(reason) {
			console.log("Service connection lost, Reason : [" + reason + "]");
			disconnect();
		});

		// fetch data..
		fetch(ACTION_FETCH_MEETINGS);
	},
	onerror : onerror
};

var peerAgentFindCallback = {
	onpeeragentfound : function(peerAgent) {
		try {
			if (peerAgent.appName == ProviderAppName) {
				SAAgent.setServiceConnectionListener(agentCallback);
				SAAgent.requestServiceConnection(peerAgent);
			} else {
				alert("Not expected app!! : " + peerAgent.appName);
			}
		} catch (err) {
			console
					.log("exception [" + err.name + "] msg[" + err.message
							+ "]");
		}
	},
	onerror : onerror
}

function onsuccess(agents) {
	try {
		if (agents.length > 0) {
			SAAgent = agents[0];

			SAAgent.setPeerAgentFindListener(peerAgentFindCallback);
			SAAgent.findPeerAgents();
		} else {
			alert("Not found SAAgent!!");
		}
	} catch (err) {
		console.log("exception [" + err.name + "] msg[" + err.message + "]");
	}
}

function connect() {
	if (SASocket) {
		alert('Already connected!');
		return false;
	}
	try {
		webapis.sa.requestSAAgent(onsuccess, onerror);
	} catch (err) {
		console.log("exception [" + err.name + "] msg[" + err.message + "]");
	}
}

function disconnect() {
	try {
		if (SASocket != null) {
			SASocket.close();
			SASocket = null;
			createHTML("closeConnection");
		}
	} catch (err) {
		console.log("exception [" + err.name + "] msg[" + err.message + "]");
	}
}

function onreceive(channelId, data) {
	updateMeetings(data);
}

function fetch(actionName) {
	try {
		SASocket.setDataReceiveListener(onreceive);
		SASocket.sendData(CHANNELID, actionName);
	} catch (err) {
		console.log("exception [" + err.name + "] msg[" + err.message + "]");
	}
}

// window.onload = function () {
// // add eventListener for tizenhwkey
// document.addEventListener('tizenhwkey', function(e) {
// if(e.keyName == "back")
// tizen.application.getCurrentApplication().exit();
// });
// };
