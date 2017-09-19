$(document).ready(function(){

	var canvas = document.getElementById("Canvas"); 
	var ctx = canvas.getContext("2d"); 
	var size = 7;
	var gridSize = 900/size;
	var speedMultiplier = 5;
	var spawnRate = 0.5;

	var getRandomData = function(){
		var data = [];
		for(var j = 0; j < gridSize; j++){
			var row = [];
			for(var i = 0; i < gridSize; i++){
				if(Math.random() < spawnRate){
					row.push(1);
				}else{
					row.push(0);
				}
			}
			data.push(row);
		}
		return data
	}

	var drawFromData = function(data){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for(var i = 0; i < data.length; i++){
			for(var j = 0; j < data[i].length; j++){
				if(data[i][j] == 1){
					ctx.fillRect(j*size, i*size, size, size);
					ctx.stroke();
				}else{

				}	
			}
		}
	}

	var countNeighbours = function(data, co){
		var neighbourCoordinates = [[co[0]-1, co[1]], //above
									[co[0]+1, co[1]], //below
									[co[0]-1, co[1]-1], //aboveleft
									[co[0]-1, co[1]+1], //aboveright
									[co[0]+1, co[1]-1], //belowleft
									[co[0]+1, co[1]+1], //belowright
									[co[0], co[1]-1], //left
									[co[0], co[1]+1]]; //right								
		var count = 0;

		for(var i = 0; i < neighbourCoordinates.length; i++){
			var newId = [neighbourCoordinates[i][0], neighbourCoordinates[i][1]];
			if(newId[0] >= 0 && newId[0] < gridSize && newId[1] >= 0 && newId[1] <= gridSize){
				if(data[newId[0]][newId[1]] == 1){
					count += 1;
				}
			}
		}
		return count;
	}

	var nextBoard = function(data){
		var deathIds = [];
		var lifeIds = [];

		for(var i = 0; i < data.length; i++){
			for(var j = 0; j < data[i].length; j++){
				var n = countNeighbours(data,[i,j]);
				//if the cell is alive
				if(data[i][j] == 1){
					//if cell has less than 2 neighbours or more than 3 neighbours		
					if(n < 2 || n > 3){
						deathIds.push([i,j]);
					}
				}
				//if the cell is dead
				else{
					//if the cell has exactly 3 neighbours
					if(n==3){
						lifeIds.push([i,j]);
					}
				}
			}
		}

		//update the data to reflect life/death changes
		for(var i = 0; i < deathIds.length; i++){
			data[deathIds[i][0]][deathIds[i][1]] = 0;
		}
		for(var i = 0; i < lifeIds.length; i++){
			data[lifeIds[i][0]][lifeIds[i][1]] = 1;
		}
		return data;
	}

	var update = function(){
		startData = nextBoard(startData);
		drawFromData(startData);
	}

	
	var startData = getRandomData();
	drawFromData(startData);
	var interval = setInterval(update, 200/speedMultiplier);

	$('#size').change(function(){
		size = $(this).val();
		gridSize = 900/size;
		startData = getRandomData();
		drawFromData(startData);
	});

	$('#speed').change(function(){
		speedMultiplier = $(this).val();
		clearInterval(interval);
		interval = setInterval(update, 200/speedMultiplier);
	});
	
	$('#spawn').change(function(){
		spawnRate = $(this).val()/100;
		startData = getRandomData();
		drawFromData(startData);
	});

	$('#reset').click(function(){
		startData = getRandomData();
		drawFromData(startData);
	});



	
});