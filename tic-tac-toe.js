// Written May 2018 by Leslie C. Bomar: contact mrlesbomar@gmail.com

function Cell(name){
	this.element = document.getElementById(name);
	this.change = () => {
		this.element.innerText = (xTurn)?"X":"O";
		this.element.style.color = (xTurn)?"black":"red";
	};
	this.element.addEventListener("click", () => {playerTurn(this)});
	this.reset = () =>{
		this.element.innerText = "";
		this.element.style.color = "white";
	};
}

function Dialog(name){
	this.element = document.getElementById(name);
	this.message = this.element.children[0].children[0];
	this.button = this.element.children[0].children[1];
	this.speak = (text) => {
			this.message.innerText = text;
			this.element.style.display = "block";
		}
	this.button.addEventListener("click", () => this.element.style.display = "none");
}

let A1 = new Cell("A1");
let A2 = new Cell("A2");
let A3 = new Cell("A3");
let B1 = new Cell("B1");
let B2 = new Cell("B2");
let B3 = new Cell("B3");
let C1 = new Cell("C1");
let C2 = new Cell("C2");
let C3 = new Cell("C3");
let gameOver = false;
let allCells = [A1,A2,A3,B1,B2,B3,C1,C2,C3];
let winKey = [[A1,B2,C3],[A3,B2,C1],[A1,A2,A3],[B1,B2,B3],[C1,C2,C3],[A1,B1,C1],[A2,B2,C2],[A3,B3,C3]];
let pcPlayer = true;
let modal = new Dialog("modal");
let xTurn = true;
let gameStats = [0,0,0]; //Total Games, X Won, Y Won

const playerTurn = (cell) => {
	if(gameOver){
		modal.speak("The game has ended, please click 'Reset' to start a new game.");
		return true;
	} else if(cell.element.innerText === ""){
		cell.change();
	} else {
		modal.speak("This cell has already been played.");
		return true;
	}
	//find winner
	if(assessWinner() === true){
		winMessage((xTurn)?"X":"O");
	} else if(movesRemaining() == true){
		computerPlays();
		xTurn = !xTurn;
	}
}

const assessWinner = () => {
	let win = false;
	winKey.forEach(solution => {
		let total = 0;
		solution.forEach(cell => {if(cell.element.innerText === ((xTurn)?"X":"O")){total++}})
		if(total === 3){win = true}
	})
	return win;
}

const assessMove = (player) =>{
	let randArray = randomizeArray(winKey);
	let returnCell = false;
	randArray.forEach(myKey => {
		let nextPlay = [[],[]];
		myKey.forEach(myCell => {
			if(myCell.element.innerText === player){nextPlay[0].push(myCell)}
			if(myCell.element.innerText === ""){nextPlay[1].push(myCell)}
		})
		if((nextPlay[0].length == 2) && (nextPlay[1].length == 1)){returnCell = nextPlay[1][0]}
	})
	return returnCell;
}

const randomizeArray = (array) =>{
	let oldArray = array.slice();
	let newArray = [];
	do {
		let i = Math.floor(Math.random()*oldArray.length);
		newArray.push(oldArray[i]);
		oldArray.splice(i,1);
	} while (oldArray.length > 0);
	return newArray;
}

const computerPlays = () => {
	if(pcPlayer === false){return false};
	xTurn = !xTurn;
	let opponentMove = assessMove((!xTurn)?"X":"O");
	let myMove = assessMove((xTurn)?"X":"O");
	if(opponentMove != false){
		opponentMove.change();
	} else if(myMove != false){
		myMove.change();
	} else {
		let blankCells = allCells.filter(cell => cell.element.innerText === "");
		let randCells = randomizeArray(blankCells);
		randCells[0].change();
	}
	if(assessWinner() === true){winMessage((xTurn)?"X":"O")};
}

const resetGame = () => {
	allCells.forEach(cell => cell.reset());
	gameOver = false;
	xTurn = true;
	pcPlayer = true;
}

const updateStats = () => {
	document.getElementById("xWins").innerText = String(gameStats[1]);
	document.getElementById("oWins").innerText = String(gameStats[2]);
	document.getElementById("xLosses").innerText = String(gameStats[0] - gameStats[1]);
	document.getElementById("oLosses").innerText = String(gameStats[0] - gameStats[2]);
	document.getElementById("xRate").innerText = `${((gameStats[1]/gameStats[0])*100).toFixed(0)}%`
	document.getElementById("oRate").innerText = `${((gameStats[2]/gameStats[0])*100).toFixed(0)}%`
}

const winMessage = (player) => {
	modal.speak(`Player ${player} has won!`);
	if(player == "X") { 
		gameStats[1]++;
	} else {
		gameStats[2]++;
	}
	gameStats[0]++;
	gameOver = true;
	updateStats();
}

const movesRemaining = () => {
	let anyBlanks = allCells.filter(cell => cell.element.innerHTML === "");
	if(anyBlanks.length < 1){
		updateStats("Draw");
		modal.speak("There are no moves left. Cat game!");
		gameOver = true;
		gameStats[0]++;
		updateStats();
		return false;
	}
	return true;
	updateStats();
}