## How to Deploy [this](https://www.christianengvall.se/electron-packager-tutorial/)
```
# Linux
electron-packager . app --overwrite --platform=linux --arch=x64 --icon={icon path .png} --prune=true --out=release-builds --electron-version={build electron version}

# Windows
electron-packager . {project folder} --overwrite --platform=win32 --arch=ia32 --icon={icon path .ico} --prune=true --out=release-builds --version-string.CompanyName=CE --version-string.FileDescription=CE --version-string.ProductName="AutoBenchClient" --electron-version={build electron version}

# MacOS
electron-packager . --overwrite --platform=darwin --arch=x64 --icon={icon path .icns} --prune=true --out=release-builds --electron-version={build electron version}
```

## Support Platform

| 운영체제 | 바이너리 | 최소 지원 버전 |
|-|-|-|
| OS X | x64 | 10.9 이후 버전 |
| Windows	| x86, x64 (ARM 버전 윈도우는 지원하지 않음) | Windows 7 이후 버전 |
| Linux | ia32(i686), x64(amd64), arm | Ubuntu 12.04 이후 버전<br/> Fedora 21<br/> Debian 8 |

## 준비물
```
```

## 추가 자료 [여기](https://proinlab.com/archives/1928)

### windows
```
npm install -g asar # 소스 코드 암호화
npm install --save-dev electron-winstaller # 윈도우 인스톨러
```

### MacOS
```
npm install -g electron-installer-dmg
electron-installer-dmg ./dist/AutoBench-darwin-x64/AutoBench.app AutoBench --out=./dist
```

### Deploy Shell Scripts
```
# delete older files
rm -rf dist

# windows exe pacakaging
electron-packager ./ AutoBench --platform=win32 --arch x64 --out dist --prune

# asar packaging
asar pack ./dist/AutoBench-win32-x64/resources/app ./dist/AutoBench-win32-x64/resources/app.asar

# delete source dir
rm -rf ./dist/AutoBench-win32-x64/resources/app

# create installer
node installer.js

# create mac app and dmg
electron-packager ./ AutoBench --platform=darwin --arch x64 --out dist --prune
electron-installer-dmg ./dist/AutoBench-darwin-x64/AutoBench.app AutoBench --out=./dist
```








