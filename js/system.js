$(document).ready(function(){
	window.System = {
		completeAction : function(action , params){
			var access = this.checkAccessAction(action);
			if(access.allow){

			}else{ // событие запретили выполнять

			}
		} ,

		checkAccessAction : function(action){
			var return_data = {
				allow : false ,
				params : {}
			};
			switch(action){
				case 'chakeBones' :
					var game_status = Game.getStatusGame();
					switch(game_status){
						case 'startGame':
							if(Game.getCountSteps(1) === 0){
								return_data.allow = true;
								return_data.params = {shake_bones : 1}
							}else if(Game.getCountSteps(2) === 0){
								return_data.allow = true;
								return_data.params = {shake_bones : 2}
							}
						break;
					}
				break;
			}
		}
	};

	window.Game = {
		game_status : "startGame" ,

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

		// функция трясет кости
		chake : function(bonesSelector){
			bonesSelector.each(function(i) {
			    var left = $(this).position().left;
		        for (var x = 1; x <= 2; x++) {
		            $(this).animate({ left: left-25 }, 10).animate({ left: left }, 50).animate({ left: left + 25 }, 10).animate({ left: left }, 50);
		        }
	    	});
	    	return bonesSelector;
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
		}
	};


	$('.bottom_field , .top_field').sortable({
		connectWith : '.bottom_field , .top_field' ,
	});
	$('.bottom_field , .top_field').disableSelection();

	
	// трясем кости :)
	$('div.die').click(function(){


		

		// смотрим статус игры
		/*var game_status = Game.getStatusGame();

		if(game_status === 'startGame'){
			if(Game.player1.count_steps === 0){
				Game.chake($('#die1'));
				var roll = Math.floor(Math.random() * 6) + 1;
				$('div#die1').addClass("active").attr('data-value' , roll);
				Game.player1.count_steps++;
			}else{
				Game.chake($('#die2'));
				var roll = Math.floor(Math.random() * 6) + 1;
				$('div#die2').addClass("active").attr('data-value' , roll);
				Game.player2.count_steps++;
			}
		}*/

		/*
		for (var i = 1; i < 3; i++) {
			var roll = Math.floor(Math.random() * 6) + 1;
			$("div#die" + i).addClass("active").attr("data-value", roll);
			// заносим значение костей в объект
			Game.setBoneValue(i , roll);
		}
		// выполняем действие
		Game.completeStep();
		*/
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