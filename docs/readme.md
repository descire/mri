## Node.js 中如何收集和解析命令行参数

### 前言

  &emsp;&emsp;在开发 CLI（Command Line Interface）工具的业务场景下，离不开命令行参数的收集和解析。

  &emsp;&emsp;接下来，本文介绍如何收集和解析命令行参数，以及一些成熟的命令行参数解析库的介绍。

### 收集命令行参数

  &emsp;&emsp;在 Node.js 中，可以通过 process.argv 属性收集进程被启动时传入的命令行参数：

```JavaScript
  // ./example/demo.js
  process.argv.slice(2);

  // 命令行执行如下命令
  node ./example/demo.js --name=xiaoming --age=20 man

  // 得到的结果
  [ '--name=xiaoming', '--age=20', 'man' ]
```

  &emsp;&emsp;由上述示例可以发现，Node.js 在处理命令行参数时，只是简单地通过空格来分割字符串。

  &emsp;&emsp;对于这样的参数数组，无法很方便地获取到每个参数对应的值，所以需要再进行一次解析操作。
### 命令行参数风格

  &emsp;&emsp;在解析命令行参数之前，需要了解一些常见的命令行参数的风格：

  - Unix 风格：参数以「-」开头
  - GNU 风格：参数以「--」开头
  - BSD 风格：参数以空格分割

  &emsp;&emsp;Unix 风格有一个特殊的注意事项：**「-」后面紧邻的每一个字母多表示一个参数名**。

```s
  ls -al
```

  &emsp;&emsp;上述命令用来显示当前目录下所有的文件、文件夹并且显示它们详细的信息，等同于：

```s
  ls -a -l
```

  &emsp;&emsp;GNU 风格的参数以 「--」开头，一般后面会跟上一个单词或者短语，例如熟悉的 npm 安装依赖的命令：

```s
  npm install --save
```

  对于两个单词的情况，在 GNU 风格中，会通过「-」来分割，例如 npm 安装仅用于开发环境的依赖：

```s
  npm install --save-dev
```


  &emsp;&emsp;BSD 是加州大学伯克利分校开发的一个 Unix 版本。其与 Unix 的区别主要在于参数前面没有 「-」，这种风格暂时不讨论。


> -- 后面紧邻空格时，表示后面的参数不解析

### 解析命令行参数

  

### 别名机制


### 成熟解析库的对比


### 写在最后




  

