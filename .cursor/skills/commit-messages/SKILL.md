---
name: commit-messages
description: Generate commit messages following the project's conventional commit format (type(scope?): subject). Use when the user asks for help writing commit messages, reviewing staged changes, or generating commit messages from git diffs.
---

# Commit Messages

## Instructions

When assisting with commits in this project:

1. Analyze the git diff or staged changes to understand what was modified.
2. Determine the appropriate `type` based on the purpose of the changes.
3. Identify a `scope` when the changes are focused on a specific module, feature, or area (e.g., `button`, `auth`, `api`).
4. Write a concise `subject` that clearly summarizes the change.
5. Keep the subject line under 72 characters when possible.
6. Never add `--trailer "Co-authored-by: Cursor"` or similar co-author trailers automatically to any commit command or message.

## Format

The commit message follows the pattern: `type(scope?): subject`

- **`type`**: Describes the purpose or category of the commit.
- **`scope`**: (Optional) Specifies the module, feature, or area of the project associated with the commit.
- **`subject`**: Briefly summarizes the changes made in the commit.

## Common Commit Types

- **`build`**: Changes related to the build system or external dependencies.
- **`ci`**: Updates to the continuous integration configuration or scripts.
- **`chore`**: Routine tasks, maintenance, or general updates.
- **`docs`**: Changes to documentation.
- **`feat`**: Introduces a new feature for the user or customer.
- **`fix`**: Resolves a bug or fixes an issue.
- **`perf`**: Improvements related to performance.
- **`refactor`**: Code restructuring that does not change its external behavior.
- **`revert`**: Reverts a previous commit.
- **`style`**: Changes that do not affect the code's logic (e.g., formatting).
- **`test`**: Adds or modifies tests.

## Examples

Some example commit messages that follow this convention:

- `chore: run tests on travis ci`
- `fix(stepper): update button actions`
- `feat(passenger): add comment section`
- `refactor(api): optimize database queries`
- `test(unit): add validation tests for user input`

