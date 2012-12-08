
var path;
var inputArray;
var cursorAt = 0;
var showPath = true;

var filesys = '<?xml version="1.0" encoding="utf-8" ?> <edgenet> <security type="folder"> <cameras type="folder"> <camera1 type="app"></camera1> <camera2 type="app"></camera2> <camera3 type="app"></camera3> <camera4 type="app"></camera4> <camera5 type="app"></camera5> <camera6 type="app"></camera6> </cameras> </security> <login type="app"></login> </edgenet>';

xmlDoc = $.parseXML(filesys),
$xml = $( xmlDoc ),
$title = 'edgeNet';

var accessed = false;

function openSidebar(cameraSource) {

   	$('#loading').show();

	// get effect type from
	var selectedEffect = 'slide';
 
	// most effect types need no options passed by default
	var options = {};

	options = {direction: "right"}
 
	// run the effect
	$( "#content" ).show( selectedEffect, options, 800, callback );

	$('#cameraFrame').attr('src', cameraSource);
		$('#cameraFrame').load(function(){
			$('#loading').hide();
	});
};

function closeSidebar() {
            // get effect type from
            var selectedEffect = 'slide';
 
            // most effect types need no options passed by default
            var options = {direction: "right"}
 
            // run the effect
            $( "#content" ).hide( selectedEffect, options, 800, callback );
};
 
//Callback for close sidebar functions
function callback() {

};

$(document).ready(function () {

	// check where the content-div is  
 	var offset = $('#content').offset();  

	$(window).scroll(function () {  
	   	var scrollTop = $(window).scrollTop(); // check the visible top of the browser  

	   	if (offset.top<scrollTop){
			$('#content').addClass('fixed');
	   	} else {
	   		$('#content').removeClass('fixed');  
	   	}
	 });

	$( "#content" ).hide();

	var accessCountimer = null;
	accessCountimer=setInterval(function(){updLstChr();},500);

	$(document).keypress(function(event){ 
		//Capture the keydown event and call the addText, this is executed on page load
		addText( event ); 
	});
});

$(document).unbind('keydown').bind('keydown', function (event) {
    var doPrevent = false;
	
	switch(event.keyCode){
		case 8:
			var d = event.srcElement || event.target;
			if ((d.tagName.toUpperCase() === 'INPUT' && d.type.toUpperCase() === 'TEXT') 
				 || d.tagName.toUpperCase() === 'TEXTAREA') {
				doPrevent = d.readOnly || d.disabled;
			}
			else {
				var cont=$("#console").html();
				$("#console").html($("#console").html().substring(0,cont.length-1));
				doPrevent = true;
			}
			break;
		case 13:
			$("#deni").remove();
			$("#gran").remove();
			var d = event.srcElement || event.target;
			if ((d.tagName.toUpperCase() === 'INPUT' && d.type.toUpperCase() === 'TEXT') 
				 || d.tagName.toUpperCase() === 'TEXTAREA') {
				doPrevent = d.readOnly || d.disabled;
			} else {
				var cont=$("#console").html();
				if(cont.substring(cont.length-1,cont.length)=="|"){
					$("#console").html($("#console").html().substring(0,cont.length-1));
					cont=cont.substring(0,cont.length-1);
				}
				
				var gtIndex = cont.indexOf('&gt;');
				var tempPath = cont.substring(0, gtIndex);
				path = tempPath.split('/');
				
				var tempInput = cont.substring(gtIndex + 4);
				inputArray=tempInput.split(" ");
				
				if(inputArray[0] == "cd.."){
					if(path[path.length-1] != "root"){
						var test = path[path.length-1];
						tempPath = "";
						for(var i = 0; i < path.length -1; i++){
							if(i > 0){
								tempPath += "/";
							}
							tempPath += path[i];
						}
					}
				}
				
				if(inputArray[0] === "cd" && 1 < inputArray.length){
					if(inputArray[1] == ".." && path[path.length-1] != "root"){
						tempPath = "";
						for(var i = 0; i < path.length -1; i++){
							if(i > 0){
								tempPath += "/";
							}
							tempPath += path[i];
						}
					}else{
						$xml.find(path[path.length-1]).eq(0).children(inputArray[1]).each(function() {
							if($(this).attr("type") == "folder"){
								tempPath += "/" + (this).nodeName;
							}else{ 
								if($(this).attr("type") == "locked"){
									var ddiv=$("<div id='deni'>").html(""); // create new blank div and id "deni"
									ddiv.addClass("accessDenied");// add class to the div
									ddiv.html("<h1>ACCESS DENIED</h1>");// set content of div
									$(document.body).prepend(ddiv);// prepend div to body
									$("#deni").fadeOut(1500);
								}
							}

						});
					}
				}
				
				var appOutput = "";
				
				if(inputArray[0] == "ls"){
					$xml.find(path[path.length-1]).eq(0).children().each(function() {
						var newDiv = "<div id='output' class='" + $(this).attr("type") + "'>" + (this).nodeName;
						if($(this).attr("type") == 'folder' || $(this).attr("type") == 'locked'){
							newDiv += "/"
						}
						newDiv += "</div>"
						$("#consoleContainer").append(newDiv);

						window.scrollBy(0,$("#output").height());
						$("#output").attr("id", "");
					});
				}
				
				if(inputArray[0] == "program"){
					$xml.find(path[path.length-1]).eq(0).children(inputArray[0]).each(function() {
						appOutput = "THIS IS A TEST PROGRAM...";
						$("#consoleContainer").append("<div id='output' style='width:95%; height:10em; background-color:red; color:white; margin-left:1em;'>" + appOutput +"</div>");
						//scroll window
						window.scrollBy(0,$("#output").height());
						$("#output").attr("id", "");
					});
				}

				if(inputArray[0] == "exit"){
					document.location.href = "index.html";
				}

				if(inputArray[0] == "help"){
					var newDiv = "<div id='output' class='app'>Console Commands_</div>";
					$("#consoleContainer").append(newDiv);

					window.scrollBy(0,$("#output").height());
					$("#output").attr("id", "");

					newDiv = "<div id='output' class='app'>  => cd {directory_name} (opens specified directory)</div>";
					$("#consoleContainer").append(newDiv);

					window.scrollBy(0,$("#output").height());
					$("#output").attr("id", "");

					newDiv = "<div id='output' class='app'>  => cd.. {directory_name} (navigates up on directory level)</div>";
					$("#consoleContainer").append(newDiv);

					window.scrollBy(0,$("#output").height());
					$("#output").attr("id", "");

					newDiv = "<div id='output' class='app'>  => {program_name} {options} (runs program with optional options)</div>";
					$("#consoleContainer").append(newDiv);

					window.scrollBy(0,$("#output").height());
					$("#output").attr("id", "");

					newDiv = "<div id='output' class='app'>  => exit (quits to EdgeNet GUI)</div>";
					$("#consoleContainer").append(newDiv);

					window.scrollBy(0,$("#output").height());
					$("#output").attr("id", "");

					newDiv = "<div id='output' class='app'>  => help (how do you think you ended up here?)</div>";
					$("#consoleContainer").append(newDiv);

					window.scrollBy(0,$("#output").height());
					$("#output").attr("id", "");
				}

				switch(inputArray[0]){
				case "camera1":
					$xml.find(path[path.length-1]).eq(0).children(inputArray[0]).each(function() {
						openSidebar("cameraSource1.html");
					});
				  	break;
				case "camera2":
				  	$xml.find(path[path.length-1]).eq(0).children(inputArray[0]).each(function() {
						openSidebar("cameraSource2.html");
					});
				  	break;
				case "camera3":
				  	$xml.find(path[path.length-1]).eq(0).children(inputArray[0]).each(function() {
						openSidebar("cameraSource3.html");
					});
				 	break;
				case "camera4":
				  	$xml.find(path[path.length-1]).eq(0).children(inputArray[0]).each(function() {
						openSidebar("cameraSource4.html");
					});
				  	break;
				case "camera5":
				  	$xml.find(path[path.length-1]).eq(0).children(inputArray[0]).each(function() {
						openSidebar("cameraSource5.html");
					});
				  	break;
				case "camera6":
				  	$xml.find(path[path.length-1]).eq(0).children(inputArray[0]).each(function() {
						openSidebar("cameraSource6.html");
					});
				  	break;
				default:
					closeSidebar();
				}

				if (inputArray[0] == "Y" || inputArray[0] =="y"){
                    if (accessed){
                        var newDiv = "<div id='output' class='app'>CONTROL SYSTEM ITEM 1 DEACTIVATING.  <audio autoplay='true'>  <source src='audio/forklift.wav' type='audio/wav'> </audio></div>";
						$("#consoleContainer").append(newDiv);
						window.scrollBy(0,$("#output").height());
						$("#output").attr("id", "");
                    }
				}
				if (inputArray[0] == "N" || inputArray[0] =="n"){
                     if (accessed){
                        var newDiv = "<div id='output' class='app'>ARE YOU SURE. <br > DO YOU WISH TO DEACTIVATE CONTROL MECHANISM 1 OF 3? Y/N  </audio></div>";
						$("#consoleContainer").append(newDiv);
						window.scrollBy(0,$("#output").height());
						$("#output").attr("id", "");
					}       
				}
				
				if(inputArray[0] == "login"){
					$xml.find(path[path.length-1]).eq(0).children(inputArray[0]).each(function() {
						if(inputArray[1] == "HOST_EPSILON"){
							var ddiv=$("<div id='gran'>").html(""); // create new blank div and id "gran"
							ddiv.addClass("accessGranted"); // add class to the div
							ddiv.html("<h1>ACCESS GRANTED</h1>"); // set content of div
							$(document.body).prepend(ddiv); // prepend div to body
							$("#gran").fadeOut(3000);
						 	var newDiv = "<div  id='output'> <pre>           ./\\.<br />        ./ /  \\ \\.<br />      ./  /    \\  \\.<br />     /___/______\\___\\<br />    |   /\\      /\\   |<br />    |  /  \\    /  \\  |<br />    | /    \\  /    \\ |<br />    |/______\\/______\\|<br />     \\.     ||     ./<br />      \\..   ||  ../<br />         \\__||__/<br />          (____)  <br />   <br /></pre> **************************************<br /><br/ >WELCOME TO THE HOST COMPUTER MAINFRAME TERMINAL 1. <br/ ><br/ >DO YOU WISH TO DEACTIVATE CONTROL MECHANISM 1 OF 3? Y/N <br/ >   </div>";
							accessed = true;
												 
							$("#consoleContainer").append(newDiv);
							window.scrollBy(0,$("#output").height());
							$("#output").attr("id", "");

							showPath = false;
						}else{
							var ddiv=$("<div id='deni'>").html(""); // create new blank div and id "deni"
							ddiv.addClass("accessDenied");// add class to the div
							ddiv.html("<h1>ACCESS DENIED</h1>");// set content of div
							$(document.body).prepend(ddiv);// prepend div to body
							$("#deni").fadeOut(1500);
						}
					});
				}
				
				$("#console").attr("id", "last");
				window.scrollBy(0,$("#last").height());

				if(showPath){
					$("#consoleContainer").append("<div id='console' class='command'>" + tempPath + "></div>");
				}else{
					$("#consoleContainer").append("<div id='console' class='command'>></div>");
				}
				
				window.scrollBy(0,$("#console").height());
				doPrevent = true;
				showPath = true
			}
			break;
		case 190:
			if(event.shiftKey){
				doPrevent = true;
				return false;
			}
			break;
		case 48:
			doPrevent = true;
			return false;
		case 37:
			
			doPrevent = false;
			break;
		case 38:
			var elems = $(".command"); // returns a nodeList
			var arr = jQuery.makeArray(elems);
			$(arr).appendTo(document.body);
			
			doPrevent = false;
			break
		default:
			doPrevent = false;
			break;
	}

    if (doPrevent) {
        event.preventDefault();
    }
});

//Main function to add the code	
function addText(key){
	var cont = $("#console").html();
	
	if(cont.substring(cont.length-1,cont.length)=="|"){ // if last char is the cursor
		$("#console").html($("#console").html().substring(0,cont.length-1));
	} // remove it
	write(String.fromCharCode(key.keyCode));	
}

// blinking cursor
function updLstChr(){ 
	var cont = $("#console").html(); // get console 
	if(cont.substring(cont.length-1,cont.length)=="|"){ // if last char is the cursor
		$("#console").html($("#console").html().substring(0,cont.length-1)); // remove it
	}else{
		write("|"); // else write it
	}
}

function write(str){// append to console content
	$("#console").append(str);
	return false;
}
