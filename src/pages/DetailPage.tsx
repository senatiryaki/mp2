import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getMealById } from "../api/mealDb";
import type { Meal } from "../types/meal";
import { getIngredients } from "../utils/mealUtils";

interface NavigationState {
  ids?: string[];
}

function DetailPage() {
  const { id } = useParams();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const navigationState = location.state as NavigationState | null;

  const ids = navigationState?.ids ?? [];
  const currentIndex = id ? ids.indexOf(id) : -1;

  useEffect(() => {
    async function loadMeal() {
      if (!id) {
        return;
      }

      try {
        setLoading(true);
        setError("");

        const result = await getMealById(id);

        if (!result) {
          setError("Recipe not found.");
          return;
        }

        setMeal(result);
      } catch {
        setError("We could not load this recipe right now.");
      } finally {
        setLoading(false);
      }
    }

    loadMeal();
  }, [id]);

  function goPrevious() {
    if (currentIndex === -1 || ids.length === 0) {
      return;
    }

    const previousIndex = (currentIndex - 1 + ids.length) % ids.length;

    navigate(`/meal/${ids[previousIndex]}`, {
      state: navigationState,
    });
  }

  function goNext() {
    if (currentIndex === -1 || ids.length === 0) {
      return;
    }

    const nextIndex = (currentIndex + 1) % ids.length;

    navigate(`/meal/${ids[nextIndex]}`, {
      state: navigationState,
    });
  }

  if (loading) {
    return <p className="status-message">Loading recipe...</p>;
  }

  if (error) {
    return <p className="status-message">{error}</p>;
  }

  if (!meal) {
    return null;
  }

  const ingredients = getIngredients(meal);

  return (
    <article>
      <div className="detail-grid">
        <img
          className="detail-image"
          src={meal.strMealThumb ?? ""}
          alt={meal.strMeal}
        />

        <div className="detail-info">
          <p className="eyebrow">Recipe Details</p>

          <h2>{meal.strMeal}</h2>

          <div className="badges">
            {meal.strCategory && (
              <span className="badge">{meal.strCategory}</span>
            )}

            {meal.strArea && <span className="badge">{meal.strArea}</span>}
          </div>

          <h3>Ingredients</h3>

          <ul className="ingredient-list">
            {ingredients.map((ingredient, index) => (
              <li key={index}>
                <strong>{ingredient.measure}</strong> {ingredient.name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <section className="instructions">
        <h3>Instructions</h3>
        <p>{meal.strInstructions}</p>
      </section>

      <div className="detail-navigation">
        <button onClick={goPrevious} disabled={ids.length === 0}>
          ← Previous
        </button>

        <button onClick={goNext} disabled={ids.length === 0}>
          Next →
        </button>
      </div>
    </article>
  );
}

export default DetailPage;
