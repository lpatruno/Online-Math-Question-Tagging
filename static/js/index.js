/**
	JavaScript code for the index.html page
*/

/**
Save the question text and the predicted keyword.
*/
function save(question, tags){
	
	$.ajax({
		type: 'POST',
		url: '/saveTags',
		data: {'question': question, 'tags': tags},
		success: function(data){
			
			// Inject html into the page
			$('#mainContainer').html(data);
		
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
		$('#mainContainer').html(data);
		
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
				
				// Retrieve the question text and predicted tags 
				var question = $.trim( $('#renderedQuestionText').text() );
				
				var tags = [];
				var tag_divs = $('#tagContainer').children($( ":contains('tag_')" ));
				
				for (var i=0; i<tag_divs.length; i++){
					tags.push( tag_divs[i].id );
				}
				
				save(question, tags);
			});
			
			$( '#mCancel').click(function(){
				cancel();
			});
		},
		dataType: 'html'
	});
	
}

/**
Initialize the click handlers associated with the view questions page.
*/
function initializeView(){
	
	$('#mViewTags').click(function(){
		var tag = $("#tagSelect :selected").text();
		
		if (tag != "Select Tag"){
				
			$.ajax({
				type: 'POST',
				url: '/viewQuestions',
				data: {'tag': tag},
				success: function(data){
					var questions = data['questions'];
					var question_string = '';
					
					for (var i=0; i<questions.length; i++){
						var question = questions[i]['question'];
						var tags = questions[i]['tags'];
						
						var tag_string = '';
						for (var j=0; j<tags.length; j++){
							tag_string += "<code style='margin-right:15px;'>" + tags[j] + "</code>";
						}
						
						question_string += "<div class='thumbnail'>" + 
												"<div>" + question + "</div>" + 
												"<div class='caption'>" + tag_string + "</div>" + 
											"</div>";	
					}
					$('#viewQuestionContainer').html(question_string);
					
					// Render the LaTeX
					MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
				},
				dataType: 'json'
			});	
		} 
	});
}

/**
Initialize the click handlers for the question text input.
This is called when the page first loads, and if a user clicks cancel after submitting a question.
*/
function initialize(){
	
	// Click handler to view the tag question page
	$('#mTagPage').click(function(){
		if ($('#mViewPage').hasClass('active')){
			$('#mViewPage').removeClass('active');
			$('#mTagPage').addClass('active');
			
			$.get('/tagPage', function(data){
				// Inject html into the page
				$('#mainContainer').html(data);
		
				// Reinitialize the original click handlers
				initialize();
			});	
		}
	});
	
	// Click handler to view the view question pages
	$('#mViewPage').click(function(){
		if ($('#mTagPage').hasClass('active')){
			
			$('#mTagPage').removeClass('active');
			$('#mViewPage').addClass('active');
			
			$.get('/viewPage', function(data){
				// Inject html into the page
				$('#mainContainer').html(data);
		
				// Initialize the view questions page click handlers
				initializeView();
			});	
		}
	});
	
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