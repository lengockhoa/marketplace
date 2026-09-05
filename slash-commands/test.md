---
description: Generate tests for the current code or specific functions.
argument-hint: <target-file-or-symbol>
allowed-tools: Read, Grep, Glob, Write, Bash
---

# /test

Generate tests for the current code or specific functions.

## Usage
- `/test <file>`: Create a test file for the target.
- `/test <function>`: Add a test case for a function.

## Instructions
- Use the project's existing testing framework (Jest, Vitest, etc.).
- Include edge cases and error handling.
- Follow the Arrange-Act-Assert pattern.
