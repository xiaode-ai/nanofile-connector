# ⚡ NanoFile MCP Server, Agent Skills & Plugins

[![MCP Compatible](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io/)
[![Agent Plugins](https://img.shields.io/badge/Plugins-Cursor%20%7C%20Dify%20%7C%20LangChain-orange.svg)](plugins/)
[![Native CLI](https://img.shields.io/badge/CLI-nf%20%7C%20nanofile--cli-purple.svg)](cli/)
[![Microsoft Store](https://img.shields.io/badge/Microsoft_Store-NanoFile-0078D7.svg?logo=windows)](https://apps.microsoft.com/detail/9pgwd50gwcjw)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Windows_10%2F11-blue.svg)](https://apps.microsoft.com/detail/9pgwd50gwcjw)

> 🚀 **Official Open Source Repository**: Standard Model Context Protocol (MCP) Server, Modular Agent Skills, Native CLI & Ecosystem Plugins for [NanoFile Desktop](https://apps.microsoft.com/detail/9pgwd50gwcjw).

[中文说明](#-中文说明) | [English Documentation](#-english-documentation)

---

## 🇨🇳 中文说明

本项目是 **NanoFile** 官方开源的 **四位一体 AI Agent 连接器与扩展仓库 (NanoFile Connector)**：

1. **Agent 插件生态 (Plugins & Extensions)**：面向主流 IDE、低代码平台、开放生态的开箱即用插件（Dify、Coze/豆包、Claude、Codex、Cursor、Trae、LangChain 等）；
2. **MCP 服务协议 (Model Context Protocol)**：面向标准 AI 客户端的标准机器通讯协议规范与全量 27 工具 JSON Schema；
3. **原生命令行交互层 (Native CLI - `nf`)**：预编译全原生单文件命令行工具（约 330 KB），为终端与子进程提供即时极速调度；
4. **AI 技能指南 (Agent Skills)**：面向大模型自然语言决策、高情商执行的 7 大核心领域操作指南。

通过将 **开放协议** 与 **微软商店官方桌面端** 结合，外部 AI 宿主无需配置复杂运行环境，只需 5 行 JSON 配置即可直接安全调度本地文件管理器能力。

### 📁 仓库四层架构体系 (Four-Tier Architecture)

```text
nanofile-connector/
├── plugins/                  # 🧩 1. 插件生态层 (Agent Plugins & Toolkits)
│   ├── manifest.json         # 统一插件清单定义 (Plugin Manifest)
│   ├── cursor/.cursorrules   # Cursor / Windsurf / Copilot 专用 Agent 规则插件
│   ├── doubao/               # 字节跳动豆包 (Doubao) / 扣子 (Coze) 插件规范与 OpenAPI
│   │   ├── manifest.json     # 豆包/扣子插件元数据清单
│   │   └── openapi.json      # OpenAPI 3.0 工具接口规范
│   ├── dify/provider/nanofile.yaml # Dify / FastGPT 低代码平台自定义工具提供商声明
│   ├── trae/                 # 字节跳动 Trae 智能 IDE 规则插件
│   └── langchain/toolkit.json # LangChain / LlamaIndex / CrewAI 工具包集成声明
├── mcp/                      # 🤖 2. 机器协议层 (MCP Server Protocol Specification)
│   ├── schema.json           # 27 个工具的标准 JSON Schema（供各大 MCP Registry / 插件市场自动索引）
│   └── config.example.json   # Claude Desktop / Cursor / Cline / Windsurf 接入范例
├── cli/                      # ⚡ 3. 命令行交互层 (Native CLI Specification & Tools)
│   ├── nf.exe                # 预编译轻量原生 CLI 工具 (约 330 KB)
│   ├── nanofile-cli.exe      # 等价官方完整别名工具
│   ├── README.md             # 原生 CLI (nf) 完整使用指南与 Agent 调度指引
│   └── commands.json         # 结构化命令清单与 JSON Schema 规范定义
├── skills/                   # 🧠 4. 智能认知层 (Modular Agent Skills Instructions)
│   ├── items/SKILL.md        # 1. 项目读写 (通用搜索、复制、移动、重命名、删除)
│   ├── files/SKILL.md        # 2. 文件读写 (文件专用检索、文本读写、打开方式读取与设定)
│   ├── folders/SKILL.md      # 3. 文件夹读写 (目录专用检索、遍历、新建、打开方式读取与设定)
│   ├── tags/SKILL.md         # 4. 标签读写 (标签库维护、多标签读写与关联管理)
│   ├── metadata/SKILL.md     # 5. 元数据读取 (属性读取、文件夹递归总大小与数量统计)
│   ├── apps/SKILL.md         # 6. 应用程序读写 (已安装应用检索、安全带参启动、卸载唤起)
│   └── favorites/SKILL.md    # 7. 收藏夹读写 (快速访问书签获取、添加、移除)
├── .claude-plugin/           # 📦 Claude Code 官方插件与市场规范
├── .codex-plugin/            # 📦 OpenAI Codex 插件清单
├── .agents/                  # 📦 通用 Agent 插件市场定义
├── SKILL.md                  # 全局 Master 技能总览 (可供外部 AI 宿主一键整体挂载)
├── README.md                 # 官方导航与接入说明
├── package.json              # 项目包清单与版本自增脚本命令
└── LICENSE                   # MIT 开源许可证
```

---

### 🧩 各 Agent 平台真实插件标准支持 (Plugins)

本仓库为业界主流的 Agent 体系提供了**100% 官方规范原生对齐**的插件标准：

| Agent 生态 / 平台                        | 官方插件规范标准                    | 对应开源文件                                                           | 使用方法                                                                          |
| :--------------------------------------- | :---------------------------------- | :--------------------------------------------------------------------- | :-------------------------------------------------------------------------------- |
| **Smithery.ai / MCP Registry**           | 官方 MCP 服务包清单标准             | [`smithery.yaml`](smithery.yaml)                                       | 平台自动收录，开发者可通过 `npx -y @smithery/cli install nanofile` 一键注册       |
| **OpenAI Codex 官方插件市场**            | 官方 Marketplace 目录规范           | [`.agents/plugins/marketplace.json`](.agents/plugins/marketplace.json) | 通过 `codex plugin marketplace add xiaode-ai/nanofile-connector` 一键发现与安装   |
| **Claude Code 官方插件市场**             | 官方 Claude Plugin 规范             | [`.claude-plugin/plugin.json`](.claude-plugin/plugin.json)             | Claude Code 官方插件市场一键安装与装载                                             |
| **Dify 1.0 官方插件体系**                | 独立 Plugin + Provider + Tools 规范 | [`plugins/dify/manifest.yaml`](plugins/dify/manifest.yaml)             | Dify 官方插件目录标准，支持在 Dify 平台一键打包与安装自定义工具插件               |
| **字节跳动 豆包 / 扣子 (Doubao & Coze)** | 豆包智能体 / OpenAPI 3.0 插件规范   | [`plugins/doubao/openapi.json`](plugins/doubao/openapi.json)           | 扣子平台一键导入 OpenAPI 规范创建插件，直接发布到豆包 AI 个人助手与电脑端         |
| **字节跳动 Trae**                        | 原生 MCP 规则与配置                 | [`plugins/trae/mcp.json`](plugins/trae/mcp.json)                       | Trae IDE 设置中导入配置，即刻具备本地文件系统极速搜索能力                         |
| **Cursor / Windsurf / Copilot**          | IDE 提示词规则与 Agent 上下文规约   | [`plugins/cursor/.cursorrules`](plugins/cursor/.cursorrules)           | 直接将 `.cursorrules` 复制到项目根目录下，代码 Agent 即刻具备调用 NanoFile 的感知 |
| **Claude / Antigravity Plugins**         | 官方 Agent Plugin 标准清单          | [`plugin.json`](plugin.json)                                           | 声明工具列表、技能路径与 MCP 服务关联，宿主自动装载                               |
| **LangChain / LlamaIndex / CrewAI**      | Agent Toolkit 架构清单              | [`plugins/langchain/toolkit.json`](plugins/langchain/toolkit.json)     | Python/TS 开发者依据参数快速实例化 `NanoFileToolkit`                              |
| **通用 MCP 客户端 / Registry**           | 官方 JSON Schema 协议定义           | [`mcp/schema.json`](mcp/schema.json)                                   | 各大 AI 框架与客户端一键导入 27 个标准工具参数定义与校验规则                      |

---

### 🛠️ 7 大核心能力速查 (27 个标准 MCP Tools)

|   #   | 能力分类         | 专项子技能                                      | 核心职能与代表工具                                                                                                    | 工具数 |
| :---: | :--------------- | :---------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------- | :----: |
| **1** | **项目读写**     | [`skills/items`](skills/items/SKILL.md)         | `search_items` (搜索项目[含文件/文件夹]/搜索文件/搜索文件夹，三选一防重复检索); `operate_item`; `batch_operate_items` |   3    |
| **2** | **文件读写**     | [`skills/files`](skills/files/SKILL.md)         | `read_file_content`; `write_file_content`; `open_file`; `get_file_default_app`; `set_file_default_app`                |   5    |
| **3** | **文件夹读写**   | [`skills/folders`](skills/folders/SKILL.md)     | `list_folder_contents`; `create_folder`; `open_folder`; `get_folder_default_app`; `set_folder_default_app`            |   5    |
| **4** | **标签读写**     | [`skills/tags`](skills/tags/SKILL.md)           | `list_all_tags`; `delete_tag`; `rename_tag`; `get_item_tags`; `set_item_tags`; `remove_item_tags`                     |   6    |
| **5** | **元数据读取**   | [`skills/metadata`](skills/metadata/SKILL.md)   | `get_item_metadata` (含文件夹递归总大小与条目数量统计); `get_media_metadata`                                          |   2    |
| **6** | **应用程序读写** | [`skills/apps`](skills/apps/SKILL.md)           | `search_apps`; `launch_app`; `uninstall_app`                                                                          |   3    |
| **7** | **收藏夹读写**   | [`skills/favorites`](skills/favorites/SKILL.md) | `get_favorites`; `add_favorite`; `remove_favorite`                                                                    |   3    |

---

### 📥 1. 安装 NanoFile 桌面应用 (底层原生驱动)

所有 MCP 工具调用与原生 CLI 均由底层的 NanoFile 原生引擎驱动，零环境依赖：

- 🛒 **微软应用商店直达 Web 链接**：[Microsoft Store 商店详情页](https://apps.microsoft.com/detail/9pgwd50gwcjw)
- ⚡ **Windows 一键唤起安装协议**：`ms-windows-store://pdp/?ProductId=9PGWD50GWCJW`

> **免配环境说明**：无需安装 Node.js、Python 或任何重型运行时。安装商店应用后，Windows 会自动注册全局执行别名 `nanofile.exe` 与原生命令行工具 `nf.exe`。

---

### ⚙️ 2. MCP 服务配置 (ServerConfig)

本地 STDIO 类型服务，无需任何公网地址，仅依赖微软商店安装后的全局执行别名 `nanofile.exe`。

**ServerConfig**

```json
{
  "mcpServers": {
    "nanofile": {
      "type": "stdio",
      "command": "nanofile.exe",
      "args": ["--mcp"]
    }
  }
}
```

**环境变量 (Environment Variables)**

无需环境变量，留空即可。

详细的各类客户端模板参见 [`mcp/config.example.json`](mcp/config.example.json)。

---

### ⚡ 3. 原生命令行工具 (Native CLI - `nf` / `nanofile-cli`)

本仓库 [`cli/`](cli/) 目录下随附了预编译的单文件原生机器码程序 [`nf.exe`](cli/nf.exe) 与官方别名 [`nanofile-cli.exe`](cli/nanofile-cli.exe)（单文件约 330 KB，零外部解释器依赖）：

- **毫秒级全盘极速检索**：`nf search "财务报表" --ext xlsx --limit 10`
- **读取文件内容**：`nf cat "D:\docs\config.json" --limit 500`
- **写入文件内容**：`nf write "D:\test.txt" "hello" --overwrite`
- **浏览目录**：`nf ls "D:\Projects" --limit 20`
- **安全移入回收站**：`nf trash "D:\temp.log"` (防意外损毁，支持系统撤回)
- **物理与媒体元数据**：`nf meta "D:\video.mp4" --media --json`
- **标签库管理**：`nf tag list` / `nf tag set "D:\doc.pdf" "Work" "Important"`
- **快速访问与收藏**：`nf fav list` / `nf fav add "D:\Projects"`
- **原生 MCP 工具直通**：`nf call search_items '{"query":"合同"}' --json`
- **完整 CLI 文档**：详见 [`cli/README.md`](cli/README.md)。

---

### 🌐 4. 全球与国内主流 Agent 平台兼容矩阵 (21+ 平台全覆盖)

无论您使用的是国外前沿 Agent 还是国内自研 AI 编程/工作流平台，NanoFile 均能无缝适配：

#### 🌍 国外主流 Agent 平台 (11 款)

| 平台名称                   | 适配协议 / 载体                | 接入方式                                                                                                |
| :------------------------- | :----------------------------- | :------------------------------------------------------------------------------------------------------ |
| **Claude** (Anthropic)     | 原生 MCP (`stdio`)             | `claude_desktop_config.json` 配置 `nanofile.exe --mcp`                                                  |
| **Cursor**                 | 原生 MCP + `.cursorrules`      | Cursor Settings > MCP Servers 添加，复制 [`.cursorrules`](plugins/cursor/.cursorrules) 到项目           |
| **GitHub Copilot**         | 原生 MCP + Copilot Rules       | VS Code Copilot MCP 设置，自动识别 [`.github/copilot-instructions.md`](.github/copilot-instructions.md) |
| **Google Antigravity**     | 原生 MCP + `plugin.json`       | 官方原生识别根目录 [`plugin.json`](plugin.json) 与 `skills/`                                            |
| **OpenCode** (Continue)    | 原生 MCP (`stdio`)             | Continue / OpenCode `config.json` 中配置 `nanofile`                                                     |
| **OpenAI Codex**           | 官方插件市场 (Marketplace)     | `codex plugin marketplace add xiaode-ai/nanofile-connector`，安装 `nanofile`                            |
| **xAI Grok**               | Function Calling (Tool Schema) | 调用 [`mcp/schema.json`](mcp/schema.json) 工具声明                                                      |
| **OpenClaw**               | 原生 MCP 客户端                | 直接配置本地 MCP 服务端命令 `nanofile.exe --mcp`                                                        |
| **Hermes** (Nous Research) | Tool Calling / Schema          | 导入 [`mcp/schema.json`](mcp/schema.json) 工具规范                                                      |
| **Inflection Pi**          | 开放工具定义                   | 参照 [`mcp/schema.json`](mcp/schema.json) 进行外部 Tool 绑定                                            |
| **Bionic** (Bionic-GPT)    | 原生 MCP 客户端                | 在 Bionic 连接面板中添加本地 MCP stdio 实例                                                             |

#### 🇨🇳 国内主流 Agent 平台 (11 款)

| 平台名称                         | 适配协议 / 载体           | 接入方式                                                                                                  |
| :------------------------------- | :------------------------ | :-------------------------------------------------------------------------------------------------------- |
| **字节跳动 Trae**                | 原生 MCP (`stdio`)        | Trae 设置 > MCP 面板添加 `nanofile.exe --mcp`，或使用 [`plugins/trae/mcp.json`](plugins/trae/mcp.json)    |
| **字节跳动 豆包 / 扣子**         | 豆包智能体 / OpenAPI 规范 | 扣子导入 [`plugins/doubao/openapi.json`](plugins/doubao/openapi.json)，一键发布至豆包 AI 个人助手与电脑端 |
| **Kimi Code** (月之暗面)         | 原生 MCP 协议             | 客户端设置中添加本地 MCP 扩展命令                                                                         |
| **阿里通义灵码 Qoder**           | 原生 MCP + 规则上下文     | IDE 设置中注册本地 MCP 服务端，配置代码库规则                                                             |
| **智谱 ZCode** (CodeGeeX)        | 原生 MCP 扩展             | 插件设置中填写 `nanofile.exe --mcp` 即可接入                                                              |
| **MiniMax Code** (海螺/星野)     | Function Calling / MCP    | 导入工具定义或配置本地 Stdio 管道                                                                         |
| **DeepSeek Harness**             | 标准 Function Calling     | 导入 [`mcp/schema.json`](mcp/schema.json) 声明                                                            |
| **腾讯 WorkBuddy**               | 企业级自定义工具 / Schema | 在机器人/工作流后台导入 [`mcp/schema.json`](mcp/schema.json) 工具规范                                     |
| **百度度伴 DuMate** (文心智能体) | 文心智能体 Tool Schema    | 智能体开发平台导入 [`mcp/schema.json`](mcp/schema.json) 工具声明                                          |
| **腾讯 Marvis**                  | 智能体 Tool Schema        | 导入 [`mcp/schema.json`](mcp/schema.json) 规范作为系统辅助工具                                            |
| **QClaw**                        | 原生 MCP 客户端协议       | 直接挂载 `nanofile.exe --mcp` 本地运行实例                                                                |

---

### 🚀 5. 版本发布与 Git 标签同步机制 (Release & Tag Sync)

本仓库建立了一键自动化版本自增与全平台清单同步标准。

#### 每次提交规范：
每次代码修改与发布，统一执行：

```bash
# 自动递增版本号 (0-999 进位制)、更新所有清单、提交 Git、打本地 Tag、推送分支与云端 Tag、并自动创建 GitHub Release
npm run release "feat: your commit message"
# 或直接调用：
node scripts/bump_version.mjs "feat: your commit message"
```

该脚本将自动执行以下完整流水线：
1. **多清单版本自动同步**：递增版本号并写入 `plugin.json`、`plugins/manifest.json`、`.claude-plugin/plugin.json`、`.codex-plugin/plugin.json`、`.claude-plugin/marketplace.json`、`plugins/doubao/manifest.json`、`plugins/doubao/openapi.json` 及 `package.json`；
2. **Git 暂存与提交**：`git add -A` 并提交 `release: v<version> - <commit_message>`；
3. **本地 Git Tag 创建**：自动打上 `v<version>` 标签；
4. **云端 Git 同步**：同步推送到 `origin main` 与 `origin v<version>`；
5. **GitHub Release 创建**：调用 `gh release create` 自动创建云端 Release；
6. **GitHub Actions 兜底保障**：云端配置了 [`.github/workflows/release.yml`](.github/workflows/release.yml)，对所有推送到 `main` 分支的提交自动核验并确保 Release 与 Tag 完备同步。

---

## 🌐 English Documentation

**NanoFile MCP & Skills** provides the official open-source [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server declarations, modular agent skills, native CLI tools, and ecosystem plugins for the [NanoFile Desktop](https://apps.microsoft.com/detail/9pgwd50gwcjw) app.

### 🌟 Four-Tier Architecture

1. **Plugin Ecosystem (`plugins/`)**: Ready-to-use plugins for Cursor rules, Dify toolsets, Doubao/Coze OpenAPI specifications, Trae, and LangChain toolkits.
2. **Machine Protocol (`mcp/`)**: Full JSON Schema (`schema.json`) with 27 standard tools for automatic indexing by MCP Registries.
3. **Native CLI (`cli/`)**: Standalone native Windows CLI binary ([`cli/nf.exe`](cli/nf.exe) / [`cli/nanofile-cli.exe`](cli/nanofile-cli.exe), ~330 KB) for terminal and sub-process execution without any dependencies.
4. **Cognitive Skills (`skills/`)**: Natural language guidelines to help LLMs select optimal search modes and safe filesystem actions.

### 📥 1. Installation

Install NanoFile from the Microsoft Store:

- 🛒 **Web**: [Microsoft Store Web Page](https://apps.microsoft.com/detail/9pgwd50gwcjw)
- ⚡ **Protocol**: `ms-windows-store://pdp/?ProductId=9PGWD50GWCJW`

### ⚙️ 2. MCP Configuration (ServerConfig)

Local STDIO service. No public endpoint required — it relies only on the global execution alias `nanofile.exe` registered by the Microsoft Store installation.

**ServerConfig**

```json
{
  "mcpServers": {
    "nanofile": {
      "type": "stdio",
      "command": "nanofile.exe",
      "args": ["--mcp"]
    }
  }
}
```

### ⚡ 3. Native CLI Usage (`nf`)

A precompiled single-binary native tool [`nf.exe`](cli/nf.exe) is included under [`cli/`](cli/):

```bash
# Instant whole-disk search
nf search "quarterly_report" --ext pdf --limit 10

# Read file contents
nf cat "D:\Projects\config.json"

# List directory contents
nf ls "D:\Projects" --limit 20

# Safe recycle bin delete
nf trash "D:\temp.log"

# Direct MCP tool dispatcher
nf call search_items '{"query":"contract","limit":5}' --json
```

For full CLI documentation, see [`cli/README.md`](cli/README.md).

---

## 🛡️ License

- **Repository License**: [MIT License](LICENSE) (Open for all MCP tool definitions, skill prompts, and plugin manifests).
- **NanoFile Desktop**: Distributed and protected under the Microsoft Store End User License Agreement.
