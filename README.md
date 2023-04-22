## 介绍
在线铜锁密码工具箱，支持sm4加密解密，sm3杂凑，sm2签名和验证签名。
- 后端使用hertz框架，借助命令行调用铜锁api.
- 前端使用React和Ant Design.

## 快速开始

### 环境
- node.js
- npm
- go
- 编译后的tongsuo库，可以从[铜锁](https://github.com/Tongsuo-Project/Tongsuo)下载

### 启动
```bash
# 启动后端
cd tongsuo
go run main.go
```
```bash
# 启动前端
npm install
npm start
```

### 生产环境
打包前端js到目录tongsuo/build,使用后端服务器来提供静态文件，之后访问后端端口8888即可.
```bash
npm build
```

## docker-compose部署
保证安装了docker和docker-compose，然后执行：
```bash
docker-compose up -d
```


