// @ts-check
import {defineConfig} from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightOpenAPI, {openAPISidebarGroups} from 'starlight-openapi';

// https://astro.build/config
export default defineConfig({
    site: 'https://docs.fixem.be',
    integrations: [
        starlight({
            title: 'fixem.be',
            social: [
                {
                    icon: 'github',
                    label: 'GitHub',
                    href: 'https://github.com/rickklaasboer/fixem.be',
                },
            ],
            plugins: [
                // Generates the API reference from the OpenAPI contract synced
                // into src/openapi.yaml by `node scripts/sync-openapi.mjs`.
                starlightOpenAPI([
                    {
                        base: 'api-reference',
                        label: 'API reference',
                        schema: './src/openapi.yaml',
                    },
                ]),
            ],
            sidebar: [
                {
                    label: 'Getting started',
                    items: [
                        {
                            label: 'Introduction',
                            slug: 'getting-started/introduction',
                        },
                        {
                            label: 'Quick start',
                            slug: 'getting-started/quick-start',
                        },
                    ],
                },
                {
                    label: 'Using fixem.be',
                    items: [
                        {label: 'Fixing embeds', slug: 'guide/fixing-embeds'},
                        {label: 'Previewing', slug: 'guide/previewing'},
                        {
                            label: 'Supported platforms',
                            slug: 'guide/platforms',
                        },
                        {
                            label: 'Running your own instance',
                            slug: 'guide/self-hosting',
                        },
                    ],
                },
                {
                    label: 'API',
                    items: [
                        {label: 'Overview', slug: 'api/overview'},
                        {label: 'Authentication', slug: 'api/authentication'},
                        {label: 'Rate limiting', slug: 'api/rate-limiting'},
                        {label: 'Resolving URLs', slug: 'api/resolving'},
                        {label: 'Batch', slug: 'api/batch'},
                        {label: 'Canonical', slug: 'api/canonical'},
                        {label: 'Platforms', slug: 'api/platforms'},
                        {label: 'Health', slug: 'api/health'},
                        {label: 'Errors', slug: 'api/errors'},
                    ],
                },
                // Injected by starlight-openapi (the generated reference group).
                ...openAPISidebarGroups,
            ],
        }),
    ],
});
