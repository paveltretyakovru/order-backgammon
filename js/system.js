$(document).ready(function () {
	/// MAIN JS CODE ///

	window.Game = {
		count_pieces : 15
	}

	window.Board = {
		element	: $('#board')
	}

	$('.field').sortable({
		 connectWith: '.field'
	});
	$('.field').disableSelection();

	var height_pieces = Board.element.height() / Game.count_pieces;

	$('.piece').height(height_pieces);
	$('.piece').width(height_pieces);
});