//You can edit ALL of the code here
async function setup() {
  const allShows = await fetch("https://api.tvmaze.com/shows")
    .then((response) => response.json())
    .catch((error) => {
      document.body.innerHTML = `<p style="color: red;">Error fetching shows: ${error.message}</p>`;
      return [];
    })
    .then((data) => {
      if (!Array.isArray(data)) {
        document.body.innerHTML = `<p style="color: red;">Unexpected data format: ${JSON.stringify(data)}</p>`;
        return [];
      }
      return data;
    });
  if (!Array.isArray(allShows)) {
    document.body.innerHTML = `
      <p style="color:red;">
        Unexpected data format
      </p>
    `;
    return;
  }
 const app = document.createElement("div");
  document.body.appendChild(app);

  const topBar = document.createElement("div");
  topBar.style.padding = "20px";
  topBar.style.backgroundColor = "rgb(37, 102, 140)";
  topBar.style.display = "flex";
  topBar.style.gap = "10px";
  topBar.style.alignItems = "center";
  app.appendChild(topBar);
  
  const showSelect = document.createElement("select");
  topBar.appendChild(showSelect);
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select a show";
  showSelect.appendChild(defaultOption);
  allShows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    showSelect.appendChild(option);
  });

  const content = document.createElement("div");
  app.appendChild(content);

  makePageForShows(allShows, content);

   showSelect.addEventListener("change", async (event) => {
    const selectedShowId = event.target.value;

   
    content.innerHTML = "";

    if (!selectedShowId) {
      makePageForShows(allShows, content);
      return;
    }

  
    const episodes = await fetch(
      `https://api.tvmaze.com/shows/${selectedShowId}/episodes`
    )
      .then((response) => response.json())
      .catch((error) => {
        content.innerHTML = `
          <p style="color:red;">
            Error fetching episodes: ${error.message}
          </p>
        `;
        return [];
      });

  
    if (!Array.isArray(episodes)) {
      content.innerHTML = `
        <p style="color:red;">
          Unexpected episode format
        </p>
      `;
      return;
    }

    makePageForEpisodes(episodes, content);
  });
}
function makePageForShows(showList, content) {
  const rootElem = document.createElement("div");

  rootElem.style.display = "grid";
  rootElem.style.gridTemplateColumns =
    "repeat(auto-fit, minmax(300px, 1fr))";
  rootElem.style.gap = "20px";
  rootElem.style.padding = "20px";

  content.appendChild(rootElem);

  showList.forEach((show) => {
    const showElem = document.createElement("div");

    showElem.style.border = "1px solid #ccc";
    showElem.style.borderRadius = "10px";
    showElem.style.padding = "15px";
    showElem.style.backgroundColor = "white";

    showElem.innerHTML = `
      <h2>${show.name}</h2>

      ${
        show.image
          ? `<img src="${show.image.medium}" alt="${show.name}">`
          : ""
      }

      <p>${show.summary || "No summary available"}</p>
    `;

    rootElem.appendChild(showElem);
  });
}

function makePageForEpisodes(episodeList) {
  const search = document.createElement("div");
  document.body.appendChild(search);
  search.style.backgroundColor = "rgb(37, 102, 140)";
  search.style.padding = "40px";
  const dropDownShow = document.createElement("select");
  search.appendChild(dropDownShow);
  const defaultOptionShow = document.createElement("option");
  defaultOptionShow.value = "";
  defaultOptionShow.textContent = "Select a show";
  dropDownShow.appendChild(defaultOptionShow);
  dropDownShow.style.marginRight = "10px";
  const searchInput = document.createElement("input");
  search.appendChild(searchInput);
  searchInput.placeholder = "Search episodes...";
  const searchCount = document.createElement("span");
  search.appendChild(searchCount);
  searchCount.textContent = `Displaying ${episodeList.length} / ${episodeList.length} episodes`;
  searchCount.style.marginLeft = "10px";

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
      <p id="summary">${episode.summary}</p>

      `;
    rootElem.appendChild(episodeElem);
    const searchInput = document.querySelector("input");
    searchInput.addEventListener("input", (event) => {
      const searchTerm = event.target.value.toLowerCase();
      if (
        episode.name.toLowerCase().includes(searchTerm) ||
        episode.summary.toLowerCase().includes(searchTerm)
      ) {
        episodeElem.style.display = "block";
      } else {
        episodeElem.style.display = "none";
      }
      const visibleEpisodes = document.querySelectorAll(
        ".episode:not([style*='display: none'])",
      );
      searchCount.textContent = `Displaying ${visibleEpisodes.length} / ${episodeList.length} episodes`;
    });
  });

  const dropdown = document.createElement("select");
  search.appendChild(dropdown);
  dropdown.style.marginLeft = "10px";
  dropdown.style.border = "1px solid blue";
  dropdown.style.color = "white";
  dropdown.style.backgroundColor = "rgb(37, 102, 140)";
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select an episode";
  dropdown.appendChild(defaultOption);

  episodeList.forEach((episode) => {
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `S${episode.season}E${episode.number} - ${episode.name}`;
    dropdown.appendChild(option);
  });

  dropdown.addEventListener("change", (event) => {
    const selectedEpisodeId = event.target.value;
    const episodeElems = document.querySelectorAll(".episode");
    episodeElems.forEach((elem) => {
      if (selectedEpisodeId === "") {
        elem.style.display = "block";
      } else if (
        elem.querySelector("h2").textContent ===
        episodeList.find((ep) => ep.id == selectedEpisodeId).name
      ) {
        elem.style.display = "block";
      } else {
        elem.style.display = "none";
      }
      const visibleEpisodes = document.querySelectorAll(
        ".episode:not([style*='display: none'])",
      );
      searchCount.textContent = `Displaying ${visibleEpisodes.length} / ${episodeList.length} episodes`;
    });
  });
}

window.onload = setup;
