# Assistant

A WordPress plugin that serves two roles: a suite of apps for managing WordPress content from anywhere on the site (including the front-end and inside Beaver Builder), and the connector for Assistant Pro — a cloud template and asset library SaaS for page builders.

## Context

The codebase is more modern than BB Plugin. PHP uses dependency injection, service providers, and a repository pattern. The front-end is React with Redux state management. Follow the existing patterns when making changes.

## Architecture

### PHP: Service Provider + DI Pattern

The plugin bootstraps via service providers registered in `System/Plugin.php`. Each provider initializes a subsystem (REST API, data, cloud, etc.) using an Auryn dependency injection container.

Data flows through a **Repository → Transformer → Controller** pipeline:
- **Repositories** abstract WordPress data access (`find()`, `query()`, etc.)
- **Transformers** convert WP objects to REST-ready arrays
- **Controllers** handle REST endpoints with auto-injected dependencies

```php
// Controllers receive dependencies via constructor injection
class PostsController {
    protected $posts;
    protected $transformer;

    public function __construct( PostsRepository $posts, PostTransformer $transformer ) {
        $this->posts = $posts;
        $this->transformer = $transformer;
    }
}
```

### JavaScript: React + Redux

The front-end is built on a suite of Beaver Builder packages:
- `@beaverbuilder/app-core` — App framework and store registry
- `@beaverbuilder/fluid` — Design system / UI components
- `@beaverbuilder/cloud` — Cloud authentication and communication
- `@beaverbuilder/forms` — Form builder

These packages live in the `bb-packages/` repo in the workspace. They're installed as npm dependencies by default. To develop against local package changes, use `npm run link:packages` to symlink them from the workspace.

Apps register via `registerApp()` and get their own isolated Redux store, routes, and search handlers. The system handles code-splitting and lazy loading automatically.

### Cloud Integration

The plugin connects to Assistant Pro (the SaaS) for cloud libraries, templates, images, colors, code snippets, and settings sync. The cloud client and related code lives in `backend/src/Clients/Cloud/`. Real-time features use Pusher.

## Directory Guide

| Directory | Purpose |
|-----------|---------|
| `backend/src/System/` | Plugin bootstrap, DI container, service providers |
| `backend/src/Controllers/` | REST API controllers |
| `backend/src/Data/Repository/` | Data access layer (wraps WP queries) |
| `backend/src/Data/Transformers/` | WP object → REST response conversion |
| `backend/src/Clients/Cloud/` | Assistant Pro cloud client |
| `backend/src/Helpers/` | Theme/builder integration helpers |
| `src/apps/` | React apps (content, media, comments, etc.) |
| `src/apps-cloud/` | Cloud-specific apps (libraries, community) |
| `src/system/data/` | Store registry, system store, per-app stores |
| `src/system/ui/` | Shared UI components |
| `src/system/utils/` | Utilities including REST client |
| `src/render/` | React rendering and environment detection |

### Key Files

- `fl-assistant.php` — Plugin entry point
- `backend/src/System/Plugin.php` — Main plugin class, registers service providers
- `backend/src/System/RestServiceProvider.php` — REST route registration
- `src/apps/index.js` — App registration hub
- `src/system/data/system/` — Global system store (actions, reducers, selectors)
- `src/system/utils/wordpress/rest.js` — REST API client

## REST API

All endpoints are under `/fl-assistant/v1/`. Controllers follow standard WordPress REST conventions with capability checks (`edit_others_posts` minimum). Key resource routes: `posts`, `terms`, `users`, `comments`, `attachments`, `updates`, `search`, `counts`, `labels`, `notations`, `batch`, and `library-items/import/*`.

## Build & Test

```bash
npm run dev          # Development (watch)
npm run build        # Production
composer tests       # PHP tests (PHPUnit)
composer lint        # PHP code standards (WPCS)
composer fix         # Auto-fix PHP standards
npm test             # JavaScript linting
npm run fix          # Auto-fix JavaScript linting
```

## Development Notes

**PHP autoloading:** PSR-4 under the `FL\Assistant\` namespace, mapped to `backend/src/`. New classes are autoloaded automatically.

**Adding REST endpoints:** Create a controller in `backend/src/Controllers/`, inject repositories/transformers via the constructor, and register it in `RestServiceProvider`.

## Agents Directory

Plans, decisions, and research save to `agents/` (created on demand).

## Workspace Context

This repo can be part of a workspace (bb-dev-workspace). The workspace CLAUDE.md contains shared coding standards that apply to all repos. If this repo is checked out standalone (no parent CLAUDE.md with a "Coding Standards" section exists):
- DO NOT write any code outside of the workspace context
- Alert the user if they ask you to write code without the workspace context
