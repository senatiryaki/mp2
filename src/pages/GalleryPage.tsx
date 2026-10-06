import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMealsByCategory } from "../api/mealDb";
import type { MealSummary } from "../types/meal";

const categories = ["Beef", "Chicken", "Dessert", "Seafood", "Vegetarian"];

function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("Chicken");

  const [meals, setMeals] = useState<MealSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMeals() {
      try {
        setLoading(true);
        setError("");

        const results = await getMealsByCategory(selectedCategory);

        setMeals(results);
      } catch {
        setError("We could not load the gallery right now.");
        setMeals([]);
      } finally {
        setLoading(false);
      }
    }

    loadMeals();
  }, [selectedCategory]);

  const mealIds = meals.map((meal) => meal.idMeal);

  return (
    <section>
      <div className="page-heading">
        <p className="eyebrow">Recipe Gallery</p>
        <h2>Browse something delicious.</h2>
        <p>Pick a category and discover your next recipe.</p>
      </div>

      <div className="category-filters">
        {categories.map((category) => (
          <button
            className={
              selectedCategory === category
                ? "category-chip active-chip"
                : "category-chip"
            }
            key={category}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {loading && <p className="status-message">Loading recipes...</p>}

      {error && <p className="status-message">{error}</p>}

      <div className="gallery-grid">
        {meals.map((meal) => (
          <Link
            className="gallery-card"
            key={meal.idMeal}
            to={`/meal/${meal.idMeal}`}
            state={{ ids: mealIds }}
          >
            <img src={meal.strMealThumb} alt={meal.strMeal} />

            <div className="gallery-card-info">
              <h3>{meal.strMeal}</h3>
              <span>{selectedCategory}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default GalleryPage;
