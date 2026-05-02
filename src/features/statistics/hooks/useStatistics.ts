import { useQuery } from "@tanstack/react-query";
import { getTodaySales, getTodayPurchases, getTodayExpenses, getTodayProfit } from "../services/statistics";

export const useTodaySales = () => 
  useQuery({
    queryKey: ["statistics", "today-sales"],
    queryFn: getTodaySales,
  });

export const useTodayPurchases = () => 
  useQuery({
    queryKey: ["statistics", "today-purchases"],
    queryFn: getTodayPurchases,
  });

export const useTodayExpenses = () => 
  useQuery({
    queryKey: ["statistics", "today-expenses"],
    queryFn: getTodayExpenses,
  });

export const useTodayProfit = () => 
  useQuery({
    queryKey: ["statistics", "today-profit"],
    queryFn: getTodayProfit,
  });
