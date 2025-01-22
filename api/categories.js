const apiEndpoint =
  "https://portfolio-backend-h9yc.onrender.com/api/v1/design/categories";

async function fetchPortfolio() {
  try {
    const response = await fetch(apiEndpoint);
    const portfolioItems = await response.json();

    const portfolioContainer = document.getElementById("portfolio-container");

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
                <h3>${item?.name}</h3>
              </div>
            </div>
            <img
              src="${item?.img}"
              class="lazyload"
              alt="${item?.name}"
            />
          </a>
        </div>
      `;
      portfolioContainer.innerHTML += portfolioHtml;
    });
  } catch (error) {
    console.error("Error fetching portfolio data:", error);
  }
}

fetchPortfolio();
