#!/bin/bash

npm i --prefix backend
npm i --prefix frontend

# copy git pre-commit hook for checking linters
cp .git/hooks/pre-commit.sample .git/hooks/pre-commit
cat scripts/hooks/pre-commit > .git/hooks/pre-commit