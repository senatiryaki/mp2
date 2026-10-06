export interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory: string | null;
  strArea: string | null;
  strInstructions: string | null;
  strMealThumb: string | null;

  [key: string]: string | null;
}

export interface MealSummary {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}
