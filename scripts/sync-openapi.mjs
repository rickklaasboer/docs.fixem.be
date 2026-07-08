// Syncs the canonical OpenAPI contract into this repo so the docs never keep a
// hand-edited (and drifting) copy. Writes a gitignored src/openapi.yaml that the
// starlight-openapi plugin reads at build time.
//
// Source precedence:
//   1. $OPENAPI_URL  — fetch it (CI / once the API is deployed, e.g.
//                      https://fixem.be/openapi.yaml)
//   2. ../fixem.be/openapi.yaml — the sibling repo (local dev, works offline)
//
// Fails loudly if neither is available.
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dest = resolve(root, 'src/openapi.yaml');
const url = process.env.OPENAPI_URL;
const sibling = resolve(root, '../fixem.be/openapi.yaml');

async function main() {
    mkdirSync(dirname(dest), {recursive: true});

    if (url) {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`GET ${url} → ${res.status}`);
        writeFileSync(dest, await res.text());
        console.log(`sync-openapi: fetched ${url} → src/openapi.yaml`);
        return;
    }

    if (existsSync(sibling)) {
        writeFileSync(dest, readFileSync(sibling));
        console.log(`sync-openapi: copied ${sibling} → src/openapi.yaml`);
        return;
    }

    throw new Error(
        'no OpenAPI source found. Set OPENAPI_URL=https://fixem.be/openapi.yaml, ' +
            'or check out the fixem.be repo at ../fixem.be so ../fixem.be/openapi.yaml exists.',
    );
}

main().catch((err) => {
    console.error(`sync-openapi failed: ${err.message}`);
    process.exit(1);
});
