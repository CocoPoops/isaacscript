#!/bin/bash

set -euo pipefail # Exit on errors and undefined variables.

# Get the directory of this script:
# https://stackoverflow.com/questions/59895/getting-the-source-directory-of-a-bash-script-from-within
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# Get the name of the package:
# https://stackoverflow.com/questions/23162299/how-to-get-the-last-part-of-dirname-in-bash/23162553
PACKAGE_NAME="$(basename "$DIR")"

echo "Building: $PACKAGE_NAME"

SECONDS=0

cd "$DIR"

REPO_ROOT="$DIR/../.."
OUT_DIR="$REPO_ROOT/dist/packages/$PACKAGE_NAME"

rm -rf "$OUT_DIR"

# Convert the TypeScript to JavaScript. (We want to generate JavaScript files in addition to Lua
# files so that Jest tests can consume this library.)
npx tsc

# Convert the TypeScript to Lua. (We provide compiled enums in addition to ambient declarations.)
npx tstl

# The declaration maps will be bugged due to nx's consolidated "dist" directory, so we use a script
# to manually rewrite them.
npx tsx "$REPO_ROOT/scripts/rewriteSourceMapDeclarationMapPaths.ts" "isaac-typescript-definitions"

# Copy the rest of the files needed for npm.
cp "$DIR/LICENSE" "$OUT_DIR/"
cp "$DIR/package.json" "$OUT_DIR/"
cp "$DIR/README.md" "$OUT_DIR/"
cp "$DIR/src" "$OUT_DIR/" --recursive

# Copy the declarations into place. (The TypeScript compiler does not do this automatically for some
# reason, probably because of the triple slash directives.)
cp "$DIR/src/types" "$OUT_DIR/dist/src" --recursive

# TypeScript messes up the path inside of the triple slash directive, so we must manually repair it.
# e.g.
# /// <reference types="packages/isaac-typescript-definitions/src/types" />
# -->
# /// <reference path="types/index.d.ts" />
sed --in-place 's/types="packages\/isaac-typescript-definitions\/src\/types"/path="types\/index.d.ts"/' "$OUT_DIR/dist/src/index.d.ts"

echo "Successfully built $PACKAGE_NAME in $SECONDS seconds."
