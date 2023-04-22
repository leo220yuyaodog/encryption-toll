FROM ubuntu:20.04
ADD sources.list /etc/apt/
RUN apt-get update \
    && apt-get -y install git make gcc golang nodejs \
    && git config --global http.sslverify false \
    && go --version \
    && nodejs --version \
    && npm --version
RUN git clone https://atomgit.com/tongsuo/Tongsuo.git \
     && cd Tongsuo \
     && ./config --prefix=/opt/tongsuo enable-ntls enable-ssl-trace -Wl,-rpath,/opt/tongsuo/lib64 --debug \
    && make -j \
    && make install \
    && /opt/tongsuo/bin/tongsuo version \

# 设置Go环境变量
ENV PATH="/usr/local/go/bin:${PATH}"
ENV GOPATH=$HOME/go
ENV PATH=$GOPATH/bin:$PATH

# 设置工作目录
WORKDIR /app

# 复制应用程序文件
COPY . /app

# 安装依赖并构建前端应用
RUN npm install && \
    npm run build

# 进入后端目录并构建后端应用
WORKDIR /app/tongsuo
RUN go build main.go

# 设置容器启动命令
CMD ["/app/tongsuo/main"]
