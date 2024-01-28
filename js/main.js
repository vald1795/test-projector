// Функция создания объекта данных карточки
const createCardData = (title, author, year, style, country, image) => {
  const imageBase = image.split(".")[0];
  return {
    title,
    author,
    year,
    style,
    country,
    image,
    imageRetina: `${imageBase}@x2.png`,
  };
};

// Массив с данными карточек
const jsonData = [
  createCardData(
    "Let There Be Rock",
    "AC/DC",
    "1990",
    "Dub, Rock",
    "Australia",
    "img6.png"
  ),
  createCardData("Love gun", "Kiss", "1990", "Punk, Dub", "USA", "img2.png"),
  createCardData(
    "Pyromania",
    "Deff Lepard",
    "1990",
    "Black Metal",
    "Spain",
    "img3.png"
  ),
  createCardData(
    "Hysteria",
    "Deff Lepard",
    "1980",
    "Black Metal",
    "Spain",
    "img3.png"
  ),
  createCardData(
    "Psycho Circus",
    "Kiss",
    "1980",
    "Punk, Dub",
    "USA",
    "img2.png"
  ),
  createCardData(
    "Back in Black",
    "AC/DC",
    "1970",
    "Dub, Rock",
    "Australia",
    "img6.png"
  ),
  createCardData("Alive II", "Kiss", "2000", "Punk, Dub", "USA", "img2.png"),
  createCardData("Making Love", "Kiss", "2005", "Punk, Dub", "USA", "img2.png"),
  createCardData("Insomniac", "Green Day", "1992", "Punk", "UK", "img5.png"),
  createCardData(
    "Chinese Democracy",
    "Guns and Roses",
    "1990",
    "Rock",
    "Canada",
    "img4.png"
  ),
  createCardData(
    "Live On Air",
    "Guns and Roses",
    "1980",
    "Rock",
    "Canada",
    "img4.png"
  ),
  createCardData(
    "American Idiot",
    "Green Day",
    "1990",
    "Punk",
    "UK",
    "img5.png"
  ),
  createCardData(
    "There Is Nothing Left to Lose",
    "Foo Fighters",
    "1990",
    "Punk, Funk",
    "Germany",
    "img1.png"
  ),
  createCardData(
    "The Colour and the Shape",
    "Foo Fighters",
    "1980",
    "Punk, Funk",
    "Germany",
    "img1.png"
  ),
  createCardData(
    "One by One",
    "Foo Fighters",
    "2001",
    "Punk, Funk",
    "Germany",
    "img1.png"
  ),
  createCardData("Destroyer", "Kiss", "1990", "Punk, Dub", "USA", "img2.png"),
];

// DOM элементы
const container = document.getElementById("card-gallery");
const pagination = document.getElementById("pagination");

let data = [...jsonData];
const itemsPerPage = 6;

// Получить текущую страницу
function getCurrentPage() {
  return parseInt(new URLSearchParams(window.location.search).get("page")) || 1;
}

// Проверка, является ли карточка избранной
const isFavorite = (title, author) => {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  return favorites.some((fav) => fav.title === title && fav.author === author);
};

// Функция для переключения элемента в/из избранного
const toggleFavorite = (title, author) => {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const index = favorites.findIndex(
    (fav) => fav.title === title && fav.author === author
  );
  index > -1 ? favorites.splice(index, 1) : favorites.push({ title, author });
  localStorage.setItem("favorites", JSON.stringify(favorites));
  updateCards();
};

// Функция для обновления отображения карточек
function updateCards() {
  displayCards(
    data.slice(
      (getCurrentPage() - 1) * itemsPerPage,
      getCurrentPage() * itemsPerPage
    )
  );
}

// Отображение карточек на странице
const displayCards = (items) => {
  container.innerHTML = items
    .map(
      (card) => `
    <div class="col-6 col-md-4 col-lg-3 card-container">
      <div class="card">
        <img src="./media/${card.image}" srcset="./media/${
        card.image
      } 1x, ./media/${card.imageRetina} 2x" alt="${
        card.title
      }" class="card-img-top" />
        <div class="card-body">
          <h5 class="card-title">${card.title}</h5>
          <p class="card-text author">${card.author}</p>
          <p class="card-text year"><span>Year:</span> ${card.year}</p>
          <p class="card-text style"><span>Style:</span> ${card.style}</p>
          <p class="card-text country"><span>Country:</span> ${card.country}</p>
          <button class="btn card-btn mt-2" onclick="toggleFavorite('${
            card.title
          }', '${card.author}')">
            ${isFavorite(card.title, card.author) ? "Remove" : "Add+"}
          </button>
        </div>
      </div>
    </div>
  `
    )
    .join("");
};

// Фильтры
const filters = {
  byArtist: (artist, items) =>
    !artist
      ? items
      : items.filter((item) =>
          item.author.toLowerCase().includes(artist.toLowerCase())
        ),
  byGenre: (genre, items) =>
    genre === "All" || genre === "Genre"
      ? items
      : items.filter((item) =>
          item.style.toLowerCase().includes(genre.toLowerCase())
        ),
  byCountry: (country, items) =>
    country === "All" || country === "Country"
      ? items
      : items.filter((item) => item.country === country),
  byDecade: (decade, items) => {
    if (decade === "All" || decade === "Decade") return items;
    const [startYear, endYear] = decade.split("-").map(Number);
    return items.filter(
      (item) => item.year >= startYear && item.year < endYear
    );
  },
};

// Создание элементов пагинации
function createPagination(pageCount, currentPage) {
  pagination.innerHTML = "";
  for (let i = 1; i <= pageCount; i++) {
    const pageItem = document.createElement("li");
    pageItem.className = `page-item ${currentPage === i ? "active" : ""}`;
    const link = document.createElement("a");
    link.className = "page-link";
    link.href = `#${i}`;
    link.textContent = i;
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const params = new URLSearchParams(window.location.search);
      params.set("page", i);

      window.history.pushState({}, "", `${window.location.pathname}?${params}`);
      applyFiltersFromURL();
    });
    pageItem.appendChild(link);
    pagination.appendChild(pageItem);
  }
}

// Обновление пагинации и карточек
const updatePaginationAndCards = (currentPage) => {
  const pageCount = Math.ceil(data.length / itemsPerPage);
  createPagination(pageCount, currentPage);
  displayCards(
    data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  );
};

// Обновление страниц пагинации
function updateItems(page) {
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  displayCards(data.slice(start, end));
}

function handlePopState() {
  applyFiltersFromURL();
}

// Применение фильтров
function applyFiltersFromURL() {
  const params = new URLSearchParams(window.location.search);
  document.getElementById("artist-input").value = params.get("artist") || "";
  const genreValue = params.get("genre");
  const countryValue = params.get("country");
  const decadeValue = params.get("decade");

  const page = parseInt(params.get("page"), 10) || 1;

  data = filters.byArtist(params.get("artist"), jsonData);
  data = filters.byGenre(genreValue || "All", data);
  data = filters.byCountry(countryValue || "All", data);
  data = filters.byDecade(decadeValue || "All", data);

  updatePaginationAndCards(page);
}

//Инициализация страницы
document.addEventListener("DOMContentLoaded", function () {
  // Обработчик события отправки формы фильтрации
  document
    .getElementById("filter-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const artist = document
        .getElementById("artist-input")
        .value.trim()
        .toLowerCase();
      const genre = document.getElementById("genre-select").value;
      const country = document.getElementById("country-select").value;
      const decade = document.getElementById("decade-select").value;

      const params = new URLSearchParams();
      if (artist) params.set("artist", artist);
      if (genre !== "Genre") params.set("genre", genre);
      if (country !== "Country") params.set("country", country);
      if (decade !== "Decade") params.set("decade", decade);
      params.set("page", 1);

      window.history.pushState({}, "", `${window.location.pathname}?${params}`);
      applyFiltersFromURL();
    });

  // Создание ивентов
  window.addEventListener("popstate", handlePopState);

  const backButton = document.querySelector(".btn--back");
  if (backButton) {
    backButton.addEventListener("click", function (e) {
      e.preventDefault();
      window.history.back();
    });
  }

  const favoritesButton = document.getElementById("favorites-button");
  if (favoritesButton) {
    favoritesButton.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "favorites.html";
    });
  }

  updatePaginationAndCards(getCurrentPage());
});
