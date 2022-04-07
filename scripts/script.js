'use strict';

const formAddCard = document.querySelector('#form_addcard');

let tasks = JSON.parse(localStorage.getItem("tasks") || '[]');

rerender(tasks);

formAddCard.addEventListener('submit', addTaskCard);

function addTaskCard(event) {

	event.preventDefault();

	const fields = ['name', 'mark'],
		task = {};

	fields.forEach(field => task[field] = event.target[field].value);

	task.status = '';
	task.id = 'card' + randomID();

	tasks.push(task);
	rerender(tasks);
}

function changeStatus(card, status) {

	let task = tasks.find(elem => elem.id === card.id);
	task.status = status;

	rerender(tasks);
}

function totalUpdate(done, canceled) {
	document.querySelector(".total_done").innerText = `Сделано ${done}`;
	document.querySelector(".total_canceled").innerText = `Отменено ${canceled}`;
}

function rerender(tasks) {

	const cards = document.querySelector('#cards');
	cards.innerText = '';

	localStorage.setItem("tasks", JSON.stringify(tasks));

	let done = 0,
		canceled = 0;

	for (let task of tasks) {

		done += (task.status === "done") ? 1 : 0;
		canceled += (task.status === "canceled") ? 1 : 0;

		const {
			card,
			close,
			check,
			name,
			mark,
			buttons,
			content
		} = createCardElements();

		check.addEventListener('click', changeStatus.bind(null, task, "done"));
		close.addEventListener('click', changeStatus.bind(null, task, "canceled"));
		card.addEventListener('dblclick', changeStatus.bind(null, task, ""));

		card.id = task.id;

		if (task.status !== "done") {
			card.classList.remove('card_done');
		}
		if (task.status !== "canceled") {
			card.classList.remove('card_canceled');
		}
		if (task.status !== "") {
			card.classList.add('card_' + task.status);
		}

		let span = "<span></span>";
		check.innerHTML = span + span;
		close.innerHTML = span + span;

		name.innerText = task.name;
		mark.innerText = task.mark;

		content.append(name, mark);
		buttons.append(check, close);

		card.append(content, buttons);
		cards.appendChild(card);
	}

	totalUpdate(done, canceled);
}

function createCardElements() {
	const card_obj = {
		card: "card",
		close: "card_buttons_",
		check: "card_buttons_",
		name: "card_content_",
		mark: "card_content_",
		buttons: "card_buttons",
		content: "card_content"
	};

	for (const [key, value] of Object.entries(card_obj)) {
		let className = value.slice(-1) === "_" ? value + key : value;
		card_obj[key] = document.createElement('div');
		card_obj[key].classList.add(className);
	}

	return card_obj;
}

function randomID() {
	return '_' + Math.random().toString(36).substr(2, 9);
}