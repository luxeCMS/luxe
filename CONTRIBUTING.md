# Contributing to LuxeCMS

We welcome contributions of any size and skill level. Even documentation fixes for typos. As a truly open source project, we aim to build together with our community and are happy to provide guidance for first-time contributors.

> [!Tip] > **New to open source?** Check out [First Contributions](https://github.com/firstcontributions/first-contributions) for a beginner-friendly guide.

## Quick Start

### Prerequisites

```shell
node: ">=20.17.1"
pnpm: ">=9.0.0"
```

### Development Setup

```shell
# Clone and install dependencies
git clone https://github.com/luxeCMS/luxe.git
cd luxe
pnpm install

# Start development server
pnpm dev

# Build the project
pnpm build

# Lint and format code
pnpm check
```

### Testing Your Changes

1. Run tests:

```shell
# Run all tests
pnpm test
```

## Making Changes

### Branch & Development Workflow

1. Create a new branch from `develop`:

   ```shell
   git checkout -b feat/my-feature
   # or
   git checkout -b fix/my-bug
   ```

2. Make your changes and test thoroughly:

   ```shell
   pnpm build              # Build all packages
   pnpm test               # Run all tests
   pnpm check              # Check code style
   ```

3. When you are ready to merge back to the `develop` branch, document your changes with a changeset:

   ```shell
   pnpm changeset
   ```

   The changeset CLI will guide you through:

   - Selecting which packages have changed
   - Choosing the type of version bump for each package:
     - `major` - Breaking changes
     - `minor` - New features
     - `patch` - Bug fixes
   - Writing a description of your changes

   Guidelines for good changeset messages:

   - Describe the change from a user's perspective
   - Mention any breaking changes clearly
   - Reference relevant issues/PRs with #
   - Keep it clear and concise

   Example changeset messages:

   ```
   Added new `useTheme` hook for accessing theme values

   Fixes #123
   ```

   ```
   BREAKING CHANGE: Removed deprecated `oldFunction` API

   Use `newFunction` instead. See #456 for migration guide.
   ```

4. Commit your changes following conventional commits:

   ```shell
   git add .
   git commit -m "feat(ui): add useTheme hook"
   # or
   git commit -m "fix(core): resolve memory leak in worker pool"
   ```

5. Push to your fork and create a pull request:
   ```shell
   git push origin feat/my-feature
   ```

### Release Process

When creating a pull request to `release`, you can control the release process using labels.
A label **must** be added to your PR when merging a PR to `release`. The following labels are available:

- `release:stable` - Production release (npm tag: `latest`)

  - Use for stable features and bug fixes
  - Creates a standard GitHub release

- `release:beta` - Beta release (npm tag: `beta`)

  - Use for feature-complete but untested changes
  - Marked as pre-release on GitHub

**Release workflow**:

1. Add the appropriate release label to your PR
2. Once merged to `release`, the GitHub Action will:
   - Build all packages
   - Create new versions based on changesets
   - Publish to npm with appropriate tags
   - Create GitHub releases
   - Update package changelogs

## Project Status

LuxeCMS is under active development as we work toward our first stable release. We encourage you to:

- ⭐ Star the repo to show your support and stay updated
- 🐛 Report bugs and suggest features
- 💬 Join our [Discord](https://discord.gg/6XzN3e8VCk) to connect with the team

## Development Scripts

```shell
# Format code
pnpm format

# Lint code
pnpm lint
```

## Getting Help

- Join our [Discord](https://discord.gg/6XzN3e8VCk)

## License

By contributing to LuxeCMS, you agree that your contributions will be licensed under its MIT license.
