//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  episodeList.forEach((episode) => {
    const episodeElem = document.createElement("div");
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
