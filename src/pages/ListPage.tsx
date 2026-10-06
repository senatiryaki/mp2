import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { searchMeals } from "../api/mealDb";
import type { Meal } from "../types/meal";

function ListPage() {
  const [query, setQuery] = useState("");
  const [meals, setMeals] = useState<Meal[]>([]);
  const [sortBy, setSortBy] = useState<"name" | "area">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query.trim()) {
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const results = await searchMeals(query);
        setMeals(results);
      } catch {
        setError("We could not load recipes right now.");
        setMeals([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  function handleSearchChange(value: string) {
    setQuery(value);

    if (!value.trim()) {
      setMeals([]);
      setError("");
      setLoading(false);
    }
  }

  const sortedMeals = useMemo(() => {
    return [...meals].sort((a, b) => {
      const aValue = sortBy === "name" ? a.strMeal : (a.strArea ?? "");

      const bValue = sortBy === "name" ? b.strMeal : (b.strArea ?? "");

      const comparison = aValue.localeCompare(bValue);

      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [meals, sortBy, sortOrder]);

  const mealIds = sortedMeals.map((meal) => meal.idMeal);

  return (
    <section>
      <div className="page-heading">
        <p className="eyebrow">Recipe Index</p>
        <h2>Find your next favorite meal.</h2>
        <p>Search recipes and browse something delicious.</p>
      </div>

      <div className="list-controls">
        <input
          className="search-input"
          type="search"
          placeholder="Search recipes..."
          value={query}
          onChange={(event) => handleSearchChange(event.target.value)}
        />

        <div className="sort-controls">
          <select
            value={sortBy}
            onChange={(event) =>
              setSortBy(event.target.value as "name" | "area")
            }
          >
            <option value="name">Meal Name</option>
            <option value="area">Cuisine</option>
          </select>

          <select
            value={sortOrder}
            onChange={(event) =>
              setSortOrder(event.target.value as "asc" | "desc")
            }
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {!query && (
        <p className="status-message">Search for a meal to get started.</p>
      )}

      {loading && <p className="status-message">Finding recipes...</p>}

      {error && <p className="status-message">{error}</p>}

      {!loading && !error && query && sortedMeals.length === 0 && (
        <p className="status-message">No recipes found for "{query}".</p>
      )}

      <div className="meal-list">
        {sortedMeals.map((meal) => (
          <Link
            className="meal-row"
            key={meal.idMeal}
            to={`/meal/${meal.idMeal}`}
            state={{ ids: mealIds }}
          >
            <img src={meal.strMealThumb ?? ""} alt={meal.strMeal} />

            <div className="meal-row-info">
              <h3>{meal.strMeal}</h3>

              <div className="badges">
                {meal.strCategory && (
                  <span className="badge">{meal.strCategory}</span>
                )}

                {meal.strArea && <span className="badge">{meal.strArea}</span>}
              </div>
            </div>

            <span className="row-arrow">→</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default ListPage;
