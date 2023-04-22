package controller

import (
	"context"
	"fmt"
	"github.com/cloudwego/hertz/pkg/app"
	"github.com/cloudwego/hertz/pkg/protocol/consts"
	"math/rand"
	"net/http"
	"strconv"
	"tongsuo/util"
)

func Sm4CbcEncryptEndpoint(ctx context.Context, c *app.RequestContext) {
	plaintext := c.FormValue("plaintext")
	key := c.FormValue("key")
	ciphertext := util.Sm4CbcEncrypt(string(plaintext), string(key))
	c.JSON(http.StatusOK, map[string]string{
		"ciphertext": ciphertext,
	})
}

func Sm4CbcDecryptEndpoint(ctx context.Context, c *app.RequestContext) {
	ciphertext := c.FormValue("ciphertext")
	key := c.FormValue("key")
	plaintext := util.Sm4CbcDecrypt(string(ciphertext), string(key))
	c.JSON(http.StatusOK, map[string]string{
		"plaintext": plaintext,
	})
}

func Sm3DgstEndpoint(ctx context.Context, c *app.RequestContext) {
	message := c.FormValue("message")
	dgst := util.Sm3Dgst(string(message))
	c.JSON(http.StatusOK, map[string]string{
		"dgst": dgst,
	})
}

func Sm2SignEndpoint(ctx context.Context, c *app.RequestContext) {
	filePath := c.FormValue("filePath")
	sigPath := string(filePath) + "_sign"

	util.Sm2Sign(string(filePath), sigPath)
	c.JSON(http.StatusOK, map[string]string{
		"status":  "ok",
		"sigPath": sigPath,
	})
}

func Sm2VerifyEndpoint(ctx context.Context, c *app.RequestContext) {
	signFilePath := c.FormValue("sign_file_path")
	filePath := c.FormValue("file_path")
	verified := util.Sm2Verify(string(signFilePath), string(filePath))
	c.JSON(http.StatusOK, map[string]bool{
		"verified": verified,
	})
}

func Upload(ctx context.Context, c *app.RequestContext) {
	file, _ := c.FormFile("file")

	randomNum := strconv.Itoa(rand.Intn(90000) + 10000)
	filename := file.Filename
	newFilename := randomNum + "_" + filename
	savePath := "./file/" + newFilename
	// Upload the file to specific dst
	c.SaveUploadedFile(file, savePath)

	c.String(consts.StatusOK, fmt.Sprintf("'%s' uploaded!", savePath))
}

func Download(ctx context.Context, c *app.RequestContext) {
	filePath := c.FormValue("filePath")
	c.File(string(filePath))
}
