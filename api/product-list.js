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

async function renderProjectLists(namesArr) {
  const apiEndpoint = `https://portfolio-backend-h9yc.onrender.com/api/v1/design/${namesArr[0]}/${namesArr[1]}/items`;

  try {
    showLoader();
    const response = await fetch(apiEndpoint);
    const projects = await response.json();

    if (projects.length) {
      renderProductList(projects);
    }
  } catch (error) {
    console.error("Error fetching portfolio data:", error);
  }
}

async function fetchProjectList(grandParent, parent) {
  const apiEndpoint = `https://portfolio-backend-h9yc.onrender.com/api/v1/design/${grandParent}/items`;

  try {
    showLoader();
    const response = await fetch(apiEndpoint);
    const portfolioItems = await response.json();

    const categoryGetByName = portfolioItems?.filter(
      (item) => item?.category?.name === parent
    );

    if (categoryGetByName.length) {
      const filteredCateg = categoryGetByName[0];
      renderBanner(filteredCateg);
    }
  } catch (error) {
    console.error("Error fetching portfolio data:", error);
  }
}

function renderBanner(categoryGetById) {
  const categoriesInfo = document.querySelector(".category-details");
  const categoryTitle = document.getElementById("category-title");

  categoriesInfo.style.backgroundImage = `url(${categoryGetById?.img})`;
  categoryTitle.innerHTML = categoryGetById?.title;
}

function renderProductList(data, name) {
  const projectList = document.getElementById("products-list-wraper");
  data?.forEach((item, index) => {
    const portfolioHtml = `
            <div
                  class="col-sm-6 col-md-6 col-lg-6 blog-post-entry gsap-reveal-img"
                >
                  <a
                    href="product-details.html#portfolio/${item.id}"
                    class="grid-item blog-item w-100 h-100"
                  >
                    <!-- <div class="overlay">
                      <div
                        class="portfolio-item-content-inner"
                        style="bottom: 0"
                      >
                        <h3>${item?.title}</h3>
                      </div>
                    </div> -->
                    <img
                      src="${item?.img}"
                      class="lazyload"
                      alt="Image"
                      referrerpolicy="no-referrer"
                    />
                  </a>
                </div>
        `;
    projectList.innerHTML += portfolioHtml;
  });
}

// Router function to handle dynamic routes
function handleRouting() {
  const hash = window.location.hash;
  if (hash.startsWith("#portfolio/")) {
    const names = hash.split("/");
    fetchProjectList(names[1], names[2]);
    renderProjectLists([names[1], [names[2]]]);
  } else {
    // renderNotFound(); // Render "Not Found" page
  }
}

// Listen to hash changes and load the appropriate page
window.addEventListener("hashchange", handleRouting);

// Initial page load
document.addEventListener("DOMContentLoaded", handleRouting);
