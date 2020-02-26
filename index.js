document.addEventListener("DOMContentLoaded", main);

const api_url = "http://www.randyconnolly.com/funwebdev/3rd/api/movie/";
const poster_url = "https://image.tmdb.org/t/p/";
const pages = {
	Home: "home",
	Search: "search",
	Details: "details"
};
let curr_page = pages.Search;
let movies;
let movie_id;

function main() {
	fetch(api_url+"movies-brief.php?id=ALL")
		.then(response => response.json())
		.then(data => populate_movies(data));

	switch_page(curr_page);

	document.querySelector("#home input[name='all_movies']")
		.addEventListener("click", e => { switch_page(pages.Search, ""); });
	document.querySelector("#home input[name='search']")
		.addEventListener("click", e => { switch_page(pages.Search, document.querySelector("#home #search_query").value); });
	document.querySelector("#search #filters_box #hide_filters")
		.addEventListener("click", toggle_filters);
}

function switch_page(page, data) {
	let home_page = document.querySelector("#home");
	let search_page = document.querySelector("#search");
	let details_page = document.querySelector("#details");
	let header = document.querySelector("header");

	switch(page) {
		case pages.Home:
			home_page.style.display = "";
			search_page.style.display = "none";
			details.style.display = "none";
			header.style.display = "none";
			break;
		case pages.Search:
			home_page.style.display = "none";
			search_page.style.display = "";
			details.style.display = "none";
			header.style.display = "";
			document.querySelector("#search #filters input[name='title']").value = data;
			search_movies(data);
			break;
		case pages.Details:
			home_page.style.display = "none";
			search_page.style.display = "none";
			details.style.display = "";
			header.style.display = "";
			movie_id = data;
			break;
		default:
	}
}

function toggle_filters() {
	let filters_box = document.querySelector("#search #filters");
	let hide_btn = document.querySelector("#search #filters_box #hide_filters p");
	let section = document.querySelector("#search");

	if (filters_box.style.display == "none") {
		filters_box.style.display = "";
		hide_btn.textContent = "<";
		section.style.gridTemplateColumns = "1fr 2fr";
	} else {
		filters_box.style.display = "none";
		hide_btn.textContent = ">";
		section.style.gridTemplateColumns = "2em auto";
	}
}

function search_movies(query) {

}

function populate_movies(data) {
	movies = data;
	let matches = document.querySelector("#search #matches ul");

	//matches.textContent = "";

	for (let movie of filtered_movies()) {
		add_movie(matches, movie);
	}
}

function add_movie(element, movie) {
	let li = document.createElement("li");
	li.classList.add("match");

	let img = document.createElement("img");
	img.classList.add("icon");
	img.src = poster_url + "w92" + movie.poster;
	img.alt = "Movie Poster";
	li.appendChild(img);

	let h3 = document.createElement("h3");
	h3.classList.add("title");
	h3.textContent = movie.title;
	li.appendChild(h3);

	let year = document.createElement("p");
	year.classList.add("year");
	year.textContent = year_of(movie.release_date);
	li.appendChild(year);

	let rating = document.createElement("p");
	rating.classList.add("rating");
	rating.textContent = movie.ratings.average.toFixed(1);
	li.appendChild(rating);

	let view_btn = document.createElement("input");
	view_btn.type = "button";
	view_btn.name = "view";
	view_btn.value = "View";
	li.appendChild(view_btn);

	element.appendChild(li);
}

function year_of(date_str) {
	return date_str.split("-")[0];
}

function filtered_movies() {
	return movies;
}

