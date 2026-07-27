# 蝴蝶效应

[![CI](https://github.com/HuaTalk/butterfly-effect-skill/actions/workflows/test.yml/badge.svg)](https://github.com/HuaTalk/butterfly-effect-skill/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![English](https://img.shields.io/badge/lang-English-blue.svg)](README.md)

**把后来发生的纠偏，变成一开始就更好的提示词。**

蝴蝶效应读取已经发生的 AI 协作会话，从中找出真正改变执行结果的人工纠偏，再生成一段可以直接用于重开同一任务的提示词。它不要求提前安装追踪器或标记每次纠正，也不会把后来才查到的事实伪装成开局时已经知道的信息。

## 快速开始

从 GitHub 安装 Skill：

```bash
npx skills add HuaTalk/butterfly-effect-skill
```

一段反复纠偏的会话结束后，输入：

```text
使用 $butterfly-effect，把当前会话中的纠偏变成一段更好的初始提示词。
```

把返回的引用块粘贴到新会话中，就可以重新开始任务。

## 示例

假设一次编码会话里出现了这些纠偏：

- 修改前先检查并解释现状。
- 必须在指定 worktree 工作。
- 保留 V2，通过开关新增 V3。
- 运行已有测试，但未明确要求时不要新增测试。

蝴蝶效应会先返回重开提示词：

> 先在指定 worktree 中检查并解释现有行为、调用链和问题原因，不要修改代码。等我确认后再实现。保留 V2，通过默认关闭的开关新增 V3；配置读取留在入口，核心匹配逻辑使用纯函数和显式参数。运行已有测试，未明确要求时不要新增测试；提交和推送前检查 worktree 与 diff。

会话中已经确认的约束会直接写成指令。如果根因是在读代码后才发现的，提示词只会要求先检查或复现，不会直接断言根因。

## 安装

### Agent Skills

适用于 Codex、Cursor、Windsurf、Gemini CLI、GitHub Copilot、Cline，以及 Agent Skills 生态支持的其他环境：

```bash
npx skills add HuaTalk/butterfly-effect-skill
```

安装位置和兼容性由安装器及宿主 Agent 的 Skill 实现决定。

### Claude Code

先把仓库注册为插件市场：

```text
/plugin marketplace add https://github.com/HuaTalk/butterfly-effect-skill.git
```

再用单独一条指令安装插件：

```text
/plugin install butterfly-effect@butterfly-effect
```

安装后重启 Claude Code。原生插件命令是 `/butterfly-effect:butterfly-effect`；没有同名命令时，也可以使用较短的 `/butterfly-effect`。

## 使用方式

默认来源是当前会话。只有请求明确指定较早或当前不可见的会话时，Skill 才会搜索本地历史记录。

| 目标 | 调用示例 | 来源处理 |
|---|---|---|
| 重开当前任务 | `使用 $butterfly-effect 分析当前会话。` | 只使用当前可见的对话 |
| 分析指定的本地会话 | `使用 $butterfly-effect 分析 Codex 会话 "checkout-refactor"。` | 定位并读取该会话 |
| 分析导出的记录 | `使用 $butterfly-effect 分析 /path/to/transcript.md。` | 按顺序读取指定 transcript 或 handoff |
| 同时查看分析依据 | `使用 $butterfly-effect --detailed 分析当前会话。` | 先返回提示词，再列出纠偏和未纳入项 |
| 对比多个会话 | `使用 $butterfly-effect 分析这三个会话导出文件。` | 先分别分析，再保留重复出现的规则 |

分析 Issue 讨论或 Review 记录时，需要提供本地可访问的导出内容或路径；Skill 不会自行抓取远端讨论。更多用法见[详细示例](docs/zh/examples.md)。

## 工作方式

1. 还原任务最初的目标和当时可用的信息。
2. 找出用户实质纠正 Agent 做法的对话轮次。
3. 区分稳定偏好、任务专属要求和一次性决定。
4. 把后来才发现的事实转换成检查或验证步骤。
5. 按执行顺序组织重开提示词。
6. 检查提示词是否覆盖所有高置信度纠偏，同时没有加入无依据的规则。

## 设计原则

- **零准备：** 直接分析已经存在的记录，使用前不需要初始化、安装 hook 或标记纠偏。
- **Prompt-first：** 直接交付新会话需要的提示词，不让用户再把复盘报告翻译成指令。
- **反事实重开：** 重建“如果一开始就这样说”的提示词，同时尊重当时的信息边界。

[设计说明](docs/zh/design.md)进一步介绍证据模型、非目标和常见失败方式。

## 隐私与范围

- 没有明确指定来源时，只使用当前可见的对话。
- 指定会话或路径后，只读取完成任务所需的相关历史。
- 输出会移除凭据、密钥、私有标识符和无关的个人内容。
- 历史缺失或证据含糊时，只简短说明缺口，不会编造纠偏。
- 能读取原始时间顺序消息时，自动生成的摘要只作为次级证据。

## 验证与局限

仓库 CI 会检查版本一致性、发布 tag、Skill 契约锚点、本地引用、插件清单、双语 README 结构、英文文档语言边界和 npm 包内容。目前还没有运行时提取准确率基准。

纠偏分类依赖模型结合上下文判断，可能漏掉隐含偏好，也可能把一次反应概括得过宽，或错误处理互相矛盾的指令。重要的重开提示词应先人工检查，尤其是来源跨越多个会话或包含敏感信息时。

## 更新

Agent Skills：

```bash
npx skills add HuaTalk/butterfly-effect-skill
```

Claude Code：

```text
/plugin update butterfly-effect@butterfly-effect
```

更新后重启 Claude Code。版本变化见[变更记录](CHANGELOG.md)。

## 开发

```bash
npm test
npm run check:package
```

`npm test` 会运行 release tag 回归测试，以及仓库、Skill、文档和包内容的全部检查。修改行为或发布元数据前，请先阅读[贡献指南](CONTRIBUTING.md)。问题可提交到 [GitHub Issues](https://github.com/HuaTalk/butterfly-effect-skill/issues)。

## 许可证

[MIT](LICENSE)
