# 蝴蝶效应

把后来发生的纠偏，变成一开始就更好的提示词。

蝴蝶效应会读取一段 AI 协作会话，识别真正改变方向的人工纠偏，并输出一段可直接复制、用于重新开始任务的提示词。

[English](README.md)

## 快速开始

安装到支持 Agent Skills 的编码代理：

```bash
npx skills add HuaTalk/butterfly-effect-skill
```

然后输入：

```text
使用 $butterfly-effect，把当前会话中的纠偏经验变成一段更好的初始提示词。
```

Claude Code 原生插件：

```text
/plugin marketplace add HuaTalk/butterfly-effect-skill
/plugin install butterfly-effect@butterfly-effect
/butterfly-effect
```

## 输出内容

默认只返回一段紧凑的重开提示词：

> 先阅读现有实现并解释当前行为、调用链和问题原因，未经确认不要修改代码。实现时保留旧路径，通过默认关闭的开关接入新路径；核心逻辑使用纯函数和显式参数。默认只运行已有测试，不新增测试；提交前确认正确的 worktree、分支和 diff，使用独立提交并推送，保证 review 只包含有效变化。

需要同时查看纠偏主题和未纳入内容时，使用 `--detailed`。

## 工作方式

1. 还原任务最初的目标和当时已知的信息。
2. 提取真正改变方向的纠偏事件。
3. 区分稳定偏好、任务专属要求和一次性决定。
4. 把后来才发现的事实转换成检查要求，而不是伪装成先验知识。
5. 按执行顺序组织启动提示词。
6. 验证提示词能否覆盖每个高置信度纠偏。

参见[示例](docs/zh/examples.md)和[设计说明](docs/zh/design.md)。

## 支持的来源

默认分析当前会话。也可以分析本地可访问的 Codex 或 Claude Code 历史会话、聊天导出、handoff、Issue 讨论或代码 Review 记录。

## 设计理念

“蝴蝶效应”表示改变开局中的一个小条件，可能改变后续整个路径。这个 Skill 不只是总结哪里出了问题，而是重写任务最初的指令，让新的 Agent 避免同样的返工，同时仍然自行调查起初无法知道的事实。

## 开发

```bash
npm test
npm pack --dry-run
```

欢迎参与改进，参见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 许可证

MIT
