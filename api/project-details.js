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

async function fetchProjectDetails(id) {
  const apiEndpoint = `https://portfolio-backend-h9yc.onrender.com/api/v1/design/items/${id}`;

  try {
    showLoader();
    const response = await fetch(apiEndpoint);
    const projects = await response.json();

    if (projects) {
      renderBannerPojectDetails(projects);
      renderProduct(projects);
    }
  } catch (error) {
    console.error("Error fetching portfolio data:", error);
  }
}

function renderBannerPojectDetails(categoryGetById) {
  const categoriesInfo = document.querySelector(".project-details");
  const categoryTitle = document.getElementById("project-title");

  categoriesInfo.style.backgroundImage = `url(${categoryGetById?.img})`;
  categoryTitle.innerHTML = categoryGetById?.title;
}

function renderProduct(data) {
  const projectList = document.getElementById("product-wraper");
  projectList.innerHTML = "";
  data?.info.forEach((item, index) => {
    const isImageFirst = index % 2 === 0;
    const portfolioHtml = isImageFirst
      ? `
               <div
                    class="col-sm-6 col-md-6 col-lg-6 blog-post-entry gsap-reveal-img isotope-mb-2"
                  >
                    <div
                      class="grid-item blog-item w-100 h-100 isotope-item"
                    >
                        <a
                        href="${item?.img}"
                        class="isotope-item gsap-reveal-img"
                        data-fancybox="gallery"
                        data-caption="${data?.title}"
                      >
                        <div class="overlay">
                          <span class="wrap-icon icon-photo2"></span>
                          <div class="portfolio-item-content famouse-projects-title">
                           <h3>${data?.title}</h3>
                            <!-- <p>web, packaging</p> -->
                          </div>
                        </div>
                        <img
                          src="${item?.img}"
                          class="lazyload img-fluid"
                          alt="Images"
                          referrerpolicy="no-referrer"
                        />
                      </a>
                    </div>
                </div>
                <div
                    class="col-sm-6 col-md-6 col-lg-6 blog-post-entry"
                    style="margin: auto;"
                  >
                        ${item?.description}
                    </a>
                </div>
          `
      : `
              <div
                    class="col-sm-6 col-md-6 col-lg-6 blog-post-entry"
                    style="margin: auto;"
                  >
                        ${item?.description}
                    </a>
                </div>
               <div
                    class="col-sm-6 col-md-6 col-lg-6 blog-post-entry gsap-reveal-img isotope-mb-2"
                  >
                    <div
                      class="grid-item blog-item w-100 h-100 isotope-item"
                    >
                        <a
                        href="${item?.img}"
                        class="isotope-item gsap-reveal-img"
                        data-fancybox="gallery"
                        data-caption="${data?.title}"
                      >
                        <div class="overlay">
                          <span class="wrap-icon icon-photo2"></span>
                          <div class="portfolio-item-content famouse-projects-title">
                           <h3>${data?.title}</h3>
                            <!-- <p>web, packaging</p> -->
                          </div>
                        </div>
                        <img
                          src="${item?.img}"
                          class="lazyload img-fluid"
                          alt="Images"
                        />
                      </a>
                    </div>
                </div>
                
          `;
    projectList.innerHTML += portfolioHtml;
  });
}

// Router function to handle dynamic routes
function handleRouting() {
  const hash = window.location.hash;
  if (hash.startsWith("#portfolio/")) {
    const id = hash.split("/")[1];
    fetchProjectDetails(id);
  } else {
    const projectList = document.getElementById("product-wraper");
    projectList.innerHTML = ""; // Clear content for unrecognized routes
    // renderNotFound(); // Optionally render a "Not Found" message
  }
}

// Listen to hash changes and load the appropriate page
window.addEventListener("hashchange", handleRouting);

// Initial page load
document.addEventListener("DOMContentLoaded", handleRouting);
