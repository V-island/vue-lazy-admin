import { createProdMockServer } from "vite-plugin-mock/es/createProdMockServer";
import authMock from "@/server/mock/auth";

export const mockModules = [...authMock];

export function setupProdMockServer() {
  createProdMockServer(mockModules);
}0