# pug-simple

Recursively traverses a directory tree, renders all `.pug` files in it to HTML
and then writes them to the output directory with the same tree structure.

Given this:

    pug/
    ├── files/
    │   ├── index.pug
    │   └── nested/
    │       └── page.pug
    └── templates/
        └── master.pug

Running this:

    pugs pug/files/ site.com/

Outputs this:

    site.com/
    ├── index.html
    └── nested/
        └── page.html

## Installation

    npm install pug-simple

## Usage

    pugs pug/files/ site.com/

## License

GNU Affero General Public License, version 3.
