$(document).ready(function(){

	window.System = {
		// метод вызывает методы других объектов
		completeEvent : function(object , method , params){
			// проверяем существование объекта обработчика
			if(typeof(window[object]) === 'object'){
				// проверяем существование метода в объекте обработчике
				if(method in window[object] && typeof(window[object][method]) === 'function'){
					// выполняем метод обработчик
					var result = window[object][method](params);
					return result;
				}else{console.error("Метод " + method + " в объекте " + object + " не найден, либо не функция");} // if method in window[object]
			}else{console.error("Объект " + object + " не найден");} // if window[object] === object
		} ,

		// генератор случайной строки
		randWD : function (n){  // [ 2 ] random words and digits
			return Math.random().toString(36).slice(2, 2 + Math.max(1, Math.min(n, 10)) );
		}
	};

	window.Game = {
		type : 'local' ,
		status : 'lot' ,
		
		steps : {
			player 	: [] ,
			title	: [] ,
			data 	: []
		} ,

		addStep : function(new_player , new_title , new_data){
			if(new_player !== '' && new_title !== ''){
				this.steps.player[this.steps.player.length] = new_player;
				this.steps.title[this.steps.title.length] 	= new_title;
				if(typeof(new_data) === 'object'){
					this.steps.data[this.steps.data.length] = new_data;
				}else{
					this.steps.data[this.steps.data.length] = false;
				}
				if(new_player === 'Player1'){
					Player1.count_steps++;
				}else{
					Player2.count_steps++;
				}
			}else{console.error('Переданы пустые аргументы')}
		}
	};

	window.Player1 = {
		name : 'Player1' ,
		count_steps : 0 ,
		relot : false
	};

	window.Player2 = {
		name : 'Player2' ,
		count_steps : 0 ,
		relot : false
	};

	window.Board = {
		bone1_val : 0 ,
		bone2_val : 0 ,

		steps_player : '' ,

		bone1_selector : $('#die1') ,
		bone2_selector : $('#die2') ,

		chakeBones : function(params){
			switch(Game.status){
				case 'lot':
					// проверяем кинул ли первый игрок жребий
					if(this.bone1_val === 0){
						// трясем кости
						this.chake(this.bone1_selector);

						var roll = Math.floor(Math.random() * 6) + 1;
						// ставим точки на кости
						this.bone1_selector.addClass("active").attr('data-value' , roll);
						this.bone1_val = roll;

					}else if(this.bone2_val === 0){
						this.chake(this.bone2_selector);

						var roll = Math.floor(Math.random() * 6) + 1;
						this.bone2_selector.addClass("active").attr('data-value' , roll);
						this.bone2_val = roll;

						// Смотрим, какой игрок будет ходить
						if(this.bone1_val > this.bone2_val){
							this.steps_player = 'Player1';
							Game.status = 'game';
						}else if(this.bone1_val < this.bone2_val){
							this.steps_player = 'Player2';
							Game.status = 'game';
						}else{
							this.bone1_val = 0;
							this.bone2_val = 0;
						}
					}
				break;
				case 'game' :
					// трясем обе кости
					this.chake($('#die1 , #die2'));
					var roll 	= Math.floor(Math.random() * 6) + 1;
					var roll1 	= Math.floor(Math.random() * 6) + 1;
					this.bone1_selector.addClass("active").attr('data-value' , roll);
					this.bone2_selector.addClass("active").attr('data-value' , roll1);

					this.bone1_val = roll;
					this.bone2_val = roll1;

					// меням ходящего игрока
					if(this.steps_player === 'Player1'){
						this.steps_player = 'Player2';
						this.setPlayerActiv('Player1');
						console.log('Ходит 1 игрок')
					}else{
						this.steps_player = 'Player1';
						this.setPlayerActiv('Player2');
						console.log('Ходит 2 игрок');
					}					
				break;
			}
		} ,

		setPlayerActiv : function(player){


			///////////////////////////////////////////////////
			function activation(player_num , enemy_num){
						// уничтожаем старые sortable, в том числе и у противника
							$('.field').each(function(index , element){
								var  field = $(element);
								if(field.hasClass('ui-sortable')){
									field.css('border' , 'none').sortable('destroy');
								}
							});
			
							// перебираем поля, на которых стоят свои фишки
							$('.field:has(.player' + player_num + ')').each(function(index , element){
								var field = $(element);
			
								var can = field.attr('data-fieldid') - (Board.bone1_val + Board.bone2_val);
								if(can< 0){
									can = 24 - can;
									if(can === 0){
										can = 24;
									}
								}
			
								// если на возможном поле стоят фишки соперника, убираем возможность ставить на них фишки
								if($('.field[data-fieldid=' + can + ']').find('figure').hasClass('player' + enemy_num)){
									can = false;
								}
			
								// вычисляем поля, на которые может сходить игрок
								var can1 = field.attr('data-fieldid') - Board.bone1_val;					
								// делаем возможным перемищение фишек по кругу
								if(can1 < 0){
									can1 = 24 + can1;
									if(can1 === 0){
										can1 = 24;
									}
								}
			
								// если на возможном поле стоят фишки соперника, убираем возможность ставить на них фишки
								if($('.field[data-fieldid=' + can1 + ']').find('figure').hasClass('player' + enemy_num)){
									can1 = false;
								}
			
								var can2 = field.attr('data-fieldid') - Board.bone2_val;
								if(can2 < 0){
									can2 = 24 + can2;
									if(can2 === 0){
										can2 = 24;
									}
								}
								if($('.field[data-fieldid=' + can2 + ']').find('figure').hasClass('player' + enemy_num)){									
									can2 = false;
								}
			
								console.log('data-fieldid: ' + field.attr('data-fieldid') + '; can1=' + can1 + '; can2=' + can2);
								console.log('bone1=' + Board.bone1_val + '; bone2=' + Board.bone2_val);
			
								// переменная будет хранить строку, в которой указано - с какими полями может коннектиться поле
								var canConnect = '';
			
								// вычесленные поля делаем активными
								if(can){						
									canConnect += '.field[data-fieldid=' + can + ']';
								}					
								if(can1){						
									if(can){
										canConnect += ' , .field[data-fieldid=' + can1 + ']';	
									}else{
										canConnect += '.field[data-fieldid=' + can1 + ']';}
								}
								if(can2){						
									if(can1 || can){										
										canConnect += ' , .field[data-fieldid=' + can2 + ']';
										console.log(canConnect);

									}else{
										canConnect += '.field[data-fieldid=' + can2 + ']';
									}
								}
			
								// функция делает возможные поля сортируемыми
								// и соеденненными между собой
								function canFun(idfiled , connect){
									var canfield = $('.field[data-fieldid=' + idfiled +']');
									if(canfield.hasClass('top_field')){
										canfield.css('border' , '1px solid red').sortable({
										connectWith : connect ,
										containment : '#main_board_table_board' ,
										items		: 'figure:last' ,
										revert : 1000
										});
									}else{
										canfield.css('border' , '1px solid red').sortable({
											connectWith : connect ,
											containment : '#main_board_table_board' ,
											items		: 'figure:first' ,
											revert 		: 1000 ,
											start 		: function(event , ui){
												
											}
										});
									}
								}
			
			
								if(can){
									canFun(can , canConnect);
								}
								if(can1){
									canFun(can1 , canConnect);
								}
								if(can2){
									canFun(can2 , canConnect);
								}			
			
								// перебираемые поля с фишками игрока делаем так же активными
								// условие делает активными - только крайние фишки
								if(field.hasClass('top_field')){
									field.sortable({
										connectWith : canConnect ,
										containment : '#main_board_table_board' ,
										items		: 'figure:last' ,
										revert : 1000
									});
								}else{
									field.sortable({
										connectWith : canConnect ,
										containment : '#main_board_table_board' ,
										items		: 'figure:first' ,
										revert : 1000
									});
								}
							});
			
			}
			////////////////////////////////////////////////////

			if(player === 'Player1'){
				activation(1 , 2);
			}else{ // END if player1. BEGIN if player2				
				activation(2 , 1);
			}
		} ,

		// функция трясет кости
		chake : function(bonesSelector){
			bonesSelector.each(function(i) {
			    var left = $(this).position().left;
		        for (var x = 1; x <= 2; x++) {
		            $(this).animate({ left: left-25 }, 10).animate({ left: left }, 50).animate({ left: left + 25 }, 10).animate({ left: left }, 50);
		        }
	    	});
	    	return bonesSelector;
		}
	};

	// Кидаем кости
	$('div.die').click(function(){
		// Вызываем метод кидающий кости
		System.completeEvent('Board' , 'chakeBones' , {shakeSelector : $(this)});		
	});

});