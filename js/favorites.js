// Функция создания объекта данных карточки
function createCardData(title, author, year, style, country, image) {
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
}

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

// Помощник для загрузки данных об избранных карточках
const loadFavoritesData = () => {
  const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
  return jsonData.filter((item) =>
    storedFavorites.some(
      (fav) => fav.title === item.title && fav.author === item.author
    )
  );
};

// DOM элементы
const container = document.getElementById("card-gallery");
const pagination = document.getElementById("pagination");

let favoritesData = loadFavoritesData();
const itemsPerPage = 6;

// Получить текущую страницу
const getCurrentPage = () =>
  new URLSearchParams(window.location.search).get("page") || 1;

// Функция для переключения элемента в/из избранного
const toggleFavorite = (title, author) => {
  const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const updatedFavorites = storedFavorites.filter(
    (fav) => !(fav.title === title && fav.author === author)
  );
  localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  const currentPage = getCurrentPage();
  const pageCount = Math.ceil(updatedFavorites.length / itemsPerPage);
  if (currentPage > pageCount) {
    const params = new URLSearchParams(window.location.search);
    params.set("page", pageCount);
    window.history.pushState({}, "", `${window.location.pathname}?${params}`);
  }
  applyFiltersFromURL();
};

// Отображение карточек на странице
const displayCards = (items) => {
  container.innerHTML = items
    .map(
      (card) => `
      <div class="col-6 col-md-4 col-lg-3 card-container">
        <div class="card">
          <img src="./media/${card.image}" srcset="./media/${card.image} 1x, ./media/${card.imageRetina} 2x" alt="${card.title}" class="card-img-top" />
          <div class="card-body">
            <h5 class="card-title">${card.title}</h5>
            <p class="card-text author">${card.author}</p>
            <p class="card-text year"><span>Year:</span> ${card.year}</p>
            <p class="card-text style"><span>Style:</span> ${card.style}</p>
            <p class="card-text country"><span>Country:</span> ${card.country}</p>
            <button class="btn card-btn mt-2" onclick="toggleFavorite('${card.title}', '${card.author}')">Remove</button>
          </div>
        </div>
      </div>
    `
    )
    .join("");

  const noFavoritesText = document.getElementById("no-favorites-text");
  if (items.length === 0) {
    noFavoritesText.style.display = "block"; // Показываем текст
  } else {
    noFavoritesText.style.display = "none"; // Скрываем текст
  }
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
    genre === "All"
      ? items
      : items.filter((item) =>
          item.style.toLowerCase().includes(genre.toLowerCase())
        ),
  byCountry: (country, items) =>
    country === "All"
      ? items
      : items.filter((item) => item.country === country),
  byDecade: (decade, items) => {
    if (decade === "All") return items;
    const [startYear, endYear] = decade.split("-").map(Number);
    return items.filter(
      (item) => item.year >= startYear && item.year < endYear
    );
  },
};

// Применение фильтров
const applyFiltersFromURL = () => {
  favoritesData = loadFavoritesData();
  const params = new URLSearchParams(window.location.search);
  const artist = params.get("artist") || "";
  const genre = params.get("genre") || "All";
  const country = params.get("country") || "All";
  const decade = params.get("decade") || "All";

  let filteredFavorites = filters.byArtist(artist, favoritesData);
  filteredFavorites = filters.byGenre(genre, filteredFavorites);
  filteredFavorites = filters.byCountry(country, filteredFavorites);
  filteredFavorites = filters.byDecade(decade, filteredFavorites);

  updatePaginationAndCards(getCurrentPage(), filteredFavorites);

  const noFavoritesText = document.getElementById("no-favorites-text");
  if (filteredFavorites.length === 0) {
    noFavoritesText.style.display = "block";
  } else {
    noFavoritesText.style.display = "none";
  }
};

// Создание элементов пагинации
const createPagination = (pageCount, currentPage) => {
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
};

// Обновление пагинации и карточек
const updatePaginationAndCards = (currentPage, items) => {
  const pageCount = Math.ceil(items.length / itemsPerPage);
  createPagination(pageCount, currentPage);
  updateItems(currentPage, items);
};

// Обновление страниц пагинации
function updateItems(page, items) {
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  displayCards(items.slice(start, end));
}

function handlePopState() {
  applyFiltersFromURL();
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
      window.location.href = "index.html";
    });
  }

  applyFiltersFromURL();
});
