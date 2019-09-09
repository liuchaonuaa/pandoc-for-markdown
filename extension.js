"use strict";
var vscode = require('vscode');
var child_process_1 = require('child_process');
var path = require('path');
var pandocOutputChannel = vscode.window.createOutputChannel('Pandoc');
function setStatusBarText(what, type) {
    var text = what + type + '……';
    vscode.window.setStatusBarMessage(text, 2000);
}
function getPandocOptions(quickPickLabel) {
    var editor = vscode.window.activeTextEditor;
    var fullName = path.normalize(editor.document.fileName);
    var fileName = path.basename(fullName);
    var fileNameOnly = path.parse(fileName).name;
    const config = vscode.workspace.getConfiguration('pandoc');
    var pandocOptions = '';
    var documentclass;
    var others;
    var engine = config.get('engine');
    var enumerate = config.get('enumerate');
    var title = config.get('metadata.title');
    var titleUseFilename = config.get('metadata.titleUseFilename');
    var author = config.get('metadata.author');
    var date = config.get('metadata.date');
    var dateUseToday = config.get('metadata.dateUseToday');
    switch (quickPickLabel) {
        case '文章':
            documentclass = config.get('type.article.documentclass');
            others = config.get('type.article.others');
            break;
        case '演示':
            documentclass = config.get('type.beamer.documentclass');
            others = config.get('type.beamer.others');
            pandocOptions = ' -t beamer'
            break;
        case '报告':
            documentclass = config.get('type.report.documentclass');
            others = config.get('type.report.others');
            break;
        case '书籍':
            documentclass = config.get('type.book.documentclass');
            others = config.get('type.book.others');
            break;
    }
    pandocOptions += ' --pdf-engine ' + engine
    if (enumerate) {
        pandocOptions += ' -N'
    }
    if (titleUseFilename) {
        pandocOptions += ' -V title:' + fileNameOnly
    } else {
        if (title) {
            pandocOptions += ' -V title:' + title
        }
    }
    if (author) {
        pandocOptions += ' -V author:' + author
    }
    if (dateUseToday) {
        pandocOptions += ' -V date:' + '\\\\today'
    } else {
        if (date) {
            pandocOptions += ' -V date:' + date
        }
    }
    pandocOptions += ' -V documentclass:' + documentclass + others;
    return pandocOptions;
}
function activate(context) {
    console.log('Congratulations, your extension "vscode-pandoc" is now active!');
    var disposable = vscode.commands.registerCommand('pandoc.render', function () {
        var editor = vscode.window.activeTextEditor;
        var fullName = path.normalize(editor.document.fileName);
        var filePath = path.dirname(fullName);
        var fileName = path.basename(fullName);
        var fileNameOnly = path.parse(fileName).name;
        var items = [];
        items.push({ label: '文章' });
        items.push({ label: '演示' });
        items.push({ label: '报告' });
        items.push({ label: '书籍' });
        vscode.window.showQuickPick(items).then(function (qpSelection) {
            if (!qpSelection) {
                return;
            }
            var inFile = path.join(filePath, fileName);
            var outFile = path.join(filePath, fileNameOnly) + '.pdf';
            setStatusBarText('正在渲染', qpSelection.label);
            var pandocOptions = getPandocOptions(qpSelection.label);
            var targetExec = 'pandoc ' + inFile + ' -o ' + outFile + pandocOptions;
            var child = child_process_1.exec(targetExec, { cwd: filePath }, function (error, stdout, stderr) {
                if (stdout) {
                    console.log(stdout.toString());
                    pandocOutputChannel.append(stdout.toString() + '\n');
                }
                if (stderr) {
                    console.log(stderr.toString());
                    vscode.window.showErrorMessage('标准错误：' + stderr.toString());
                    pandocOutputChannel.append('标准错误：' + stderr.toString() + '\n');
                }
                if (error) {
                    console.log('执行错误：' + error);
                    vscode.window.showErrorMessage('执行错误：' + error);
                    pandocOutputChannel.append('执行错误：' + error + '\n');
                }
                else {
                    setStatusBarText('正在打开', qpSelection.label);
                    switch (process.platform) {
                        case 'darwin':
                            child_process_1.exec('open ' + outFile);
                            break;
                        case 'linux':
                            child_process_1.exec('xdg-open ' + outFile);
                            break;
                        default:
                            child_process_1.exec(outFile);
                    }
                }
            });
        });
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;