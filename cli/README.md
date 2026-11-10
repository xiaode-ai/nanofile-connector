# NanoFile 原生命令行工具 (CLI) 指南

## 1. 概述

本目录下随附了预编译的 Windows 原生命令行工具 [`nf.exe`](./nf.exe) 与等价别名 [`nanofile-cli.exe`](./nanofile-cli.exe)（单文件约 330 KB）。
二者内容完全相同，可在本目录直接调用；若需在任意终端全局使用，必须手动复制到用户级 PATH 目录（如 `%LOCALAPPDATA%\Microsoft\WindowsApps`）。
`nf` 采用轻量客户端代理架构（Thin CLI），作为与 NanoFile 桌面端通信的高效命令行桥梁，帮助开发者和 AI Agent 在终端中直接调用 NanoFile 强大的本地文件管理能力。

### 核心特性

- **开箱即用**：直接提供预编译的单文件原生可执行程序 [`nf.exe`](./nf.exe) 及 [`nanofile-cli.exe`](./nanofile-cli.exe)，在本目录免编译直接执行；全局调用需自行加入 PATH。
- **极致轻量**：单文件约 330 KB，全原生机器码交付，无任何 Node.js、Python 或外部解释器依赖，启动耗时仅数毫秒。
- **无缝集成桌面端**：深度对接 NanoFile 桌面端核心引擎，共享毫秒级全盘极速检索与底层文件管理能力。
- **对齐 MCP 全量能力**：完整覆盖全盘极速检索、文件内容读写、目录浏览、物理生命周期、元数据提取、标签维护、应用管理及收藏夹功能。

### 前置要求

- 运行 `nf.exe` 需要本机已安装 **NanoFile 桌面客户端**（推荐前往微软应用商店下载安装）。
- 商店 MSIX 安装包**不包含 `nf.exe`，也不会注册 `nf` 执行别名**；本工具随 `nanofile-connector` 单独分发。
- 全局使用需手动加入 PATH（PowerShell）：

  ```powershell
  Copy-Item .\nf.exe "$env:LOCALAPPDATA\Microsoft\WindowsApps\"
  Copy-Item .\nanofile-cli.exe "$env:LOCALAPPDATA\Microsoft\WindowsApps\"
  ```

  该目录默认已在系统 PATH 中，复制后即可在任意终端执行 `nf` / `nanofile-cli`；未复制时请在 `cli/` 目录下使用 `.\nf.exe`。

- 若未检测到桌面客户端，工具将输出友好的安装引导提示。

---

> ℹ️ 以下命令以 `nf` 形式书写，假定已按上文加入 PATH；未加入时请在本目录改用 `.\nf.exe`。

## 2. 命令速查矩阵

| 命令         | 别名            | 说明                     | 典型示例                                         |
| :----------- | :-------------- | :----------------------- | :----------------------------------------------- |
| `nf search`  | `nf find`       | 毫秒级全盘极速检索       | `nf search "财务报表" --ext xlsx --limit 10`     |
| `nf cat`     | `nf read`       | 读取文本文件内容         | `nf cat "D:\docs\config.json" --limit 500`       |
| `nf write`   | -               | 创建或覆盖写入文件       | `nf write "D:\test.txt" "hello" --overwrite`     |
| `nf ls`      | `nf list`       | 浏览目录子项目           | `nf ls "D:\Projects" --limit 20`                 |
| `nf mkdir`   | -               | 递归创建目录             | `nf mkdir "D:\Projects\NewFolder"`               |
| `nf open`    | -               | 打开文件或目录           | `nf open "D:\file.pdf" --app "acrobat.exe"`      |
| `nf mv`      | `nf move`       | 移动文件或目录           | `nf mv "D:\a.txt" "D:\Backup\a.txt"`             |
| `nf cp`      | `nf copy`       | 复制文件或目录           | `nf cp "D:\a.txt" "D:\Backup\a_copy.txt"`        |
| `nf rename`  | -               | 重命名文件或目录         | `nf rename "D:\old.txt" "D:\new.txt"`            |
| `nf trash`   | -               | 安全移入 Windows 回收站  | `nf trash "D:\temp.log"`                         |
| `nf rm`      | `nf delete`     | 移入 Windows 回收站      | `nf rm "D:\junk.tmp"`                            |
| `nf meta`    | `nf metadata`   | 获取物理属性与媒体元数据 | `nf meta "D:\video.mp4" --media --json`          |
| `nf tag`     | `nf tags`       | 标签管理（增删改查）     | `nf tag set "D:\file.txt" "Work" "Important"`    |
| `nf fav`     | `nf favorites`  | 收藏夹与快速访问管理     | `nf fav list` / `nf fav add "D:\Work"`           |
| `nf app`     | `nf apps`       | 已安装应用检索与启动     | `nf app list "notepad"` / `nf app run "notepad"` |
| `nf tools`   | `nf list-tools` | 列出所有底层 MCP 工具    | `nf tools --json`                                |
| `nf call`    | -               | **原生 MCP 直通调度**    | `nf call search_items '{"query":"doc"}' --json`  |
| `nf version` | -               | 显示 CLI 版本号          | `nf version`                                     |

---

## 3. 详细使用示例

### 3.1 毫秒级极速检索

```bash
# 1. 简单按名称关键词搜索
nf search "report"

# 2. 限制文件类型与扩展名
nf search "report" --ext pdf --type file --limit 5

# 3. 限定父目录范围检索
nf search "readme" --path "D:\Projects"

# 4. 结构化 JSON 输出（供自动化脚本消费）
nf search "project" --json
```

### 3.2 文件与目录操作

```bash
# 读取文件文本
nf cat "D:\Projects\README.md"

# 分段读取（跳过前 100 字符，最多读 200 字符）
nf cat "D:\LargeFile.log" --offset 100 --limit 200

# 写入文件
nf write "D:\output.txt" "Hello NanoFile" --overwrite

# 浏览目录（支持递归）
nf ls "D:\Projects" --limit 30 --recursive
```

### 3.3 元数据与多媒体探针

```bash
# 获取文件常规文件系统属性
nf meta "D:\document.docx"

# 获取音视频与多媒体深度元数据（JSON 格式）
nf meta "D:\music.mp3" --media --json
```

### 3.4 标签维护与管理

```bash
# 查看系统全部标签及关联项目数
nf tag list

# 查看指定文件的标签
nf tag get "D:\Project\doc.pdf"

# 为项目设置/绑定标签
nf tag set "D:\Project\doc.pdf" "工作" "待审"

# 移除项目指定标签
nf tag remove "D:\Project\doc.pdf" "待审"
```

### 3.5 原生 MCP 直通调度 (`nf call`)

AI Agent 或开发人员可以直接按 MCP Tool 契约传递任意 JSON 参数：

```bash
# 直接调度 search_items
nf call search_items '{"query":"invoice","item_type":"file","limit":3}' --json

# 直接调度 get_favorites
nf call get_favorites '{}' --json

# 导出全量 MCP 工具 Schema
nf tools --json
```

---

## 4. 与 AI Agent / 自动化脚本集成

在没有启动 stdio JSON-RPC 管道常驻服务的轻量级场景下，AI Agent 可通过终端子进程直接执行 `nf` 命令获取纯净结构化数据：

```python
import subprocess
import json

# Python 示例：调用 nf 搜索文件
result = subprocess.run(
    ["nf", "search", "合同", "--ext", "pdf", "--json"],
    capture_output=True,
    text=True,
    check=True
)
data = json.loads(result.stdout)
print(f"找到 {len(data.get('items', []))} 项文件")
```

```javascript
// Node.js / Bun 示例：调用 nf 直通工具
import { spawnSync } from "child_process";

const proc = spawnSync("nf", ["call", "list_all_tags", "{}", "--json"], {
  encoding: "utf-8",
});
const tags = JSON.parse(proc.stdout);
console.log("系统标签:", tags);
```
