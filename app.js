$(document).ready( function() {
	$('.unanswered-getter').submit( function(event){
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='tags']").val();
		getUnanswered(tags);
	});

	$('.inspiration-getter').submit( function(event){
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='answerers']").val();
		getTopAnswerers(tags);
	});
});

var getUnanswered = function(tags) {
	
	// the parameters we need to pass in our request to StackOverflow's API
	var request = {		tagged: 	tags,
						site: 'stackoverflow',
						order: 'desc',
						sort: 'creation'};
	
	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/questions/unanswered",
		data: request,
		dataType: "jsonp",
		type: "GET",
		})
	.done(function(result){

		var searchResults = showSearchResults(request.tagged, result.items.length);
		$('.search-results').html(searchResults);
		$.each(result.items, function(i, item) {
			var question = showUnansweredQuestion(item);
			$('.results').append(question);
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};

// this function takes the results object from StackOverflow
// and creates info about search results to be appended to DOM
var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query;
	return results;
};

// this function takes the question object returned by StackOverflow 
// and creates new result to be appended to DOM
var showUnansweredQuestion = function(question) {
	
	// clone our result template code
	var result = $('.templates .question').clone();
	
	// Set the question properties in result
	var questionElem = result.find('.question-text a');
	questionElem.attr('href', question.link);
	questionElem.text(question.title);

	// set the date asked property in result
	var asked = result.find('.asked-date');
	var date = new Date(1000*question.creation_date);
	asked.text(date.toString());

	// set the #views for question property in result
	var viewed = result.find('.viewed');
	viewed.text(question.view_count);

	// set some properties related to asker
	var asker = result.find('.asker');
	asker.html('<p>Name: <a target="_blank" href=http://stackoverflow.com/users/' + 
				question.owner.user_id + 
				' >' +
				question.owner.display_name +
				'</a>' +
				'</p>' +
 				'<p>Reputation: ' +
 				question.owner.reputation + 
 				'</p>'
	);

	return result;
};


var getTopAnswerers = function(tags) {

	var getURL = 'http://api.stackexchange.com/2.2/tags/' + tags +'/top-answerers/month';


	var request = {
		site: 'stackoverflow',

	};
	
	var result = $.ajax({
		url: getURL,
		data: request,
		dataType: "jsonp",
		type: "GET",
		})


	.done(function(result){
		var searchResults = showSearchResults(tags, result.items.length);
		$('.search-results').html(searchResults);
		$.each(result.items, function(i, item) {
			var question = showTopAnswerer(item);
			$('.results').append(question);
		});
	});

var showTopAnswerer = function(question) {
	// clone our result template code
	var result = $('.templates .answerer').clone();
	
	// Set the answerer display name in result
	var answererDisplayName = result.find('.answerer-displayName');

	answererDisplayName.text(question.user.display_name);

	// set the reputation in result
	var reputation = result.find('.answerer-reputation');

	reputation.text(question.user.reputation);

	// set the post count for question property in result
	var postCount = result.find('.answerer-postCount');
		postCount.text(question.post_count);

	// display a link to the users profile
	console.log(question.user.link);
	var profileLink = result.find('.answerer-profile a');
	console.log(profileLink);
	profileLink.attr('href', question.user.link);

	

	return result;
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};


};





