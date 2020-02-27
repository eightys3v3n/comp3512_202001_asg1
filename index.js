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

function Filter(title, year_between, rating_between) {
	if (title) {
		this.title = title.toLowerCase();
	} else {
		this.title = "";
	}

	if (year_between) {
		console.assert(year_between.length === 2, "year_between must be an array with two elements");
		if (year_between[0] && year_between[1]) {
			console.assert(year_between[0] <= year_between[1], "After year must be <= than Before year when specified");
		}
		this.year = {after: year_between[0], before: year_between[1]};
	} else {
		this.year = {after: 0, before: Number.MAX_SAFE_INTEGER};
	}

	if (rating_between) {
		console.assert(rating_between.length === 2, "rating_between must be an array with two elements");
		if (rating_between[0] && rating_between[1]) {
			console.assert(rating_between[0] <= rating_between[1], "Above rating must be >= Below rating when specified");
		}
		this.rating = {after: rating_between[0], before: rating_between[1]};
	} else {
		this.rating = {after: 0, before: 10};
	}
}

function main() {
	fetch(api_url+"movies-brief.php?id=ALL")
		.then(response => response.json())
		.then(data => {
			movies = data;
			populate_movies(data)
		});

	switch_page(curr_page);

	document.querySelector("#filters")
		.addEventListener("keyup", e => {
			if (e.keyCode === 13) {
				refresh_filters();
			}
		});
	document.querySelector("#home input[name='all_movies']")
		.addEventListener("click", e => { switch_page(pages.Search, ""); });
	document.querySelector("#home input[name='search']")
		.addEventListener("click", e => { switch_page(pages.Search, document.querySelector("#home #search_query").value); });
	document.querySelector("#search #filters_box #hide_filters")
		.addEventListener("click", toggle_filters);
	document.querySelector("#search #filters #buttons #update_filters")
		.addEventListener("click", refresh_filters);
}

function switch_page(page, data) {
	let home_page = document.querySelector("#home");
	let search_page = document.querySelector("#search");
	let details_page = document.querySelector("#details");
	let header = document.querySelector("header");

	if (!data) {
		data = "";
	}

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
			refresh_filters();
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

function refresh_filters() {
	let title = document.querySelector("#search #filters input[name='title']").value;
	let year_between = get_year_between_filter();

	filter = new Filter(title);
	filtered_movies = filter_movies(filter);
	populate_movies(filtered_movies);
}

function get_year_between_filter() {
	let year = [undefined, undefined];
	let selector = document.querySelector("#search #filters #year_filters #before

}

function populate_movies(movies_list) {
	let matches = document.querySelector("#search #matches ul");

	matches.innerHTML = "";

	for (let movie of movies_list) {
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

function filter_movies(filter) {
	if (!movies) {
		console.warn("Movies attempted to be populated but they haven't been fetched yet.");
		return [];
	}

	filtered_movies = [];
	for (let movie of movies) {
		if (movie.title.toLowerCase().includes(filter.title)) { // In production I would find or implemenet a fuzzy search algorithm.
			filtered_movies.push(movie);
		}
	}

	return filtered_movies;
}

