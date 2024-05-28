import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer'

import message from './message'


const mockModules = [...message]

export function setupProdMockServer() {
  createProdMockServer(mockModules)
}
