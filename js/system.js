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
		status : 'Start' ,
		
		steps : {
			player 	: [] ,
			title	: [] ,
			data 	: []
		} ,

		addStep : function(new_player , new_title , new_data){
			if(new_player !== '' && new_title !== ''){
				this.steps.player[this.steps.player.length] = new_player;
				this.steps.title[this.steps.title.length] 	= new_title;
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
		count_steps : 0
	};

	window.Player2 = {
		name : 'Player2' ,
		count_steps : 0
	};

	window.Board = {
		bone1 : $('#die1') ,
		bone2 : $('#die2') ,

		chakeBones : function(params){
			switch(Game.type){
				case 'local':
					// Проверяем кидают ли игроки жребии
					if(Player1.count_steps === 0){
						// обновляем лог и заносим информацию игроками
						Game.addStep('Player1' , 'throwlot');
						// трясем кости
						this.chake(this.bone1);
						// генерируем случайное число
						var roll = Math.floor(Math.random() * 6) + 1;
						// отображаем на костях нужное количество точек
						this.bone1.addClass("active").attr('data-value' , roll);
						console.log('Игрок 1 кинул жребий');

						return true;
					}else if(Player2.count_steps === 0){
						Game.addStep('Player2' , 'throwlot');
						this.chake(this.bone2);
						var roll = Math.floor(Math.random() * 6) + 1;
						this.bone2.addClass("active").attr('data-value' , roll);
						// оба игрока кинули жребий, меняем статус игры
						Game.status = 'Game';
						console.log('Игрок 2 кинул жребий');

						return true;
					// если жребий брошен, значит начинаем игру
					}else if(Game.status === 'Game'){
						alert('Start game :)');
					}
				break;
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