/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',

  // Diz ao Jest que .ts é ESM
  extensionsToTreatAsEsm: ['.ts'],

  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: 'tsconfig.json'
      }
    ]
  },

  moduleNameMapper: {
    // remove .js dos imports ESM durante o teste
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },

  testMatch: ['**/*.spec.ts']
};
