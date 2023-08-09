#!/usr/bin/env node

/* pug-simple, pugs - simple whole directory pug template renderer
 * Copyright © 2023 Matheus Afonso Martins Moreira
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

const path = require('path');
const fs = require('fs');

function check(argv) {
    const program = path.basename(argv[1]);
    const arguments = argv.slice(2);

    if (arguments.length !== 2) {
        console.log(`${program} <input directory> <output directory>`);
        process.exit(1);
    }

    const inputDirectory = arguments[0], outputDirectory = arguments[1];

    if (!fs.statSync(inputDirectory).isDirectory()) {
        console.log(`'${inputDirectory}' is not a directory`);
        process.exit(2);
    }

    if (fs.existsSync(outputDirectory) && !fs.statSync(outputDirectory).isDirectory()) {
        console.log(`'${outputDirectory}' exists and is not a directory`);
        process.exit(3);
    }

    return [inputDirectory, outputDirectory]
}

const [inputDirectory, outputDirectory] = check(process.argv);

const pug = require('pug');
const pugExtension = /\.pug$/;

function isPug(file) {
    return pugExtension.test(file);
}

function walk(directory, f) {
    const entries = fs.readdirSync(directory);

    for (var i = 0; i < entries.length; ++i) {
        const entry = path.join(directory, entries[i]);

        if (fs.statSync(entry).isDirectory()) {
            walk(entry, f);
        } else {
            if (isPug(entry)) {
                f(entry);
            }
        }
    }
}

function renderPug(input) {
    const relative = path.relative(inputDirectory, input);
    const outputPath = path.join(outputDirectory, relative).replace(pugExtension, '.html');
    const directory = path.dirname(outputPath);
    const output = pug.renderFile(input);
    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(outputPath, output, { encoding: 'utf8' });
}

walk(inputDirectory, renderPug);
