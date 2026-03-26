import type { Config } from 'jest';
import nextJest from 'next/jest.js';

// Diz ao Jest onde está o projeto Next.js para ele carregar as configurações
const createJestConfig = nextJest({
  dir: './',
});

// Configurações personalizadas do Jest
const config: Config = {
  testEnvironment: 'jsdom', // Fundamental para simular o navegador no React
  clearMocks: true,
};

// Exporta a configuração para o Jest usar o compilador do Next.js
export default createJestConfig(config);