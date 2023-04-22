package util

import (
	"fmt"
	"os/exec"
)

// Sm4CbcEncrypt SM4-CBC加密
func Sm4CbcEncrypt(plaintext string, key string) string {
	command := fmt.Sprintf("echo %s | /opt/tongsuo/bin/tongsuo enc -K %s -e -sm4-cbc "+
		"-iv 1fb2d42fb36e2e88a220b04f2e49aa13 -base64", plaintext, key)
	return execCommand(command)
}

// Sm4CbcDecrypt SM4-CBC解密
func Sm4CbcDecrypt(ciphertext string, key string) string {
	command := fmt.Sprintf("echo %s | /opt/tongsuo/bin/tongsuo enc -K %s -d -sm4-cbc "+
		"-iv 1fb2d42fb36e2e88a220b04f2e49aa13 -base64", ciphertext, key)
	return execCommand(command)
}

// Sm3Dgst SM3哈希
func Sm3Dgst(ciphertext string) string {
	command := fmt.Sprintf("echo -n %s | /opt/tongsuo/bin/tongsuo dgst -sm3", ciphertext)
	return execCommand(command)
}

// Sm2Sign SM2签名
func Sm2Sign(sigFile string, filePath string) string {
	command := fmt.Sprintf("/opt/tongsuo/bin/tongsuo dgst -sm3 -sign ./sm2.key -out %s %s", sigFile, filePath)
	return execCommand(command)
}

// Sm2Verify SM2验签
func Sm2Verify(sigFile, filePath string) bool {
	command := fmt.Sprintf("/opt/tongsuo/bin/tongsuo dgst -sm3 -verify ./sm2pub.key -signature %s %s", sigFile, filePath)
	result := execCommand(command)
	if result == "Verified OK" {
		return true
	} else {
		return false
	}
}

// 执行Shell命令
func execCommand(command string) string {
	cmd := exec.Command("bash", "-c", command)
	stdout, err := cmd.Output()
	if err != nil {
		fmt.Println(err.Error())
		return ""
	}
	return string(stdout)
}
