# 蝴蝶效应

[![CI](https://github.com/HuaTalk/butterfly-effect-skill/actions/workflows/test.yml/badge.svg)](https://github.com/HuaTalk/butterfly-effect-skill/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![English](https://img.shields.io/badge/lang-English-blue.svg)](README.md)

**蝴蝶效应用来纠正 AI trajectory drift，而不是默认假设每个会话都需要重写的重开提示词生成器。**

蝴蝶效应分析已经发生的 AI 协作会话，只在因果证据充分时把人工纠偏连接成链条，并定位最早有依据的 Agent 假设或行动，也就是把工作带偏的起点。确认存在偏斜后，它返回简洁的 rewind 建议和一段可直接复制的更新后提示词，用于重开同一任务；历史或因果证据不足时，则降低置信度或返回 `No reliable drift or rewind point detected`，不会伪造精确位置。它适用于编码、调研、写作、设计、规划、运营和其他 AI 协作任务；不要求提前安装追踪器或标记每次纠正，也不会把后来才查到的事实伪装成开局时已经知道的信息。

## 快速开始

通过 npm 安装 Skill：

```bash
npm install -D @huatalk/butterfly-effect-skill
npx skills-npm setup
```

一段反复纠偏的会话结束后，输入：

```text
使用 /butterfly-effect，找出当前会话中 Agent 最早从哪里偏航，并返回 rewind 建议和更新后的提示词。
```

把 `Updated prompt`（更新后的提示词）引用块复制到新会话中；rewind 建议则说明原轨迹最早从哪里偏离。如果会话不能支持可靠的偏斜诊断，Skill 会返回无可靠结果，而不是凭空生成提示词。

## 示例

### 排查偶发重复扣款

最初的请求是：

> 修复结账时偶发重复扣款的问题。

随后，会话中出现了这些纠偏：

- 不要只修改前端按钮。
- 追踪支付回调和重试路径。
- 修改代码前先证明根因。
- 保持现有支付接口兼容。

蝴蝶效应会返回：

**Rewind recommendation（回退建议）**

- **Rewind to（回退到）：** Agent 把前端按钮当成唯一支付入口之前。
- **Why（原因）：** 这个假设解释了后续为什么必须追踪回调、重试和全链路幂等。
- **Keep（保留）：** 修改前先复现，保持现有支付接口，并验证确认过的故障路径。
- **Confidence（置信度）：** high（高）。

**Updated prompt（更新后的提示词）**

> 先复现重复扣款，并追踪用户提交、服务端创建订单、支付回调和重试任务的完整链路。检查所有入口是否一致执行幂等校验，区分用户重复操作、回调重试和并发竞争。修改前先说明证据与根因；保持现有支付接口兼容，再为确认的故障路径补充回归验证。

建议指出了更早的偏斜，而提示词利用了会话中获得的经验，但不会假装最终根因在任务开始时已经明确。

### 重写开源项目文案

最初的请求是：

> 给这个开源项目写一段介绍。

随后，会话中出现了这些纠偏：

- 开头先说解决的问题，不要写口号。
- 面向开发者，不要泛泛而谈。
- 删除夸张表达和无依据的效果声明。
- 用一个具体场景说明价值，并交代当前边界。

蝴蝶效应会返回：

**Rewind recommendation（回退建议）**

- **Rewind to（回退到）：** Agent 把介绍写成泛化的宣传文案之前。
- **Why（原因）：** 这个定位导致了后续关于受众、证据、具体用途和能力边界的纠偏。
- **Keep（保留）：** 面向开发者写作，并以仓库现状为依据。
- **Confidence（置信度）：** high（高）。

**Updated prompt（更新后的提示词）**

> 为这个开源项目撰写一段面向开发者的简洁介绍。开头直接说明它解决的问题、输入和产物，再用一个具体场景展示价值。使用克制、自然的语言，不写宣传口号、空泛优势或未经验证的效果；明确当前能力边界，并确保每项功能描述都有仓库现状支持。

最终结果可以直接用于新会话，同时不会把一次性的措辞反应夸大成普遍的性格偏好。

### 调研一个决策

最初的请求是：

> 帮团队选一个工具。

随后，会话中出现了这些纠偏：

- 先定义团队约束，再选择热门方案。
- 区分有来源的证据、假设和未知信息。
- 比较运营成本、迁移风险和可逆性。
- 给出有适用条件的建议，不要宣布一个放之四海而皆准的赢家。

蝴蝶效应会返回：

**Rewind recommendation（回退建议）**

- **Rewind to（回退到）：** Agent 未先定义团队决策标准就选择热门工具之前。
- **Why（原因）：** 这些纠偏共同暴露的是缺少依据的比较，而不是某个特定厂商选错了。
- **Keep（保留）：** 区分证据与假设，比较可逆性和成本，并给出有条件的建议。
- **Confidence（置信度）：** high（高）。

**Updated prompt（更新后的提示词）**

> 先确认决策标准、受影响的用户、约束条件和时间范围，再比较候选方案。区分有来源的证据、假设和缺失信息；对时效性结论使用最新来源进行核验。比较运营成本、迁移风险和可逆性等取舍，然后给出带适用条件的建议，并附上一段简短的验证计划。

## 安装

安装方式取决于 AI Agent 加载 Skill 的机制。

### npm

适用于使用 `skills-npm` 的环境：

```bash
npm install -D @huatalk/butterfly-effect-skill
npx skills-npm setup
```

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

默认来源是当前会话。如果当前可见历史已被截断，Skill 只会尝试恢复能够识别的同一个 session；只有请求明确指定其他会话时，才会搜索其他本地历史记录。

| 目标 | 调用示例 | 来源处理 |
|---|---|---|
| 重开当前任务 | `使用 /butterfly-effect 分析当前会话。` | 使用当前可见历史；早期轮次被截断时只恢复同一个 session |
| 分析指定的本地会话 | `使用 /butterfly-effect 分析 Codex 会话 "launch-plan"。` | 定位并读取该会话 |
| 分析导出的记录 | `使用 /butterfly-effect 分析 /path/to/transcript.md。` | 按顺序读取指定 transcript 或 handoff |
| 只返回提示词 | `使用 /butterfly-effect --prompt-only 分析当前会话。` | 显式省略 rewind 建议 |
| 同时查看分析依据 | `使用 /butterfly-effect --detailed 分析当前会话。` | 先返回 rewind 建议和提示词，再列出时间线、纠偏和未纳入项 |
| 对比多个会话 | `使用 /butterfly-effect 分析这三个会话导出文件。` | 先分别分析，再保留重复出现的规则 |

分析调研笔记、文档评审、Issue 讨论或其他外部记录时，需要提供本地可访问的导出内容或路径；Skill 不会自行抓取远端内容。更多用法见[详细示例](docs/zh/examples.md)。

`--prompt-only` 是显式输出模式，不能根据过去的用法自动推断，也不能替代默认的 rewind 建议加提示词契约。

## 工作方式

1. 还原任务最初的目标、受众、请求产物和当时可用的信息。
2. 按时间顺序建立 Agent 假设、行动、用户纠偏、已接受决定和后续发现组成的时间线。
3. 只有时间线支持因果关系时，才把相关纠偏连接成链条，并为每条链追溯最早有依据的 Agent 偏斜点。
4. 保持独立链条彼此分开；历史缺失或因果证据较弱时降低置信度，没有可用边界时返回无可靠结果。
5. 区分稳定偏好、任务专属要求和一次性决定。
6. 把后来才发现的事实转换成检查或验证步骤，再按执行顺序组织更新后的提示词。
7. 检查提示词是否覆盖所有高置信度纠偏，同时不引入无依据规则。

## 设计原则

- **零准备：** 直接分析已经存在的记录，使用前不需要初始化、安装 hook 或标记纠偏。
- **先诊断再重建：** 生成更新后的提示词之前，先确认存在有证据支持的偏斜边界。
- **Rewind-first：** 先说明有证据支持的最早偏斜边界，再直接交付新会话需要的提示词，不让用户把复盘报告重新翻译成指令。
- **反事实重开：** 重建“如果一开始就这样说”的提示词，同时尊重当时的信息边界。

[设计说明](docs/zh/design.md)进一步介绍证据模型、非目标和常见失败方式。

## 隐私与范围

- 没有明确指定来源时，只使用当前 session；不会用无关会话替代被截断的历史。
- 指定会话或路径后，只读取完成任务所需的相关历史。
- 输出会移除凭据、密钥、私有标识符和无关的个人内容。
- 历史缺失或证据含糊时，只简短说明缺口，不会编造纠偏。
- 不把独立纠偏链强行合并成虚构的共同原因或伪精确的单一 rewind 点。
- 能读取原始时间顺序消息时，自动生成的摘要只作为次级证据。

## 验证与局限

**注意：** 纠偏提取、链条关联和 rewind 置信度仍依赖模型判断。仓库校验可以验证版本一致性、发布 tag、Skill 契约锚点、本地引用、插件清单、双语 README 结构、英文文档语言边界和 npm 包内容，但这些静态检查不能证明运行时诊断一定准确。结果可能漏掉偏斜、过度推断因果关系、把一次性反应概括得过宽，或错误处理互相矛盾的指令。重要的建议和更新后提示词应先人工检查，尤其是来源跨越多个会话或包含敏感信息时。

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
