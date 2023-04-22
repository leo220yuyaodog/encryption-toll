export const ServerUrl = ""

export function encrypt(inputText,key) {
    return fetch(`${ServerUrl}/api/sm4-cbc-encrypt`, {
        method: 'POST',
        body: JSON.stringify({"inputtext": inputText, "key": key}),
    }).then((res) => res.json())
}

export function decrypt( cipherText , key) {
    return fetch(`${ServerUrl}/api/sm4-cbc-decrypt`, {
        method: 'POST',
        body: JSON.stringify({"ciphertext": cipherText, "key": key}),
    }).then((res) => res.json())
}

export function ensm3(inputText){
    //  server route sm3DgstEndpoint
    return fetch(`${ServerUrl}/api/sm3-dgst`, {
        method: 'POST',
        body: JSON.stringify({"message": inputText}),
    }).then((res) => res.json())
}

export function upload(file) {
    const formData = new FormData();
    formData.append('file',file);
    return fetch(`${ServerUrl}/api/upload`, {
        method: 'POST',
        body: formData,
    }).then((res) => res.text())
}

export function download(filePath) {
    return fetch(`${ServerUrl}/api/download?filePath=${filePath}`, {
        method: 'GET',
    }).then((res) => res.blob())
}

export function verifySign(signFilePath,originFilePath) {
    return fetch(`${ServerUrl}/api/sm2-verify`, {
        method: 'POST',
        body: JSON.stringify({"signFilePath": signFilePath, "originFilePath": originFilePath}),
    }).then((res) => res.json())
}

export function sm2Sign(filePath){
    return  fetch(`${ServerUrl}/api/sm2-verify`, {
        method: 'POST',
        body: JSON.stringify({"signFile": filePath,}),
    }).then((res) => res.json())
}