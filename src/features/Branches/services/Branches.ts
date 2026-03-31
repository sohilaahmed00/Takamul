import { httpClient } from "@/api/httpClient";
import type { Branch, BranchListItem, CreateBranchPayload, UpdateBranchPayload } from "../types/Branches.types";

export const getAllBranches = () => httpClient<BranchListItem[]>("/Branch");
export const getBranchById = (id: number) => httpClient<Branch>(`/Branch/${id}`);
export const createBranch = (data: CreateBranchPayload) => httpClient<string>("/Branch", { method: "POST", data });
export const updateBranch = (id: number, data: UpdateBranchPayload) => httpClient<string>(`/Branch/${id}`, { method: "PUT", data });
export const toggleBranchStatus = (id: number) => httpClient<string>(`/Branch/toggle-status/${id}`, { method: "PATCH" });
export const deleteBranch = (id: number) => httpClient<string>(`/Branch/${id}`, { method: "DELETE" });