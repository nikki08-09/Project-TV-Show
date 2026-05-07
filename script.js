//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
const search = document.createElement("div");
document.body.appendChild(search);
const searchInput = document.createElement("input");
search.appendChild(searchInput);
searchInput.placeholder = "Search episodes...";
  const rootElem = document.createElement("div");
  document.body.appendChild(rootElem);
  const copyWrite = document.createElement("div");
  document.body.appendChild(copyWrite);
  copyWrite.innerHTML = `<p>All data is from <a href="https://www.tvmaze.com/" target="_blank">TVmaze.com</a></p>`;
  episodeList.forEach((episode) => {
    const episodeElem = document.createElement("div");
    episodeElem.style.border = "1px solid black";
    episodeElem.style.padding = "10px";
    episodeElem.style.margin = "10px";
    episodeElem.style.color = "rgb(38, 142, 190)";
    episodeElem.classList.add("episode");
    if (episode.season < 10) {
      episode.season = "0" + episode.season;
    }
    if (episode.number < 10) {
      episode.number = "0" + episode.number;
    }
    episodeElem.innerHTML = `
      <h2>${episode.name}</h2>
      <img src="${episode.image.medium}" alt="${episode.name}">
      <h3>Season ${episode.season}, Episode ${episode.number}</h3>
      <p>${episode.summary}</p>

      `;
    rootElem.appendChild(episodeElem);
  });
}

window.onload = setup;
