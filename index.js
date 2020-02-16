document.addEventListener("DOMContentLoaded", main);

const pages = {
	Home: "home",
	Search: "search",
	Details: "details"
};
let curr_page = pages.Search;

function main() {
	switch_page(curr_page);
}

function switch_page(page) {
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
			break;
		case pages.Details:
			home_page.style.display = "none";
			search_page.style.display = "none";
			details.style.display = "";
			header.style.display = "";
			break;
		default:
	}
}
