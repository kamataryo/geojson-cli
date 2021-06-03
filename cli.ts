#!/usr/bin/env node

import { isatty } from "tty"
import process from 'process'

process.stdin.resume();
process.stdin.setEncoding("utf8");

let data = "";

const onEnd = () => {
  const cli = meow(
    `
	Usage
	  $ stdin-server <input>

	Options
    --port, -p         port to be used
    --content-type, -c prefered MIME value for Content-Type response header
    --open, -o         open browser or not automatically

	Examples
    $ echo '<html>Hello!</html>' | stdin-server
    $ pbpaste | stdin-server # only with Mac
`,
    {
      flags: {
        port: {
          type: "number",
          alias: "p",
          default: 3000
        },
        "content-type": {
          type: "string",
          alias: "c",
          default: "text/html"
        },
        open: {
          type: "boolean",
          alias: "o",
          default: true
        }
      }
    }
  );

  try {
    server(data, cli.flags, message => process.stdout.write(message));
  } catch (e) {
    process.stdout.write(e.message);
    process.exit(1);
  }
};

if (isatty(0)) {
  onEnd();
} else {
  process.stdin.on("data", chunk => (data += chunk));
  process.stdin.on("end", onEnd);
}