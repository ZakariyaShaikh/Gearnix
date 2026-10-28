# Gearnix Build Report

## How to use this file
- This is the single shared log between you (Copilot) and Claude.
- Append new entries at the bottom of "Log". Never delete an entry. To change one, add a new entry that refers to the old ID.
- Update your own entries' Status when it changes.
- At the end of every task, add entries for everything you created, changed, installed, or decided.

## Log

### R-001 · Task 1 · COMMAND
- Path: `frontend/`
- Purpose: Attempted the requested latest Vite scaffolder command.
- Depends on: npm and network access.
- Used by: Vite project setup.
- Status: blocked
- Notes for Claude: `npm create vite@latest . -- --template react` failed because the published create-vite@9.3.2 package lacked its `template-react` directory. The latest TypeScript template attempt failed for the same reason.

### R-002 · Task 1 · COMMAND
- Path: `frontend/`
- Purpose: Scaffolded the JavaScript React Vite project after the latest scaffolder failure.
- Depends on: create-vite@8.3.0.
- Used by: Frontend application.
- Status: done
- Notes for Claude: Ran `npm create vite@8.3.0 . -- --template react --overwrite`.

### R-003 · Task 1 · DECISION
- Path: `frontend/`
- Purpose: Use JavaScript with React, not TypeScript.
- Depends on: User requirement.
- Used by: All frontend source and Tailwind content scanning.
- Status: done
- Notes for Claude: The scaffold uses `.jsx` files. The `@types/react` and `@types/react-dom` packages remain from the earlier TypeScript scaffold and are not needed by the JavaScript app.

### R-004 · Task 1 · FILE_CREATED
- Path: `frontend/.gitignore`
- Purpose: Ignore dependencies, build output, and local files.
- Depends on: Vite React scaffold.
- Used by: Git.
- Status: done
- Notes for Claude: Created by the Vite scaffold.

### R-005 · Task 1 · FILE_CREATED
- Path: `frontend/eslint.config.js`
- Purpose: Configure ESLint for the JavaScript React app.
- Depends on: Vite React scaffold and ESLint packages.
- Used by: `npm run lint`.
- Status: done
- Notes for Claude: Created by the Vite JavaScript template.

### R-006 · Task 1 · FILE_CREATED
- Path: `frontend/index.html`
- Purpose: Provide the Vite HTML entry document.
- Depends on: Vite React scaffold.
- Used by: Vite.
- Status: done
- Notes for Claude: Created by the Vite scaffold.

### R-007 · Task 1 · FILE_CREATED
- Path: `frontend/README.md`
- Purpose: Document the generated Vite React starter.
- Depends on: Vite React scaffold.
- Used by: Frontend developers.
- Status: done
- Notes for Claude: Starter documentation; not yet customized for Gearnix.

### R-008 · Task 1 · FILE_CREATED
- Path: `frontend/vite.config.js`
- Purpose: Configure Vite with the React plugin.
- Depends on: Vite and `@vitejs/plugin-react`.
- Used by: Vite development and production builds.
- Status: done
- Notes for Claude: Created by the Vite JavaScript template.

### R-009 · Task 1 · FILE_CREATED
- Path: `frontend/public/vite.svg`
- Purpose: Include the default Vite starter asset.
- Depends on: Vite React scaffold.
- Used by: Default starter screen.
- Status: done
- Notes for Claude: Starter asset; replace or remove when building the Gearnix UI.

### R-010 · Task 1 · FILE_CREATED
- Path: `frontend/src/App.css`
- Purpose: Style the generated starter screen.
- Depends on: Vite React scaffold.
- Used by: `frontend/src/App.jsx`.
- Status: done
- Notes for Claude: Starter CSS; not yet adapted to Gearnix.

### R-011 · Task 1 · FILE_CREATED
- Path: `frontend/src/App.jsx`
- Purpose: Render the generated starter screen.
- Depends on: React.
- Used by: `frontend/src/main.jsx`.
- Status: done
- Notes for Claude: This remains the default Vite demo, not a Gearnix page.

### R-012 · Task 1 · FILE_CREATED
- Path: `frontend/src/index.css`
- Purpose: Provide global styles and Tailwind directives.
- Depends on: Tailwind CSS.
- Used by: `frontend/src/main.jsx`.
- Status: done
- Notes for Claude: Initially created by the Vite scaffold; Tailwind directives and basic global styles were added for Task 1.

### R-013 · Task 1 · FILE_CREATED
- Path: `frontend/src/main.jsx`
- Purpose: Mount the React app.
- Depends on: React and React DOM.
- Used by: `frontend/index.html`.
- Status: done
- Notes for Claude: Created by the Vite JavaScript template.

### R-014 · Task 1 · FILE_CREATED
- Path: `frontend/src/assets/react.svg`
- Purpose: Include the default React starter asset.
- Depends on: Vite React scaffold.
- Used by: Default starter screen.
- Status: done
- Notes for Claude: Starter asset; replace or remove when building the Gearnix UI.

### R-015 · Task 1 · DEPENDENCY
- Path: `frontend/package.json`
- Purpose: Provide the React component library.
- Depends on: npm.
- Used by: Frontend app.
- Status: done
- Notes for Claude: `react`, manifest range `^19.2.0`; installed version `19.3.1`.

### R-016 · Task 1 · DEPENDENCY
- Path: `frontend/package.json`
- Purpose: Mount React in the browser.
- Depends on: npm.
- Used by: `frontend/src/main.jsx`.
- Status: done
- Notes for Claude: `react-dom`, manifest range `^19.2.0`; installed version `19.3.1`.

### R-017 · Task 1 · DEPENDENCY
- Path: `frontend/package.json`
- Purpose: Run the development server and production bundler.
- Depends on: npm.
- Used by: Frontend development and build.
- Status: done
- Notes for Claude: `vite`, manifest range `^7.3.1`; installed version `7.3.7`.

### R-018 · Task 1 · DEPENDENCY
- Path: `frontend/package.json`
- Purpose: Enable React support and fast refresh in Vite.
- Depends on: npm.
- Used by: `frontend/vite.config.js`.
- Status: done
- Notes for Claude: `@vitejs/plugin-react`, manifest range `^5.1.1`; installed version `5.2.0`.

### R-019 · Task 1 · DEPENDENCY
- Path: `frontend/package.json`
- Purpose: Provide ESLint's recommended JavaScript rules.
- Depends on: npm.
- Used by: `frontend/eslint.config.js`.
- Status: done
- Notes for Claude: `@eslint/js`, manifest range `^9.39.1`; installed version `9.39.5`.

### R-020 · Task 1 · DEPENDENCY
- Path: `frontend/package.json`
- Purpose: Provide ESLint global variable definitions.
- Depends on: npm.
- Used by: `frontend/eslint.config.js`.
- Status: done
- Notes for Claude: `globals`, manifest range `^16.5.0`; installed version `16.5.0`.

### R-021 · Task 1 · DEPENDENCY
- Path: `frontend/package.json`
- Purpose: Enforce React Hooks rules in ESLint.
- Depends on: npm.
- Used by: `frontend/eslint.config.js`.
- Status: done
- Notes for Claude: `eslint-plugin-react-hooks`, manifest range `^7.0.1`; installed version `7.1.1`.

### R-022 · Task 1 · DEPENDENCY
- Path: `frontend/package.json`
- Purpose: Enforce React Fast Refresh rules in ESLint.
- Depends on: npm.
- Used by: `frontend/eslint.config.js`.
- Status: done
- Notes for Claude: `eslint-plugin-react-refresh`, manifest range `^0.4.24`; installed version `0.4.26`.

### R-023 · Task 1 · DEPENDENCY
- Path: `frontend/package.json`
- Purpose: Provide React type declaration packages.
- Depends on: Earlier TypeScript scaffold.
- Used by: None; the app now uses JavaScript.
- Status: done
- Notes for Claude: `@types/react`, manifest range `^19.2.7`; installed version `19.3.0`. Retained from the earlier TypeScript template.

### R-024 · Task 1 · DEPENDENCY
- Path: `frontend/package.json`
- Purpose: Provide React DOM type declaration packages.
- Depends on: Earlier TypeScript scaffold.
- Used by: None; the app now uses JavaScript.
- Status: done
- Notes for Claude: `@types/react-dom`, manifest range `^19.2.3`; installed version `19.3.0`. Retained from the earlier TypeScript template.

### R-025 · Task 1 · COMMAND
- Path: `frontend/`
- Purpose: Install the dependencies from the JavaScript React scaffold.
- Depends on: `frontend/package.json`.
- Used by: Frontend development and verification.
- Status: done
- Notes for Claude: Ran `npm install`.

### R-026 · Task 1 · COMMAND
- Path: `frontend/`
- Purpose: Add Tailwind CSS and its PostCSS build dependencies.
- Depends on: npm.
- Used by: Tailwind styling and Vite builds.
- Status: done
- Notes for Claude: Ran `npm install -D tailwindcss@^3 postcss autoprefixer`.

### R-027 · Task 1 · DEPENDENCY
- Path: `frontend/package.json`
- Purpose: Generate the utility CSS framework.
- Depends on: npm.
- Used by: `frontend/tailwind.config.js`, `frontend/postcss.config.js`, and `frontend/src/index.css`.
- Status: done
- Notes for Claude: `tailwindcss`, manifest range `^3.4.19`; installed version `3.4.19`.

### R-028 · Task 1 · DEPENDENCY
- Path: `frontend/package.json`
- Purpose: Process Tailwind directives during the Vite build.
- Depends on: npm.
- Used by: `frontend/postcss.config.js`.
- Status: done
- Notes for Claude: `postcss`, manifest range `^8.5.32`; installed version `8.5.32`.

### R-029 · Task 1 · DEPENDENCY
- Path: `frontend/package.json`
- Purpose: Add vendor prefixes to generated CSS.
- Depends on: npm.
- Used by: `frontend/postcss.config.js`.
- Status: done
- Notes for Claude: `autoprefixer`, manifest range `^10.6.2`; installed version `10.6.2`.

### R-030 · Task 1 · FILE_CHANGED
- Path: `frontend/package.json`
- Purpose: Add Tailwind CSS, PostCSS, and Autoprefixer development dependencies.
- Depends on: `R-026`.
- Used by: npm.
- Status: done
- Notes for Claude: The manifest also retains unused React type packages from the previous TypeScript scaffold.

### R-031 · Task 1 · FILE_CHANGED
- Path: `frontend/package-lock.json`
- Purpose: Lock the frontend dependency tree after installing Tailwind.
- Depends on: `R-026`.
- Used by: `npm install`.
- Status: done
- Notes for Claude: Generated/updated by npm.

### R-032 · Task 1 · FILE_CREATED
- Path: `frontend/tailwind.config.js`
- Purpose: Configure Tailwind content scanning for the HTML and JavaScript/JSX source.
- Depends on: Tailwind CSS 3.
- Used by: Tailwind CSS build.
- Status: done
- Notes for Claude: Tailwind v3 configuration is in JavaScript config, not CSS `@theme`.

### R-033 · Task 1 · FILE_CREATED
- Path: `frontend/postcss.config.js`
- Purpose: Configure Tailwind and Autoprefixer as PostCSS plugins.
- Depends on: `tailwindcss`, `postcss`, and `autoprefixer`.
- Used by: Vite CSS processing.
- Status: done
- Notes for Claude: Uses the Tailwind v3 PostCSS plugin.

### R-034 · Task 1 · FILE_CREATED
- Path: `frontend/src/api/.gitkeep`
- Purpose: Keep the API module directory in the project structure.
- Depends on: Architecture section 6.
- Used by: Future API client and modules.
- Status: done
- Notes for Claude: Directory placeholder only.

### R-035 · Task 1 · FILE_CREATED
- Path: `frontend/src/auth/.gitkeep`
- Purpose: Keep the authentication directory in the project structure.
- Depends on: Architecture section 6.
- Used by: Future auth context and route guards.
- Status: done
- Notes for Claude: Directory placeholder only.

### R-036 · Task 1 · FILE_CREATED
- Path: `frontend/src/layouts/.gitkeep`
- Purpose: Keep the layouts directory in the project structure.
- Depends on: Architecture section 6.
- Used by: Future store and admin layouts.
- Status: done
- Notes for Claude: Directory placeholder only.

### R-037 · Task 1 · FILE_CREATED
- Path: `frontend/src/pages/public/.gitkeep`
- Purpose: Keep the public pages directory in the project structure.
- Depends on: Architecture section 6.
- Used by: Future public pages.
- Status: done
- Notes for Claude: Directory placeholder only.

### R-038 · Task 1 · FILE_CREATED
- Path: `frontend/src/pages/customer/.gitkeep`
- Purpose: Keep the customer pages directory in the project structure.
- Depends on: Architecture section 6.
- Used by: Future customer pages.
- Status: done
- Notes for Claude: Directory placeholder only.

### R-039 · Task 1 · FILE_CREATED
- Path: `frontend/src/pages/admin/.gitkeep`
- Purpose: Keep the admin pages directory in the project structure.
- Depends on: Architecture section 6.
- Used by: Future admin pages.
- Status: done
- Notes for Claude: Directory placeholder only.

### R-040 · Task 1 · FILE_CREATED
- Path: `frontend/src/components/ui/.gitkeep`
- Purpose: Keep the UI components directory in the project structure.
- Depends on: Architecture section 6.
- Used by: Future shadcn/ui components.
- Status: done
- Notes for Claude: Directory placeholder only.

### R-041 · Task 1 · FILE_CREATED
- Path: `frontend/src/components/shared/.gitkeep`
- Purpose: Keep the shared components directory in the project structure.
- Depends on: Architecture section 6.
- Used by: Future shared components.
- Status: done
- Notes for Claude: Directory placeholder only.

### R-042 · Task 1 · FILE_CREATED
- Path: `frontend/src/hooks/.gitkeep`
- Purpose: Keep the hooks directory in the project structure.
- Depends on: Architecture section 6.
- Used by: Future shared hooks.
- Status: done
- Notes for Claude: Directory placeholder only.

### R-043 · Task 1 · FILE_CREATED
- Path: `frontend/src/utils/.gitkeep`
- Purpose: Keep the utilities directory in the project structure.
- Depends on: Architecture section 6.
- Used by: Future formatting utilities.
- Status: done
- Notes for Claude: Directory placeholder only.

### R-044 · Task 1 · FILE_CREATED
- Path: `frontend/src/constants/.gitkeep`
- Purpose: Keep the constants directory in the project structure.
- Depends on: Architecture section 6.
- Used by: Future frontend constants.
- Status: done
- Notes for Claude: Directory placeholder only. A separate pre-existing `frontend/constants/site.js` also exists outside the documented `src/` layout.

### R-045 · Task 1 · DECISION
- Path: `frontend/tailwind.config.js`
- Purpose: Use Tailwind CSS 3 configuration for this setup.
- Depends on: Task 1 Tailwind configuration requirement.
- Used by: Future Tailwind font and color mappings.
- Status: done
- Notes for Claude: Installed Tailwind is 3.4.19. The requested `tailwind.config.js` font/color mapping approach applies; Tailwind v4 CSS `@theme` configuration does not apply.

### R-046 · Task 1 · COMMAND
- Path: `frontend/`
- Purpose: Verify the production build.
- Depends on: Frontend dependencies and Tailwind configuration.
- Used by: Task 1 verification.
- Status: done
- Notes for Claude: Ran `npm run build`; Vite completed successfully. It warned that no Tailwind utility classes are present yet, expected for the starter screen.

### R-047 · Task 1 · COMMAND
- Path: `frontend/`
- Purpose: Verify JavaScript source linting.
- Depends on: Frontend dependencies.
- Used by: Task 1 verification.
- Status: done
- Notes for Claude: Ran `npm run lint`; it passed.

### R-048 · Task 1 · COMMAND
- Path: `frontend/`
- Purpose: Start the Vite development server for the smoke test.
- Depends on: Vite.
- Used by: Task 1 verification.
- Status: done
- Notes for Claude: Ran `npm run dev -- --host 127.0.0.1`.

### R-049 · Task 1 · TEST
- Path: `frontend/`
- Purpose: Verify that the development server serves the app entry page.
- Depends on: `R-048`.
- Used by: Task 1 verification.
- Status: done
- Notes for Claude: Requested `http://127.0.0.1:5173/`; received HTTP 200 and confirmed the React root and `/src/main.jsx` entry script.

### R-050 · Task 1 · TODO_DESIGN
- Path: `docs/design.md:129`
- Purpose: Preserve the mobile layout as unresolved until the mobile reference is available.
- Depends on: Mobile screenshots/reference.
- Used by: Future responsive storefront work.
- Status: pending
- Notes for Claude: Mobile layouts are marked TODO-DESIGN. Do not guess; follow the documented temporary stacking/header rules until design is provided.

### R-051 · Task 1 · TODO_DESIGN
- Path: `docs/design.md:161`
- Purpose: Preserve mobile navigation design as unresolved.
- Depends on: Mobile navigation reference/design.
- Used by: Future storefront navigation.
- Status: pending
- Notes for Claude: Mobile navigation is explicitly TODO-DESIGN. Do not guess.

### R-052 · Task 1 · TODO_DESIGN
- Path: `docs/design.md:237`
- Purpose: Preserve blog excerpt and date presentation as unresolved.
- Depends on: Blog listing design reference.
- Used by: Future blog listing page.
- Status: pending
- Notes for Claude: Excerpt/date styling and presentation are TODO-DESIGN. Do not guess.

### R-053 · Task 1 · TODO_DESIGN
- Path: `docs/design.md:368`
- Purpose: Preserve the mobile menu drawer's exact layout as unresolved.
- Depends on: Mobile menu drawer design.
- Used by: Future storefront mobile navigation.
- Status: pending
- Notes for Claude: The drawer's exact layout is TODO-DESIGN. Do not guess.

### R-054 · Task 1 · FILE_CHANGED
- Path: `docs/progress.md`
- Purpose: Record that Phase 1 Task 1 is complete and no decisions are needed for it.
- Depends on: Task 1 build, lint, and smoke test.
- Used by: Project progress tracking.
- Status: done
- Notes for Claude: Phase 1 remains in progress; only Task 1 of 11 is complete.

### R-055 · Task 1 · FILE_CREATED
- Path: `docs/report.md`
- Purpose: Establish the shared build log and current project map for Copilot and Claude.
- Depends on: User-provided report structure and Task 1 history.
- Used by: Copilot and Claude for shared implementation context.
- Status: done
- Notes for Claude: Append new entries; do not delete prior entries. Update statuses in place only for your own entries.

### R-056 · Task 1 · FILE_CHANGED
- Path: `docs/progress.md`
- Purpose: Require matching report entries before marking a task complete.
- Depends on: User-provided shared-report rule.
- Used by: Future task completion tracking.
- Status: done
- Notes for Claude: Exact rule added: "Each completed task must have matching entries in docs/report.md before the task is marked done."

### R-057 · Task 1 · COMMAND
- Path: `frontend/`
- Purpose: Verify the installed Tailwind version and current top-level dependency tree.
- Depends on: Installed frontend packages.
- Used by: Shared report dependency map.
- Status: done
- Notes for Claude: `tailwindcss` is 3.4.19; `npm ls --depth=0` completed successfully.

### R-058 · Task 1 · FILE_CREATED
- Path: `frontend/package-lock.json`
- Purpose: Record the dependency tree installed for the Vite React scaffold.
- Depends on: `R-025`.
- Used by: npm installs.
- Status: done
- Notes for Claude: The lockfile was created by the initial scaffold dependency install and subsequently updated for Tailwind in `R-031`.

### R-059 · Task 2 · COMMAND
- Path: `frontend/`
- Purpose: Check current npm versions for the requested UI and data packages and available shadcn v2 CLI versions.
- Depends on: npm registry access.
- Used by: Task 2 package and CLI selection.
- Status: done
- Notes for Claude: Queried `react-icons`, `react-router-dom`, `@tanstack/react-query`, `sonner`, and `shadcn@2`. Selected latest queried versions of the first four and shadcn CLI 2.10.0.

### R-060 · Task 2 · DEPENDENCY
- Path: `frontend/package.json`
- Purpose: Provide the React icon set for Gearnix-owned interface icons.
- Depends on: npm.
- Used by: Future storefront and admin UI.
- Status: done
- Notes for Claude: `react-icons` `^5.7.0`, installed 5.7.0.

### R-061 · Task 2 · DEPENDENCY
- Path: `frontend/package.json`
- Purpose: Provide client-side application routing.
- Depends on: npm.
- Used by: Future route tree and route guards.
- Status: done
- Notes for Claude: `react-router-dom` `^7.18.4`, installed 7.18.4.

### R-062 · Task 2 · DEPENDENCY
- Path: `frontend/package.json`
- Purpose: Manage server-state caching and queries.
- Depends on: npm.
- Used by: Future API-backed pages and hooks.
- Status: done
- Notes for Claude: `@tanstack/react-query` `^5.105.0`, installed 5.105.0.

### R-063 · Task 2 · DEPENDENCY
- Path: `frontend/package.json`
- Purpose: Provide toast notifications.
- Depends on: npm.
- Used by: Future action feedback and shadcn Sonner wrapper.
- Status: done
- Notes for Claude: `sonner` `^2.0.8`, installed 2.0.8.

### R-064 · Task 2 · COMMAND
- Path: `frontend/`
- Purpose: Install the requested UI and data libraries.
- Depends on: `R-060` through `R-063`.
- Used by: Frontend application.
- Status: done
- Notes for Claude: Ran `npm install react-icons react-router-dom @tanstack/react-query sonner`.

### R-065 · Task 2 · COMMAND
- Path: `frontend/`
- Purpose: Check shadcn CLI options before initialization.
- Depends on: npm registry access.
- Used by: Tailwind v3-compatible shadcn setup.
- Status: done
- Notes for Claude: Ran `npx --yes shadcn@2.10.0 init --help`; CLI version 2.10.0 supports Tailwind config, CSS variables, defaults, and a selected base color.

### R-066 · Task 2 · COMMAND
- Path: `frontend/`
- Purpose: Attempt shadcn initialization before adding the JavaScript alias config.
- Depends on: shadcn CLI 2.10.0.
- Used by: shadcn setup.
- Status: blocked
- Notes for Claude: Ran `npx --yes shadcn@2.10.0 init --yes --css-variables --base-color zinc`; it stopped at import-alias validation because no `tsconfig.json` or `jsconfig.json` alias existed yet.

### R-067 · Task 2 · FILE_CHANGED
- Path: `frontend/vite.config.js`
- Purpose: Add the `@` import alias for source modules.
- Depends on: User requirement for `@/` imports.
- Used by: Vite and shadcn component imports.
- Status: done
- Notes for Claude: Added a Vite alias to `src` using `fileURLToPath` and `new URL`.

### R-068 · Task 2 · FILE_CREATED
- Path: `frontend/jsconfig.json`
- Purpose: Configure JavaScript editor/module resolution for the `@/` alias.
- Depends on: User requirement for `@/` imports.
- Used by: JavaScript tooling and shadcn CLI alias validation.
- Status: done
- Notes for Claude: Maps `@/*` to `./src/*`.

### R-069 · Task 2 · COMMAND
- Path: `frontend/`
- Purpose: Retry shadcn initialization after adding the JavaScript alias.
- Depends on: `R-067` and `R-068`.
- Used by: shadcn setup.
- Status: blocked
- Notes for Claude: Ran `npx --yes shadcn@2.10.0 init --yes --css-variables --base-color zinc`; alias validation passed, but the CLI then requested a style selection interactively and exited without completing initialization.

### R-070 · Task 2 · COMMAND
- Path: `frontend/`
- Purpose: Initialize shadcn for Vite, Tailwind v3, CSS variables, and JavaScript.
- Depends on: `R-067` and `R-068`.
- Used by: shadcn UI components.
- Status: done
- Notes for Claude: Exact command: `npx --yes shadcn@2.10.0 init --yes --defaults --css-variables --base-color zinc`. The CLI was pinned to 2.10.0; it selected New York style and `tailwind.config.js`, not CSS-only `@theme`.

### R-071 · Task 2 · FILE_CREATED
- Path: `frontend/components.json`
- Purpose: Configure shadcn style, Tailwind v3 settings, CSS variables, and import aliases.
- Depends on: `R-070`.
- Used by: shadcn CLI and UI components.
- Status: done
- Notes for Claude: `tsx: false`; aliases include `@/components`, `@/components/ui`, and `@/lib/utils`.

### R-072 · Task 2 · FILE_CHANGED
- Path: `frontend/tailwind.config.js`
- Purpose: Add the shadcn semantic theme extension and animation plugin.
- Depends on: `R-070`.
- Used by: Tailwind CSS and generated shadcn components.
- Status: done
- Notes for Claude: The CLI preserved the Tailwind v3 config file rather than switching to `@theme`. Compatibility adjustments are recorded in `R-090`.

### R-073 · Task 2 · FILE_CHANGED
- Path: `frontend/src/index.css`
- Purpose: Add shadcn CSS-variable theme tokens and base layer.
- Depends on: `R-070`.
- Used by: shadcn components and global styling.
- Status: done
- Notes for Claude: Existing Task 1 Tailwind directives and global reset were retained. No Task 1 font-family or brand color mappings existed to restore; fonts and brand tokens remain for Tasks 3 and 4.

### R-074 · Task 2 · FILE_CREATED
- Path: `frontend/src/lib/utils.js`
- Purpose: Provide the shared `cn` helper for composing and merging Tailwind classes.
- Depends on: `clsx` and `tailwind-merge`.
- Used by: Generated shadcn components.
- Status: done
- Notes for Claude: Created by the shadcn CLI.

### R-075 · Task 2 · DEPENDENCY
- Path: `frontend/package.json`
- Purpose: Build class-based variants for shadcn components.
- Depends on: shadcn CLI.
- Used by: Button and Label.
- Status: done
- Notes for Claude: `class-variance-authority` `^0.7.1`, installed 0.7.1.

### R-076 · Task 2 · DEPENDENCY
- Path: `frontend/package.json`
- Purpose: Compose conditional class names.
- Depends on: shadcn CLI.
- Used by: `frontend/src/lib/utils.js`.
- Status: done
- Notes for Claude: `clsx` `^2.1.1`, installed 2.1.1.

### R-077 · Task 2 · DEPENDENCY
- Path: `frontend/package.json`
- Purpose: Provide Lucide icons for shadcn-owned components.
- Depends on: shadcn CLI.
- Used by: Generated shadcn UI.
- Status: done
- Notes for Claude: `lucide-react` `^1.62.0`, installed 1.62.0. Gearnix-owned icons continue to use `react-icons`.

### R-078 · Task 2 · DEPENDENCY
- Path: `frontend/package.json`
- Purpose: Merge Tailwind class names without conflicts.
- Depends on: shadcn CLI.
- Used by: `frontend/src/lib/utils.js`.
- Status: done
- Notes for Claude: `tailwind-merge` `^3.7.0`, installed 3.7.0.

### R-079 · Task 2 · DEPENDENCY
- Path: `frontend/package.json`
- Purpose: Add the animation utilities expected by shadcn.
- Depends on: shadcn CLI.
- Used by: `frontend/tailwind.config.js`.
- Status: done
- Notes for Claude: `tailwindcss-animate` `^1.0.7`, installed 1.0.7.

### R-080 · Task 2 · DEPENDENCY
- Path: `frontend/package.json`
- Purpose: Provide the accessible slot primitive for Button's `asChild` behavior.
- Depends on: shadcn CLI.
- Used by: `frontend/src/components/ui/button.jsx`.
- Status: done
- Notes for Claude: `@radix-ui/react-slot` `^1.5.0`, installed 1.5.0.

### R-081 · Task 2 · DEPENDENCY
- Path: `frontend/package.json`
- Purpose: Provide the accessible label primitive.
- Depends on: shadcn CLI.
- Used by: `frontend/src/components/ui/label.jsx`.
- Status: done
- Notes for Claude: `@radix-ui/react-label` `^2.1.17`, installed 2.1.17.

### R-082 · Task 2 · COMMAND
- Path: `frontend/`
- Purpose: Generate the requested shadcn UI components.
- Depends on: shadcn CLI 2.10.0 and `R-070`.
- Used by: Frontend application.
- Status: done
- Notes for Claude: Ran `npx --yes shadcn@2.10.0 add button input label card sonner`.

### R-083 · Task 2 · FILE_CREATED
- Path: `frontend/src/components/ui/button.jsx`
- Purpose: Provide shadcn Button and button variants.
- Depends on: Radix Slot, class-variance-authority, and `cn`.
- Used by: Future pages and UI.
- Status: done
- Notes for Claude: Generated by shadcn CLI 2.10.0; left unmodified.

### R-084 · Task 2 · FILE_CREATED
- Path: `frontend/src/components/ui/input.jsx`
- Purpose: Provide the shadcn text input component.
- Depends on: React and `cn`.
- Used by: Future forms and pages.
- Status: done
- Notes for Claude: Generated by shadcn CLI 2.10.0; left unmodified.

### R-085 · Task 2 · FILE_CREATED
- Path: `frontend/src/components/ui/label.jsx`
- Purpose: Provide the shadcn accessible Label component.
- Depends on: Radix Label, class-variance-authority, and `cn`.
- Used by: Future forms and pages.
- Status: done
- Notes for Claude: Generated by shadcn CLI 2.10.0; left unmodified.

### R-086 · Task 2 · FILE_CREATED
- Path: `frontend/src/components/ui/card.jsx`
- Purpose: Provide Card and its related content/title subcomponents.
- Depends on: React and `cn`.
- Used by: Future page and panel layouts.
- Status: done
- Notes for Claude: Generated by shadcn CLI 2.10.0; left unmodified.

### R-087 · Task 2 · FILE_CREATED
- Path: `frontend/src/components/ui/sonner.jsx`
- Purpose: Provide the shadcn-styled Sonner toaster.
- Depends on: Sonner, next-themes, and shadcn theme tokens.
- Used by: Future global toast feedback.
- Status: done
- Notes for Claude: Generated by shadcn CLI 2.10.0; left unmodified.

### R-088 · Task 2 · DEPENDENCY
- Path: `frontend/package.json`
- Purpose: Let the generated Sonner wrapper read the active theme.
- Depends on: shadcn component generation.
- Used by: `frontend/src/components/ui/sonner.jsx`.
- Status: done
- Notes for Claude: `next-themes` `^0.4.6`, installed 0.4.6.

### R-089 · Task 2 · COMMAND
- Path: `frontend/`
- Purpose: Ensure the generated Sonner theme dependency is installed.
- Depends on: `R-087`.
- Used by: Generated Sonner wrapper.
- Status: done
- Notes for Claude: Ran `npm install next-themes`; npm reported the package was already up to date after component generation.

### R-090 · Task 2 · FILE_CHANGED
- Path: `frontend/tailwind.config.js`
- Purpose: Make generated shadcn color utilities compatible with its full-value OKLCH CSS variables and ESM project config.
- Depends on: `R-072` and Tailwind 3.4.
- Used by: Tailwind component classes and lint.
- Status: done
- Notes for Claude: Replaced `hsl(var(--token))` wrappers with `var(--token)` so generated OKLCH values resolve correctly; replaced CommonJS `require` for `tailwindcss-animate` with an ESM import. The initial lint identified `require` as undefined.

### R-091 · Task 2 · FILE_CHANGED
- Path: `frontend/src/index.css`
- Purpose: Define the foreground token referenced by the generated destructive button variant.
- Depends on: shadcn component token inspection.
- Used by: Destructive Button variant.
- Status: done
- Notes for Claude: Added `--destructive-foreground` to light and dark token sets because the generated config/component referenced it but the CLI output omitted it.

### R-092 · Task 2 · FILE_CHANGED
- Path: `frontend/eslint.config.js`
- Purpose: Allow generated shadcn UI files to export component variants alongside components.
- Depends on: Linting generated `button.jsx`.
- Used by: `npm run lint`.
- Status: done
- Notes for Claude: Disabled `react-refresh/only-export-components` only for `src/components/ui/**/*.jsx`; the generated Button exports both `Button` and `buttonVariants`.

### R-093 · Task 2 · FILE_CHANGED
- Path: `frontend/src/App.jsx`
- Purpose: Temporarily render the Button, labeled Input, Card, and Sonner toast for the required smoke test.
- Depends on: `R-083` through `R-087`.
- Used by: Browser smoke test only.
- Status: done
- Notes for Claude: Temporary test content was removed and the original Vite starter App restored; see `R-098`.

### R-094 · Task 2 · COMMAND
- Path: `frontend/`
- Purpose: Build the temporary UI component smoke test.
- Depends on: Generated UI components and temporary App test.
- Used by: Task 2 smoke verification.
- Status: done
- Notes for Claude: Ran `npm run build`; passed.

### R-095 · Task 2 · COMMAND
- Path: `frontend/`
- Purpose: Lint the temporary UI component smoke test.
- Depends on: Generated UI components and temporary App test.
- Used by: Task 2 lint verification.
- Status: done
- Notes for Claude: The first `npm run lint` found generated shadcn Button export and ESM Tailwind `require` issues. These were addressed in `R-090` and `R-092`; final lint passed in `R-100`.

### R-096 · Task 2 · COMMAND
- Path: `frontend/`
- Purpose: Start Vite for the browser smoke test.
- Depends on: Installed dependencies.
- Used by: `R-097`.
- Status: done
- Notes for Claude: Ran `npm run dev -- --host 127.0.0.1`; Vite served on port 5173.

### R-097 · Task 2 · TEST
- Path: `frontend/src/App.jsx`
- Purpose: Confirm all requested controls render, the toast button works, and there are no runtime errors.
- Depends on: `R-093` and `R-096`.
- Used by: Task 2 UI smoke verification.
- Status: done
- Notes for Claude: Browser showed Card, Label, Input, Button, and the Sonner toaster; clicking the button displayed "Sonner toast works". Runtime error check returned no data. Computed button colors resolved to OKLCH values, confirming the Tailwind mapping fix.

### R-098 · Task 2 · TEST
- Path: `frontend/src/App.jsx`
- Purpose: Remove the temporary smoke-test markup and restore the original starter app.
- Depends on: `R-097`.
- Used by: Normal frontend starter screen.
- Status: done
- Notes for Claude: Confirmed the source no longer imports the temporary UI components or toast.

### R-099 · Task 2 · COMMAND
- Path: `frontend/`
- Purpose: Run the final production build after removing temporary markup.
- Depends on: Task 2 implementation.
- Used by: Final verification.
- Status: done
- Notes for Claude: Ran `npm run build`; passed with Vite 7.3.7.

### R-100 · Task 2 · COMMAND
- Path: `frontend/`
- Purpose: Run final JavaScript lint.
- Depends on: Task 2 implementation.
- Used by: Final verification.
- Status: done
- Notes for Claude: Ran `npm run lint`; passed.

### R-101 · Task 2 · COMMAND
- Path: `frontend/`
- Purpose: Record final installed package versions.
- Depends on: npm lockfile.
- Used by: Shared dependency map and completion report.
- Status: done
- Notes for Claude: Queried `package.json` and `package-lock.json`; versions are recorded in the Map and dependency entries.

### R-102 · Task 2 · FILE_CHANGED
- Path: `docs/report.md`
- Purpose: Record Task 2 commands, dependencies, files, tests, and current project map.
- Depends on: Task 2 implementation and verification.
- Used by: Copilot and Claude.
- Status: done
- Notes for Claude: New Task 2 entries use sequential IDs after R-058. No open questions were identified.

### R-103 · Task 2 · FILE_CHANGED
- Path: `docs/progress.md`
- Purpose: Mark Phase 1 Task 2 complete after its report entries were added.
- Depends on: `R-102`.
- Used by: Project progress tracking.
- Status: done
- Notes for Claude: The progress table now records Tasks 1-2/11 complete. The report entries were written before marking Task 2 done.

### R-104 · Task 3 · FILE_CHANGED
- Path: `frontend/src/index.css`
- Purpose: Load Orbitron and Poppins with `font-display: swap` and define the requested font-family variables.
- Depends on: Google Fonts stylesheet and Tailwind CSS.
- Used by: Global typography and Tailwind font utilities.
- Status: done
- Notes for Claude: Added a Google Fonts CSS import requesting Orbitron weights 500, 700, 900 and Poppins weights 400, 500, 600, 700 with `display=swap`. Defined `--font-family-primary` and `--font-family-default` on the top-level `:root`; body uses the Poppins variable.

### R-105 · Task 3 · FILE_CHANGED
- Path: `frontend/tailwind.config.js`
- Purpose: Expose the display and default fonts through Tailwind utility classes.
- Depends on: CSS font-family variables in `frontend/src/index.css`.
- Used by: Components using `font-primary` and `font-default`.
- Status: done
- Notes for Claude: Added `fontFamily.primary` and `fontFamily.default` mappings using their respective CSS variables. Existing shadcn color mappings remain unchanged.

### R-106 · Task 3 · COMMAND
- Path: `frontend/`
- Purpose: Run the app to verify font setup in the browser.
- Depends on: Task 3 CSS and Tailwind changes.
- Used by: Task 3 smoke test.
- Status: done
- Notes for Claude: Ran `npm run dev -- --host 127.0.0.1`; Vite served the app at `http://127.0.0.1:5173/`.

### R-107 · Task 3 · TEST
- Path: `frontend/src/index.css`
- Purpose: Verify the served page uses the configured default font and exposes both CSS variables without runtime errors.
- Depends on: `R-104` and `R-106`.
- Used by: Task 3 validation.
- Status: done
- Notes for Claude: Browser computed body font as `Poppins, system-ui, sans-serif`, read both root variables, and confirmed the Google Fonts import includes `display=swap`. Browser runtime error check returned no data.

### R-108 · Task 3 · COMMAND
- Path: `frontend/`
- Purpose: Verify the production build after font configuration.
- Depends on: Task 3 implementation.
- Used by: Task 3 validation.
- Status: done
- Notes for Claude: Ran `npm run build`; Vite 7.3.7 completed successfully.

### R-109 · Task 3 · COMMAND
- Path: `frontend/`
- Purpose: Verify frontend lint after font configuration.
- Depends on: Task 3 implementation.
- Used by: Task 3 validation.
- Status: done
- Notes for Claude: Ran `npm run lint`; it passed.

### R-110 · Task 3 · FILE_CHANGED
- Path: `docs/report.md`
- Purpose: Record Task 3 changes, commands, tests, and font setup details.
- Depends on: Task 3 implementation and verification.
- Used by: Copilot and Claude.
- Status: done
- Notes for Claude: Task 3 entries are R-104 through R-111.

### R-111 · Task 3 · FILE_CHANGED
- Path: `docs/progress.md`
- Purpose: Mark Phase 1 Task 3 complete after adding matching report entries.
- Depends on: `R-110`.
- Used by: Project progress tracking.
- Status: done
- Notes for Claude: Updated only after the Task 3 report entries were added.

### R-112 · Task 4 · FILE_CHANGED
- Path: `frontend/src/index.css`
- Purpose: Add the design colors and gradients from design.md section 4 as CSS custom properties.
- Depends on: Design specification values.
- Used by: Tailwind brand color and background-image utilities.
- Status: done
- Notes for Claude: Every specified estimated value, including gradient stops, has a trailing `/* est. */` comment. No values were invented for TODO-DESIGN items.

### R-113 · Task 4 · FILE_CHANGED
- Path: `frontend/tailwind.config.js`
- Purpose: Map design color tokens and gradients to Tailwind utility classes.
- Depends on: `R-112`.
- Used by: Frontend components.
- Status: done
- Notes for Claude: Added `brand.*` colors (for example `bg-brand-base`, `text-brand-text-primary`, `border-brand-border-subtle`) and `bg-grad-*` background images. Kept existing shadcn semantic colors.

### R-114 · Task 4 · COMMAND
- Path: `frontend/`
- Purpose: Run the initial production build for the new design tokens.
- Depends on: `R-112` and `R-113`.
- Used by: Task 4 verification.
- Status: done
- Notes for Claude: Ran `npm run build`; passed.

### R-115 · Task 4 · COMMAND
- Path: `frontend/`
- Purpose: Lint the first Tailwind token mapping change.
- Depends on: `R-113`.
- Used by: Task 4 verification.
- Status: done
- Notes for Claude: The first `npm run lint` identified a duplicate `colors` key in the Tailwind config. Merged the design mappings into the existing colors extension and reran lint successfully.

### R-116 · Task 4 · COMMAND
- Path: `frontend/`
- Purpose: Run the final production build after merging the color mappings.
- Depends on: `R-113`.
- Used by: Task 4 final verification.
- Status: done
- Notes for Claude: Ran `npm run build`; passed with Vite 7.3.7.

### R-117 · Task 4 · COMMAND
- Path: `frontend/`
- Purpose: Run final lint after merging the color mappings.
- Depends on: `R-113`.
- Used by: Task 4 final verification.
- Status: done
- Notes for Claude: Ran `npm run lint`; passed.

### R-118 · Task 4 · FILE_CHANGED
- Path: `docs/report.md`
- Purpose: Record Task 4 token additions, checks, and Tailwind mappings.
- Depends on: Task 4 implementation and verification.
- Used by: Copilot and Claude.
- Status: done
- Notes for Claude: Task 4 entries are R-112 through R-119.

### R-119 · Task 4 · FILE_CHANGED
- Path: `docs/progress.md`
- Purpose: Mark Task 4 complete after writing its report entries.
- Depends on: `R-118`.
- Used by: Project progress tracking.
- Status: done
- Notes for Claude: Updated only after the Task 4 report entries were added.

### R-120 · Task 5 · COMPONENT
- Path: `frontend/src/components/shared/Logo.jsx`
- Purpose: Render the supplied wordmark SVG with selectable light or dark text.
- Depends on: Existing `frontend/public/brand/logo-wordmark.svg` and brand text color tokens.
- Used by: Future store and admin headers.
- Status: done
- Notes for Claude: Imports the existing SVG as raw markup so its `currentColor` stroke follows the `color` prop while preserving the original gradient X. No logo was redrawn.

### R-121 · Task 5 · FILE_CHANGED
- Path: `frontend/src/App.jsx`
- Purpose: Temporarily render the Logo in light and dark variants for visual verification.
- Depends on: `R-120`.
- Used by: Task 5 browser smoke test only.
- Status: done
- Notes for Claude: Temporary test content was removed and the original Vite starter App restored.

### R-122 · Task 5 · COMMAND
- Path: `frontend/`
- Purpose: Run the app to verify the Logo SVG renders.
- Depends on: `R-120`.
- Used by: Task 5 browser smoke test.
- Status: done
- Notes for Claude: Ran `npm run dev -- --host 127.0.0.1`; Vite served on port 5173.

### R-123 · Task 5 · TEST
- Path: `frontend/src/components/shared/Logo.jsx`
- Purpose: Verify both Logo color prop values visually.
- Depends on: `R-120` and `R-122`.
- Used by: Task 5 verification.
- Status: done
- Notes for Claude: Browser showed a white wordmark on the dark surface and a dark wordmark on the light surface; the SVG's magenta-violet X gradient was preserved.

### R-124 · Task 5 · TEST
- Path: `frontend/src/App.jsx`
- Purpose: Restore the normal starter screen after Logo smoke testing.
- Depends on: `R-123`.
- Used by: Frontend starter app.
- Status: done
- Notes for Claude: Removed the temporary Logo imports and markup.

### R-125 · Task 5 · COMMAND
- Path: `frontend/`
- Purpose: Verify the Logo component does not break the production build.
- Depends on: `R-120`.
- Used by: Task 5 verification.
- Status: done
- Notes for Claude: Ran `npm run build`; passed.

### R-126 · Task 5 · COMMAND
- Path: `frontend/`
- Purpose: Verify the Logo component passes lint.
- Depends on: `R-120`.
- Used by: Task 5 verification.
- Status: done
- Notes for Claude: Ran `npm run lint`; passed.

### R-127 · Task 5 · FILE_CHANGED
- Path: `docs/report.md`
- Purpose: Record Task 5 Logo implementation and verification.
- Depends on: Task 5 implementation and test.
- Used by: Copilot and Claude.
- Status: done
- Notes for Claude: Task 5 entries are R-120 through R-128.

### R-128 · Task 5 · FILE_CHANGED
- Path: `docs/progress.md`
- Purpose: Mark Task 5 complete after recording its report entries.
- Depends on: `R-127`.
- Used by: Project progress tracking.
- Status: done
- Notes for Claude: Existing brand SVG assets were already present in `frontend/public/brand/`, so no copy operation was needed.

### R-129 · Task 6 · FILE_CREATED
- Path: `frontend/src/constants/site.js`
- Purpose: Centralize store identity, contact placeholders, social URLs, payment methods, and footer feature flags.
- Depends on: Design.md section 13 and the decisions log.
- Used by: Future store/footer components.
- Status: done
- Notes for Claude: Contact values remain explicit TODO placeholders and social URLs are empty pending Gearnix details. Payment methods follow the design list. Newsletter, Store Location, and Gift Cards are disabled pending the documented decisions.

### R-130 · Task 6 · FILE_CREATED
- Path: `frontend/src/constants/permissions.js`
- Purpose: Define every permission key from architecture.md section 5 in one constants module.
- Depends on: Backend permission key documentation.
- Used by: Future AuthContext, route guards, and admin navigation.
- Status: done
- Notes for Claude: Includes all 20 documented permission keys; components should use these keys and never role names.

### R-131 · Task 6 · FILE_CHANGED
- Path: `frontend/constants/site.js`
- Purpose: Remove the duplicate out-of-layout site details constant.
- Depends on: New canonical `frontend/src/constants/site.js`.
- Used by: None; no frontend imports referenced the old file.
- Status: done
- Notes for Claude: Deleted the stale duplicate so store details have one source of truth in `src/constants/site.js`.

### R-132 · Task 6 · DECISION
- Path: `frontend/src/constants/site.js`
- Purpose: Keep contact details as TODO placeholders and disable features that depend on unresolved business decisions.
- Depends on: Existing Open decisions for the footer in design.md.
- Used by: Future footer and store information UI.
- Status: done
- Notes for Claude: No real address, phone, email, or social URL was invented. Newsletter remains hidden until its backend-storage decision is made; Gift Cards and Store Location remain off.

### R-133 · Task 6 · COMMAND
- Path: `frontend/`
- Purpose: Run the production build after adding constants.
- Depends on: `R-129` and `R-130`.
- Used by: Task 6 verification.
- Status: done
- Notes for Claude: Ran `npm run build`; passed.

### R-134 · Task 6 · COMMAND
- Path: `frontend/`
- Purpose: Run lint after adding constants.
- Depends on: `R-129` and `R-130`.
- Used by: Task 6 verification.
- Status: done
- Notes for Claude: Ran `npm run lint`; passed.

### R-135 · Task 6 · TEST
- Path: `frontend/src/constants/permissions.js`
- Purpose: Confirm all documented permission keys exist exactly once.
- Depends on: `R-130`.
- Used by: Task 6 verification.
- Status: done
- Notes for Claude: Script inspection found all 20 unique keys listed in architecture.md section 5.

### R-136 · Task 6 · QUESTION
- Path: `docs/design.md` section 13
- Purpose: Decide whether footer newsletter subscriptions should be stored in the database or hidden.
- Depends on: Newsletter backend scope.
- Used by: Future footer implementation.
- Status: pending
- Notes for Claude: Until answered, `SITE.features.newsletter` is false. Open question Q-001.

### R-137 · Task 6 · QUESTION
- Path: `docs/design.md` section 13
- Purpose: Decide whether Gift Cards should be removed or shown as a Coming Soon page.
- Depends on: Product scope decision.
- Used by: Future footer and routes.
- Status: pending
- Notes for Claude: Until answered, `SITE.features.giftCards` is false. Open question Q-002.

### R-138 · Task 6 · QUESTION
- Path: `docs/design.md` section 13
- Purpose: Obtain the real store address before enabling Store Location/contact details.
- Depends on: Gearnix business details.
- Used by: Future footer and store information UI.
- Status: pending
- Notes for Claude: Until answered, the address remains a TODO placeholder and `SITE.features.storeLocation` is false. Open question Q-003.

### R-139 · Task 6 · QUESTION
- Path: `docs/design.md` section 13
- Purpose: Obtain the real Facebook, Instagram, X, and TikTok URLs or identify unused networks.
- Depends on: Gearnix social account details.
- Used by: Future social links.
- Status: pending
- Notes for Claude: Social URL strings remain empty. Open question Q-004.

### R-140 · Task 6 · QUESTION
- Path: `docs/design.md` section 13
- Purpose: Obtain the real store phone number and contact email.
- Depends on: Gearnix contact details.
- Used by: Future footer/contact page.
- Status: pending
- Notes for Claude: Phone and email remain TODO placeholders. Open question Q-005.

### R-141 · Task 6 · FILE_CHANGED
- Path: `docs/report.md`
- Purpose: Record Task 6 constants, decisions, tests, and business-detail questions.
- Depends on: Task 6 implementation and verification.
- Used by: Copilot and Claude.
- Status: done
- Notes for Claude: Task 6 entries are R-129 through R-142; open questions Q-001 through Q-005 remain pending.

### R-142 · Task 6 · FILE_CHANGED
- Path: `docs/progress.md`
- Purpose: Mark Task 6 complete after adding matching report entries.
- Depends on: `R-141`.
- Used by: Project progress tracking.
- Status: done
- Notes for Claude: Five business-content questions are recorded, but do not block these constants or subsequent Phase 1 tasks.

### R-143 · Task 7 · FILE_CREATED
- Path: `frontend/src/api/client.js`
- Purpose: Centralize API requests, credentials, in-memory Authorization, one-at-a-time token refresh, one retry, and readable response errors.
- Depends on: `VITE_API_URL` and access-token state set by AuthContext.
- Used by: AuthContext and all future API modules.
- Status: done
- Notes for Claude: No API URL or localhost fallback is hard-coded. Failed refresh 401 responses clear the in-memory token; non-401 refresh failures surface the server message. Refresh/login/logout endpoints are excluded from recursive refresh.

### R-144 · Task 7 · COMMAND
- Path: `frontend/`
- Purpose: Verify the API client compiles in the frontend.
- Depends on: `R-143`.
- Used by: Task 7 validation.
- Status: done
- Notes for Claude: Ran `npm run build`; passed.

### R-145 · Task 7 · COMMAND
- Path: `frontend/`
- Purpose: Lint the API client.
- Depends on: `R-143`.
- Used by: Task 7 validation.
- Status: done
- Notes for Claude: Ran `npm run lint`; passed.

### R-146 · Task 7 · FILE_CHANGED
- Path: `docs/report.md`
- Purpose: Record Task 7 API client and validation.
- Depends on: Task 7 implementation and verification.
- Used by: Copilot and Claude.
- Status: done
- Notes for Claude: Task 7 entries are R-143 through R-147.

### R-147 · Task 7 · FILE_CHANGED
- Path: `docs/progress.md`
- Purpose: Mark Task 7 complete after adding its matching report entries.
- Depends on: `R-146`.
- Used by: Project progress tracking.
- Status: done
- Notes for Claude: No API call is made directly from any page.

### R-148 · Task 8 · FILE_CREATED
- Path: `frontend/src/auth/AuthContext.jsx`
- Purpose: Restore the session on app load and expose in-memory access token, current user, login, logout, and permission checks.
- Depends on: `frontend/src/api/client.js`, `/auth/refresh`, and `/users/me`.
- Used by: Route guards and future auth-aware components.
- Status: done
- Notes for Claude: Refresh uses the httpOnly cookie via credentials include; the returned access token stays in JS memory. StrictMode's initial mount is deduplicated through a module-level restore promise. Non-401 failures are exposed on context `error`; unauthenticated 401 restores resolve as guest.

### R-149 · Task 8 · FILE_CHANGED
- Path: `frontend/src/main.jsx`
- Purpose: Provide AuthContext to the React app.
- Depends on: `R-148`.
- Used by: All app routes and components.
- Status: done
- Notes for Claude: Wrapped App in `AuthProvider` inside StrictMode.

### R-150 · Task 8 · FILE_CHANGED
- Path: `frontend/eslint.config.js`
- Purpose: Allow the AuthContext module to export its provider and useAuth hook together.
- Depends on: AuthContext provider/hook implementation.
- Used by: `npm run lint`.
- Status: done
- Notes for Claude: Disabled the fast-refresh-only-components rule for this AuthContext file only.

### R-151 · Task 8 · COMMAND
- Path: `frontend/`
- Purpose: Build the AuthContext and provider wiring.
- Depends on: `R-148` and `R-149`.
- Used by: Task 8 validation.
- Status: done
- Notes for Claude: Ran `npm run build`; passed.

### R-152 · Task 8 · COMMAND
- Path: `frontend/`
- Purpose: Lint the first AuthContext implementation.
- Depends on: `R-148`.
- Used by: Task 8 validation.
- Status: done
- Notes for Claude: The first lint reported the expected fast-refresh export rule for a module exporting both provider and hook. Addressed by `R-150`; final lint passed.

### R-153 · Task 8 · COMMAND
- Path: `frontend/`
- Purpose: Run final build after the AuthContext lint adjustment.
- Depends on: `R-150`.
- Used by: Task 8 final validation.
- Status: done
- Notes for Claude: Ran `npm run build`; passed.

### R-154 · Task 8 · COMMAND
- Path: `frontend/`
- Purpose: Run final lint after the AuthContext lint adjustment.
- Depends on: `R-150`.
- Used by: Task 8 final validation.
- Status: done
- Notes for Claude: Ran `npm run lint`; passed.

### R-155 · Task 8 · FILE_CHANGED
- Path: `docs/report.md`
- Purpose: Record Task 8 auth context and validation.
- Depends on: Task 8 implementation and verification.
- Used by: Copilot and Claude.
- Status: done
- Notes for Claude: Task 8 entries are R-148 through R-156.

### R-156 · Task 8 · FILE_CHANGED
- Path: `docs/progress.md`
- Purpose: Mark Task 8 complete after adding matching report entries.
- Depends on: `R-155`.
- Used by: Project progress tracking.
- Status: done
- Notes for Claude: User-facing login form is intentionally deferred to Task 11.

### R-157 · Task 9 · FILE_CREATED
- Path: `frontend/src/auth/RequireLogin.jsx`
- Purpose: Redirect guests to login and retain the attempted location.
- Depends on: AuthContext and React Router.
- Used by: Customer and admin routes.
- Status: done
- Notes for Claude: Shows a session-checking status while AuthContext is loading; guests navigate to `/login`.

### R-158 · Task 9 · FILE_CREATED
- Path: `frontend/src/auth/RequirePermission.jsx`
- Purpose: Prevent authenticated users without the requested permission from entering a protected route.
- Depends on: `hasPermission` from AuthContext.
- Used by: Admin route tree.
- Status: done
- Notes for Claude: Forbidden users see exactly "You don't have access to this page." Role names are not checked.

### R-159 · Task 9 · COMMAND
- Path: `frontend/`
- Purpose: Build the route guards.
- Depends on: `R-157` and `R-158`.
- Used by: Task 9 validation.
- Status: done
- Notes for Claude: Ran `npm run build`; passed.

### R-160 · Task 9 · COMMAND
- Path: `frontend/`
- Purpose: Lint the route guards.
- Depends on: `R-157` and `R-158`.
- Used by: Task 9 validation.
- Status: done
- Notes for Claude: Ran `npm run lint`; passed.

### R-161 · Task 9 · FILE_CHANGED
- Path: `docs/report.md`
- Purpose: Record Task 9 route guards and validation.
- Depends on: Task 9 implementation and verification.
- Used by: Copilot and Claude.
- Status: done
- Notes for Claude: Task 9 entries are R-157 through R-162.

### R-162 · Task 9 · FILE_CHANGED
- Path: `docs/progress.md`
- Purpose: Mark Task 9 complete after adding matching report entries.
- Depends on: `R-161`.
- Used by: Project progress tracking.
- Status: done
- Notes for Claude: Authentication redirects preserve the attempted URL in navigation state.

### R-163 · Task 10 · FILE_CHANGED
- Path: `frontend/src/constants/permissions.js`
- Purpose: Define the set of permission keys that qualifies for access to the admin route shell.
- Depends on: Architecture.md section 5.
- Used by: `StoreLayout` and the `/admin` route guard.
- Status: done
- Notes for Claude: Exported `ADMIN_PERMISSIONS` from documented permission constants; no role-name checks are used.

### R-164 · Task 10 · FILE_CHANGED
- Path: `frontend/src/auth/RequirePermission.jsx`
- Purpose: Support route access requiring any one of a set of permission keys.
- Depends on: `R-163`.
- Used by: `/admin` parent route.
- Status: done
- Notes for Claude: Single-permission routes still require their exact permission; admin shell accepts `anyOf={ADMIN_PERMISSIONS}`.

### R-165 · Task 10 · FILE_CREATED
- Path: `frontend/src/layouts/StoreLayout.jsx`
- Purpose: Provide the storefront header, navigation, icon links, and route outlet.
- Depends on: React Router, Logo, AuthContext, react-icons, and Task 4 design tokens.
- Used by: Public and customer routes.
- Status: done
- Notes for Claude: Gearnix-owned icons use react-icons. Admin link is shown only when any documented admin permission is present.

### R-166 · Task 10 · FILE_CREATED
- Path: `frontend/src/layouts/AdminLayout.jsx`
- Purpose: Provide an admin header, placeholder sidebar, and route outlet.
- Depends on: React Router, Logo, and react-icons.
- Used by: `/admin` and its child routes.
- Status: done
- Notes for Claude: Sidebar remains a placeholder as requested; a store link uses a react-icons icon.

### R-167 · Task 10 · FILE_CREATED
- Path: `frontend/src/pages/public/PlaceholderPage.jsx`
- Purpose: Render named placeholder content for Phase 1 routes.
- Depends on: Tailwind design tokens.
- Used by: All documented placeholder routes.
- Status: done
- Notes for Claude: Task 11 will replace the login placeholder with a functional page.

### R-168 · Task 10 · FILE_CHANGED
- Path: `frontend/src/App.jsx`
- Purpose: Define the documented public, customer, and admin route tree.
- Depends on: React Router, route guards, layouts, permissions, and placeholder page.
- Used by: `frontend/src/main.jsx`.
- Status: done
- Notes for Claude: Customer routes require login. Admin root accepts any admin permission; users, roles, categories, products, and blogs require their respective read permission. All routes are placeholders; no API calls are made from pages.

### R-169 · Task 10 · FILE_CHANGED
- Path: `frontend/src/main.jsx`
- Purpose: Wrap the app with BrowserRouter.
- Depends on: React Router.
- Used by: All route components.
- Status: done
- Notes for Claude: BrowserRouter wraps AuthProvider so route guards and layouts can access navigation.

### R-170 · Task 10 · COMMAND
- Path: `frontend/`
- Purpose: Build the route tree and layout shells.
- Depends on: Task 10 frontend implementation.
- Used by: Task 10 validation.
- Status: done
- Notes for Claude: Ran `npm run build`; passed.

### R-171 · Task 10 · COMMAND
- Path: `frontend/`
- Purpose: Lint the route tree and layout shells.
- Depends on: Task 10 frontend implementation.
- Used by: Task 10 validation.
- Status: done
- Notes for Claude: Ran `npm run lint`; passed.

### R-172 · Task 10 · COMMAND
- Path: `frontend/`
- Purpose: Start Vite for browser route checks.
- Depends on: Task 10 frontend implementation.
- Used by: `R-173` and `R-174`.
- Status: done
- Notes for Claude: Ran `npm run dev -- --host 127.0.0.1`; Vite served on port 5173.

### R-173 · Task 10 · TEST
- Path: `frontend/src/App.jsx`
- Purpose: Verify a public product detail route renders inside StoreLayout.
- Depends on: `R-165`, `R-167`, `R-168`, and `R-172`.
- Used by: Task 10 browser verification.
- Status: done
- Notes for Claude: Navigated to `/products/keyboard`; the StoreLayout header and Product detail placeholder rendered. Browser runtime error tool returned no data.

### R-174 · Task 10 · TEST
- Path: `frontend/src/App.jsx`
- Purpose: Verify an unauthenticated guest cannot enter the admin route.
- Depends on: `R-157`, `R-158`, `R-164`, and `R-168`.
- Used by: Task 10 browser verification.
- Status: done
- Notes for Claude: Navigated to `/admin`; RequireLogin redirected to `/login`.

### R-175 · Task 10 · FILE_CHANGED
- Path: `docs/report.md`
- Purpose: Record Task 10 routes, layouts, tests, and current route map.
- Depends on: Task 10 implementation and verification.
- Used by: Copilot and Claude.
- Status: done
- Notes for Claude: Task 10 entries are R-163 through R-176.

### R-176 · Task 10 · FILE_CHANGED
- Path: `docs/progress.md`
- Purpose: Mark Task 10 complete after adding matching report entries.
- Depends on: `R-175`.
- Used by: Project progress tracking.
- Status: done
- Notes for Claude: Task 11 Login remains not started and is intentionally next.

### R-177 · Task 11 · FILE_CREATED
- Path: `frontend/src/pages/public/LoginPage.jsx`
- Purpose: Provide the Gearnix login form and successful sign-in redirects.
- Depends on: AuthContext, shadcn Button/Input/Label, and permission constants.
- Used by: `/login`.
- Status: done
- Notes for Claude: Email and password are labeled and autocomplete-enabled; submission feedback is shown accessibly. The return destination is restricted to safe internal paths.

### R-178 · Task 11 · FILE_CHANGED
- Path: `frontend/src/App.jsx`
- Purpose: Replace the login placeholder route with the functional login page.
- Depends on: `R-177`.
- Used by: React Router.
- Status: done
- Notes for Claude: Other routes remain unchanged.

### R-179 · Task 11 · API_CALL
- Path: `frontend/src/auth/AuthContext.jsx`
- Purpose: Authenticate and retrieve the signed-in user's permission keys.
- Depends on: `frontend/src/api/client.js` and `VITE_API_URL`.
- Used by: `frontend/src/pages/public/LoginPage.jsx`.
- Status: done
- Notes for Claude: Login calls `POST /auth/login`; AuthContext then calls `GET /users/me`. Both requests use the shared API client and cookie credentials.

### R-180 · Task 11 · DECISION
- Path: `frontend/src/pages/public/LoginPage.jsx`
- Purpose: Choose safe post-login destinations.
- Depends on: Permission keys and the protected route's `from` location.
- Used by: Login redirect handling.
- Status: done
- Notes for Claude: Honor a safe internal `from` path when present; otherwise send users with any documented admin permission to `/admin` and other users to `/`.

### R-181 · Task 11 · FILE_CHANGED
- Path: `frontend/src/constants/site.js`
- Purpose: Record that the newsletter is a frontend-only decorative demo.
- Depends on: User decision.
- Used by: Future storefront/footer UI.
- Status: done
- Notes for Claude: `SITE.features.newsletter` is enabled for presentation only. Do not add a backend endpoint or persist subscriber data.

### R-182 · Task 11 · DECISION
- Path: `docs/report.md`
- Purpose: Resolve open footer decisions using the user's instruction to make conservative assumptions.
- Depends on: User direction.
- Used by: `SITE` constants and future storefront work.
- Status: done
- Notes for Claude: A-001: newsletter is demo-only and has no backend storage. A-002: Gift Cards remain disabled. A-003: no real address was supplied, so keep its TODO placeholder. A-004: no social URLs were supplied, so keep them empty. A-005: no phone or email was supplied, so keep their TODO placeholders. Do not invent business contact information.

### R-183 · Task 11 · COMMAND
- Path: `frontend/`
- Purpose: Build the frontend after implementing the login page.
- Depends on: `R-177` and `R-178`.
- Used by: Task 11 verification.
- Status: done
- Notes for Claude: `npm run build` passed.

### R-184 · Task 11 · COMMAND
- Path: `frontend/`
- Purpose: Lint the frontend after implementing the login page.
- Depends on: `R-177` and `R-178`.
- Used by: Task 11 verification.
- Status: done
- Notes for Claude: `npm run lint` passed.

### R-185 · Task 11 · TEST
- Path: `frontend/src/pages/public/LoginPage.jsx`
- Purpose: Verify normal-user login, admin redirect, and readable login failure feedback.
- Depends on: `R-177` through `R-180`.
- Used by: Task 11 acceptance check.
- Status: done
- Notes for Claude: Browser checks used mocked API responses: a regular user reached `/`, a user with `user.read` reached `/admin`, and a 401 login response showed its `message`. No uncaught page errors occurred. The mock's intentional refresh 401 responses appeared as network errors in the browser console; no live backend login was exercised.

### R-186 · Task 11 · DECISION
- Path: `docs/progress.md`
- Purpose: Define numbered work items for the requested Tasks 11–20 from the documented phase deliverables.
- Depends on: `docs/phases.md` and `docs/architecture.md`.
- Used by: Task tracking through Task 20.
- Status: done
- Notes for Claude: Task 11 login; Task 12 Super Admin dashboard; Task 13 users list/search/filter; Task 14 role change/history; Task 15 roles and permissions list; Task 16 role permission editing and locked-role state; Task 17 permission-aware sidebar; Task 18 category management; Task 19 product list/search/pagination; Task 20 product form and image management. This is a task breakdown, not a change to the phase scope.

### R-187 · Task 12 · ISSUE
- Path: `backend/src/routes/order.route.js`
- Purpose: Record the backend API blocker for the documented Super Admin dashboard counts.
- Depends on: Phase 2 dashboard requirement for user, product, and order counts.
- Used by: Task 12 planning.
- Status: blocked
- Notes for Claude: The existing `/api/orders` list is customer-scoped and guarded by `order.manage`; no admin aggregate/dashboard endpoint or all-orders permission route exists. Showing the customer's orders as the store-wide count would be misleading. Backend is out of scope and remains untouched; wait for the user to choose whether to authorize a backend addition or change the dashboard requirement.

### R-188 · Task 11 · FILE_CHANGED
- Path: `docs/report.md`
- Purpose: Record Task 11 implementation, validation, user decisions, and the Task 12 blocker.
- Depends on: `R-177` through `R-187`.
- Used by: Copilot and Claude.
- Status: done
- Notes for Claude: Entries R-177–R-187 document this work. A-001–A-005 are user-provided resolutions to Q-001–Q-005; the conservative unresolved real-world contact values remain placeholders.

### R-189 · Task 11 · FILE_CHANGED
- Path: `docs/progress.md`
- Purpose: Mark Task 11 complete and Task 12 blocked after recording the matching report entries.
- Depends on: `R-188`.
- Used by: Project progress tracking.
- Status: done
- Notes for Claude: No Task 12 implementation was started because it would require an out-of-scope backend API change or a user-approved reduction in dashboard scope.

### R-190 · Task 12 · FILE_CREATED
- Path: `frontend/src/pages/admin/DashboardPage.jsx`
- Purpose: Show user and product totals when the current user's permission allows each total.
- Depends on: User and product list endpoints and permission constants.
- Used by: `/admin`.
- Status: done
- Notes for Claude: The order card explicitly reports that no admin-wide count is available; no customer-scoped order data is presented as a store-wide total.

### R-191 · Task 12 · API_CALL
- Path: `frontend/src/api/users.api.js`
- Purpose: Read the total user count from the existing paginated users endpoint.
- Depends on: `user.read`.
- Used by: Admin dashboard and users page.
- Status: done
- Notes for Claude: Dashboard requests page 1 with limit 1 and uses the server's pagination total.

### R-192 · Task 12 · API_CALL
- Path: `frontend/src/api/catalog.api.js`
- Purpose: Read the total product count from the existing admin product endpoint.
- Depends on: `product.read`.
- Used by: Admin dashboard and products page.
- Status: done
- Notes for Claude: Dashboard requests page 1 with limit 1 and uses the server's pagination total.

### R-193 · Task 12 · ISSUE
- Path: `backend/src/routes/order.route.js`
- Purpose: Preserve the blocker for the required store-wide order count.
- Depends on: An admin-wide aggregate API.
- Used by: Dashboard task completion.
- Status: blocked
- Notes for Claude: Existing order listing is customer-scoped; no backend routes or data were changed. Task 12 remains incomplete until an authorized backend endpoint or a revised dashboard requirement is provided.

### R-194 · Task 13 · FILE_CREATED
- Path: `frontend/src/api/users.api.js`
- Purpose: Query users by page, search text, and role filter.
- Depends on: `GET /users` and `frontend/src/api/client.js`.
- Used by: Users page and dashboard user count.
- Status: done
- Notes for Claude: Query parameters match backend validation (`page`, `limit`, `role_id`, `search`); response shape is checked explicitly.

### R-195 · Task 13 · FILE_CREATED
- Path: `frontend/src/pages/admin/UsersPage.jsx`
- Purpose: Display paginated users with email/username search and role filtering.
- Depends on: `R-194` and `frontend/src/api/roles.api.js`.
- Used by: `/admin/users`.
- Status: done
- Notes for Claude: Role filter and role choices are loaded only when `role.read` is present. Loading, empty, error, and result states are provided.

### R-196 · Task 14 · API_CALL
- Path: `frontend/src/api/users.api.js`
- Purpose: Assign a selected role to a user.
- Depends on: `PATCH /users/:id/role` and `user.update_role`.
- Used by: Users page.
- Status: done
- Notes for Claude: Sends the validated `role_id` and optional empty reason through the shared client; backend messages are displayed.

### R-197 · Task 14 · ISSUE
- Path: `backend/src/routes/user.route.js`
- Purpose: Record that role history cannot currently be read by the frontend.
- Depends on: An authenticated, permission-checked history endpoint.
- Used by: User role history display.
- Status: blocked
- Notes for Claude: A database model/procedure exists, but there is no controller/service/router entry exposing history. The UI states this limitation instead of fabricating history. Backend was not changed.

### R-198 · Task 15 · API_CALL
- Path: `frontend/src/api/roles.api.js`
- Purpose: Fetch roles with their permissions and user counts.
- Depends on: `GET /roles` and `role.read`.
- Used by: Roles page and user role filter.
- Status: done
- Notes for Claude: Validates the returned roles array before use.

### R-199 · Task 15 · FILE_CREATED
- Path: `frontend/src/pages/admin/RolesPage.jsx`
- Purpose: List role descriptions, status, user counts, permissions, and locked state.
- Depends on: `R-198`.
- Used by: `/admin/roles`.
- Status: done
- Notes for Claude: Locked state uses the backend `is_locked` property, not role-name checks.

### R-200 · Task 16 · API_CALL
- Path: `frontend/src/api/roles.api.js`
- Purpose: Replace a role's permission set through the backend.
- Depends on: `PATCH /roles/:id/permissions` and `role.update`.
- Used by: Roles page.
- Status: done
- Notes for Claude: The editor disables locked/inactive roles and requires the `role.update` permission.

### R-201 · Task 17 · FILE_CHANGED
- Path: `frontend/src/layouts/AdminLayout.jsx`
- Purpose: Replace the sidebar placeholder with responsive, permission-filtered admin navigation.
- Depends on: `AuthContext` and documented permission constants.
- Used by: Admin routes.
- Status: done
- Notes for Claude: Gearnix-owned navigation icons use `react-icons`; a browser check confirmed a product-only user sees only Dashboard and Products.

### R-202 · Task 18 · FILE_CREATED
- Path: `frontend/src/pages/admin/CategoriesPage.jsx`
- Purpose: List visible and hidden categories; create, rename, hide, and show them.
- Depends on: `frontend/src/api/catalog.api.js` and category permission keys.
- Used by: `/admin/categories`.
- Status: done
- Notes for Claude: Create/update controls are gated by permission constants. Deletion is not offered because the backend contract supports hiding categories.

### R-203 · Task 19 · FILE_CREATED
- Path: `frontend/src/pages/admin/ProductsPage.jsx`
- Purpose: Search and paginate all admin products, including hidden ones.
- Depends on: `GET /products/admin` and the shared client.
- Used by: `/admin/products`.
- Status: done
- Notes for Claude: Product visibility is represented and toggled through the existing update endpoint.

### R-204 · Task 20 · FILE_CHANGED
- Path: `frontend/src/pages/admin/ProductsPage.jsx`
- Purpose: Create and edit products, manage categories/visibility, and upload, delete, or select primary images.
- Depends on: Existing product/category endpoints and `product.create`/`product.update`.
- Used by: Products page editor.
- Status: done
- Notes for Claude: Validates image count, MIME type, and 2 MB per-file limits client-side; backend validation remains authoritative. The public product detail endpoint omits hidden products, so hidden product editing falls back to only fields available from the admin list until the product is made visible. Product deletion itself is not exposed; visibility is toggled.

### R-205 · Task 20 · FILE_CREATED
- Path: `frontend/src/api/catalog.api.js`
- Purpose: Centralize category and product list/detail/create/update/image requests.
- Depends on: `frontend/src/api/client.js`.
- Used by: Dashboard, categories, and products pages.
- Status: done
- Notes for Claude: Includes multipart product image upload with the backend's `images` field and routes for primary selection and deletion.

### R-206 · Tasks 12–20 · FILE_CHANGED
- Path: `frontend/src/App.jsx`
- Purpose: Replace admin placeholders for dashboard, users, roles, categories, and products with task pages.
- Depends on: Permission guards and admin page components.
- Used by: React Router.
- Status: done
- Notes for Claude: Existing per-route `RequirePermission` checks remain in place.

### R-207 · Tasks 12–20 · COMMAND
- Path: `backend/`
- Purpose: Start the existing local backend for a login verification attempt.
- Depends on: Existing backend dependencies and local environment.
- Used by: Attempted local admin login.
- Status: done
- Notes for Claude: Ran `npm run dev`; MySQL connected and health endpoint returned HTTP 200. No backend source was changed.

### R-208 · Tasks 12–20 · COMMAND
- Path: `frontend/`
- Purpose: Start Vite against the local API for login and browser checks.
- Depends on: Existing frontend dependencies.
- Used by: Login and admin page verification.
- Status: done
- Notes for Claude: Ran `$env:VITE_API_URL='http://127.0.0.1:5000/api'; npm run dev -- --host 127.0.0.1 --port 5173 --strictPort`. No `.env` file was created.

### R-209 · Task 11 · TEST
- Path: `frontend/src/pages/public/LoginPage.jsx`
- Purpose: Attempt local sign-in with the user-supplied admin credential alternatives.
- Depends on: Local backend and the login form.
- Used by: Real API verification.
- Status: blocked
- Notes for Claude: Both attempts were rejected by the backend with `Internal Server Error`; no credentials were saved in source, environment files, or this report. Live admin verification and real mutations could not be performed.

### R-210 · Tasks 12–20 · TEST
- Path: `frontend/src/pages/admin/`
- Purpose: Smoke-test admin routes and controls against mocked API responses.
- Depends on: Admin pages and route guards.
- Used by: Frontend validation.
- Status: done
- Notes for Claude: Browser confirmed dashboard totals render, the orders gap is explicit, user/role/category/product screens render, locked role controls are disabled, the product editor loads, and permission-filtered navigation works. No uncaught page errors or console errors occurred in the final mock run. Mutations were not sent to the real backend.

### R-211 · Tasks 12–20 · COMMAND
- Path: `frontend/`
- Purpose: Build the frontend after admin page implementation.
- Depends on: Admin pages and API modules.
- Used by: Frontend validation.
- Status: done
- Notes for Claude: `npm run build` passed.

### R-212 · Tasks 12–20 · COMMAND
- Path: `frontend/`
- Purpose: Lint the frontend after admin page implementation.
- Depends on: Admin pages and API modules.
- Used by: Frontend validation.
- Status: done
- Notes for Claude: `npm run lint` passed after fixing component state/effect issues.

### R-213 · Tasks 12–20 · FILE_CHANGED
- Path: `docs/report.md`
- Purpose: Log implementation, API calls, limitations, and validation for Tasks 12–20.
- Depends on: `R-190` through `R-212`.
- Used by: Copilot and Claude.
- Status: done
- Notes for Claude: The shared map is updated; Task 12, 14 history, and hidden-product detail limits remain explicitly blocked rather than overstated.

### R-214 · Tasks 12–20 · FILE_CHANGED
- Path: `docs/progress.md`
- Purpose: Record task statuses and API/login blockers after matching report entries.
- Depends on: `R-213`.
- Used by: Project progress tracking.
- Status: done
- Notes for Claude: Tasks 13, 15–19 are complete; Task 12, Task 14 history, and part of Task 20 remain blocked. No backend change was made.

### R-215 · Tasks 12–20 · TEST
- Path: `frontend/src/pages/admin/`
- Purpose: Recheck admin pages, permission navigation, locked-role state, and hidden product handling after refinements.
- Depends on: Admin pages and API modules.
- Used by: Final UI verification.
- Status: done
- Notes for Claude: Mocked browser run confirmed the dashboard's visible order-count limitation; users, roles, and categories render; only allowed sidebar items show for a product-only permission set; locked permissions are disabled; hidden products appear and show the documented limited-edit warning. No page errors or console errors occurred.

### R-216 · Tasks 12–20 · COMMAND
- Path: `frontend/`
- Purpose: Run the final production build after the last UI refinements.
- Depends on: `R-215`.
- Used by: Final verification.
- Status: done
- Notes for Claude: `npm run build` passed; 77 modules transformed.

### R-217 · Tasks 12–20 · COMMAND
- Path: `frontend/`
- Purpose: Run final lint after the last UI refinements.
- Depends on: `R-215`.
- Used by: Final verification.
- Status: done
- Notes for Claude: `npm run lint` passed.

### R-218 · Tasks 12–20 · FILE_CHANGED
- Path: `docs/report.md`
- Purpose: Add final test and validation results to the shared work log.
- Depends on: `R-215` through `R-217`.
- Used by: Copilot and Claude.
- Status: done
- Notes for Claude: Entry IDs remain sequential through R-218.

### R-219 · Tasks 12–20 · FILE_CHANGED
- Path: `docs/progress.md`
- Purpose: Keep task statuses aligned with the final report and limitations.
- Depends on: `R-218`.
- Used by: Project progress tracking.
- Status: done
- Notes for Claude: The report records all work before the progress status update; the order count, role history read, and full hidden-product editing remain blocked by existing API limits.

### R-220 · Task 21 · FILE_CREATED
- Path: `frontend/src/api/blogs.api.js`
- Purpose: Centralize public and admin blog list/detail, create/update, and cover-image requests.
- Depends on: `frontend/src/api/client.js`.
- Used by: Admin blog pages and public blog pages.
- Status: done
- Notes for Claude: All requests use the shared API client; list responses are checked for items and pagination.

### R-221 · Task 21 · API_CALL
- Path: `frontend/src/api/blogs.api.js`
- Purpose: Map frontend helpers to the documented blog endpoints.
- Depends on: The existing blog API.
- Used by: Blog admin and storefront.
- Status: done
- Notes for Claude: Uses `GET /blogs`, `GET /blogs/:slug`, `GET /blogs/admin`, `GET /blogs/admin/:id`, `POST /blogs`, and `PATCH /blogs/:id`.

### R-222 · Task 22 · FILE_CREATED
- Path: `frontend/src/pages/admin/BlogsPage.jsx`
- Purpose: List drafts and published posts with search, pagination, status badges, edit links, and publish controls.
- Depends on: `frontend/src/api/blogs.api.js`, `frontend/src/pages/admin/BlogEditor.jsx`.
- Used by: `/admin/blogs`.
- Status: done
- Notes for Claude: Route requires `blog.read`; real admin API actions were not end-to-end verified in this environment.

### R-223 · Task 23 · FILE_CREATED
- Path: `frontend/src/pages/admin/BlogEditor.jsx`
- Purpose: Create and edit posts with title, auto-generated/editable slug, excerpt, rich content, and draft/publish actions.
- Depends on: `frontend/src/api/blogs.api.js`, Tiptap, DOMPurify.
- Used by: `frontend/src/pages/admin/BlogsPage.jsx`.
- Status: done
- Notes for Claude: Sanitizes HTML before save; editing and publishing use existing blog endpoints.

### R-224 · Task 23 · DEPENDENCY
- Path: `frontend/package.json`
- Purpose: Install `@tiptap/react` version `^3.32.0` (installed `3.32.0`) for the blog editor.
- Depends on: Task 23 rich-text editor.
- Used by: `frontend/src/pages/admin/BlogEditor.jsx`.
- Status: done
- Notes for Claude: React integration for Tiptap.

### R-225 · Task 23 · DEPENDENCY
- Path: `frontend/package.json`
- Purpose: Install `@tiptap/starter-kit` version `^3.32.0` (installed `3.32.0`) for core editor nodes and marks.
- Depends on: Task 23 rich-text editor.
- Used by: `frontend/src/pages/admin/BlogEditor.jsx`.
- Status: done
- Notes for Claude: Includes the common formatting extensions used in the editor toolbar.

### R-226 · Task 23 · DEPENDENCY
- Path: `frontend/package.json`
- Purpose: Install `@tiptap/extension-link` version `^3.32.0` (installed `3.32.0`) for safe link editing.
- Depends on: Task 23 rich-text editor.
- Used by: `frontend/src/pages/admin/BlogEditor.jsx`.
- Status: done
- Notes for Claude: Link schemes are restricted in the editor to HTTP, HTTPS, and mailto.

### R-227 · Task 23 · DEPENDENCY
- Path: `frontend/package.json`
- Purpose: Install `@tiptap/extension-underline` version `^3.32.0` (installed `3.32.0`) for underline formatting.
- Depends on: Task 23 rich-text editor.
- Used by: `frontend/src/pages/admin/BlogEditor.jsx`.
- Status: done
- Notes for Claude: Used by the editor's formatting toolbar.

### R-228 · Task 23 · DEPENDENCY
- Path: `frontend/package.json`
- Purpose: Install `dompurify` version `^3.4.17` (installed `3.4.17`) to sanitize rich HTML before storage and display.
- Depends on: Task 23 rich-text editor.
- Used by: `frontend/src/pages/admin/BlogEditor.jsx`, `frontend/src/utils/sanitize.js`.
- Status: done
- Notes for Claude: Public rendering uses an explicit tag and attribute allowlist.

### R-229 · Task 23 · FILE_CHANGED
- Path: `frontend/package.json`
- Purpose: Record the rich-text editor and HTML-sanitization dependencies.
- Depends on: `R-224` through `R-228`.
- Used by: Frontend dependency installation.
- Status: done
- Notes for Claude: Added Tiptap React, StarterKit, Link, Underline, and DOMPurify.

### R-230 · Task 23 · FILE_CHANGED
- Path: `frontend/package-lock.json`
- Purpose: Lock the rich-text editor and HTML-sanitization dependency versions.
- Depends on: `R-229`.
- Used by: Reproducible frontend installs.
- Status: done
- Notes for Claude: Resolved package versions are listed in the Dependencies map.

### R-231 · Task 24 · FILE_CHANGED
- Path: `frontend/src/api/blogs.api.js`
- Purpose: Add blog cover upload and removal helpers.
- Depends on: `frontend/src/api/client.js`.
- Used by: `frontend/src/pages/admin/BlogEditor.jsx`.
- Status: done
- Notes for Claude: Upload uses multipart field `cover`; removal uses `DELETE /blogs/:id/cover`.

### R-232 · Task 24 · FILE_CHANGED
- Path: `frontend/src/pages/admin/BlogEditor.jsx`
- Purpose: Validate cover image type and size, upload it after post creation/update, and allow removal.
- Depends on: `R-231`.
- Used by: `/admin/blogs`.
- Status: done
- Notes for Claude: Accepts JPEG, PNG, and WebP up to 2 MB; server validation remains authoritative.

### R-233 · Task 25 · FILE_CREATED
- Path: `frontend/src/pages/public/HomePage.jsx`
- Purpose: Build the storefront landing page with hero, feature strip, promo/story blocks, featured products, latest stories, and scroll-to-top.
- Depends on: Public catalog and blog APIs; design tokens.
- Used by: `/`.
- Status: done
- Notes for Claude: Uses existing product/blog content; no invented store contact details or external assets.

### R-234 · Task 26 · FILE_CREATED
- Path: `frontend/src/components/shared/ProductCard.jsx`
- Purpose: Render reusable product cards with image fallback, rupee price, stock state, and add-to-cart/wishlist actions.
- Depends on: `frontend/src/api/customer.api.js`, `frontend/src/utils/media.js`.
- Used by: Home and product listing pages.
- Status: done
- Notes for Claude: Guests are redirected to login for customer actions; out-of-stock items cannot be added to cart.

### R-235 · Task 26 · FILE_CREATED
- Path: `frontend/src/pages/public/ProductsPage.jsx`
- Purpose: Provide public product search, category filtering, pagination, loading, empty, and error states.
- Depends on: `frontend/src/api/catalog.api.js`.
- Used by: `/products`.
- Status: done
- Notes for Claude: Category filter passes category slugs to the existing public API.

### R-236 · Task 26 · FILE_CHANGED
- Path: `frontend/src/api/catalog.api.js`
- Purpose: Add public product listing and slug-to-ID detail resolution using the public paginated list and existing numeric detail endpoint.
- Depends on: Existing product APIs.
- Used by: Home, public product list, and product detail.
- Status: done
- Notes for Claude: No backend route or endpoint was added.

### R-237 · Task 27 · FILE_CREATED
- Path: `frontend/src/pages/public/ProductDetailPage.jsx`
- Purpose: Show product gallery, categories, price, stock, description, cart action, and wishlist action.
- Depends on: `frontend/src/api/catalog.api.js`, `frontend/src/api/customer.api.js`.
- Used by: `/products/:slug`.
- Status: done
- Notes for Claude: Product slug resolution uses public listing data because the existing detail endpoint accepts numeric IDs.

### R-238 · Task 27 · FILE_CREATED
- Path: `frontend/src/api/customer.api.js`
- Purpose: Centralize cart and wishlist read/add/remove requests.
- Depends on: `frontend/src/api/client.js`.
- Used by: Product cards, product detail, and store header.
- Status: done
- Notes for Claude: Cart requests send `{ product_id, quantity }`; wishlist requests use the documented product routes.

### R-239 · Task 27 · FILE_CHANGED
- Path: `frontend/src/utils/media.js`
- Purpose: Resolve upload paths against the backend origin and provide rupee and date formatters.
- Depends on: `VITE_API_URL`.
- Used by: Product and blog pages.
- Status: done
- Notes for Claude: Upload paths are rooted at the API host, not appended beneath `/api`.

### R-240 · Task 28 · FILE_CREATED
- Path: `frontend/src/pages/public/BlogsPage.jsx`
- Purpose: List published stories with search, pagination, cover image fallbacks, and empty/error/loading states.
- Depends on: `frontend/src/api/blogs.api.js`.
- Used by: `/blogs`.
- Status: done
- Notes for Claude: Excerpt/date styling remains marked TODO-DESIGN.

### R-241 · Task 28 · FILE_CREATED
- Path: `frontend/src/pages/public/BlogDetailPage.jsx`
- Purpose: Render a published blog post and its cover, date, excerpt, and sanitized rich content.
- Depends on: `frontend/src/api/blogs.api.js`, `frontend/src/utils/sanitize.js`.
- Used by: `/blogs/:slug`.
- Status: done
- Notes for Claude: HTML passes through the sanitizer before insertion into the page.

### R-242 · Task 28 · FILE_CREATED
- Path: `frontend/src/utils/sanitize.js`
- Purpose: Sanitize public blog HTML using DOMPurify with a constrained formatting allowlist.
- Depends on: `dompurify`.
- Used by: `frontend/src/pages/public/BlogDetailPage.jsx`.
- Status: done
- Notes for Claude: Browser smoke test confirmed script and image elements were removed from the test fixture.

### R-243 · Task 29 · FILE_CHANGED
- Path: `frontend/src/layouts/StoreLayout.jsx`
- Purpose: Add responsive storefront header, cart/wishlist badges, mobile drawer and tabs, footer, and newsletter demo.
- Depends on: `frontend/src/constants/site.js`, `frontend/src/api/customer.api.js`.
- Used by: Storefront and customer routes.
- Status: done
- Notes for Claude: Contact/social values come from `SITE`; unset values are not invented. Mobile drawer details remain TODO-DESIGN.

### R-244 · Task 29 · DECISION
- Path: `frontend/src/layouts/StoreLayout.jsx`
- Purpose: Keep newsletter signup as a frontend-only demo interaction.
- Depends on: User decision recorded as A-001.
- Used by: Store footer.
- Status: done
- Notes for Claude: Submit shows an informational toast; no API call or subscriber data storage is added.

### R-245 · Task 30 · FILE_CHANGED
- Path: `frontend/src/App.jsx`
- Purpose: Wire the completed public storefront and admin blog pages to their documented routes.
- Depends on: Tasks 22 and 25–28.
- Used by: `frontend/src/main.jsx`.
- Status: done
- Notes for Claude: Blog admin is lazy-loaded; existing customer placeholder routes remain unchanged.

### R-246 · Task 29 · FILE_CHANGED
- Path: `frontend/src/main.jsx`
- Purpose: Mount the shared Sonner toaster for storefront feedback.
- Depends on: `sonner`.
- Used by: Global application layout.
- Status: done
- Notes for Claude: Toast messages are used for cart, wishlist, and demo newsletter feedback.

### R-247 · Task 30 · FILE_CHANGED
- Path: `frontend/index.html`
- Purpose: Set Gearnix page title, description, theme color, and supplied brand-mark favicon.
- Depends on: `frontend/public/brand/logo-mark.svg`.
- Used by: Browser document shell.
- Status: done
- Notes for Claude: Replaced Vite starter title and favicon.

### R-248 · Task 28 · TODO_DESIGN
- Path: `docs/design.md` section 12; `frontend/src/pages/public/BlogsPage.jsx`
- Purpose: Track unspecified excerpt and publication-date treatment.
- Depends on: Reference screenshots.
- Used by: Blog listing design follow-up.
- Status: pending
- Notes for Claude: Kept the content visible with a restrained fallback style and an inline TODO-DESIGN comment; no design value was guessed.

### R-249 · Task 30 · TODO_DESIGN
- Path: `docs/design.md` section 13A; `frontend/src/layouts/StoreLayout.jsx`
- Purpose: Track the unspecified mobile drawer layout.
- Depends on: Mobile reference screenshot.
- Used by: Store navigation design follow-up.
- Status: pending
- Notes for Claude: Drawer is a simple provisional navigation and is explicitly marked TODO-DESIGN in source.

### R-250 · Task 27 · ISSUE
- Path: `frontend/src/pages/public/ProductDetailPage.jsx`
- Purpose: Record the local product-image delivery limitation observed during browser verification.
- Depends on: Existing backend upload serving and product image data.
- Used by: Product detail verification.
- Status: blocked
- Notes for Claude: The local API referenced `/uploads/product-images/t-3.jpg`; that URL returned HTTP 404 and the response included `Cross-Origin-Resource-Policy: same-origin`. Backend files were not changed. Product data/listing rendered, but actual image delivery needs backend/data investigation.

### R-251 · Task 30 · COMMAND
- Path: `frontend/`
- Purpose: Start Vite for browser smoke tests with `npm run dev -- --host 127.0.0.1`.
- Depends on: Installed frontend dependencies.
- Used by: Browser verification.
- Status: done
- Notes for Claude: The development server responded with HTTP 200 on the Vite entry page.

### R-252 · Task 30 · COMMAND
- Path: `frontend/`
- Purpose: Run `npm run lint`.
- Depends on: Current frontend source.
- Used by: Final validation.
- Status: done
- Notes for Claude: Final lint run passed.

### R-253 · Task 30 · COMMAND
- Path: `frontend/`
- Purpose: Run `npm run build`.
- Depends on: Current frontend source.
- Used by: Final validation.
- Status: done
- Notes for Claude: Final Vite production build passed without a chunk-size warning.

### R-254 · Tasks 21–30 · COMMAND
- Path: `frontend/`
- Purpose: Inspect installed versions with `npm list --depth=0`.
- Depends on: Frontend package installation.
- Used by: Dependency report.
- Status: done
- Notes for Claude: Resolved package versions are recorded in the Dependencies map.

### R-255 · Task 30 · TEST
- Path: Storefront browser smoke test
- Purpose: Check home, public product list, mobile drawer/tabs, and responsive width against the running Vite app.
- Depends on: `R-233` through `R-247`.
- Used by: Task 30 acceptance check.
- Status: done
- Notes for Claude: Home and product listing rendered against the local public API; at 390px there was no horizontal overflow, the mobile drawer opened, and opening Newsletters closed Contact us. Product image delivery is separately blocked by `R-250`.

### R-256 · Task 28 · TEST
- Path: `frontend/src/pages/public/BlogDetailPage.jsx`
- Purpose: Verify blog HTML is sanitized before rendering.
- Depends on: `R-242`.
- Used by: Public blog detail.
- Status: done
- Notes for Claude: A browser fixture containing script and image elements rendered safe text only; both element counts were zero.

### R-257 · Tasks 22–24 · ISSUE
- Path: `frontend/src/pages/admin/BlogsPage.jsx`
- Purpose: Record that authenticated admin blog API flows could not be validated against the local backend.
- Depends on: Valid local admin session and available backend.
- Used by: Admin blog acceptance verification.
- Status: blocked
- Notes for Claude: Build and lint passed, but the available local auth refresh returned 401 and the prior admin login attempt returned a server error. No credentials were persisted; no backend files were changed.

### R-258 · Tasks 21–30 · FILE_CHANGED
- Path: `docs/progress.md`
- Purpose: Record the Tasks 21–30 status and product-image blocker after report entries were added.
- Depends on: `R-220` through `R-257`.
- Used by: Project progress tracking.
- Status: done
- Notes for Claude: Task 27 remains partial pending image availability; Task 31 was not started.

### R-259 · Tasks 21–30 · FILE_CHANGED
- Path: `docs/report.md`
- Purpose: Append the implementation, dependency, validation, and issue log for Tasks 21–30.
- Depends on: `R-220` through `R-258`.
- Used by: Copilot and Claude.
- Status: done
- Notes for Claude: IDs continue sequentially from R-219; backend worktree changes remain untouched.

### R-260 · Task 11 · ISSUE
- Path: `frontend/src/pages/public/LoginPage.jsx`
- Purpose: Correct the task status to reflect that live authentication is not verified.
- Depends on: `R-185` and `R-209`.
- Used by: Phase 1 status tracking.
- Status: blocked
- Notes for Claude: R-185 tested only mocked login outcomes. R-209 records both local admin credential attempts returning `Internal Server Error`; successful live login remains unverified.

### R-261 · Task 12 · ISSUE
- Path: `frontend/src/pages/admin/DashboardPage.jsx`
- Purpose: Correct the dashboard task status to partial because the required all-orders count remains unavailable.
- Depends on: `R-187`, `R-190`, and `R-193`.
- Used by: Phase 2 status tracking.
- Status: blocked
- Notes for Claude: Dashboard frontend exists and displays the available user/product counts. No all-orders aggregate endpoint exists, so the order total remains blocked.

### R-262 · Tasks 22–24 · ISSUE
- Path: `frontend/src/pages/admin/BlogsPage.jsx`; `frontend/src/pages/admin/BlogEditor.jsx`
- Purpose: Correct blog admin task statuses to partial pending live backend verification.
- Depends on: `R-222`, `R-223`, `R-232`, and `R-257`.
- Used by: Phase 4 status tracking.
- Status: blocked
- Notes for Claude: The implementation is present and build/lint passed, but the admin blog list, editor mutations, cover upload/removal, and publishing were not verified against a live authenticated backend.

### R-263 · Task 27 · ISSUE
- Path: `frontend/src/pages/public/ProductDetailPage.jsx`
- Purpose: Keep product detail marked partial because real product image delivery is blocked.
- Depends on: `R-237`, `R-239`, and `R-250`.
- Used by: Phase 5 status tracking.
- Status: blocked
- Notes for Claude: Product detail UI and API integration exist, but the referenced uploaded image returns 404 and the response has `Cross-Origin-Resource-Policy: same-origin`.

### R-264 · Task 30 · TODO_DESIGN
- Path: `docs/design.md` section 13A; `frontend/src/layouts/StoreLayout.jsx`
- Purpose: Preserve the responsive verification limitations in the Task 30 status.
- Depends on: `R-249` and `R-250`.
- Used by: Phase 5 status tracking.
- Status: pending
- Notes for Claude: Task 30 verification notes must retain both the product image delivery blocker (R-250) and the mobile drawer's unresolved TODO-DESIGN state (R-249).

### R-265 · Map Q-003–Q-005 · DECISION
- Path: `docs/report.md` Map
- Purpose: Align the open-question status values with the recorded user decisions.
- Depends on: Answers A-003, A-004, and A-005.
- Used by: Shared report Map.
- Status: done
- Notes for Claude: Q-003 is resolved by A-003; Q-004 by A-004; Q-005 by A-005. The business values remain intentionally unset.

### R-266 · Tasks 11–30 · FILE_CHANGED
- Path: `docs/progress.md`
- Purpose: Correct task summaries and statuses to match the verification evidence.
- Depends on: `R-260` through `R-265`.
- Used by: Project progress tracking.
- Status: done
- Notes for Claude: Task 11, Task 12, Tasks 22–24, Task 27, and Task 30 are represented with the requested partial/blocker notes.

### R-267 · Tasks 11–30 · FILE_CHANGED
- Path: `docs/report.md`
- Purpose: Record the status reconciliation and Q-003–Q-005 Map resolutions without rewriting earlier log entries.
- Depends on: `R-260` through `R-266`.
- Used by: Copilot and Claude.
- Status: done
- Notes for Claude: Existing historical entries remain unchanged; this reconciliation is appended as R-260–R-267.

### R-268 · Backend login diagnosis · TEST
- Path: `POST /api/auth/login`
- Purpose: Reproduce login using the active, verified `test_user1` test account and the supplied test credentials.
- Depends on: Backend running via `npm run dev`; active database `gearnix`.
- Used by: Auth login verification.
- Status: done
- Notes for Claude: Before the fix, HTTP 200 (expected 200). Body: `{"success":true,"message":"Login successful","data":{"user":{"user_id":2,"username":"test_user1","role_id":3,"role_name":"Product Admin","profile_image":null},"access_token":"[REDACTED]"}}`; the account email and token are omitted.

### R-269 · Backend login diagnosis · TEST
- Path: `POST /api/auth/login`
- Purpose: Reproduce login for the same test account with an incorrect password.
- Depends on: `R-268`.
- Used by: Auth error-status verification.
- Status: done
- Notes for Claude: Before the fix, HTTP 500 (expected 401). Response body was Express's HTML error page containing `Error: Invalid email or password`. Stack: `at loginUser (file:///C:/Internship/Gearnix/backend/src/services/auth.service.js:160:15)` then `at async login (file:///C:/Internship/Gearnix/backend/src/controllers/auth.controller.js:120:44)`. No password was recorded.

### R-270 · Backend login diagnosis · TEST
- Path: `POST /api/auth/login`
- Purpose: Reproduce login for an unknown email.
- Depends on: `R-268`.
- Used by: Auth error-status verification.
- Status: done
- Notes for Claude: Before the fix, HTTP 500 (expected 401). Response body was Express's HTML error page containing `Error: Invalid email or password`. Stack: `at loginUser (file:///C:/Internship/Gearnix/backend/src/services/auth.service.js:143:15)` then `at async login (file:///C:/Internship/Gearnix/backend/src/controllers/auth.controller.js:120:44)`. The terminal error's first line was `Error: Invalid email or password`.

### R-271 · Backend login diagnosis · TEST
- Path: `POST /api/auth/login`
- Purpose: Check whether an unverified account is available for the conditional login test.
- Depends on: Read-only query against active database `gearnix`.
- Used by: Auth verification.
- Status: done
- Notes for Claude: No non-deleted user with `is_email_verified = 0` exists, so request (d) was not sent; its conditional expected 403 could not be exercised live.

### R-272 · Backend login diagnosis · TEST
- Path: `GET /api/users/me`
- Purpose: Verify the access token returned by the successful test login.
- Depends on: `R-268`.
- Used by: Authenticated user verification.
- Status: done
- Notes for Claude: Before the fix, HTTP 200 (expected 200). Response body reported `success: true`, `message: "Current user fetched successfully"`, and the `test_user1` profile with permissions; email omitted.

### R-273 · Backend login diagnosis · TEST
- Path: `POST /api/auth/refresh`
- Purpose: Verify refresh using the httpOnly cookie returned by the successful test login.
- Depends on: `R-268`.
- Used by: Session refresh verification.
- Status: done
- Notes for Claude: Before the fix, HTTP 200 (expected 200). Response body: `{"success":true,"message":"Session refreshed","data":{"access_token":"[REDACTED]","user":{"user_id":2,"role_id":3,"role_name":"Product Admin"}}}`. Cookie and token were kept in memory only.

### R-274 · Backend login diagnosis · ISSUE
- Path: `backend/src/app.js`; `backend/src/controllers/auth.controller.js`
- Purpose: Document the error-to-status behavior used by login.
- Depends on: Inspection of the mounted routes and controller error flow.
- Used by: Root-cause analysis.
- Status: done
- Notes for Claude: `app.js` defines no custom global `app.use((err, req, res, next) => ...)` middleware. `login` passes exceptions to `next(error)`; Express's default handler uses the error's status/statusCode when valid and otherwise responds 500. The default development response is HTML and includes the stack. The plain `Error` objects from login had no statusCode, explaining the observed 500s.

### R-275 · Backend login diagnosis · TEST
- Path: Active database `gearnix` · `information_schema.ROUTINES`
- Purpose: Check whether any of the requested stored procedures are missing.
- Depends on: Read-only database connection from backend configuration.
- Used by: Database failure exclusion.
- Status: done
- Notes for Claude: Compared the complete user-supplied procedure list to the procedures in the active `gearnix` database (the read-only equivalent of `SHOW PROCEDURE STATUS WHERE Db = 'gearnix'`). Missing procedures: none. No procedure or data was changed.

### R-276 · Backend login diagnosis · COMMAND
- Path: `backend/`
- Purpose: Start the backend, execute the before/after HTTP matrices, inspect database procedure metadata, and syntax-check the changed service.
- Depends on: Existing backend dependencies and local environment configuration.
- Used by: Reproduction and verification.
- Status: done
- Notes for Claude: Ran `npm run dev`; used an inline Node fetch/database probe for requests (a)–(f) and the read-only procedure check; ran `node --check src\\services\\auth.service.js`. Startup output confirmed MySQL connected and the server listened on port 5000. No credentials or tokens were saved.

### R-277 · Backend login diagnosis · FILE_CHANGED
- Path: `backend/src/services/auth.service.js`
- Purpose: Return correct HTTP statuses for login failures without changing messages or other login behavior.
- Depends on: `R-269`, `R-270`, and `R-274`.
- Used by: `POST /api/auth/login`.
- Status: done
- Notes for Claude: The wrong-password and unknown-user `Invalid email or password` errors now carry `statusCode = 401`; inactive and unverified account errors carry `statusCode = 403`. Messages remain unchanged. This fixes the 500s reproduced in requests (b) and (c). Neither the inactive nor unverified branch was live-exercised; no unverified account exists. Existing unrelated changes in this file were preserved.

### R-278 · Backend login diagnosis · TEST
- Path: `POST /api/auth/login`
- Purpose: Retest login using the active, verified `test_user1` test account and the supplied test credentials.
- Depends on: `R-277`.
- Used by: Auth login verification.
- Status: done
- Notes for Claude: After the fix, HTTP 200 (expected 200). Response body reported `success: true`, `message: "Login successful"`, the `test_user1` user object, and an access token; token and email omitted/redacted.

### R-279 · Backend login diagnosis · TEST
- Path: `POST /api/auth/login`
- Purpose: Retest login for the same test account with an incorrect password.
- Depends on: `R-277`.
- Used by: Auth error-status verification.
- Status: done
- Notes for Claude: After the fix, HTTP 401 (expected 401). The response remained Express's HTML error page and contained `Error: Invalid email or password`; no response shape was changed.

### R-280 · Backend login diagnosis · TEST
- Path: `POST /api/auth/login`
- Purpose: Retest login for an unknown email.
- Depends on: `R-277`.
- Used by: Auth error-status verification.
- Status: done
- Notes for Claude: After the fix, HTTP 401 (expected 401). The response remained Express's HTML error page and contained `Error: Invalid email or password`; no response shape was changed.

### R-281 · Backend login diagnosis · TEST
- Path: `POST /api/auth/login`
- Purpose: Retest the conditional unverified-account case.
- Depends on: `R-271` and `R-277`.
- Used by: Auth verification.
- Status: done
- Notes for Claude: Not sent; the database still has no non-deleted unverified account. Conditional case is unavailable for live verification, not a failed request.

### R-282 · Backend login diagnosis · TEST
- Path: `GET /api/users/me`
- Purpose: Retest the authenticated current-user request using the access token from the post-fix login.
- Depends on: `R-278`.
- Used by: Authenticated user verification.
- Status: done
- Notes for Claude: After the fix, HTTP 200 (expected 200). Response body reported `success: true` and `message: "Current user fetched successfully"`; token and email were not recorded.

### R-283 · Backend login diagnosis · TEST
- Path: `POST /api/auth/refresh`
- Purpose: Retest refresh using the cookie from the post-fix login.
- Depends on: `R-278`.
- Used by: Session refresh verification.
- Status: done
- Notes for Claude: After the fix, HTTP 200 (expected 200). Response body reported `success: true`, `message: "Session refreshed"`, the Product Admin user identity, and a redacted access token. Cookie and token remained in memory only.

### R-284 · Backend login diagnosis · FILE_CHANGED
- Path: `docs/report.md`
- Purpose: Record reproduction results, stack evidence, error handling, procedure audit, the fix, and retest outcomes.
- Depends on: `R-268` through `R-283`.
- Used by: Copilot and Claude.
- Status: done
- Notes for Claude: Entries R-268–R-283 document the requested diagnosis. No frontend or database files were changed.

### R-285 · Admin verification prerequisite · TEST
- Path: `POST /api/auth/login`
- Purpose: Check access for the previously supplied admin account before attempting live verification of all admin pages.
- Depends on: Backend login fix `R-277`.
- Used by: Storefront build prerequisite.
- Status: blocked
- Notes for Claude: Both previously supplied password candidates returned HTTP 401 with `Invalid email or password`. No password or email was recorded here. No admin pages were verified in this attempt.

### R-286 · Admin verification prerequisite · ISSUE
- Path: `frontend/src/pages/admin/`
- Purpose: Record why the storefront build remains gated.
- Depends on: A live session with permissions for every implemented admin area.
- Used by: Storefront build Steps 1–7.
- Status: blocked
- Notes for Claude: The working test login only exposes `category.*` and `product.*` permissions (R-268, R-272). It cannot verify all pages; Users, Roles, and Blogs require additional access. Storefront work has not started. Need an authorized all-permissions test session or user-provided narrower verification scope.

### R-287 · Admin live verification · TEST
- Path: `/admin`
- Purpose: Verify the dashboard loads using authenticated live backend requests.
- Depends on: User-authenticated shared browser session and backend running locally.
- Used by: Storefront build prerequisite.
- Status: done
- Notes for Claude: Dashboard rendered live totals of 6 users and 3 products; orders displayed the known unavailable aggregate message. The page loaded without a permission error.

### R-288 · Admin live verification · TEST
- Path: `/admin/users`
- Purpose: Verify the live users list and role options load for the authorized admin session.
- Depends on: Authenticated user session.
- Used by: Storefront build prerequisite.
- Status: done
- Notes for Claude: Rendered six live users and four role options, including the authorized admin account. Role-history column continues to disclose that no read endpoint exists (R-197). Search and role-filter interactions, and role mutation, were not exercised in this read-only page check.

### R-289 · Admin live verification · TEST
- Path: `/admin/roles`
- Purpose: Verify live roles and locked-role state.
- Depends on: Authenticated user session.
- Used by: Storefront build prerequisite.
- Status: done
- Notes for Claude: Live roles rendered: Customer, Blog Admin, Product Admin, and Super Admin. Super Admin showed the Locked badge and disabled permission fieldsets. No permission updates were submitted.

### R-290 · Admin live verification · TEST
- Path: `/admin/categories`
- Purpose: Verify live categories load.
- Depends on: Authenticated user session.
- Used by: Storefront build prerequisite.
- Status: done
- Notes for Claude: Two live categories rendered, with current names, slugs, and visible status. No category create/update/hide action was submitted.

### R-291 · Admin live verification · TEST
- Path: `/admin/products`
- Purpose: Verify live product list loads, including hidden-product visibility.
- Depends on: Authenticated user session.
- Used by: Storefront build prerequisite.
- Status: done
- Notes for Claude: Three live products rendered, including one hidden product; no product mutation or image operation was submitted.

### R-292 · Admin live verification · TEST
- Path: `/admin/blogs`
- Purpose: Verify the live admin blog list loads drafts and published posts.
- Depends on: Authenticated user session.
- Used by: Storefront build prerequisite.
- Status: done
- Notes for Claude: Three live posts rendered (two published and one draft); no create, edit, cover, or publish action was submitted.

### R-293 · Admin live verification · ISSUE
- Path: `docs/report.md` R-285–R-286
- Purpose: Supersede the prior access blocker with the completed live read-only page verification.
- Depends on: `R-287` through `R-292`.
- Used by: Storefront build prerequisite.
- Status: done
- Notes for Claude: The authorized session is now available in the shared browser and all implemented admin page routes have rendered live data. Read-only verification is complete; action/mutation flows were intentionally not modified.

### R-294 · Storefront Step 1 · ISSUE
- Path: `docs/reference/`
- Purpose: Record that no reference screenshots were available for the header implementation.
- Depends on: Storefront header specification in `docs/design.md`.
- Used by: Storefront visual implementation.
- Status: done
- Notes for Claude: The directory does not exist in this workspace. The written design specification was used as the visual source of truth.

### R-295 · Storefront Step 1 · COMPONENT
- Path: `frontend/src/components/shared/StoreHeader.jsx`
- Purpose: Add the responsive storefront header, desktop navigation menus, mobile drawer, and mobile accordions.
- Depends on: Existing logo, public catalog/blog APIs, shared media utilities, Motion.
- Used by: `frontend/src/layouts/StoreLayout.jsx`
- Status: done
- Notes for Claude: Uses the SVG wordmark and react-icons. Menus load live categories, products, and blogs through existing API modules. Home header overlays the hero, becomes solid after scrolling past 40px, and inner pages use a solid header. Motion and reduced-motion behavior are included.

### R-296 · Storefront Step 1 · FILE_CHANGED
- Path: `frontend/src/layouts/StoreLayout.jsx`
- Purpose: Replace the inline storefront header with the shared `StoreHeader` component.
- Depends on: `R-295`
- Used by: Public and customer routes using `StoreLayout`.
- Status: done
- Notes for Claude: Existing footer, mobile tab bar, and shared cart/wishlist count behavior remain in the layout.

### R-297 · Storefront Step 1 · DEPENDENCY
- Path: `frontend/package.json`
- Purpose: Add Motion for header dropdown and mobile drawer transitions.
- Depends on: Storefront header interaction requirements.
- Used by: `frontend/src/components/shared/StoreHeader.jsx`
- Status: done
- Notes for Claude: `motion@14.7.1` is the installed version.

### R-298 · Storefront Step 1 · FILE_CHANGED
- Path: `frontend/package.json`
- Purpose: Record the direct Motion dependency.
- Depends on: `R-297`
- Used by: Frontend package manager.
- Status: done
- Notes for Claude: The manifest range is `^14.7.1`.

### R-299 · Storefront Step 1 · FILE_CHANGED
- Path: `frontend/package-lock.json`
- Purpose: Lock Motion and its resolved transitive dependencies.
- Depends on: `R-297`
- Used by: Frontend package manager.
- Status: done
- Notes for Claude: Updated by npm during installation.

### R-300 · Storefront Step 1 · COMMAND
- Path: `frontend/`
- Purpose: Install Motion.
- Depends on: Storefront header transition requirements.
- Used by: `R-297` through `R-299`
- Status: done
- Notes for Claude: Ran `npm install motion`; resolved direct version is `14.7.1`.

### R-301 · Storefront Step 1 · TODO_DESIGN
- Path: `frontend/src/components/shared/StoreHeader.jsx`
- Purpose: Track the featured product image fallback (`TODO-ASSET`).
- Depends on: Product menu data from the public product API.
- Used by: Products mega menu when the product image is unavailable.
- Status: done
- Notes for Claude: Placeholder is a square 1:1 product cutout labeled `TODO-ASSET · featured product cutout · 1:1`. Product image delivery remains blocked as previously recorded in R-250.

### R-302 · Storefront Step 1 · TEST
- Path: `frontend/`
- Purpose: Validate frontend lint and production build after the header changes.
- Depends on: `R-295` and `R-296`
- Used by: Storefront Step 1 verification.
- Status: done
- Notes for Claude: `npm run lint` passed. `npm run build` passed (574 modules transformed); Vite emitted its existing large-chunk warning for the 618.72 kB main JS chunk.

### R-303 · Storefront Step 1 · TEST
- Path: Browser at 375px viewport
- Purpose: Verify the inner-page header and mobile navigation at a narrow viewport.
- Depends on: `R-295` and `R-296`
- Used by: Storefront Step 1 verification.
- Status: done
- Notes for Claude: At 375px, the inner header measured 60px, mobile controls and bottom tabs were visible, and there was no horizontal overflow. Opening the mobile drawer and Collections accordion displayed live categories.

### R-304 · Storefront Step 1 · TEST
- Path: Browser at 1440px viewport
- Purpose: Verify desktop header behavior, live menus, and the home header scroll state.
- Depends on: `R-295` and `R-296`
- Used by: Storefront Step 1 verification.
- Status: done
- Notes for Claude: Inner header measured 76px including its border, with no horizontal overflow. Home header was transparent at scroll position 0 and black after scrolling past 40px. The desktop navigation showed Home, Collections, Products, Pages, Blog; Collections and Products menus displayed live API content. Product-image fallback reflects the known backend limitation in R-250.

### R-305 · Storefront Step 1 · FILE_CHANGED
- Path: `docs/report.md`
- Purpose: Record Step 1 files, dependency, placeholder, tests, and component/dependency map updates.
- Depends on: `R-294` through `R-304`
- Used by: Shared build report.
- Status: done
- Notes for Claude: This entry records the report and Map updates for storefront Step 1. No Step 2 work was started.

### R-306 · Profile and login access · ISSUE
- Path: `frontend/src/pages/public/LoginPage.jsx`
- Purpose: Record why `/login` was not visible while the browser had an authenticated session.
- Depends on: AuthContext session restoration from the httpOnly refresh cookie.
- Used by: Profile and login access fix.
- Status: done
- Notes for Claude: Direct navigation to `/login` was redirected to `/admin` by the authenticated-only redirect. The session was restored from the existing browser cookie; this was not a role bypass or an unauthenticated login. The profile page had still been a placeholder, so the user had no visible sign-out action.

### R-307 · Profile and login access · FILE_CREATED
- Path: `frontend/src/pages/public/ProfilePage.jsx`
- Purpose: Replace the profile placeholder with a signed-in account details page and visible Log out action.
- Depends on: AuthContext user data and logout action.
- Used by: `/profile`
- Status: done
- Notes for Claude: Displays username, email, and role name from the current user response; no profile values or credentials are hard-coded.

### R-308 · Profile and login access · FILE_CHANGED
- Path: `frontend/src/App.jsx`
- Purpose: Wire the protected `/profile` route to `ProfilePage`.
- Depends on: `R-307`
- Used by: Authenticated customers and admins.
- Status: done
- Notes for Claude: Other public/customer routes are unchanged.

### R-309 · Profile and login access · FILE_CHANGED
- Path: `frontend/src/auth/AuthContext.jsx`
- Purpose: Clear local authentication state only after the server logout request succeeds.
- Depends on: `POST /auth/logout`
- Used by: Profile page and authenticated login page.
- Status: done
- Notes for Claude: Logout failures are surfaced to the caller and do not falsely present a successful sign-out while the server refresh cookie remains valid.

### R-310 · Profile and login access · FILE_CHANGED
- Path: `frontend/src/pages/public/LoginPage.jsx`
- Purpose: Keep `/login` visible during an existing session and improve sign-in error messages.
- Depends on: `R-309`
- Used by: `/login`
- Status: done
- Notes for Claude: An authenticated visitor now sees the current session and can log out to use another account, rather than being redirected away. HTTP 401 and 403 errors show clear account-safe messages instead of generic status text. Session restoration on app load remains unchanged.

### R-311 · Profile and login access · TEST
- Path: Browser `/profile` and `/login`
- Purpose: Verify live account details, logout, and guest login access.
- Depends on: `R-307` through `R-310`
- Used by: Profile and login access validation.
- Status: done
- Notes for Claude: The live profile rendered current username, email, and role. Clicking Log out successfully navigated to `/login`; reloading stayed on the login form, confirming the refresh session was ended. No credentials or tokens were recorded.

### R-312 · Profile and login access · TEST
- Path: Browser `/login`
- Purpose: Verify invalid-credential feedback without using a real account.
- Depends on: `R-310`
- Used by: Login error validation.
- Status: done
- Notes for Claude: A dummy unknown email request returned HTTP 401. The page remained on `/login` and displayed “Email or password is incorrect.” The dummy credentials were not saved or logged.

### R-313 · Profile and login access · TEST
- Path: Browser `/login` at 375px and 1440px
- Purpose: Check responsive layout after the login changes.
- Depends on: `R-310`
- Used by: Profile and login access validation.
- Status: done
- Notes for Claude: At both viewport widths, document scroll width matched client width; no horizontal overflow was observed.

### R-314 · Profile and login access · TEST
- Path: `frontend/`
- Purpose: Run frontend lint and production build after the account changes.
- Depends on: `R-307` through `R-310`
- Used by: Profile and login access validation.
- Status: done
- Notes for Claude: `npm run lint` passed. `npm run build` passed with 575 modules transformed; Vite retained its large-chunk warning for the 622.98 kB main JavaScript chunk.

### R-315 · Profile and login access · FILE_CHANGED
- Path: `docs/progress.md`
- Purpose: Mark Phase 6 as started while recording that customer account and checkout work is still incomplete.
- Depends on: `R-307` through `R-314`
- Used by: Project progress tracking.
- Status: done
- Notes for Claude: Only the initial profile and logout slice is implemented; the rest of Phase 6 remains pending.

### R-316 · Profile and login access · FILE_CHANGED
- Path: `docs/report.md`
- Purpose: Record the profile/login implementation, tests, and updated Map.
- Depends on: `R-306` through `R-315`
- Used by: Shared build report.
- Status: done
- Notes for Claude: This entry records the account work. No backend files were changed.

### R-317 · Profile and login access · FILE_CHANGED
- Path: `docs/progress.md`
- Purpose: Correct stale login status notes using the existing report evidence.
- Depends on: `R-277` through `R-285` and `R-312`
- Used by: Phase 1 login status tracking.
- Status: done
- Notes for Claude: Task 11 remains partial because valid sign-in with the supplied admin credentials is still unverified, but progress no longer attributes the blocker to the already-fixed 500 status handling.

### R-318 · Cross-origin uploaded images · ISSUE
- Path: `backend/src/app.js`
- Purpose: Identify the cause of browser image load errors for public blog PNGs.
- Depends on: `Helmet` security headers and the `/uploads` static route.
- Used by: Blog and product image rendering in the frontend.
- Status: done
- Notes for Claude: The image files exist and returned HTTP 200, but Helmet's default `Cross-Origin-Resource-Policy: same-origin` blocked them when the frontend at port 5173 embedded resources served from port 5000.

### R-319 · Cross-origin uploaded images · FILE_CHANGED
- Path: `backend/src/app.js`
- Purpose: Permit cross-origin embedding for public blog and product uploads only.
- Depends on: `R-318`
- Used by: Public blog/product image rendering from the Vite frontend.
- Status: done
- Notes for Claude: Middleware mounted at `/uploads` sets `Cross-Origin-Resource-Policy: cross-origin` only for `/blog-images/` and `/product-images/`; other upload paths keep Helmet's same-origin default. This is the requested targeted backend fix.

### R-320 · Cross-origin uploaded images · TEST
- Path: `/uploads/blog-images/blog-14-1793166724980-2490r1.png` and `/uploads/blog-images/blog-13-1792480034408-volb0g.png`
- Purpose: Confirm public image response status, MIME type, and CORP header.
- Depends on: `R-319`
- Used by: Cross-origin image verification.
- Status: done
- Notes for Claude: Both files exist, return HTTP 200 with `Content-Type: image/png`, and now return `Cross-Origin-Resource-Policy: cross-origin`. An existing product JPG endpoint has the same public policy. A nonexistent profile image path returned 404 and retained Helmet's `same-origin` default.

### R-321 · Cross-origin uploaded images · TEST
- Path: Browser `/blogs`
- Purpose: Verify real blog cover images render from the separate backend origin.
- Depends on: `R-319`
- Used by: Blog listing image display.
- Status: done
- Notes for Claude: Both PNGs loaded in the browser with non-zero natural widths (1917px and 1536px). No `ERR_BLOCKED_BY_RESPONSE.NotSameOrigin` errors were observed.

### R-322 · Cross-origin uploaded images · ISSUE
- Path: `/uploads/product-images/t-3.jpg`
- Purpose: Preserve the separate missing-product-file limitation from the fixed CORP issue.
- Depends on: Existing product image evidence in `R-250`
- Used by: Product detail page.
- Status: blocked
- Notes for Claude: The CORP policy is corrected for public product images, but `t-3.jpg` is not present in the local uploads directory and its URL still returns 404. This is a missing file/data reference, not a remaining cross-origin policy failure.

### R-323 · Cross-origin uploaded images · FILE_CHANGED
- Path: `docs/progress.md`
- Purpose: Update product-image status to distinguish the CORP fix from the missing product image file.
- Depends on: `R-318` through `R-322`
- Used by: Phase 5 progress tracking.
- Status: done
- Notes for Claude: Task 27 remains partial because the API-referenced `t-3.jpg` is missing. Task 30 retains the TODO-DESIGN mobile drawer note.

### R-324 · Cross-origin uploaded images · FILE_CHANGED
- Path: `docs/report.md`
- Purpose: Record the backend CORP fix, response-header checks, browser test, and remaining missing file.
- Depends on: `R-318` through `R-323`
- Used by: Shared build report.
- Status: done
- Notes for Claude: The historical R-250 entry is not rewritten; these entries supersede its same-origin policy finding for existing public blog/product uploads.

## Map

### Routes
| Path | Page file | Layout | Permission | API calls |
|---|---|---|---|---|
| `/` | `frontend/src/pages/public/HomePage.jsx` | `StoreLayout` | Everyone | `GET /products`, `GET /blogs` |
| `/products` | `frontend/src/pages/public/ProductsPage.jsx` | `StoreLayout` | Everyone | `GET /products`, `GET /categories` |
| `/products/:slug` | `frontend/src/pages/public/ProductDetailPage.jsx` | `StoreLayout` | Everyone | `GET /products` (slug lookup), `GET /products/:id`, `POST /cart/items`, `POST /wishlist/items` |
| `/blogs` | `frontend/src/pages/public/BlogsPage.jsx` | `StoreLayout` | Everyone | `GET /blogs` |
| `/blogs/:slug` | `frontend/src/pages/public/BlogDetailPage.jsx` | `StoreLayout` | Everyone | `GET /blogs/:slug` |
| `/login` | `frontend/src/pages/public/LoginPage.jsx` | `StoreLayout` | Guests; authenticated users can explicitly log out to switch accounts | `POST /auth/login`, `POST /auth/logout` |
| `/register` | `frontend/src/pages/public/PlaceholderPage.jsx` ("Register") | `StoreLayout` | Guests | None |
| `/cart` | `frontend/src/pages/public/PlaceholderPage.jsx` ("Cart") | `StoreLayout` | Login required | None |
| `/checkout` | `frontend/src/pages/public/PlaceholderPage.jsx` ("Checkout") | `StoreLayout` | Login required | None |
| `/orders` | `frontend/src/pages/public/PlaceholderPage.jsx` ("Orders") | `StoreLayout` | Login required | None |
| `/orders/:id` | `frontend/src/pages/public/PlaceholderPage.jsx` ("Order detail") | `StoreLayout` | Login required | None |
| `/wishlist` | `frontend/src/pages/public/PlaceholderPage.jsx` ("Wishlist") | `StoreLayout` | Login required | None |
| `/addresses` | `frontend/src/pages/public/PlaceholderPage.jsx` ("Addresses") | `StoreLayout` | Login required | None |
| `/profile` | `frontend/src/pages/public/ProfilePage.jsx` | `StoreLayout` | Login required | AuthContext user from `GET /users/me`, `POST /auth/logout` |
| `/admin` | `frontend/src/pages/admin/DashboardPage.jsx` | `AdminLayout` | Any admin permission | `GET /users`, `GET /products/admin`; orders count unavailable |
| `/admin/users` | `frontend/src/pages/admin/UsersPage.jsx` | `AdminLayout` | `user.read` | `GET /users`, `GET /roles`, `PATCH /users/:id/role` |
| `/admin/roles` | `frontend/src/pages/admin/RolesPage.jsx` | `AdminLayout` | `role.read` | `GET /roles`, `PATCH /roles/:id/permissions` |
| `/admin/categories` | `frontend/src/pages/admin/CategoriesPage.jsx` | `AdminLayout` | `category.read` | `GET /categories/admin`, `POST /categories`, `PATCH /categories/:id` |
| `/admin/products` | `frontend/src/pages/admin/ProductsPage.jsx` | `AdminLayout` | `product.read` | `GET /products/admin`, `GET /products/:id`, `POST /products`, `PATCH /products/:id`, product image endpoints |
| `/admin/blogs` | `frontend/src/pages/admin/BlogsPage.jsx` | `AdminLayout` | `blog.read` | `GET /blogs/admin`, `GET /blogs/admin/:id`, `POST /blogs`, `PATCH /blogs/:id`, blog cover upload/removal |

### Pages and components
| File | Type (page, component, layout, hook, util) | Used by | Status |
|---|---|---|---|
| `frontend/src/App.jsx` | component | `frontend/src/main.jsx` | Gearnix routes; public store pages and admin blog route wired |
| `frontend/src/main.jsx` | component | `frontend/index.html` | React application entry point and global toaster |
| `frontend/index.html` | document shell | Browser | Gearnix title, description, theme color, brand favicon |
| `frontend/src/constants/site.js` | util | Future store/footer components | done; newsletter is frontend-only demo, unavailable real contact/social values remain placeholders |
| `frontend/src/constants/permissions.js` | util | Future AuthContext, guards, and admin navigation | done; all 20 documented permission keys |
| `frontend/src/components/ui/button.jsx` | component | Future pages and UI | done |
| `frontend/src/components/ui/input.jsx` | component | Future forms and pages | done |
| `frontend/src/components/ui/label.jsx` | component | Future forms and pages | done |
| `frontend/src/components/ui/card.jsx` | component | Future page and panel layouts | done |
| `frontend/src/components/ui/sonner.jsx` | component | Future global toast feedback | done |
| `frontend/src/components/shared/Logo.jsx` | component | Store/admin headers | done |
| `frontend/src/components/shared/StoreHeader.jsx` | component | `frontend/src/layouts/StoreLayout.jsx` | done; responsive home/inner header, live-data menus, and mobile drawer |
| `frontend/src/auth/RequireLogin.jsx` | component | Protected customer/admin routes | done |
| `frontend/src/auth/RequirePermission.jsx` | component | Permission-protected admin routes | done |
| `frontend/src/layouts/StoreLayout.jsx` | layout | Public/customer routes | done; shared StoreHeader, footer, count badges, mobile navigation, demo-only newsletter |
| `frontend/src/layouts/AdminLayout.jsx` | layout | Admin routes | done |
| `frontend/src/pages/admin/DashboardPage.jsx` | page | `/admin` | partial; all-orders total awaits backend API |
| `frontend/src/pages/admin/UsersPage.jsx` | page | `/admin/users` | done; role-history reading awaits backend endpoint |
| `frontend/src/pages/admin/RolesPage.jsx` | page | `/admin/roles` | done |
| `frontend/src/pages/admin/CategoriesPage.jsx` | page | `/admin/categories` | done |
| `frontend/src/pages/admin/ProductsPage.jsx` | page | `/admin/products` | partial; hidden product detail is unavailable through current API |
| `frontend/src/pages/admin/BlogsPage.jsx` | page | `/admin/blogs` | done; admin API actions require a valid session for live verification |
| `frontend/src/pages/admin/BlogEditor.jsx` | component | Admin blog list | done; Tiptap editing, sanitized save, draft/publish, cover upload/removal |
| `frontend/src/pages/public/HomePage.jsx` | page | `/` | done; hero, benefits, promos, product and story sections |
| `frontend/src/pages/public/ProductsPage.jsx` | page | `/products` | done; search, category filter, pagination, loading/empty/error states |
| `frontend/src/components/shared/ProductCard.jsx` | component | Home and product listing | done; cart/wishlist actions and stock-aware cart control |
| `frontend/src/pages/public/ProductDetailPage.jsx` | page | `/products/:slug` | partial; detail UI/API implemented, local product image URL returns 404 and is blocked by backend response policy |
| `frontend/src/pages/public/BlogsPage.jsx` | page | `/blogs` | done; published list, search, pagination; excerpt/date remain TODO-DESIGN |
| `frontend/src/pages/public/BlogDetailPage.jsx` | page | `/blogs/:slug` | done; sanitizes HTML before rendering |
| `frontend/src/utils/media.js` | util | Product and blog pages | done; upload URL, rupee, and date formatting |
| `frontend/src/utils/sanitize.js` | util | Public blog detail | done; DOMPurify allowlist |
| `frontend/src/pages/public/LoginPage.jsx` | page | `/login` | done |
| `frontend/src/pages/public/ProfilePage.jsx` | page | `/profile` | done; account details and logout |
| `frontend/src/pages/public/PlaceholderPage.jsx` | page | All Phase 1 routes until replaced by task-specific pages | done |

### Design tokens
| Token group | CSS variables | Tailwind utility examples | Status |
|---|---|---|---|
| Backgrounds | `--bg-base`, `--bg-black`, `--bg-light`, `--bg-panel`, `--bg-sidebar-head` | `bg-brand-base`, `bg-brand-black`, `bg-brand-light`, `bg-brand-panel`, `bg-brand-sidebar-head` | done; all estimated values marked `/* est. */` |
| Text | `--text-primary`, `--text-muted`, `--text-dark` | `text-brand-text-primary`, `text-brand-text-muted`, `text-brand-text-dark` | done; all estimated values marked `/* est. */` |
| Accents | `--accent-magenta`, `--accent-pink`, `--accent-violet`, `--accent-blue` | `bg-brand-accent-magenta`, `text-brand-accent-pink`, etc. | done; all estimated values marked `/* est. */` |
| Glow and border | `--glow-warm`, `--glow-rose`, `--border-subtle` | `bg-brand-glow-warm`, `border-brand-border-subtle` | done; all estimated values marked `/* est. */` |
| Gradients | `--grad-cta`, `--grad-story`, `--grad-header-home`, `--grad-header-purple` | `bg-grad-cta`, `bg-grad-story`, `bg-grad-header-home`, `bg-grad-header-purple` | done; all estimated values marked `/* est. */` |

### API modules
| File | Backend endpoints used | Used by |
|---|---|---|
| `frontend/src/api/client.js` | Configured base URL; generic request client, including `/auth/refresh` retry flow | AuthContext and future API modules |
| `frontend/src/api/users.api.js` | `GET /users`, `PATCH /users/:id/role` | Dashboard and Users page |
| `frontend/src/api/roles.api.js` | `GET /roles`, `PATCH /roles/:id/permissions` | Users and Roles pages |
| `frontend/src/api/catalog.api.js` | Category list/create/update; admin and public product list/detail, slug resolution, product create/update and image upload/delete/primary | Dashboard, Categories, Products, Home, product detail, and StoreHeader menus |
| `frontend/src/api/blogs.api.js` | Public/admin blog list/detail, create/update, cover upload/removal | Admin blog and public blog pages, StoreHeader menus |
| `frontend/src/api/customer.api.js` | `GET /cart`, `POST /cart/items`, `GET /wishlist`, wishlist add/remove | Store header, product cards, and product detail |

### Contexts and state
| File | What it holds | Used by |
|---|---|---|
| `frontend/src/auth/AuthContext.jsx` | Access token in memory, current user and permissions, auth status/error, login/logout, hasPermission | App routes and components; logout clears local state only after server success |

### Dependencies
| Package | Version | Why it's installed |
|---|---|---|
| `react` | `^19.2.0` (installed `19.3.1`) | UI components |
| `react-dom` | `^19.2.0` (installed `19.3.1`) | Browser React renderer |
| `vite` | `^7.3.1` (installed `7.3.7`) | Development server and production bundler |
| `@vitejs/plugin-react` | `^5.1.1` (installed `5.2.0`) | React support and fast refresh for Vite |
| `tailwindcss` | `^3.4.19` (installed `3.4.19`) | Utility CSS framework |
| `postcss` | `^8.5.32` (installed `8.5.32`) | CSS processing for Tailwind |
| `autoprefixer` | `^10.6.2` (installed `10.6.2`) | CSS vendor prefixes |
| `eslint` | `^9.39.1` (installed `9.39.5`) | JavaScript linting |
| `@eslint/js` | `^9.39.1` (installed `9.39.5`) | ESLint recommended JavaScript rules |
| `globals` | `^16.5.0` (installed `16.5.0`) | Browser globals for ESLint |
| `eslint-plugin-react-hooks` | `^7.0.1` (installed `7.1.1`) | React Hooks lint rules |
| `eslint-plugin-react-refresh` | `^0.4.24` (installed `0.4.26`) | React Fast Refresh lint rules |
| `@types/react` | `^19.2.7` (installed `19.3.0`) | Left over from TypeScript scaffold; unused in JavaScript |
| `@types/react-dom` | `^19.2.3` (installed `19.3.0`) | Left over from TypeScript scaffold; unused in JavaScript |
| `react-icons` | `^5.7.0` (installed `5.7.0`) | Icons for Gearnix-owned interface elements |
| `motion` | `^14.7.1` (installed `14.7.1`) | StoreHeader desktop dropdown and mobile drawer transitions with reduced-motion support |
| `react-router-dom` | `^7.18.4` (installed `7.18.4`) | Client-side routing |
| `@tanstack/react-query` | `^5.105.0` (installed `5.105.0`) | Server-state caching and queries |
| `sonner` | `^2.0.8` (installed `2.0.8`) | Toast notifications |
| `class-variance-authority` | `^0.7.1` (installed `0.7.1`) | Component variant generation |
| `clsx` | `^2.1.1` (installed `2.1.1`) | Conditional class composition |
| `lucide-react` | `^1.62.0` (installed `1.62.0`) | Icons used internally by shadcn components |
| `tailwind-merge` | `^3.7.0` (installed `3.7.0`) | Merge conflicting Tailwind classes |
| `tailwindcss-animate` | `^1.0.7` (installed `1.0.7`) | shadcn animation utilities |
| `@radix-ui/react-slot` | `^1.5.0` (installed `1.5.0`) | Button `asChild` primitive |
| `@radix-ui/react-label` | `^2.1.17` (installed `2.1.17`) | Accessible Label primitive |
| `next-themes` | `^0.4.6` (installed `0.4.6`) | Theme context imported by generated Sonner wrapper |
| `@tiptap/react` | `^3.32.0` (installed `3.32.0`) | Rich-text blog editor React bindings |
| `@tiptap/starter-kit` | `^3.32.0` (installed `3.32.0`) | Core Tiptap formatting and editor nodes |
| `@tiptap/extension-link` | `^3.32.0` (installed `3.32.0`) | Link editing in the blog editor |
| `@tiptap/extension-underline` | `^3.32.0` (installed `3.32.0`) | Underline formatting in the blog editor |
| `dompurify` | `^3.4.17` (installed `3.4.17`) | Sanitize blog HTML before save and public rendering |
| `shadcn` (npx CLI only) | `2.10.0` | Tailwind v3-compatible initialization and component generation; not a project dependency |

### Environment variables
| Name | Read by | Purpose |
|---|---|---|
| `VITE_API_URL` | `frontend/src/api/client.js` | API base URL; must be supplied by the environment, with no localhost fallback |

### Open questions for Claude
| Q-ID | Question | Status |
|---|---|---|
| Q-001 | Should footer newsletter subscribers be stored in the database, or should the form remain hidden? | Resolved by user: demo decoration only; no backend storage |
| Q-002 | Should Gift Cards be removed or shown as a Coming Soon page? | Resolved conservatively: disabled until real content is supplied |
| Q-003 | What is the real store address? | Resolved by A-003; TODO placeholder retained |
| Q-004 | What are the real Facebook, Instagram, X, and TikTok URLs, and which networks should be omitted? | Resolved by A-004; links remain empty |
| Q-005 | What are the real store phone number and contact email? | Resolved by A-005; TODO placeholders retained |

### Answers from Claude
None.

### User decisions
| A-ID | Answer |
|---|---|
| A-001 | Newsletter is demo decoration only; do not add backend storage or an API endpoint. |
| A-002 | Keep Gift Cards disabled until real content is available. |
| A-003 | Keep the address placeholder; do not invent a real address. |
| A-004 | Keep social URLs empty until supplied. |
| A-005 | Keep phone and email placeholders until supplied. |
