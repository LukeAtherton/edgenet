
var path;
var inputArray;
var cursorAt = 0;

var filesys = '<?xml version="1.0" encoding="utf-8" ?> <edgenet> <security type="folder"> <cameras type="folder"> <camera1 type="app"></camera1> <camera2 type="app"></camera2> <camera3 type="app"></camera3> <camera4 type="app"></camera4> <camera5 type="app"></camera5> <camera6 type="app"></camera6> </cameras> </security> <fileB type="folder"></fileB> <fileC type="locked"></fileC> <login type="app"></login> <program type="app"></program> </edgenet>';

xmlDoc = $.parseXML(filesys),
$xml = $( xmlDoc ),
$title = 'edgeNet';

function updLstChr(){ // blinking cursor
		var cont=this.content(); // get console 
		if(cont.substring(cont.length-1,cont.length)=="|") // if last char is the cursor
			$("#console").html($("#console").html().substring(0,cont.length-1)); // remove it
		else
			this.write("|"); // else write it
	}

//$(function() {
        // run the currently selected effect
function runEffect(cameraSource) {
        	//$('#cameraFrame').hide();
        	$('#loading').show();

            // get effect type from
            var selectedEffect = 'slide';
 
            // most effect types need no options passed by default
            var options = {};
            // some effects have required parameters
            if ( selectedEffect === "scale" ) {
                options = { percent: 100 };
            } else if ( selectedEffect === "size" ) {
                options = { to: { width: 280, height: 185 } };
            }

            options = {direction: "right"}
 
            // run the effect
            $( "#content" ).show( selectedEffect, options, 800, callback );

            $('#cameraFrame').attr('src', cameraSource);
				$('#cameraFrame').load(function() 
			    {
			    	$('#loading').hide();
			        //$('#cameraFrame').show();
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
 
        //callback function to bring a hidden box back
function callback() {
            /*setTimeout(function() {
                $( "#frame:visible" ).removeAttr( "style" ).fadeOut();
            }, 1000 );*/
};
 
        
   // });

$(document).ready(function () {

	// check where the content-div is  
 	var offset = $('#content').offset();  

	 $(window).scroll(function () {  
	   var scrollTop = $(window).scrollTop(); // check the visible top of the browser  

	   if (offset.top<scrollTop) $('#content').addClass('fixed');  
	   else $('#content').removeClass('fixed');  
	  });

	$( "#content" ).hide();

	var accessCountimer = null;
	accessCountimer=setInterval(function(){Typer.updLstChr();},500);



		 /*$.ajax({
		   url: "http://teethtracker.heroku.com/device_movements.json",
		   dataType: "jsonp",
		   success: function(data){
			alert("success");
			 
			 // Returned data available in object "xml"
			 $("body").append("<div id='output' style='margin-left:1em; color:#FF6600;'>test</div>");
		   },
			error: function(data) {
				//alert("error");
				var test = "";
				$.each(data, function (key, val) {
					test += key + "-" + val + "</br>";
                // Format the text to display.
                //var str = val.WorkOrderID + '-' + val.Reason;
                //alert(str); 

                // Add a list item for the product.
                //$('<li/>', { html: str })
                //.appendTo($('.body'));
				});
				//$("body").append("<div id='output' style='margin-left:1em; color:#FF6600;'>" + test + "</div>");
			}
		 });*/

        /*$.getJSON("http://teethtracker.heroku.com/device_movements.json?callback=?",
        function (data) {
            alert("success");
            //$.each(data, function (key, val) {

                // Format the text to display.
                //var str = val.WorkOrderID + '-' + val.Reason;
                //alert(str); 

                // Add a list item for the product.
                //$('<li/>', { html: str })
                //.appendTo($('.body'));
            //});
			$("body").append("<div id='output' style='margin-left:1em; color:#FF6600;'>test</div>");
        });*/
});

$(
	function(){
		$( document ).keypress (
			function ( event ) { 
				Typer.addText( event ); //Capture the keydown event and call the addText, this is executed on page load
			}
		);
	}
);

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
						runEffect("cameraSource1.html");
					});
				  	break;
				case "camera2":
				  	$xml.find(path[path.length-1]).eq(0).children(inputArray[0]).each(function() {
						runEffect("cameraSource2.html");
					});
				  	break;
				case "camera3":
				  	$xml.find(path[path.length-1]).eq(0).children(inputArray[0]).each(function() {
						runEffect("cameraSource3.html");
					});
				 	break;
				case "camera4":
				  	$xml.find(path[path.length-1]).eq(0).children(inputArray[0]).each(function() {
						runEffect("cameraSource4.html");
					});
				  	break;
				case "camera5":
				  	$xml.find(path[path.length-1]).eq(0).children(inputArray[0]).each(function() {
						runEffect("cameraSource5.html");
					});
				  	break;
				case "camera6":
				  	$xml.find(path[path.length-1]).eq(0).children(inputArray[0]).each(function() {
						runEffect("cameraSource6.html");
					});
				  	break;
				default:
					closeSidebar();
				}
				
				if(inputArray[0] == "login"){
					$xml.find(path[path.length-1]).eq(0).children(inputArray[0]).each(function() {
						if(inputArray[1] == "password"){
							var ddiv=$("<div id='gran'>").html(""); // create new blank div and id "gran"
							ddiv.addClass("accessGranted"); // add class to the div
							ddiv.html("<h1>ACCESS GRANTED</h1>"); // set content of div
							$(document.body).prepend(ddiv); // prepend div to body
							$("#gran").fadeOut(1500);
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
				$("#consoleContainer").append("<div id='console' class='command'>" + tempPath + "></div>");
				window.scrollBy(0,$("#console").height());
				//cursorAt++;
				doPrevent = true;
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
			//arr.reverse(); // use an Array method on list of dom elements
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

var Typer={
	text: null,
	accessCountimer:null,
	index:0, // current cursor position
	speed:2, // speed of the Typer
	file:"", //file, must be setted
	accessCount:0, //times alt is pressed for Access Granted
	deniedCount:0, //times caps is pressed for Access Denied
	init: function(){// inizialize Hacker Typer
		accessCountimer=setInterval(function(){Typer.updLstChr();},500); // inizialize timer for blinking cursor
		/*$.get(Typer.file,function(data){// get the text file
			Typer.text=data;// save the textfile in Typer.text
		});*/
	},
	
	content:function(){
		return $("#console").html();// get console content
	},
	
	write:function(str){// append to console content
		$("#console").append(str);
		return false;
	},
	
	makeAccess:function(){//create Access Granted popUp      FIXME: popup is on top of the page and doesn't show is the page is scrolled
		Typer.hidepop(); // hide all popups
		Typer.accessCount=0; //reset count
		var ddiv=$("<div id='gran'>").html(""); // create new blank div and id "gran"
		ddiv.addClass("accessGranted"); // add class to the div
		ddiv.html("<h1>ACCESS GRANTED</h1>"); // set content of div
		$(document.body).prepend(ddiv); // prepend div to body
		return false;
	},
	makeDenied:function(){//create Access Denied popUp      FIXME: popup is on top of the page and doesn't show is the page is scrolled
		Typer.hidepop(); // hide all popups
		Typer.deniedCount=0; //reset count
		var ddiv=$("<div id='deni'>").html(""); // create new blank div and id "deni"
		ddiv.addClass("accessDenied");// add class to the div
		ddiv.html("<h1>ACCESS DENIED</h1>");// set content of div
		$(document.body).prepend(ddiv);// prepend div to body
		return false;
	},
	
	hidepop:function(){// remove all existing popups
		$("#deni").remove();
		$("#gran").remove();
	},
	
	addText:function(key){//Main function to add the code
		if(key.keyCode==18){// key 18 = alt key
			Typer.accessCount++; //increase counter 
			if(Typer.accessCount>=3){// if it's presed 3 times
				Typer.makeAccess(); // make access popup
			}
		}else if(key.keyCode==20){// key 20 = caps lock
			Typer.deniedCount++; // increase counter
			if(Typer.deniedCount>=3){ // if it's pressed 3 times
				Typer.makeDenied(); // make denied popup
			}
		}else if(key.keyCode==27){ // key 27 = esc key
			Typer.hidepop(); // hide all popups
		}/*else if(Typer.text){ // otherway if text is loaded
			var cont=Typer.content(); // get the console content
			if(cont.substring(cont.length-1,cont.length)=="|") // if the last char is the blinking cursor
				$("#console").html($("#console").html().substring(0,cont.length-1)); // remove it before adding the text
			if(key.keyCode!=8){ // if key is not backspace
				Typer.index+=Typer.speed;	// add to the index the speed
			}else{
				if(Typer.index>0) // else if index is not less than 0 
					Typer.index-=Typer.speed;//	remove speed for deleting text
			}
			var text=$("<div/>").text(Typer.text.substring(0,Typer.index)).html();// parse the text for stripping html enities
			var rtn= new RegExp("\n", "g"); // newline regex
			var rts= new RegExp("\\s", "g"); // whitespace regex
			var rtt= new RegExp("\\t", "g"); // tab regex
			$("#console").html(text.replace(rtn,"<br/>").replace(rtt,"&nbsp;&nbsp;&nbsp;&nbsp;").replace(rts,"&nbsp;"));// replace newline chars with br, tabs with 4 space and blanks with an html blank
			window.scrollBy(0,50); // scroll to make sure bottom is always visible
		}*/
		/*if ( key.preventDefault && key.keyCode != 122 ) { // prevent F11(fullscreen) from being blocked
			//key.preventDefault()
		};  
		if(key.keyCode != 122){ // otherway prevent keys default behavior
			//key.returnValue = false;
		}*/
		
		var cont=this.content();
		
		if(cont.substring(cont.length-1,cont.length)=="|"){ // if last char is the cursor
			$("#console").html($("#console").html().substring(0,cont.length-1));
		} // remove it
		$("#console").append(String.fromCharCode(key.keyCode));
		
	},
	
	updLstChr:function(){ // blinking cursor
		var cont=this.content(); // get console 
		if(cont.substring(cont.length-1,cont.length)=="|") // if last char is the cursor
			$("#console").html($("#console").html().substring(0,cont.length-1)); // remove it
		else
			this.write("|"); // else write it
	}
}


