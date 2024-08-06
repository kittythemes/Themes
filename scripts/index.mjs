#!/usr/bin/env node
export default async function exec() {
  const [cmd, ...args] = process.argv.slice(2);

  switch (cmd) {
    case "create": {
      const { default: create } = await import("./create.mjs");
      await create(...args);
      break;
    }
  }
}

exec();
