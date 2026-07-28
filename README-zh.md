# 蝴蝶效应

[![CI](https://github.com/HuaTalk/butterfly-effect-skill/actions/workflows/test.yml/badge.svg)](https://github.com/HuaTalk/butterfly-effect-skill/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![English](https://img.shields.io/badge/lang-English-blue.svg)](README.md)

**AI 会话里的“月光宝盒”：带着后来得到的信息，回到对话开始偏离预期的节点。**

一段 AI 会话起初可能看起来没有问题，但某个假设或决定会让 LLM 走上错误路径，此后的输出越来越不符合预期。直到后面经过多次纠偏，你才知道在那个节点应该怎样做。

蝴蝶效应利用 session 后半段出现的纠偏和确认，向前追溯到最早有依据的分叉点。它会告诉你应该回到哪里，并生成一段修订后的提示词，把后来获得的信息带回那个节点，让后续轨迹走向期望结果。

原会话开始前不需要安装追踪器或做任何准备，直接使用已有对话即可。

## 30 秒看懂

你最初提出：

> 修复结账时偶发重复扣款的问题。

Agent 随后假设前端按钮是唯一的支付入口。从这个节点开始，它的输出逐渐偏离真正的问题。你后来不得不反复纠正：要追踪支付回调和重试、修改前先证明原因、不能破坏现有支付接口。

```text
最初请求 -> 只看前端的错误假设 -> 输出持续偏离 -> 后续纠偏
            ^ 带着后来获得的信息回到这里
```

输入：

```text
使用 /butterfly-effect 分析当前会话。
```

你会得到：

**回退建议**

> 回退到 Agent 把前端按钮当成唯一支付入口之前。这个假设导致了后续关于回调、重试和幂等性的多次纠偏。

**更新后的提示词**

> 先复现重复扣款，并追踪用户提交、服务端创建订单、支付回调和重试任务的完整链路。修改前先说明证据和根因；保持现有支付接口兼容，再为确认的故障路径补充回归验证。

后续纠偏就是已经知道的“未来”。蝴蝶效应把它们带回“只看前端”这个错误假设发生之前，并转换成新轨迹需要的提示词。

## 什么时候使用

适合这些情况：

- 会话起初正常，之后 LLM 的输出越来越不符合预期；
- 后续纠偏已经暴露了前面哪里出了问题；
- 想回到真正的分叉点，而不是毫无依据地从头重来；
- 想把后见信息变成修订后的提示词，又不伪装成当时已经知道答案。

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
