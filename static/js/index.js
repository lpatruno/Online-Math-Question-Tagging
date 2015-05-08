/**
	JavaScript code for the index.html page
*/

/**
Save the question text and the predicted keyword.
*/
function save(){
	var question = $.trim( $('#renderedQuestionText').text() );
	var tags = [];
	tags[0] = 'a';
	tags[1] = 'b';
	
	$.ajax({
		type: 'POST',
		url: '/saveTags',
		data: {'question': question, 'tags': tags},
		success: function(data){
			// TODO Flash message
			
			// Inject html into the page
			$('#container').html(data);
		
			// Reinitialize the original click handlers
			initialize();
		},
		dataType: 'html'
	});
}

/**
Reject the predicted tags and go back to the question input screen
AJAX request for the question input UI.
*/
function cancel(){
	
	$.get('/cancel', function(data){
		// Inject html into the page
		$('#container').html(data);
		
		// Reinitialize the original click handlers
		initialize();
	});	
}

/**
Performs AJAX Post request to server. Sends the question text to the server, accepts the 
predicted tags, and displays these to the user.
*/
function tag_question(){
	
	var question = document.getElementById("questionText").value;
	
	// Credit to Jacques Dancause for the spinner code
	// http://codepen.io/hexagonest/
	var spinner = '<div style="margin-top:20%;" class="content">' + 
	  '<p id="spinnerText">Generating predictions...</p>' +
	  '<div class="loading">' +
	  '<div class="l1"></div>' +
	  '<div class="l2"></div>' +
	  '<div class="l3"></div>' +
	  '</div>' +
	  '</div>' +
	  '<link href="http://fonts.googleapis.com/css?family=Dancing+Script" rel="stylesheet" type="text/css"/>';
	  
	$('#header').hide();
	$('#container').html( spinner );
	
	$.ajax({
		type: 'POST',
		url: '/tagQuestion',
		data: {'question': question},
		success: function(data){
			
			$('#header').slideDown( "slow" );
			
			// Substitute the html into the page
			$('#container').html(data);
			
			// Render the LaTeX
			MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
			
			// Add click handlers to the new buttons
			$( '#mSave').click(function(){
				save();
			});
			
			$( '#mCancel').click(function(){
				cancel();
			});
		},
		dataType: 'html'
	});
	
}

/**
Initialize the click handlers for the question text input.
This is called when the page first loads, and if a user clicks cancel after submitting a question.
*/
function initialize(){
	
	// Click handler to submit the question text to the tagging engine
	$( "#mSubmit" ).click(function () {
		tag_question();
	});
	
	// Click handler to render a preview of the question
	$( "#mPreview" ).click(function () {
		if ( $( "#questionPreview" ).is( ":hidden" ) ) {
			// Substitute the question text into the div for rendering
			document.getElementById("questionPreviewText").innerHTML = document.getElementById("questionText").value;
			// Call MathJaX to render the LaTeX
			MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
			// Use jQuery animation to slide down the rendered question
			$( "#questionPreview" ).slideDown( "slow" );
			// Disable the preview button
			$( "#mPreview" ).addClass("disabled");
		}
	});

	// Click handler to close the preview 
	$( "#mPreviewClose" ).click(function () {
		$( "#questionPreview" ).hide();
		$( "#mPreview" ).removeClass("disabled");
	});
}

/**
Initialize the UI event handlers when the DOM is loaded
*/
$( document ).ready(function() {
    
	initialize();	
	
});