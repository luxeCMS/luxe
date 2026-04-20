<div align="center">

![LuxeCMS](./assets/luxe-logo-github.webp)

The first truly composable headless CMS built for the modular web.

[![GitHub license](https://img.shields.io/github/license/luxeCMS/luxe)](https://github.com/luxeCMS/luxe/blob/759f622655fb59b374ad3feb497922e104d8c232/LICENSE.md)
[![Discord](https://img.shields.io/discord/1315711442669928580?label=Discord&logo=discord)](https://discord.gg/6XzN3e8VCk)

> **Update [April 2026]**: On hold. I underestimated the scope of this project and hit the edges of what I currently know well enough to build right. Rather than ship something I'm not proud of, I'm pausing LuxeCMS to close some gaps first.

</div>

## Overview

LuxeCMS is a modular headless CMS that revolutionizes content management through true composability and framework independence. Built for modern development workflows, it enables teams to create scalable content architectures that grow with their needs while maintaining complete control over their technology choices. Amazing, right?

If you're interested in this project, please consider giving us a ⭐ star to show your support and stay updated on our progress.

## Key Features

- **True Composability**: Build your CMS like a composable frontend - add only what you need
- **Framework Independence**: No vendor lock-in - use any frontend framework or build your own integration
- **Live Preview**: Instantly preview content changes through external SSR renderers specific to your frontend
- **Content Types**: Documents, objects, widgets, pages, media, and more - all with full versioning and history
- **Developer-First**: Type-safe APIs, comprehensive docs, and an extensible plugin system
- **Plugins**: Extend LuxeCMS with custom plugins for your specific use case (e.g. e-commerce, SEO, etc.)

## Quick Start

To get started with LuxeCMS, run the following command:

```bash
pnpm create luxe@latest
# or
npm create luxe@latest
```

Follow the steps in the CLI to create a new Luxe project.

> **Note:** LuxeCMS is still in development and won't setup a working project yet.

## Roadmap

LuxeCMS is currently in the very early stages of development. Here's what we're working on:

| Feature               | Status                   | Description                                                                    |
| --------------------- | ------------------------ | ------------------------------------------------------------------------------ |
| Core Functionality    | 🚧&nbsp;In&nbsp;Progress | Core CMS functionality (configuration, CLI tools, internals, etc.)             |
| Module System         | 🚧&nbsp;In&nbsp;Progress | Module system for registering and running modules                              |
| Core Features         | 📆&nbsp;Planned          | Core CMS features (content types, versioning, history, scheduling, etc.)       |
| API Server            | 📆&nbsp;Planned          | API server for managing content, users, media, and other CMS data              |
| Webhooks Server       | 📆&nbsp;Planned          | Webhooks server for triggering external events on content changes              |
| CLI Tools             | 📆&nbsp;Planned          | CLI tools for managing LuxeCMS projects and modules                            |
| Admin Interface       | 📆&nbsp;Planned          | Admin interface for managing content, users, media, and other CMS data         |
| Plugin System         | 📆&nbsp;Planned          | Plugin system for extending LuxeCMS modules with custom functionality          |
| Object Module         | 📆&nbsp;Planned          | Object module for creating and managing key-value data                         |
| Document Module       | 📆&nbsp;Planned          | Document module for creating and managing complex documents with schemas       |
| User Module           | 📆&nbsp;Planned          | User module for managing user accounts and permissions                         |
| Media Module          | 📆&nbsp;Planned          | Media module for uploading and managing media assets                           |
| Widget Module         | 📆&nbsp;Planned          | Widget module for creating and managing reusable components                    |
| Astro Integration     | 📆&nbsp;Planned          | Astro integration for live previewing content changes and widget rendering     |
| Page Module           | 📆&nbsp;Planned          | Page module for creating and managing static and dynamic pages                 |
| SEO Plugin            | ✨&nbsp;TBD              | SEO plugin for managing metadata, sitemaps, and other SEO functionality        |
| Next.js Integration   | ✨&nbsp;TBD              | Next.js integration for live previewing content changes and widget rendering   |
| SvelteKit Integration | ✨&nbsp;TBD              | SvelteKit integration for live previewing content changes and widget rendering |
| Medusa Plugin         | ✨&nbsp;TBD              | Medusa plugin for e-commerce functionality (products, categories)              |
| Shopify Plugin        | ✨&nbsp;TBD              | Shopify plugin for e-commerce functionality (products, collections)            |
| A/B Testing Plugin    | ✨&nbsp;TBD              | A/B testing plugin for running experiments on content changes                  |

Got a feature request? [Join our Discord](https://discord.gg/6XzN3e8VCk) and let us know!

## Inspiration

This project would not be possible without the existence of these amazing open-source projects [Astro](https://astro.build/) & [Medusa](https://medusajs.com/).

## Contributing

We welcome contributions! See our [Contributing Guide](./CONTRIBUTING.md) for details on:

- Setting up your development environment
- Making pull requests
- Our coding standards

Join our [Discord](https://discord.gg/6XzN3e8VCk) to connect with other contributors.

## License

MIT © [LuxeCMS Contributors](./LICENSE.md)
