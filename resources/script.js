const serverUrl = 'http://localhost:3000';
let wordData;

let sliderValue = 0;

document.addEventListener('DOMContentLoaded', function(){
	fetchWords();
	setupSlider();

	// document.querySelector('#submit').addEventListener('click', function(){
	// 	sendWords();
	// });
});


var ws = new WebSocket('ws://172.20.10.3:8025/');

let timer;

ws.onmessage = function (event) {
	console.log(event.data);
	clearTimeout(timer);
	timer = setTimeout(function(){
		sendWords();
	}, 500);	
};

function setupSlider(){
	const slider = document.querySelector('#slider input');
	slider.oninput = function(){
		var self = this;
		sliderValue = parseInt(this.value);
		document.querySelectorAll('#container > div').forEach(function(el){
			el.style.backgroundColor = 'transparent';
		});

		const score = document.querySelector('#container div[data-score="'+this.value+'"]');
		score.style.backgroundColor = 'red';
		//selectWordsFromScore(score);
	}
	slider.onmousedown = function(){
		this.classList.add('dragging');
	}

	slider.onmouseup = function(){
		this.classList.remove('dragging');
		sendWords();
	}
}

function selectWords(){
	let numWords = Math.floor(Math.random() * 17) + 3;
	const selectedWords = [];
	const availableWords = _.where(wordData, { sentiment: sliderValue });
	for(let i = 0; i < numWords; i++){

		const rWord = availableWords[Math.floor(Math.random() * availableWords.length)];
		selectedWords.push(rWord);
	}
	return selectedWords;
}


function sendWords(){
	const rselectedWords = selectWords();
	fetch(serverUrl+'/print', {
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ 
			value: sliderValue,
			words: rselectedWords
		})
	})
	.then((response) => {
		return response.json();
	})
	.then((result) => {
		console.log(result);
	});
}


function mapRange(value, low1, high1, low2, high2) {
	return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}


function getNews(since) {
	return new Promise((resolve, reject) => { 
		fetch(serverUrl+'?since='+since, {
			method: 'get'
		}).then((response) => {
			return response.json();
		}).then((data) => {
			resolve(data);
		});
	});
}

function fetchWords(){
	fetch(serverUrl+'/words', {
		method: 'get'
	}).then((response) => {
		return response.json();
	}).then((data) => {
		wordData = data;
		wordData.forEach((word, i) => {
			if(word.sentiment !== 0){
				const div = document.createElement('div');
				
				div.innerHTML = `
					${word.word}
				`;
				
				document.querySelector('#container div[data-score="'+word.sentiment+'"] .column').appendChild(div);
			}
		});


	});

}