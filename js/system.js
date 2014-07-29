$(document).ready(function(){
	window.Board = {
		shakeBones : function(access_params , event_params){
			if('shake_bones' in access_params.params){
				if(access_params.params.shake_bones === 1 || access_params.params.shake_bones === 2){
					if(access_params.params.shake_bones === 1){
						var chake_bone = $('#die1');
						Game.player1.count_steps++;

					}else{
						var chake_bone = $('#die2');
						Game.player2.count_steps++;
					}

					this.chake(chake_bone);
					var roll = Math.floor(Math.random() * 6) + 1;
					chake_bone.addClass("active").attr('data-value' , roll);

					switch(access_params.params.shake_bones){
						case 1:
							Game.addNewStep('shakeOneBone' , 'player1' , {shake_result : roll});
						break;
						case 2:
							Game.addNewStep('shakeOneBone' , 'player2' , {shake_result : roll});
						break;
					}
					
					/*
						for (var i = 1; i < 3; i++) {
						var roll = Math.floor(Math.random() * 6) + 1;
						$("div#die" + i).addClass("active").attr("data-value", roll);
						// заносим значение костей в объект
						Game.setBoneValue(i , roll);
					}*/

				}else{
					console.error('Неизвестный порядковый номер кости');
				}
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


	window.System = {
		eventsController : function(access_params , event_params){
			console.log(access_params , event_params);
			// Если событие запустили с параметром, который указывает, какой объект должен обрабатывать запрос
			if('object' in event_params){
				if('fun' in event_params){
					if(typeof(window[event_params.object]) === 'object'){
						console.info("Объект обработки события найден");
						var obj = event_params.object;
						var fun = event_params.fun;

						window[obj][fun](access_params , event_params);
					}else{
						console.error("Не найден объект " + event_params.object + " для обработки события");
					}
				}
			}
		} ,

		completeAction : function(action , params){
			// проверяем, разрешена ли обработка события
			var access = this.checkAccessAction(action);
			if(access.allow){
				var result = this.eventsController(access , params);
			}else{ // событие запретили выполнять

			}
		} ,

		checkAccessAction : function(action){
			var return_data = {
				allow : false ,
				params : {}
			};
			// перечисление событий системы
			switch(action){
				// бросать кости
				case 'chakeBones' :
					var game_status = Game.getStatusGame();
					switch(game_status){
						case 'startGame':
							if(Game.getCountSteps(1) === 0){
								console.log('Бросает кубик, 1-й игрок');
								return_data.allow = true;
								return_data.params = {shake_bones : 1}
							}else if(Game.getCountSteps(2) === 0){
								console.log('Бросает кубик, 2-й игрок');
								return_data.allow = true;
								return_data.params = {shake_bones : 2}
							}
						break;
					}
				break;
			}

			return return_data;
		}
	};	

	window.Game = {
		game_status : "startGame" ,

		steps : {
			title_step : [] , 	// array of string
			stepsUser	: [] , 	// array of string
			data 		: []	// array of object
		} ,

		stroke : {
			bone1 : '' ,
			bone2 : ''
		} ,

		player1 : {
			count_steps : 0
		} ,

		player2 : {
			count_steps : 0
		} ,	

		getStatusGame : function(){
			return this.game_status;
		} ,
		getCountSteps : function(num_player){
			if(num_player === 1){
				return this.player1.count_steps;
			}else{
				return this.player2.count_steps;
			}
		} ,

		addNewStep : function(new_title_step , new_stepsUser ,  new_data){
			if(void 0 !== new_title_step && void 0 !== new_stepsUser){
				if(this.steps.title_step !== 0){
					this.steps.title_step[this.steps.title_step.length] = new_title_step;
					this.steps.stepsUser[this.steps.title_step.length] = new_stepsUser;
					if(typeof(new_data) === 'object'){
						this.steps.data[this.steps.title_step.length] = new_data;
					}else{
						this.steps.data[this.steps.title_step.length] = false;
					}

					console.info('New system step. ' + new_stepsUser + ' doing ' + new_title_step + ' with data: ' , new_data);
				}else{
					this.steps.title_step[0] 	= new_title_step;
					this.steps.stepsUser[0]		= new_stepsUser;
				}
			}
		}

	};


	$('.bottom_field , .top_field').sortable({
		connectWith : '.bottom_field , .top_field' ,
	});
	$('.bottom_field , .top_field').disableSelection();

	
	// трясем кости :)
	$('div.die').click(function(){
		System.completeAction('chakeBones' , {object : 'Board' , fun : 'shakeBones'});
	});



	jQuery.fn.shake = function() {
	    this.each(function(i) {
		    var left = $(this).position().left;
	        for (var x = 1; x <= 2; x++) {
	            $(this).animate({ left: left-25 }, 10).animate({ left: left }, 50).animate({ left: left + 25 }, 10).animate({ left: left }, 50);
	        }
	    });
	    return this;
	}
});