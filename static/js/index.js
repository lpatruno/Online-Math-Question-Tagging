/**
	JavaScript code for the index.html page
*/

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
			/*
			var tags = data['tags'];
			for(var i = 0; i < tags.length; i++){
				console.log(tags[i]);
  			}
			*/
			$('#container').html(data);
		},
		dataType: 'html'//'json'
	});
	
}

$( document ).ready(function() {
    
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
	
});