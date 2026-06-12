import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

// Configurações personalizadas do Jest
const config: Config = {
  testEnvironment: 'jsdom', // Fundamental para simular o navegador no React
  clearMocks: true,
  restoreMocks: true, // restaura spyOn automaticamente após cada teste
};

// Exporta a configuração para o Jest usar o compilador do Next.js
export default createJestConfig(config);