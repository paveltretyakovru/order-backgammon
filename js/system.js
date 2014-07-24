$(document).ready(function () {
	/// MAIN JS CODE ///

	window.Board = {
		element			: $('#board') ,
		board_top 		: $('#board_top') ,
		board_bottom 	: $('#board_bottom')
	}

	// Выравниваем высоту верхней и нижней части доски
	var board_height = Board.element.height();
	Board.board_top.height(Board.element.height() / 2);
	Board.board_bottom.height(Board.element.height() / 2)

});