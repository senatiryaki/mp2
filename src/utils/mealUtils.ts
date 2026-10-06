import type { Meal } from "../types/meal";

export interface Ingredient {
  name: string;
  measure: string;
}

export function getIngredients(meal: Meal): Ingredient[] {
  const ingredients: Ingredient[] = [];

  for (let i = 1; i <= 20; i++) {
    const name = meal[`strIngredient${i}`]?.trim();
    const measure = meal[`strMeasure${i}`]?.trim() ?? "";

    if (name) {
      ingredients.push({
        name,
        measure,
      });
    }
  }

  return ingredients;
}
