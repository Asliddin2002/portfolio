const apiEndpoint =
  "https://portfolio-backend-h9yc.onrender.com/api/v1/design/categories";

async function fetchPortfolio() {
  try {
    const response = await fetch(apiEndpoint);
    const portfolioItems = await response.json();
    return portfolioItems;
  } catch (error) {
    console.error("Error fetching portfolio data:", error);
  }
}

async function buildPortolioUi() {
  const portfolioContainer = document.getElementById("portfolio-container");

  let portfolioItems = [];

  try {
    const data = await fetchPortfolio();
    portfolioItems = data;
  } catch (error) {}

  console.log("portfolioItems", portfolioItems);

  portfolioItems.forEach((item, index) => {
    const portfolioHtml = `
      <div
        class="col-sm-6 col-md-6 col-lg-12 blog-post-entry gsap-reveal-img"
        data-aos="fade-up"
        data-aos-delay="${index * 100}"
      >
        <a href="sub-categories.html#portfolio/${
          item?.name
        }" class="grid-item blog-item w-100 h-100">
          <div class="overlay">
            <div class="portfolio-item-content">
              <h3>${item?.name[0].toUpperCase() + item?.name.slice(1)}</h3>
            </div>
          </div>
          <img
            src="${item?.img}"
            class="lazyload"
            alt="${item?.name}"
            referrerpolicy="no-referrer"
          />
        </a>
      </div>
    `;
    portfolioContainer.innerHTML += portfolioHtml;
  });
}

buildPortolioUi();

async function famouseProject() {
  const url = "https://portfolio-backend-h9yc.onrender.com/api/v1/design/items";
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {}
}

async function transformData() {
  let categories = [];
  let projects = [];

  console.log("categories", categories);
  console.log("projects", projects);

  try {
    const data = await fetchPortfolio();
    categories = data;
  } catch (error) {
    console.error("Error fetching categories data:", error);
  }

  try {
    const data = await famouseProject();
    projects = data;
  } catch (error) {
    console.error("Error fetching projects data:", error);
  }

  const projectMap = projects.reduce((map, project) => {
    map[project.id] = {
      img: project.img,
      title: project.title,
      id: project.id,
      rating: project.rating,
    };
    return map;
  }, {});

  const transformedCategories = categories.map((category) => ({
    name: category.name,
    id: category.id,
    items: category.items.map((projectId) => projectMap[projectId]),
  }));

  console.log("transformedCategories", transformedCategories);

  return transformedCategories;
}

document.addEventListener("DOMContentLoaded", async function () {
  let categories = [];
  try {
    const data = await transformData();
    categories = data
      .flatMap((obj) => obj.items)
      .filter((item) => item.rating > 3)
      .slice(0, 5);
  } catch (error) {}

  console.log("categories", categories);

  const postsContainer = document.getElementById("posts");
  const filtersContainer = document.getElementById("filters");

  function createFilterLink(category) {
    const filterLink = document.createElement("a");
    filterLink.href = "#";
    filterLink.textContent = category.title;
    filterLink.setAttribute("data-filter", `.${category.name}`);
    return filterLink;
  }

  function createProjectElement(item, category) {
    const projectDiv = document.createElement("div");
    projectDiv.className = `item ${category} col-sm-6 col-md-6 col-lg-4 isotope-mb-2`;

    const projectLink = document.createElement("a");
    projectLink.href = "#";
    projectLink.className =
      "portfolio-item ajax-load-page isotope-item gsap-reveal-img";

    const overlayDiv = document.createElement("div");
    overlayDiv.className = "overlay";

    const iconSpan = document.createElement("span");
    iconSpan.className = "wrap-icon icon-link2";

    const contentDiv = document.createElement("div");
    contentDiv.className = "portfolio-item-content famouse-projects-title";

    const title = document.createElement("h3");
    title.textContent = item.title;

    contentDiv.appendChild(title);
    overlayDiv.appendChild(iconSpan);
    overlayDiv.appendChild(contentDiv);

    const img = document.createElement("img");
    img.src = item.img;
    img.alt = item.title;
    img.setAttribute("referrerpolicy", "no-referrer");
    img.className = "lazyload img-fluid";

    projectLink.appendChild(overlayDiv);
    projectLink.appendChild(img);
    projectDiv.appendChild(projectLink);

    return projectDiv;
  }

  function loadProjects(filter = "*") {
    postsContainer.innerHTML = "";

    categories.forEach((category) => {
      if (filter === "*" || filter === `.${category.name}`) {
        category.items.forEach((item) => {
          const projectElement = createProjectElement(item, category.name);
          postsContainer.appendChild(projectElement);
        });
      }
    });
  }

  categories.forEach((category) => {
    const filterLink = createFilterLink(category);
    filtersContainer.appendChild(filterLink);
  });

  const filterLinks = document.querySelectorAll("#filters a");
  filterLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const filter = this.getAttribute("data-filter");
      loadProjects(filter);
    });
  });

  loadProjects();
});
