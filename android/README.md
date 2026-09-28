# 安卓客户端安装包

`dist/yunxu-client-1.0.0.apk` 是可安装的安卓 APK，包名 `com.yunxu.client`，支持 Android 7.0 及以上。它加载现有的 `/app/` 手机前台，与后台共用业务数据；应用本身不包含服务器或数据库。

首次打开时填写后台地址，例如 `https://your-domain.example` 或 `http://192.168.1.10:8100`。可直接粘贴带 `/app/#/` 的前台链接。应用顶部“服务器”按钮可修改地址，“刷新”可重新加载页面。输入的网址会保存在这台手机上。

## 本地连接

电脑和手机须在同一局域网。先查电脑的局域网 IPv4 地址，再从 PowerShell 启动：

```powershell
$env:HOST = '0.0.0.0'
python app.py
```

在手机上填写 `http://电脑局域网IP:8100`。电脑防火墙须允许此端口。`127.0.0.1` 是手机自身，不能作为手机连接电脑的地址。安卓模拟器可用 `http://10.0.2.2:8100`。

## 本机模拟器一键试装

在 `android` 目录运行：

```powershell
.\run-emulator.ps1
```

脚本默认打开 `x64_33` 模拟器窗口，等系统完成开机后安装 `dist/yunxu-client-1.0.0.apk` 并打开客户端。模拟器已运行时会复用它。无窗口排查可用 `.\run-emulator.ps1 -Headless`；如 SDK 或 AVD 不在默认位置，可传 `-AndroidSdk`、`-AvdHome`。首次启动可能需要数分钟，超时信息及 `build/emulator.stdout.log`、`build/emulator.stderr.log` 可用于定位问题。前台连接本机后台时，在应用中输入 `http://10.0.2.2:8100`。

正式交付应使用固定 HTTPS 域名和正式服务进程；服务端的公开部署要求见项目根目录 README。APK 允许 HTTP 用于局域网调试，登录及下单数据在 HTTP 上传输时未加密。

## 重新生成 APK

本机需要 JDK 17+ 和 Android SDK Platform 35、Build Tools 34.0.0、Command-line Tools（latest）。在 `android` 目录运行：

```powershell
$env:ANDROID_HOME = 'D:\Android\Sdk'
.\build-apk.ps1
```

脚本直接使用 SDK 工具生成并验证 APK，不依赖 Gradle 在线下载。首次构建会在 `signing/` 创建发布签名密钥及密码文件；该目录不进 Git。**务必单独备份两个文件并控制访问**，以后更新同一包名的应用必须用同一密钥签名。`dist/` 是最终安装包，不进 Git。

项目同时保留标准 Android Gradle 工程，可在 Android Studio 中打开；离线环境优先使用上述脚本。
