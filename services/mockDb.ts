import { User, Meal, Order, DailyLog, Goal, ActivityLevel, Gender } from '../types';
import { SEED_MEALS } from '../constants';

const KEYS = {
  USERS: 'fitmeal_users',
  CURRENT_USER: 'fitmeal_current_user',
  MEALS: 'fitmeal_meals',
  ORDERS: 'fitmeal_orders',
  LOGS: 'fitmeal_logs'
};

// --- Helpers ---
const getStorage = <T>(key: string, defaultVal: T): T => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultVal;
};

const setStorage = (key: string, val: any) => {
  localStorage.setItem(key, JSON.stringify(val));
};

// --- Calc Logic ---
export const calculateTDEE = (
  weight: number,
  height: number,
  age: number,
  gender: Gender,
  activity: ActivityLevel,
  goal: Goal
): number => {
  // Mifflin-St Jeor Equation
  let bmr = 10 * weight + 6.25 * height - 5 * age;
  bmr += gender === Gender.MALE ? 5 : -161;

  let multiplier = 1.2;
  if (activity === ActivityLevel.MEDIUM) multiplier = 1.55;
  if (activity === ActivityLevel.HIGH) multiplier = 1.725;

  let tdee = Math.round(bmr * multiplier);

  if (goal === Goal.LOSE) return tdee - 500;
  if (goal === Goal.GAIN) return tdee + 500;
  return tdee;
};

// --- Seed Users Data ---
const SEED_USERS: User[] = [
  {
    id: 'user_demo',
    name: 'Demo User',
    email: 'user@fitmeal.com',
    password: 'password',
    age: 25,
    gender: Gender.MALE,
    height: 175,
    weight: 70,
    goal: Goal.MAINTAIN,
    activityLevel: ActivityLevel.MEDIUM,
    allergies: [],
    dislikedIngredients: [],
    tdee: 2200,
    isAdmin: false
  },
  {
    id: 'admin_demo',
    name: 'Admin User',
    email: 'admin@fitmeal.com',
    password: 'password',
    age: 30,
    gender: Gender.FEMALE,
    height: 165,
    weight: 60,
    goal: Goal.MAINTAIN,
    activityLevel: ActivityLevel.HIGH,
    allergies: [],
    dislikedIngredients: [],
    tdee: 2000,
    isAdmin: true
  }
];

// --- Auth Service ---
export const AuthService = {
  login: async (email: string): Promise<User> => {
    // Simulating delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let users = getStorage<User[]>(KEYS.USERS, []);
    
    // Auto-seed users if empty so demo credentials work immediately
    if (users.length === 0) {
        users = SEED_USERS;
        setStorage(KEYS.USERS, users);
    }

    const user = users.find(u => u.email === email);
    
    if (user) {
      setStorage(KEYS.CURRENT_USER, user.id);
      return user;
    }
    throw new Error('User not found');
  },

  register: async (userData: Omit<User, 'id' | 'tdee' | 'isAdmin'>): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = getStorage<User[]>(KEYS.USERS, []);
    if (users.find(u => u.email === userData.email)) {
      throw new Error('Email already exists');
    }

    const tdee = calculateTDEE(
      userData.weight,
      userData.height,
      userData.age,
      userData.gender,
      userData.activityLevel,
      userData.goal
    );

    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      tdee,
      isAdmin: userData.email.includes('admin'), // Simple admin hack for demo
    };

    users.push(newUser);
    setStorage(KEYS.USERS, users);
    setStorage(KEYS.CURRENT_USER, newUser.id);
    return newUser;
  },

  getCurrentUser: (): User | null => {
    const id = getStorage<string | null>(KEYS.CURRENT_USER, null);
    if (!id) return null;
    const users = getStorage<User[]>(KEYS.USERS, []);
    return users.find(u => u.id === id) || null;
  },

  logout: () => {
    localStorage.removeItem(KEYS.CURRENT_USER);
  },

  updateProfile: (updated: Partial<User>) => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) return;
    
    const users = getStorage<User[]>(KEYS.USERS, []);
    const index = users.findIndex(u => u.id === currentUser.id);
    if (index === -1) return;

    // Recalculate TDEE if physical stats change
    let tdee = currentUser.tdee;
    if (updated.weight || updated.height || updated.age || updated.activityLevel || updated.goal) {
       tdee = calculateTDEE(
         updated.weight || currentUser.weight,
         updated.height || currentUser.height,
         updated.age || currentUser.age,
         updated.gender || currentUser.gender,
         updated.activityLevel || currentUser.activityLevel,
         updated.goal || currentUser.goal
       );
    }

    const newUserData = { ...currentUser, ...updated, tdee };
    users[index] = newUserData;
    setStorage(KEYS.USERS, users);
    return newUserData;
  }
};

// --- Meal Service ---
export const MealService = {
  getAll: (): Meal[] => {
    const meals = getStorage<Meal[]>(KEYS.MEALS, []);
    if (meals.length === 0) {
      setStorage(KEYS.MEALS, SEED_MEALS);
      return SEED_MEALS;
    }
    return meals;
  },

  save: (meal: Meal) => {
    const meals = MealService.getAll();
    const index = meals.findIndex(m => m.id === meal.id);
    if (index >= 0) {
      meals[index] = meal;
    } else {
      meals.push(meal);
    }
    setStorage(KEYS.MEALS, meals);
  },
  
  toggleActive: (id: string) => {
    const meals = MealService.getAll();
    const meal = meals.find(m => m.id === id);
    if(meal) {
        meal.isActive = !meal.isActive;
        setStorage(KEYS.MEALS, meals);
    }
  }
};

// --- Order Service ---
export const OrderService = {
  create: (order: Order) => {
    const orders = getStorage<Order[]>(KEYS.ORDERS, []);
    orders.push(order);
    setStorage(KEYS.ORDERS, orders);

    // Auto-log calories for the duration (simple MVP logic: log average per day)
    // In a real app, users would check in meals. Here we pre-fill.
    const today = new Date();
    const totalCalories = order.items.reduce((acc, item) => {
        const meal = MealService.getAll().find(m => m.id === item.mealId);
        return acc + (meal ? meal.calories * item.quantity : 0);
    }, 0);
    
    // Distribute calories roughly over the days
    const dailyCal = Math.round(totalCalories / order.durationDays);
    
    for (let i = 0; i < order.durationDays; i++) {
        const dateDate = new Date(today);
        dateDate.setDate(today.getDate() + i);
        const dateStr = dateDate.toISOString().split('T')[0];
        TrackerService.logDaily(order.userId, dateStr, { consumedCalories: dailyCal });
    }
  },

  getUserOrders: (userId: string): Order[] => {
    const orders = getStorage<Order[]>(KEYS.ORDERS, []);
    return orders.filter(o => o.userId === userId).reverse();
  }
};

// --- Tracker Service ---
export const TrackerService = {
  getLog: (userId: string, date: string): DailyLog => {
    const logs = getStorage<DailyLog[]>(KEYS.LOGS, []);
    const log = logs.find(l => l.userId === userId && l.date === date);
    return log || { id: '', userId, date, consumedCalories: 0, extraFoodCalories: 0, workoutCalories: 0 };
  },

  logDaily: (userId: string, date: string, data: Partial<DailyLog>) => {
    const logs = getStorage<DailyLog[]>(KEYS.LOGS, []);
    const index = logs.findIndex(l => l.userId === userId && l.date === date);
    
    if (index >= 0) {
      logs[index] = { ...logs[index], ...data };
    } else {
      logs.push({
        id: Math.random().toString(36).substr(2, 9),
        userId,
        date,
        consumedCalories: 0,
        extraFoodCalories: 0,
        workoutCalories: 0,
        ...data
      });
    }
    setStorage(KEYS.LOGS, logs);
  },

  getWeeklyStats: (userId: string) => {
    const logs = getStorage<DailyLog[]>(KEYS.LOGS, []);
    const userLogs = logs.filter(l => l.userId === userId);
    // Sort logs by date
    userLogs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    // Get last 7 entries (or fewer)
    return userLogs.slice(-7);
  }
};