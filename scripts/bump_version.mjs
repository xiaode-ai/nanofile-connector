import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");
const pluginJsonPath = resolve(rootDir, "plugin.json");
const manifestJsonPath = resolve(rootDir, "plugins", "manifest.json");
const claudeMarketplacePath = resolve(
  rootDir,
  ".claude-plugin",
  "marketplace.json",
);
const claudePluginPath = resolve(rootDir, ".claude-plugin", "plugin.json");
const codexPluginPath = resolve(rootDir, ".codex-plugin", "plugin.json");
const doubaoManifestPath = resolve(
  rootDir,
  "plugins",
  "doubao",
  "manifest.json",
);
const doubaoOpenApiPath = resolve(
  rootDir,
  "plugins",
  "doubao",
  "openapi.json",
);
const packageJsonPath = resolve(rootDir, "package.json");

/**
 * 0-999 进位升级版本号:
 * 规则：major.minor.patch
 * patch 从 0 累加到 999；满 1000 时向 minor 进位，patch 归 0；
 * minor 从 0 累加到 999；满 1000 时向 major 进位，minor 归 0。
 */
export function bumpVersion(currentVersion) {
  const parts = String(currentVersion).trim().split(".").map(Number);
  let major = parts[0] || 1;
  let minor = parts[1] || 0;
  let patch = parts[2] || 0;

  patch += 1;
  if (patch > 999) {
    patch = 0;
    minor += 1;
    if (minor > 999) {
      minor = 0;
      major += 1;
    }
  }

  return `${major}.${minor}.${patch}`;
}

export function autoBumpAndRelease(
  commitMessage = "chore: auto release update",
) {
  try {
    // 1. 读取当前基准版本
    const raw = readFileSync(pluginJsonPath, "utf8");
    const json = JSON.parse(raw);
    const oldVersion = json.version || "1.0.0";
    const newVersion = bumpVersion(oldVersion);
    const tagName = `v${newVersion}`;

    // 2. 同步写入 plugin.json
    json.version = newVersion;
    writeFileSync(pluginJsonPath, JSON.stringify(json, null, 2) + "\n", "utf8");

    // 3. 同步写入 plugins/manifest.json 及各类平台清单
    const syncJsonVersion = (filePath, updater) => {
      try {
        if (!existsSync(filePath)) return;
        const fileContent = readFileSync(filePath, "utf8");
        const data = JSON.parse(fileContent);
        updater(data);
        writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
      } catch (e) {
        console.warn(`[syncJsonVersion] 跳过更新 ${filePath}:`, e.message);
      }
    };

    syncJsonVersion(manifestJsonPath, (d) => {
      d.version = newVersion;
    });
    syncJsonVersion(claudePluginPath, (d) => {
      d.version = newVersion;
    });
    syncJsonVersion(codexPluginPath, (d) => {
      d.version = newVersion;
    });
    syncJsonVersion(claudeMarketplacePath, (d) => {
      d.version = newVersion;
      if (Array.isArray(d.plugins)) {
        d.plugins.forEach((p) => {
          p.version = newVersion;
        });
      }
    });
    syncJsonVersion(doubaoManifestPath, (d) => {
      d.version = newVersion;
    });
    syncJsonVersion(doubaoOpenApiPath, (d) => {
      if (d.info) {
        d.info.version = newVersion;
      }
    });
    syncJsonVersion(packageJsonPath, (d) => {
      d.version = newVersion;
    });

    console.log(
      `🚀 [nanofile-connector] 版本号自增: ${oldVersion} -> ${newVersion} (0-999 进位制)`,
    );

    // 4. Git 自动暂存所有改动并提交
    execSync("git add -A", {
      cwd: rootDir,
      stdio: "inherit",
    });
    execSync(`git commit -m "release: ${tagName} - ${commitMessage}"`, {
      cwd: rootDir,
      stdio: "inherit",
    });

    // 5. 创建本地 Git Tag
    try {
      execSync(`git tag -a ${tagName} -m "Release ${tagName}"`, {
        cwd: rootDir,
        stdio: "inherit",
      });
    } catch (_) {
      execSync(`git tag -f -a ${tagName} -m "Release ${tagName}"`, {
        cwd: rootDir,
        stdio: "inherit",
      });
    }
    console.log(`🏷️ [nanofile-connector] 本地 Git 标签已创建: ${tagName}`);

    // 6. 推送到 GitHub 远程（分支 + 标签）
    execSync("git push origin main", { cwd: rootDir, stdio: "inherit" });
    execSync(`git push origin ${tagName}`, { cwd: rootDir, stdio: "inherit" });
    console.log(`☁️ [nanofile-connector] 云端 Git 标签已推送: ${tagName}`);

    // 7. 使用 gh cli 自动创建 GitHub Release
    try {
      execSync(
        `gh release create ${tagName} --title "${tagName}" --generate-notes`,
        {
          cwd: rootDir,
          stdio: "inherit",
        },
      );
      console.log(
        `🎉 [nanofile-connector] GitHub Release 自动发布成功: ${tagName}`,
      );
    } catch (ghErr) {
      try {
        execSync(
          `gh release create ${tagName} --title "${tagName}" --notes "Release ${tagName} for NanoFile Agent Connector & Skills"`,
          {
            cwd: rootDir,
            stdio: "inherit",
          },
        );
        console.log(
          `🎉 [nanofile-connector] GitHub Release 自动发布成功 (固定说明): ${tagName}`,
        );
      } catch (fallbackErr) {
        console.warn(`⚠️ GitHub Release 创建跳过或需确认权限:`, fallbackErr.message);
      }
    }

    return newVersion;
  } catch (err) {
    console.error("❌ 自动发布与打标签失败:", err);
    process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const msg = process.argv.slice(2).join(" ") || "auto bump version";
  autoBumpAndRelease(msg);
}
