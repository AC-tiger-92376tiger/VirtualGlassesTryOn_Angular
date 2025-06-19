// set-env.ts
import { writeFileSync } from 'fs';
import { config } from 'dotenv';
import * as path from 'path';

// Load variables from .env file
config();

const targetPath = path.resolve(__dirname, './src/environments/environment.ts');

const envConfigFile = `
export const environment = {
  production: false,
  apiUrl: "${process.env['BASE_URL']}"
};
`;

writeFileSync(targetPath, envConfigFile);

console.log(`✔️  Environment file generated at ${targetPath}`);
