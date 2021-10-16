const { join, resolve } = require('path');
const { existsSync, mkdirSync, readdirSync, writeFileSync, unlinkSync } = require('fs');


const pagesDirPath = resolve(__dirname, '../src/pages');
const clientComponentsDirPath = resolve(__dirname, '../src/generated-client-components');

const createClientComponentFileContents = (componentName) =>
  `import ${componentName} from '../pages/${componentName}.svelte';

export const ${componentName[0].toLowerCase() + componentName.slice(1)} = new ${componentName}({
    target: document.body,
    hydrate: true,
});
`;

const cleanClientComponentsDir = () => {
  readdirSync(clientComponentsDirPath).forEach((fileName) => {
    unlinkSync(join(clientComponentsDirPath, fileName));
    console.log('Deleted: ', fileName);
  })
}

const createClientComponentFiles = () => {
  const pagesComponentsFiles = readdirSync(pagesDirPath, 'utf-8');

  for (const filename of pagesComponentsFiles) {
    if (filename.includes('.svelte')) {
      const componentName = filename.replace('.svelte', '');
      const fileContents = createClientComponentFileContents(componentName);
      const scriptPath = join(clientComponentsDirPath, componentName + '.ts');
      writeFileSync(scriptPath, fileContents, 'utf-8');
      console.log('Created: ', scriptPath);
    }
  }
};

(function main() {
  if (!existsSync(clientComponentsDirPath)) {
    mkdirSync(clientComponentsDirPath);
  } else {
    cleanClientComponentsDir()
  }
  createClientComponentFiles();
})();