# Pandoc for Markdown

Markdown 是一种轻量级的标记语言，并可以通过 Pandoc 转换为 LaTeX PDF 文档。本插件实现了转换过程的封装，使其更为易用。

## 特性

支持四类 LaTeX 文档（Article｜文章，Report｜报告，Book｜书籍和 Beamer｜演示）的生成，可以分别配置参数；

支持自动添加元信息（标题、作者和日期）。

## 准备

- 安装 Pandoc：https://www.pandoc.org/installing.html
- 安装 LaTeX：
  - Linux 和 Windows 系统：TeX Live https://tug.org/texlive/
  - macOS 系统：MacTeX https://tug.org/mactex/
- （可选）CTeX 宏集
  - 在完整版 TeX Live 或 MacTeX 中已经集成
  - 可以通过 `sudo tlmgr install ctex` 安装

## 设置

### 通用设置

- `engine`：调用的 LaTeX 排版引擎，可选项为 `xelatex`（推荐），`pdflatex` 和 `lualatex`；
- `enumerate`：章节标题是否添加数字编号（推荐添加）；
- `metadata.title`：手动配置文档标题；
- `metadata.titleUseFilename`：使用文件名自动配置文档标题（推荐），若此项为 `true` 则手动配置无效；
- `metadata.author`：配置文档作者；
- `metadata.date`：手动配置文档日期；
- `metadata.dateUseToday`：使用今天（`\today` 命令）自动配置文档日期（推荐），若此项为 `true` 则手动配置无效；

### 专用设置

- `type.xxx.documentclass`：配置四类文档所使用的具体文档类（推荐使用 `ctexart`、`ctexrep`、`ctexbook` 和 `ctexbeamer`）；
- `type.xxx.others`：配置四类文档所使用的其他参数。

## 已知问题

无。