import {Tabs, Input, Button, Upload, message, Card} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import * as tongsuo from "./api/tongsuo";

const { TabPane } = Tabs;
const { TextArea } = Input;

function App() {
    const [sm4PlainText, setSm4PlainText] = useState('');
    const [sm4CipherText, setSm4CipherText] = useState('');
    const [sm4Key, setSm4Key] = useState('');

    const [sm3PlainText, setSm3PlainText] = useState('');
    const [sm3Result, setSm3Result] = useState('');

    const [file, setFile] = useState(null)
    const [originFile, setOriginFile] = useState(null);
    const [signFile, setSignFile] = useState(null);

    const handleSm4Encrypt = () => {
        tongsuo.encrypt(sm4PlainText,sm4Key).then((res) => {
            if(res.status === "ok"){
                setSm4PlainText(res.data);
            }else {
                message.error("加密失败");
            }
        })
    };

    const handleSm4Decrypt = () => {
        tongsuo.decrypt(sm4CipherText,sm4Key).then((res) => {
            if(res.status === "ok"){
                setSm4CipherText(res.data);
            }   else {
                message.error("解密失败");
            }
        })
    };

    const handleSm3Encrypt = () => {
        tongsuo.ensm3(sm3PlainText).then((res) => {
            if(res.status === "ok"){
                setSm3Result(res.data);
            }   else {
                message.error("加密失败");
            }
        })
    };

    const handleFileUpload = (file) => {
        tongsuo.upload(file).then((res) => {
            if(res === "upload failed"){
                message.error("上传失败");}
            else {
                setFile(res);
            }
        })
    };

    const handleSignFileUpload = (file) => {
        tongsuo.upload(file).then((res) => {
            if(res === "upload failed"){
                message.error("上传失败");}
            else {
                setSignFile(res);
            }
        })
    };

    const handleOriginFileUpload = (file) => {
        tongsuo.upload(file).then((res) => {
            if(res === "upload failed"){
                message.error("上传失败");}
            else {
                setOriginFile(res);
            }
        })
    };

    const handleSignVerify = () => {
        if (!originFile || originFile === '') {
            return message.info('原始文件未上传！');
        }
        if (!signFile || signFile === '') {
            return message.info('签名文件未上传！');
        }

        tongsuo.verifySign( signFile, originFile).then((data) => {
            if (data.status === 'ok') {
                message.success('验证成功！');
            } else {
                message.error('验证失败！');
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }


    const handleSignDownload = () => {
        if (!file || file === '') {
            return message.info('请先上传文件！');
        }
        tongsuo.sm2Sign(file).then((res)=>{
            if (res.status === "ok"){
                tongsuo.download(res.sigPath).then((data) => {
                    const blob = new Blob([data], { type: 'application/octet-stream' });
                    const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = file;
                    link.click();
                })
            }else {
                message.error("签名失败！")
            }
        })
    };

    return (
        <div style={{ padding: '20px 20px' }}>
            <Tabs defaultActiveKey="1">
                <TabPane tab="SM4加解密算法" key="1">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <TextArea
                            style={{ resize: 'none', minHeight: '280px', width: '45%' }}
                            placeholder="在此输入明文，选择对应的加密方式，也可以加入密钥，然后加密即可。"
                            value={sm4PlainText}
                            onChange={(e) => setSm4PlainText(e.target.value)}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin:"20px" }}>
                            <Input
                                placeholder="在此输入密钥"
                                autoComplete="off"
                                style={{ width: '200px', margin: '10px 0' }}
                                value={sm4Key}
                                onChange={(e) => setSm4Key(e.target.value)}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-evenly', width: '180px'}}>
                                <Button type="primary" style={{ margin: '10px 0' }} onClick={handleSm4Encrypt}>
                                    加密
                                </Button>
                                <Button type="primary" style={{ margin: '10px 0' }} onClick={handleSm4Decrypt}>
                                    解密
                                </Button>
                            </div>
                        </div>
                        <TextArea
                            style={{ resize: 'none', minHeight: '280px', width: '45%' }}
                            placeholder="加密结果会显示在这里。"
                            value={sm4CipherText}
                            onChange={(e) => setSm4CipherText(e.target.value)}
                        />
                    </div>
                </TabPane>
                <TabPane tab="SM3杂凑算法" key="2">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <TextArea
                            style={{ resize: 'none', minHeight: '280px', width: '45%' }}
                            placeholder="在此输入要进行杂凑的明文。"
                            value={sm3PlainText}
                            onChange={(e) => setSm3PlainText(e.target.value)}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Button type="primary" style={{ margin: '10px 0' }} onClick={handleSm3Encrypt}>
                                加密
                            </Button>
                        </div>
                        <TextArea
                            style={{ resize: 'none', minHeight: '280px', width: '45%' }}
                            placeholder="杂凑结果会显示在这里。"
                            value={sm3Result}
                            onChange={(e) => setSm3Result(e.target.value)}
                        />
                    </div>
                </TabPane>
                <TabPane tab="数字签名" key="3">
                        <div style={{ display: 'flex', justifyContent: 'space-around'}}>
                            <Card title="对文件签名">
                                <Upload
                                    accept=".txt"
                                    beforeUpload={(file) => {
                                        handleFileUpload(file);
                                        return false
                                    }}
                                >
                                    <Button icon={<UploadOutlined />}>上传需要签名的文件</Button>
                                </Upload>
                                <Button type="primary" style={{ margin: '10px 0' }} onClick={handleSignDownload}>
                                    下载签名文件
                                </Button>
                            </Card>
                            <Card title="验证文件签名">
                                <Upload
                                    accept=".txt"
                                    beforeUpload={(file) => {
                                        handleOriginFileUpload(file);
                                        return false;
                                    }}
                                >
                                    <Button icon={<UploadOutlined />} style={{ marginTop: '10px' }}>
                                        上传源文件
                                    </Button>
                                </Upload>
                                <Upload
                                    accept=".txt"
                                    beforeUpload={(file) => {
                                        handleSignFileUpload(file);
                                        return false;
                                    }}
                                >
                                    <Button icon={<UploadOutlined />} style={{ marginTop: '10px' }}>
                                        上传签名文件
                                    </Button>
                                </Upload>
                                <Button type="primary" style={{ margin: '10px 0' }} onClick={handleSignVerify}>
                                    验证签名
                                </Button>
                            </Card>
                        </div>
                </TabPane>
            </Tabs>
        </div>
    );
}

export default App;