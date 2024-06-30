document.addEventListener("DOMContentLoaded", async function () {
  const randomButton = document.getElementById("randomButton");
  const seafoodButton = document.getElementById("seafoodButton");
  const searchButton = document.getElementById("searchButton");
  const categoryDetails = document.getElementById("categoryDetails");

  async function fetchRandomRecipe() {
    const url = "https://www.themealdb.com/api/json/v1/1/random.php";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      const json = await response.json();
      const meal = json.meals[0];

      categoryDetails.innerHTML = "";

      displayMealDetails(meal);

      categoryDetails.classList.remove("hidden");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function fetchSeafoodRecipes() {
    const url = "https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      const json = await response.json();
      const mealIds = json.meals.map((meal) => meal.idMeal);

      const promises = mealIds.map(async (mealId) => {
        const mealDetailsResponse = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
        );
        if (!mealDetailsResponse.ok) {
          throw new Error(
            `Failed to fetch meal details: ${mealDetailsResponse.status}`
          );
        }
        return mealDetailsResponse.json();
      });

      const mealResponses = await Promise.all(promises);
      const meals = mealResponses.map((mealResponse) => mealResponse.meals[0]);

      categoryDetails.innerHTML = "";

      meals.forEach((meal) => {
        displayMealDetails(meal);
      });

      categoryDetails.classList.remove("hidden");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function searchRecipesByTerm() {
    const searchTerm = prompt("Enter a search term (e.g., chicken):");
    if (!searchTerm) return;

    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      const json = await response.json();
      const mealIds = json.meals.map((meal) => meal.idMeal);

      const promises = mealIds.map(async (mealId) => {
        const mealDetailsResponse = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
        );
        if (!mealDetailsResponse.ok) {
          throw new Error(
            `Failed to fetch meal details: ${mealDetailsResponse.status}`
          );
        }
        return mealDetailsResponse.json();
      });

      const mealResponses = await Promise.all(promises);
      const meals = mealResponses.map((mealResponse) => mealResponse.meals[0]);

      categoryDetails.innerHTML = "";

      meals.forEach((meal) => {
        displayMealDetails(meal);
      });

      categoryDetails.classList.remove("hidden");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  function displayMealDetails(meal) {
    const mealName = meal.strMeal || "Meal Name Unavailable";
    const mealCategory = meal.strCategory || "Category Unavailable";
    const mealThumbnail = meal.strMealThumb || "";

    const mealItem = document.createElement("div");
    mealItem.classList.add("mb-4");

    const mealTitle = document.createElement("h2");
    mealTitle.textContent = mealName;
    mealTitle.classList.add("text-xl", "font-semibold", "mb-2");
    mealItem.appendChild(mealTitle);

    const mealCategoryElement = document.createElement("p");
    mealCategoryElement.textContent = `Category: ${mealCategory}`;
    mealCategoryElement.classList.add("text-gray-700", "mb-2");
    mealItem.appendChild(mealCategoryElement);

    const mealImage = document.createElement("img");
    mealImage.src = mealThumbnail;
    mealImage.alt = mealName;
    mealImage.classList.add("rounded-lg", "shadow-md", "mb-2");
    mealItem.appendChild(mealImage);

    if (meal.strYoutube) {
      const youtubeLink = document.createElement("a");
      youtubeLink.href = meal.strYoutube;
      youtubeLink.textContent = "Watch on YouTube";
      youtubeLink.classList.add("block", "text-blue-500", "hover:underline");
      youtubeLink.target = "_blank";
      mealItem.appendChild(youtubeLink);
    } else {
      const noYoutubeLink = document.createElement("p");
      noYoutubeLink.textContent = "No YouTube link available";
      noYoutubeLink.classList.add("text-gray-700");
      mealItem.appendChild(noYoutubeLink);
    }

    categoryDetails.appendChild(mealItem);
  }

  randomButton.addEventListener("click", fetchRandomRecipe);
  seafoodButton.addEventListener("click", fetchSeafoodRecipes);
  searchButton.addEventListener("click", searchRecipesByTerm);
});
