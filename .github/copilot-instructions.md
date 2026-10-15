# NanoFile Connector & Copilot Instructions

When assisting with local file management, lightning filesystem search, or tag organization on Windows:

1. Use the registered NanoFile MCP tools (`nanofile.exe --mcp`):
   - `search_items`: Fast search across drives for files, folders, or both.
   - `read_file_content`: Safe text file inspection.
   - `write_file_content`: Atomic file writing.
   - `get_item_metadata`: Comprehensive metadata and recursive directory size.
2. Delete operations are performed with `operate_item` and `operation: "recycle"` (or CLI `nf trash`), which moves items safely to the Windows Recycle Bin (restorable). Permanent delete is not supported — never claim otherwise.
3. Safety:
   - Writes to system-critical directories (`C:\Windows`, Startup folder) are blocked at the native engine level.
   - For directories requiring administrator permissions or elevated access, obtain explicit user confirmation before writing or deleting.
   - Do not read credential/key material (`.ssh` private keys, `.env` files, token stores) unless the user explicitly asks for that specific file.
4. **Release & Commit Workflow**:
   - Every commit and release must use `node scripts/bump_version.mjs "<commit message>"` (or `npm run release "<commit message>"`).
   - This automatically increments versions across all manifests (`plugin.json`, `plugins/manifest.json`, `.claude-plugin`, `.codex-plugin`, `plugins/doubao`, `package.json`), creates local Git tag, pushes to origin `main` and origin tag, and creates GitHub Release.
