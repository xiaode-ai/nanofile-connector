import { spawn, spawnSync } from "child_process";
import { existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// 优先探测全原生极速 CLI (nf.exe)
function resolveNfCliExe() {
  // 1. 优先探测当前 Skill 自带的 cli/nf.exe
  const bundledCli = resolve(__dirname, "../cli/nf.exe");
  if (existsSync(bundledCli)) return bundledCli;

  // 2. 本地开发与构建产物
  const localTarget = resolve(process.cwd(), "src-tauri/target/debug/nf.exe");
  if (existsSync(localTarget)) return localTarget;
  const localRelease = resolve(
    process.cwd(),
    "src-tauri/target/release/nf.exe",
  );
  if (existsSync(localRelease)) return localRelease;

  // 3. 微软商店安装的全局执行别名
  if (process.env.LOCALAPPDATA) {
    const storeApp = resolve(
      process.env.LOCALAPPDATA,
      "Microsoft/WindowsApps/nf.exe",
    );
    if (existsSync(storeApp)) return storeApp;
  }
  return null;
}

// 兜底探测 NanoFile 主程序 (NanoFile.exe --mcp)
function resolveNanoFileExe() {
  const localTarget = resolve(
    process.cwd(),
    "src-tauri/target/debug/NanoFile.exe",
  );
  if (existsSync(localTarget)) return localTarget;
  const localRelease = resolve(
    process.cwd(),
    "src-tauri/target/release/NanoFile.exe",
  );
  if (existsSync(localRelease)) return localRelease;
  if (process.env.LOCALAPPDATA) {
    const storeApp = resolve(
      process.env.LOCALAPPDATA,
      "Microsoft/WindowsApps/NanoFile.exe",
    );
    if (existsSync(storeApp)) return storeApp;
  }
  return "nanofile.exe";
}

export function callMcp(toolName, args) {
  // 1. 优先使用原生 nf.exe 直调（毫秒级原生直通，0 握手延迟）
  const nfExe = resolveNfCliExe();
  if (nfExe) {
    try {
      const proc = spawnSync(
        nfExe,
        ["call", toolName, JSON.stringify(args || {}), "--json"],
        {
          encoding: "utf-8",
          windowsHide: true,
        },
      );
      if (proc.status === 0 && proc.stdout) {
        try {
          return Promise.resolve(JSON.parse(proc.stdout.trim()));
        } catch (_) {
          return Promise.resolve(proc.stdout.trim());
        }
      } else if (proc.status !== 0) {
        return Promise.reject(
          new Error(
            proc.stderr?.trim() ||
              proc.stdout?.trim() ||
              `nf.exe exited with code ${proc.status}`,
          ),
        );
      }
    } catch (_) {
      // 降级至 stdio MCP 管道
    }
  }

  // 2. 兜底走 NanoFile.exe --mcp stdio 管道
  return new Promise((resolve, reject) => {
    const exe = resolveNanoFileExe();
    const child = spawn(exe, ["--mcp"]);

    child.stdout.on("data", (d) => {
      const text = d.toString();
      try {
        const json = JSON.parse(text);
        if (json.id === 1) {
          // 初始化成功，直接派发工具调用
          const req =
            JSON.stringify({
              jsonrpc: "2.0",
              id: 2,
              method: "tools/call",
              params: { name: toolName, arguments: args },
            }) + "\n";
          child.stdin.write(req);
        } else if (json.id === 2) {
          child.kill();
          if (json.result && json.result.content && json.result.content[0]) {
            try {
              const parsed = JSON.parse(json.result.content[0].text);
              resolve(parsed);
            } catch (_) {
              resolve(json.result.content[0].text);
            }
          } else {
            resolve(json.result);
          }
        }
      } catch (_) {}
    });

    child.stderr.on("data", () => {});
    child.on("error", (err) => reject(err));

    setTimeout(() => {
      child.kill();
      reject(new Error("NanoFile MCP 调用超时 (15000ms)"));
    }, 15000);

    // 握手包
    const initReq =
      JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: "2024-11-05",
          clientInfo: { name: "NanoCLI", version: "1.0" },
        },
      }) + "\n";
    child.stdin.write(initReq);
  });
}

// CLI 模式支持：bun scripts/nanofile_cli.mjs search_items '{"query":"@@@"}'
if (process.argv[2]) {
  const tool = process.argv[2];
  let params = {};
  if (process.argv[3]) {
    try {
      params = JSON.parse(process.argv[3]);
    } catch (_) {
      params = { query: process.argv[3] };
    }
  }
  callMcp(tool, params)
    .then((res) => {
      console.log(JSON.stringify(res, null, 2));
      process.exit(0);
    })
    .catch((err) => {
      console.error("Error:", err.message);
      process.exit(1);
    });
}
