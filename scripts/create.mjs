/**
 * Creates a new theme
 */
import { $, cd, minimist, path } from "zx";

export default async function create(...args) {
  const availableTemplates = ["astro", "enhance"];
  const parsedArgs = minimist(args, {
    string: ["t", "template"],
  });
  const theme = parsedArgs._[0];
  const template = parsedArgs.t || parsedArgs.template;

  if (!theme) {
    throw new Error("No theme specified");
  }
  if (!template) {
    throw new Error("No template specified");
  }
  if (!availableTemplates.includes(template)) {
    throw new Error(`Template ${template} not available`);
  }

  console.log(`Creating theme ${theme} with ${template} template...`);

  const themeDir = path.resolve(`./library/${theme}/${template}`);
  const stylesDir = path.resolve(`./packages/${theme}-styles`);

  /**
   * Create styles package
   */
  await Promise.all([
    await $`pnpm dlx giget@latest gh:nitish-rk/templates/styles-pkg packages/${theme}-styles`,
    cd(stylesDir),
    await $`pnpm pkg set name="${theme}-styles"`,
    await $`pnpm install`,
  ]);

  /**
   * Bootstrap the theme and add styles package as dependency
   */
  await Promise.all([
    await $`pnpm dlx giget@latest gh:nitish-rk/templates/${template} ${themeDir}`,
    cd(themeDir),
    await $`pnpm pkg set name="${theme}-${template}"`,
    await $`pnpm pkg set dependencies.styles="workspace:${theme}-styles@^"`,
    await $`pnpm install`,
  ]);
}
