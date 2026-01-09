export enum Goal {
  LOSE = 'Giảm Cân',
  MAINTAIN = 'Giữ Cân',
  GAIN = 'Tăng Cơ'
}

export enum ActivityLevel {
  LOW = 'Ít vận động',
  MEDIUM = 'Vừa phải',
  HIGH = 'Năng động'
}

export enum Gender {
  MALE = 'Nam',
  FEMALE = 'Nữ',
  OTHER = 'Khác'
}

export enum MealType {
  FIT_PLUS = 'Tăng Cơ (Fit+)',
  FIT_MINUS = 'Giảm Mỡ (Fit-)'
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // In real app, never store plain text
  age: number;
  gender: Gender;
  height: number; // cm
  weight: number; // kg
  goal: Goal;
  activityLevel: ActivityLevel;
  allergies: string[];
  dislikedIngredients: string[];
  tdee: number; // Total Daily Energy Expenditure
  isAdmin: boolean;
}

export interface Ingredient {
  name: string;
  removable: boolean;
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  type: MealType;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: Ingredient[];
  imageUrl: string;
  isActive: boolean;
}

export interface OrderItem {
  mealId: string;
  quantity: number;
  removedIngredients: string[];
}

export interface Order {
  id: string;
  userId: string;
  date: string;
  durationDays: 3 | 7 | 30;
  items: OrderItem[];
  totalPrice: number;
  status: 'pending' | 'delivered';
}

export interface DailyLog {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  consumedCalories: number; // From meals
  extraFoodCalories: number;
  workoutCalories: number;
}