---
title: "我是否需要nvim插件"
date: 2025-07-29T15:41:59+08:00
lastmod: 2025-07-29T15:41:59+08:00
draft: false

# 作者
author: "Downmars"

# 分类和标签
tags: [""]
categories: [""]

# 描述
description: "" # SEO 搜索优化
summary: ""    # 列表页展示的简短描述

# 自定义url
slug:

# 是否被允许搜索
searchHidden: false

# 可选：权重（用于置顶文章）
weight: null

license: "CC-BY-NC-4.0"  # 对应 data/licenses.yml 中的 keys

# 可选：封面图片
cover:
    image: ""
    alt: ""
    caption: ""
---

今天在尝试寻找一个程序问题的时候，想到了我是不是可以在nvim上添加一个调试的插件，我在搜索的过程中发现一篇有意思的讨论[how many of you use a debugger with nvim](https://www.reddit.com/r/neovim/comments/1cwxlnf/how_many_of_you_use_a_debugger_with_nvim/?show=original)。题主在讨论中说到了“我在使用 VS Code 时从未设置或使用过调试器，并且一直觉得调试器可能有用却也可能麻烦，所以我现在在考虑是否值得在迁移到 Neovim 后去研究它的调试功能”。

## 讨论焦点  

对于这篇帖子的讨论观点主要分为以下几种：  
- “Print永远滴神”： 有大约五分之一的人认为调试器太慢、太复杂，反而print显得直接明了，不少人声称甚至在几十万行的项目中只依靠print来完成程序的调试。  
- “调试器无所不能”： 断点、变量可视化、单步执行、状态回溯、运行时修改对象……这些都是 print 难以替代的功能，特别是在调试复杂状态机或大型类系统时。  
- “Neovim的调试器体验差”： 不是不想用，而是用得太痛苦。DAP 配置繁琐、UI 不友好、调试流程割裂，甚至还会导致程序行为变化。最后，还是回归 VS Code、IntelliJ 或 Xcode。  
- “Unix哲学派”： 这部分人认为 Neovim 作为一个纯粹的文本编辑器，不需要调试功能，这些额外功能就交给别的工具来实现。  

## 我为什么选择使用Neovim  

我愿意使用Neovim的原因可以分为以下几点：  
- 这是一种键盘友好的文本编辑器。  
- 能够高度定制化你的需求，尽管有一定的门槛，但是经过调整之后能够找到适合自己的输入体验。  
- 高度一致化的输入体验，经过一定的插件整合，我能够在同一种输入体验下完成尽可能多的输入环境需求，而不是无限制得引入重量级的IDE。  

## 高度定制化的Neovim是否背叛了Unix哲学  

在给[讨论焦点](../2025_07_29-do_i_need_neovim_plugins/#讨论焦点)一节中的“Unix哲学派”命名的时候，我顺便去搜寻了下人们对于Neovim的Unix哲学的看法，确实发现了一些很有意思的内容。  
[The Book of Neo](https://snare.dev/musings/the-book-of-neo/)的作者模仿[《摩西十戒》](https://www.ewtn.com/catholicism/library/ten-commandments-10336)写下了《NeoLORD 的十条诫命》，以下是关于其内容的翻译供大家一乐。  
{{< collapse summary="NeoLORD 的十条诫命" >}}

**1.**
**Thou shalt abide by the philosophy of my right hand: “Thou shalt do one thing, and do it well.”**
The `$EDITOR` is a craft, created to create. It is the crafter of crafters. Do not fall into the traps of the cursèd devil which shall not be named, and do more than is intended.
**I am the NeoLORD.**

**汝当遵循吾右手的哲学：“汝当专一其事，精其所精。”**
`$EDITOR` 乃神圣之工艺，生来为创造而生，是工匠中的工匠。切勿堕入那不可名状之魔的陷阱——贪多务广，违背初衷。
**我乃 NeoLORD。**

---

**2.**
**Thou shalt not use editors other than the venerable Neovim;**
for I the NeoLORD am a jealous God, and will destroy all that create with no regard to their true creator.
**I am the NeoLORD.**

**汝不可使用 Neovim 之外之编辑器。**
因为我，NeoLORD，是妒忌之神，凡无视真正创造者而妄作他器者，必遭我之毁灭，永堕 IDE 之牢笼。
**我乃 NeoLORD。**

---

**3.**
**Thou shalt abstain from usage of VimScript in favor of Lua.**
The venerable VimScript will be kept alive, since he is still useful, but beware; old wineskins will break eventually.
**I am the NeoLORD.**

**汝当弃用 VimScript，转而皈依 Lua。**
虽古老之 VimScript 尚存其用，然陈酒袋终将破裂。吾已赐汝新皮囊，汝当谨慎斟酌。
**我乃 NeoLORD。**

---

**4.**
**Thou shalt make the fullest use of the tools that the NeoLORD has graciously provided to you.**
Give LSP and Treesitter their due homage.
**I am the NeoLORD.**

**汝当善用吾所赐之神圣工具。**
当向 LSP 与 Treesitter 献上敬意。此为圣礼，不容懈怠。
**我乃 NeoLORD。**

---

**5.**
**Honor plugin maintainers with the utmost respect.**
They are not subject to your fleeting whims, and are free to do as they please with the fruits of their labor. Must a conflict arise, thou shalt resolve thy disagreements through civil discussion. Take care, and wield the mighty fork with caution.
**I am the NeoLORD.**

**汝当敬重插件的造物者。**
他们非汝一时之所欲可左右，其劳作之果，亦不为尔独享。若有争端，汝当理性交涉；必要时，方可挥动那威力巨大的 fork，然须慎之又慎。
**我乃 NeoLORD。**

---

**6.**
**Beware the temptresses of useless plugins.**
Do not let them sour your desire to create.
**I am the NeoLORD.**

**当警惕虚妄插件之诱惑。**
切勿让它们腐蚀汝创造之心志，陷入配置地狱之苦。
**我乃 NeoLORD。**

---

**7.**
**Thou shalt respect Vim and its contributions to the world,**
and upstream any applicable patches, for the spirit of Bram shall live forever and ever.
**I am the NeoLORD.**

**汝当尊重 Vim 及其对世界之贡献。**
若能回馈补丁于其上游，更当尽力为之。因为 Bram 的灵魂将与代码同在，直到永远。
**我乃 NeoLORD。**

---

**8.**
**Thou shalt not act in sloth, lest you perish in the bottomless pits of the lazy Inferno.**
The NeoLORD your God is not a lazy God; thou shalt instead weave thy configurations by hand.
For the lazy folk are unable to partake in the NeoLORD’s wisdom, and their fingers will rot from confusion.
**I am the NeoLORD.**

**懒惰者必将堕入无底之惰狱。**
NeoLORD 并非懒神，汝亦不可依赖懒人配置如 LazyVim。
汝当亲手编织 config，方得其真谛。否则汝之指，将因混乱而枯萎。
**我乃 NeoLORD。**

---

**9.**
**Thou shalt not blaspheme against the spirit of modality,**
for whoever disowns the other modes in favor of insert-only mode shall never be forgiven until they repent of their ways.

**汝不可亵渎“模式”的圣灵。**
唯用插入模式者，若不悔改，永不得赦。
汝当尊崇 Normal 与 Visual，因其蕴藏强大之力。

---

**10.**
**Do not distress over the transgressions of the ignorant,**
for everyone is a sinner in the NeoLORD’s presence.
Instead, lead them towards repentance and the narrow gate of change.
**I am the NeoLORD.**

**勿因无知者之愚行而动怒。**
因所有人在 NeoLORD 面前皆为罪人。引导他们悔改，引他们走向“变更”之窄门。
**我乃 NeoLORD。**

{{< /collapse >}}

这些戒令虽然夸张滑稽，但是能够看出Neovim社区的一种价值观：**自由、克制、纯粹、可组合、可配置但不强求整合。**

Reddit上关于[The Book of Neo](https://www.reddit.com/r/neovim/comments/1jhio51/the_book_of_neo_a_satirical_ten_commandments_for/)的讨论也很有意思，大家可以自行前往观看。  
{{< quote >}}Do one thing, and do it well. Don't be like Emacs.{{< /quote >}}  
"intercaetera"如此提出了这个[观点](https://www.reddit.com/r/neovim/comments/1jhio51/comment/mj8eys5/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button)。  
“做一件事，做好它。别学Emacs。”  
这话其实很讽刺——  
考虑到现在有那么多 Neovim 插件，基本上是用 Lua 重写了 Linux/Unix 的各种小工具。
相比 10 年前的 Vim，Neovim 实际上已经大概成了 Emacs 的 75%。  

{{< quote >}}Write programs that do one thing and do it well. {{< /quote >}}  
"someboddy"在下面进行了[反驳](https://www.reddit.com/r/neovim/comments/1jhio51/comment/mjb8xo7/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button)。  
“写程序要做到一件事，并把它做好。”  
但现在人们经常省略“写程序”这部分，结果把整句话的意思搞错了。“做一件事”应该是针对程序本身而言；而不是拿来限制用户或用户的系统组合行为。

