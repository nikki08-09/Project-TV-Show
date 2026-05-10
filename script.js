//You can edit ALL of the code here

async function setup() {
  // Fetch all shows
  const allShows = await fetch("https://api.tvmaze.com/shows")
    .then((response) => response.json())
    .catch((error) => {
      document.body.innerHTML = `
    <p style="color:red;">
    Error fetching shows: ${error.message}
    </p>
    `;
      return [];
    });

  if (!Array.isArray(allShows)) {
    document.body.innerHTML = `
    <p style="color:red;">
    Unexpected data format
    </p>
    `;
    return;
  }
  allShows.sort((a, b) => a.name.localeCompare(b.name));
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
      `https://api.tvmaze.com/shows/${selectedShowId}/episodes`,
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
  rootElem.style.gridTemplateColumns = "repeat(auto-fit, minmax(300px, 1fr))";
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

    ${show.image ? `<img src="${show.image.medium}" alt="${show.name}">` : ""}

    <p>${show.summary || "No summary available"}</p>
    <p><strong>Genres:</strong> ${show.genres.join(", ") || "N/A"}</p>
    <p><strong>Rating:</strong> ${show.rating?.average || "N/A"}</p>
    <p><strong>Runtime:</strong> ${show.runtime ? show.runtime + " min" : "N/A"}</p>
    <p><strong>Status:</strong> ${show.status || "N/A"}</p>
    `;

    rootElem.appendChild(showElem);
  });
}

function makePageForEpisodes(episodeList, content) {
  const searchBar = document.createElement("div");

  searchBar.style.backgroundColor = "rgb(37, 102, 140)";
  searchBar.style.padding = "20px";
  searchBar.style.display = "flex";
  searchBar.style.gap = "10px";
  searchBar.style.alignItems = "center";

  content.appendChild(searchBar);

  const searchInput = document.createElement("input");

  searchInput.placeholder = "Search episodes...";
  searchInput.style.padding = "8px";

  searchBar.appendChild(searchInput);

  // Episode dropdown
  const episodeDropdown = document.createElement("select");

  searchBar.appendChild(episodeDropdown);

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select an episode";

  episodeDropdown.appendChild(defaultOption);

  const searchCount = document.createElement("span");

  searchCount.style.color = "white";
  searchCount.textContent = `
    Displaying ${episodeList.length} / ${episodeList.length} episodes
    `;

  searchBar.appendChild(searchCount);

  // Episode container
  const rootElem = document.createElement("div");

  rootElem.style.display = "grid";
  rootElem.style.gridTemplateColumns = "repeat(auto-fit, minmax(300px, 1fr))";
  rootElem.style.gap = "20px";
  rootElem.style.padding = "20px";

  content.appendChild(rootElem);

  // Store episode cards
  const episodeCards = [];

  // Create episodes
  episodeList.forEach((episode) => {
    const season = String(episode.season).padStart(2, "0");
    const number = String(episode.number).padStart(2, "0");

    // Dropdown option
    const option = document.createElement("option");

    option.value = episode.id;
    option.textContent = `S${season}E${number} - ${episode.name}`;

    episodeDropdown.appendChild(option);

    // Episode card
    const episodeElem = document.createElement("div");

    episodeElem.classList.add("episode");

    episodeElem.style.border = "1px solid #ccc";
    episodeElem.style.borderRadius = "10px";
    episodeElem.style.padding = "15px";
    episodeElem.style.backgroundColor = "white";

    episodeElem.dataset.name = episode.name.toLowerCase();
    episodeElem.dataset.summary = (episode.summary || "").toLowerCase();

    episodeElem.dataset.id = episode.id;

    episodeElem.innerHTML = `
    <h2>${episode.name}</h2>

    ${
      episode.image
        ? `<img src="${episode.image.medium}" alt="${episode.name}">`
        : ""
    }

    <h3>S${season}E${number}</h3>

    <p>${episode.summary || "No summary available"}</p>
    `;

    rootElem.appendChild(episodeElem);

    episodeCards.push(episodeElem);
  });

  // Update visible count
  function updateCount() {
    const visibleEpisodes = episodeCards.filter(
      (card) => card.style.display !== "none",
    );

    searchCount.textContent = `
    Displaying ${visibleEpisodes.length} / ${episodeList.length} episodes
    `;
  }

  // Search filter
  searchInput.addEventListener("input", (event) => {
    const searchTerm = event.target.value.toLowerCase();

    episodeCards.forEach((card) => {
      const matches =
        card.dataset.name.includes(searchTerm) ||
        card.dataset.summary.includes(searchTerm);

      card.style.display = matches ? "block" : "none";
    });

    updateCount();
  });

  // Dropdown filter
  episodeDropdown.addEventListener("change", (event) => {
    const selectedId = event.target.value;

    episodeCards.forEach((card) => {
      if (!selectedId || card.dataset.id === selectedId) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });

    updateCount();
  });

  // Copyright
  const copyright = document.createElement("div");

  copyright.style.padding = "20px";

  copyright.innerHTML = `
    <p>
    All data is from
    <a href="https://www.tvmaze.com/" target="_blank">
    TVmaze.com
    </a>
    </p>
    `;

  content.appendChild(copyright);
}

window.onload = setup;
