/**
	JavaScript code for the index.html page
*/

/**
Reject the predicted tags and go back to the question input screen
AJAX request for the question input UI.
*/
function cancel(){
	
	$.get('/cancel', function(data){
		$('#container').html(data);
		initialize();
	});	
}

/**
Performs AJAX Post request to server. Sends the question text to the server, accepts the 
predicted tags, and displays these to the user.
*/
function tag_question(){
	
	var question = document.getElementById("questionText").value;
	
	$.ajax({
		type: 'POST',
		url: '/tagQuestion',
		data: {'question': question},
		success: function(data){
			// Substitute the html into the page
			$('#container').html(data);
			// Render the LaTeX
			MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
			
			$( '#mSave').click(function(){
				// TODO define click handler for the save button
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