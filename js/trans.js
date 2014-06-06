( function () {
	var popup = document.getElementById("PopupToast");
	console.log('added event listener');
	   popup.addEventListener("popupcreate", function(ev) 
	   { setTimeout(function(){tau.changePage('oldmeeting.html');},5000);
	      
	   });
} () );
