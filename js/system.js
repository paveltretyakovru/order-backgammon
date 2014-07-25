$(document).ready(function () {
	/// MAIN JS CODE ///

	window.Game = {
		count_pieces : 15	// количество шашек
	}

	window.Board = {
		empty_piece_html : "<li><div class='empty_piece'> </div></li>" ,

		element	: $('#board') ,
		
		// Изменяем размер шашек
		setPiecesSize : function(){
			// размер шашек = высота доски / количество шашек
			var size = this.element.height() / Game.count_pieces - 1;
			
			$('.piece').height(size).width(size);

			return size;
		} ,
		// Вставляем пустые шашки на нижнюю часть доски
		inputEmptyPieces : function(){
			// Вычисляем необходимое количество фишек для нижнего поля доски
			var need_count_pieces = Math.floor(Game.count_pieces / 2);
			// Поля для фишек на нижней части доски
			var bottom_fields = $('.bottom_field');

			bottom_fields.each(function(index , element){
				var count_pieces = 0;
				var fields_elements = $(this).find('li');
				// проверяем есть ли вообще шашки на поле
				if(fields_elements.length > 0){
					count_pieces = need_count_pieces - fields_elements.length;
				}else{
					count_pieces = need_count_pieces;
				}

				for(var i = 0; i < count_pieces; i++){
					$(this).prepend(Board.empty_piece_html);
				}
			});
			
			var count_pieces = Game.count_pieces / 2;
		}
	}

	// Делаем пешки перемещаемыми
	$('.field').sortable({
		placeholder	:'ui-state-highlight' ,
		connectWith	: '.field' ,
		items:"li:not(.empty_piece)" ,
		cancel:"li.empty_piece" ,
		stop 		: function(event , ui){

		 	var parent 			= ui.item.parent('ul');
		 	var count_elements 	= parent.find('li').length;
		 	
		 	// при добавлении новоой шашки на поле, удаляем пустой элемент
			if(ui.item.find('div:first').attr('class') !== 'empty_piece'){
				parent.find('li .empty_piece:last').replaceWith(ui.item)
			};
		}
	});
	$('.field').disableSelection();

	// Изменяем размер шашек
	var elements_size = Board.setPiecesSize();
	// Вставляем пустые шашки на нижние поля
	Board.inputEmptyPieces();

	$('.empty_piece').height(elements_size  + 3 ).width(elements_size + 3);
	
});