package main

import (
	"github.com/cloudwego/hertz/pkg/app"
	"github.com/cloudwego/hertz/pkg/app/server"
	"github.com/cloudwego/kitex/pkg/klog"
	kitexlogrus "github.com/kitex-contrib/obs-opentelemetry/logging/logrus"
	"tongsuo/controller"
)

func main() {
	h := server.Default()
	klog.SetLogger(kitexlogrus.NewLogger())
	klog.SetLevel(klog.LevelDebug)

	h.StaticFile("/", "build/index.html")
	h.StaticFS("/", &app.FS{Root: "./build", GenerateIndexPages: true})

	api := h.Group("/api")
	api.POST("/sm4-cbc-encrypt", controller.Sm4CbcEncryptEndpoint)
	api.POST("/sm4-cbc-decrypt", controller.Sm4CbcDecryptEndpoint)
	api.POST("/sm3-dgst", controller.Sm3DgstEndpoint)
	api.POST("/sm2-sign", controller.Sm2SignEndpoint)
	api.POST("/sm2-verify", controller.Sm2VerifyEndpoint)
	api.POST("/upload", controller.Upload)
	api.POST("/download", controller.Download)

	h.Spin()
}
