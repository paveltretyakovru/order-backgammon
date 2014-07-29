$(document).ready(function(){

	$('.top_field , .bottom_field').sortable({
		connectWith : '.top_field , .bottom_field'
	}).disableSelection();

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

					this.bone1_val = roll;
					this.bone1_val = roll1;
				break;
			}
		} ,

		setPlayerActiv : function(player){
			if(player === 'Player1'){
								
			}else{
				
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