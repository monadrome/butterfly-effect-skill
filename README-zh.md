# 蝴蝶效应

[![CI](https://github.com/HuaTalk/butterfly-effect-skill/actions/workflows/test.yml/badge.svg)](https://github.com/HuaTalk/butterfly-effect-skill/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![English](https://img.shields.io/badge/lang-English-blue.svg)](README.md)

**把一段反复纠偏的 AI 会话，变成一次更好的重开。**

当你已经多次要求 AI Agent 改变方向时，蝴蝶效应会找出最早有依据的错误假设，并交付两项结果：一条简短的回退建议，以及一段可以直接复制到新会话的提示词。

原会话开始前不需要安装追踪器或做任何准备，直接使用已有对话即可。

## 30 秒看懂

你最初提出：

> 修复结账时偶发重复扣款的问题。

随后却不得不反复纠正 Agent：不要只看前端按钮、要追踪支付回调和重试、修改前先证明原因、不能破坏现有支付接口。

输入：

```text
使用 /butterfly-effect 分析当前会话。
```

你会得到：

**回退建议**

> 回退到 Agent 把前端按钮当成唯一支付入口之前。这个假设导致了后续关于回调、重试和幂等性的多次纠偏。

**更新后的提示词**

> 先复现重复扣款，并追踪用户提交、服务端创建订单、支付回调和重试任务的完整链路。修改前先说明证据和根因；保持现有支付接口兼容，再为确认的故障路径补充回归验证。

把更新后的提示词粘贴到新会话，就能带着已经确认的要求重新开始同一个任务。

## 什么时候使用

适合这些情况：

- Agent 一直在解决错误版本的问题；
- 经过多次纠偏，结果才逐渐可用；
- 想重开任务，但不想再次重复相同指导；
- 想知道是哪一个更早的假设造成了返工。

它适用于编码、调研、写作、设计、规划、运营及其他 AI 协作任务。

如果会话中没有足够证据支撑一个可靠原因，它可能返回 `No reliable drift or rewind point detected`。这比把普通追问拼成一段虚构的重开提示词更可靠。

## 安装

### Agent Skills

适用于 Codex、Cursor、Windsurf、Gemini CLI、GitHub Copilot、Cline 及其他兼容 Agent：

```bash
npx skills add HuaTalk/butterfly-effect-skill
```

### Claude Code

先注册插件市场，再安装插件：

```text
/plugin marketplace add https://github.com/HuaTalk/butterfly-effect-skill.git
/plugin install butterfly-effect@butterfly-effect
```

安装后重启 Claude Code。原生命令是 `/butterfly-effect:butterfly-effect`；没有其他同名命令时，也可以使用 `/butterfly-effect`。

### npm

适用于使用 `skills-npm` 的环境：

```bash
npm install -D @huatalk/butterfly-effect-skill
npx skills-npm setup
```

## 使用

### 当前会话

默认分析当前会话：

```text
使用 /butterfly-effect 分析当前会话。
```

如果当前可见对话已被截断，Skill 只会尝试恢复能够识别的同一个 session，不会用无关会话替代缺失历史。

### Transcript 或指定会话

也可以指定导出的 transcript 或本地会话：

```text
使用 /butterfly-effect 分析 /path/to/transcript.md。
使用 /butterfly-effect 分析 Codex 会话 "launch-plan"。
```

分析多个会话时，可以要求它分别处理每个会话。更多场景见[详细示例](docs/zh/examples.md)。

### 输出模式

| 请求 | 结果 |
|---|---|
| `使用 /butterfly-effect 分析当前会话。` | 回退建议和更新后的提示词 |
| `使用 /butterfly-effect --prompt-only 分析当前会话。` | 只返回更新后的提示词 |
| `使用 /butterfly-effect --detailed 分析当前会话。` | 默认结果，以及支持该结论的纠偏和未纳入项 |

只有明确指定时才会启用 `--prompt-only`。

## 会读取什么

- 没有指定来源时，只使用当前 session。
- 指定会话或路径后，只读取完成任务所需的相关历史。
- 输出会移除凭据、密钥、私有标识符和无关个人内容。
- 后来才发现的事实会被改写成检查或验证要求，不会伪装成开局时已经知道的信息。

## 局限

识别纠偏和判断因果关系仍依赖模型。历史缺失、彼此独立的改向或含义不明确的反馈，都可能导致无法给出可靠回退建议。重要提示词在复用前仍应人工检查，尤其是 transcript 跨越多个会话或包含敏感内容时。

证据模型和常见失败情况见[设计说明](docs/zh/design.md)。

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

修改行为或发布元数据前，请先阅读[贡献指南](CONTRIBUTING.md)。问题可提交到 [GitHub Issues](https://github.com/HuaTalk/butterfly-effect-skill/issues)。

## 许可证

[MIT](LICENSE)
