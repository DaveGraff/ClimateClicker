//Call timing function
setInterval(Function("timeIncrement();"), 1000);

		//Initialize the two most important variables
		var winRange = 5000000;
		var climateState = (winRange/20);
		var pointsCounter = 0;
		checkClimateHealth();

		//Help the climate & your points by clicking!
		clickPower = 1;
		updatePoints(0);
		$("#climateState").text(climateState);
		$("#mainIcon").click(function(evt){
			updatePoints(clickPower);
			$("#climateState").text(++climateState);
			checkClimateHealth();
			checkAvailable();
		});

		itemCount = new Array(7).fill(0);
		itemEffectiveness = new Array(7).fill(1);

		$("#itemsList tr").each(function(){
			orig = $(this).children().first().children().first();
			index = $(this).index();
			//Set cost
			orig.children().eq(1).children().eq(1).text(itemCost(index, itemCount[index]));
			$(this).click(function(e){
				orig = $(this).children().first().children().first();
				index = $(this).index();
				cost = itemCost(index, itemCount[index]);
				if(cost <= pointsCounter){
					checkUnavailable();
					updatePoints(-(cost));
					//Reset cost
					orig.children().eq(1).children().eq(1).text(itemCost(index, ++itemCount[index]));
					//Reset num owned
					orig.children().eq(1).children().eq(0).text(itemCount[index]);
				}
				e.preventDefault();
			});
		});

		var timePassed = 0;
		function timeIncrement(){
			climateState -= Math.pow(2, Math.floor(timePassed / 30));
			if(climateState < -(winRange))
				document.location.href = 'LosePage.html';
			if(climateState > winRange)
				document.location.href = 'WinPage.html';

			for (var i = 0; i < itemCount.length; i++) {
				gain = itemGain(i);
				updatePoints(gain);
				climateState += gain;
				$("#climateState").text(climateState);
			}

			$("#climateState").text(climateState);
			checkAvailable();
			checkClimateHealth();
			timePassed++;
		}



		function itemCost(index, numOwned){
			return Math.ceil(Math.pow(2, index*3) * Math.pow(1.5, numOwned));
		}

		function itemGain(index){
			return Math.ceil(Math.pow(2, 2 * index) * itemEffectiveness[index] * itemCount[index]);
		}

		function updatePoints(change) {
			pointsCounter += change;
			$("#pointsCounter").text(pointsCounter);
		}

		function handleUpgrade(upgradeIndex, change, upgradeId, cost){
			if(cost <= pointsCounter){
				checkUnavailable();
				updatePoints(-(cost));
				if(upgradeIndex == -1)
					clickPower += change;
				else
					itemEffectiveness[upgradeIndex] += change;
				$('#' + upgradeId).detach();
			}
		}
		function move() {
			var elem = document.getElementById("prog");
			var width = 1;
			var id = setInterval(frame, 10);
			function frame() {
				if (width >= 100) {
					clearInterval(id);
				} else {
					width++;
					if(climateState>0){
						elem.style.paddingLeft = climateState/5000000 + '%';
						elem.style.backgroundColor="green";
					}
					else{
						elem.style.paddingRight = climateState/5000000 + '%';
						elem.style.backgroundColor="red";
					}
				}
			}
		}

		var coll = document.getElementsByClassName("collapsible_button");
		var row = document.getElementsByClassName("side_collapsible");
		var i;
		for (i = 0; i < coll.length; i++) {
			coll[i].addEventListener("click", function() {
				this.classList.toggle("active");
				var content = this.nextElementSibling;
				if (content.style.maxHeight){
					content.style.maxHeight = null;
					content.style.padding="0px";
					content.style.paddingBottom= "0px";
				} else {
					content.style.maxHeight = content.scrollHeight + "px";
					content.style.padding= "10px";
					content.style.paddingBottom= "50px";
				}
			});
		}

		var map = {}; // You could also use an array
		document.addEventListener("keydown", cheatfunc);
		document.addEventListener("keyup", cheatfunc);
		function cheatfunc(e){
		e = e || event; // to deal with IE
		map[e.keyCode] = (e.type == 'keydown');
		if(map[17] && map[18] && map[82]){
			document.getElementById("mainIcon").src="../static/images/Ritesh.jpg"
		}
	}

	function checkAvailable(){
		$(".buttonDisabled").each(function(){
			var cost = $(this).children().first().children().eq(0).children().eq(1).children().eq(1).text();
			if(parseInt(cost) <= pointsCounter){
				$(this).addClass("buttonEnabled");
				$(this).removeClass("buttonDisabled");
			}
		});

		$(".buttonDisabledUpgrade").each(function(){
			var cost = $(this).children().eq(1).text();
			cost = cost.replace(/[\$,\(\)]/g, "");
			if(parseInt(cost) <= pointsCounter){
				$(this).addClass("buttonEnabledUpgrade");
				$(this).removeClass("buttonDisabledUpgrade");
			}
		});
	}

	function checkUnavailable(){
		$(".buttonEnabled").each(function(){
			var cost = $(this).children().first().children().eq(0).children().eq(1).children().eq(1).text();
			if(parseInt(cost) > pointsCounter){
				$(this).addClass("buttonDisabled");
				$(this).removeClass("buttonEnabled");
			}
		});

		$(".buttonEnabledUpgrade").each(function(){
			var cost = $(this).children().eq(1).text();
			cost = cost.replace(/[\$,\(\)]/g, "");
			if(parseInt(cost) > pointsCounter){
				$(this).addClass("buttonDisabledUpgrade");
				$(this).removeClass("buttonEnabledUpgrade");
			}
		});
	}

	function checkClimateHealth(){
		var stateVal = (climateState / winRange) * (window.innerWidth / 2);
		if(climateState < 0){
			$("#climateBarNegative").css('left', (window.innerWidth / 2) + (stateVal));
			$("#climateBarNegative").css('width', -(stateVal));
			$("#climateBarPositive").css('width', 0);
			console.log()
		} else {
			$("#climateBarPositive").css('width', stateVal);
			$("#climateBarNegative").css('width', 0);
		}
	}