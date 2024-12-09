# Contributing to LuxeCMS

We welcome contributions of any size and skill level. Even documentation fixes for typos. As a truly open source project, we aim to build together with our community and are happy to provide guidance for first-time contributors.

> [!Tip]
> **New to open source?** Check out [First Contributions](https://github.com/firstcontributions/first-contributions) for a beginner-friendly guide.

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
```

### Testing Your Changes

1. Run tests:

```shell
# Run all tests
pnpm test
```

## Making Changes

1. Create a new branch:

```shell
git checkout -b my-feature
```

2. Make your changes and test thoroughly

3. Add a changeset to document your changes:

```shell
pnpm exec changeset
```

4. Commit your changes:

```shell
git add .
git commit -m "feat (package): description of your changes"
```

5. Push to your fork and create a pull request

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
