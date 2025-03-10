// Show the loader
function showLoader() {
  setTimeout(function () {
    TweenMax.to(".site-loader-wrap", 1, {
      marginTop: 50,
      autoAlpha: 0,
      ease: Power4.easeInOut,
    });
  }, 3000);
  $(".site-loader-wrap").delay(1000).fadeOut("slow");
  $("#unslate_co--overlayer").delay(1000).fadeOut("slow");
}

// Hide the loader with animation
function hideLoader() {}

// Render project details
async function renderProjectDetails(name) {
  const apiEndpoint = `https://portfolio-backend-h9yc.onrender.com/api/v1/design/${name}/categories`;

  try {
    showLoader(); // Show loader before fetching data
    const response = await fetch(apiEndpoint);
    const portfolioItems = await response.json();

    if (portfolioItems.length) {
      renderSubCategoryList(portfolioItems, name);
    }
  } catch (error) {
    console.error("Error fetching portfolio data:", error);
  } finally {
    hideLoader(); // Hide loader after data is fetched
  }
}

// Fetch parent category
async function fetchParentCategory(name) {
  const apiEndpoint = `https://portfolio-backend-h9yc.onrender.com/api/v1/design/categories`;

  try {
    showLoader(); // Show loader before fetching data
    const response = await fetch(apiEndpoint);
    const portfolioItems = await response.json();

    const decodedParam = decodeURIComponent(name);

    const categoryGetByName = portfolioItems?.filter(
      (item) => item?.name === decodedParam
    );

    if (categoryGetByName.length) {
      const filteredCateg = categoryGetByName[0];
      renderBanner(filteredCateg);
    }
  } catch (error) {
    console.error("Error fetching portfolio data:", error);
  } finally {
    hideLoader(); // Hide loader after data is fetched
  }
}

// Render banner
function renderBanner(categoryGetByName) {
  const categoriesInfo = document.querySelector(".category-details");
  const categoryTitle = document.getElementById("category-title");
  categoriesInfo.style.backgroundImage = `url(${categoryGetByName?.img})`;
  categoryTitle.innerHTML =
    categoryGetByName?.name[0].toUpperCase() + categoryGetByName?.name.slice(1);
}

// Render sub-category list
function renderSubCategoryList(subCategories, name) {
  const subCategWraper = document.getElementById("sub-categories-list-wraper");
  subCategWraper.innerHTML = ""; // Clear previous content

  subCategories?.forEach((item, index) => {
    const portfolioHtml = `
           <div
                  class="col-sm-6 col-md-6  ${
                    index === 0 ? "col-lg-8" : "col-lg-4"
                  } blog-post-entry gsap-reveal-img"
                >
                  <a
                    href="product-page-list.html#portfolio/${name}/${
      item?.name
    }"
                    class="grid-item blog-item w-100 h-100"
                  >
                    <div class="overlay">
                      <div class="portfolio-item-content-inner">
                        <h3>${
                          item?.name[0].toUpperCase() + item?.name.slice(1)
                        }</h3>
                      </div>
                    </div>
                    <img
                      src=${item?.img}
                      class="lazyload"
                      alt="Image"
                      referrerpolicy="no-referrer"
                    />
                  </a>
            </div>
        `;
    subCategWraper.innerHTML += portfolioHtml;
  });
}

// Router function to handle dynamic routes
function handleRouting() {
  const hash = window.location.hash;
  if (hash.startsWith("#portfolio/")) {
    const name = hash.split("/")[1];
    fetchParentCategory(name);
    renderProjectDetails(name);
  } else {
    // renderNotFound(); // Render "Not Found" page
  }
}

// Listen to hash changes and load the appropriate page
window.addEventListener("hashchange", handleRouting);

// Initial page load
document.addEventListener("DOMContentLoaded", handleRouting);
