import axios from "axios";
import type { Meal, MealSummary } from "../types/meal";

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

interface MealResponse {
  meals: Meal[] | null;
}

interface MealSummaryResponse {
  meals: MealSummary[] | null;
}

export async function searchMeals(query: string): Promise<Meal[]> {
  const response = await axios.get<MealResponse>(`${BASE_URL}/search.php`, {
    params: {
      s: query,
    },
  });

  return response.data.meals ?? [];
}

export async function getMealById(id: string): Promise<Meal | null> {
  const response = await axios.get<MealResponse>(`${BASE_URL}/lookup.php`, {
    params: {
      i: id,
    },
  });

  return response.data.meals?.[0] ?? null;
}

export async function getMealsByCategory(
  category: string,
): Promise<MealSummary[]> {
  const response = await axios.get<MealSummaryResponse>(
    `${BASE_URL}/filter.php`,
    {
      params: {
        c: category,
      },
    },
  );

  return response.data.meals ?? [];
}
