# Agent Guidelines

Follow these steps for every code change in this repository:

1. Make the smallest safe change that solves the task.
2. Use Bun for package and script commands:
   - If Bun is missing, install it first.
   - Use `bun install` for dependencies.
3. Run formatting:
   - `bun run format`
4. Run lint and type checks:
   - `bun run lint`
5. Run a production build:
   - `bun run build`
6. Fix any failures before considering the task complete.
