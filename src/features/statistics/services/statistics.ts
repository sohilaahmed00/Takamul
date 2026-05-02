import { httpClient } from "@/api/httpClient";

export interface TodaySalesResponse {
  date: string;
  totalSales: number;
}

export interface TodayPurchasesResponse {
  date: string;
  totalPurchases: number;
}

export interface TodayExpensesResponse {
  date: string;
  totalExpenses: number;
}

export interface TodayProfitResponse {
  date: string;
  netProfit: number;
}

export const getTodaySales = () => 
  httpClient<TodaySalesResponse>("/Statestic/today-sales");

export const getTodayPurchases = () => 
  httpClient<TodayPurchasesResponse>("/Statestic/today-purchases");

export const getTodayExpenses = () => 
  httpClient<TodayExpensesResponse>("/Statestic/today-expenses");

export const getTodayProfit = () => 
  httpClient<TodayProfitResponse>("/Statestic/today-profit");
