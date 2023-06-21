import { createProdMockServer } from "vite-plugin-mock/es/createProdMockServer";
import authMock from "@/mock/server/auth";

export const mockModules = [...authMock];

export function setupProdMockServer() {
  createProdMockServer(mockModules);
}