// OSS上传
const OSS = require('ali-oss');
import { getOssSts } from "@/api/mini/"
export default class OssUpload {
    // file ---> file对象, dir ---> 上传到目标文件夹, callback --->成功回调
    constructor(file, dir, callback){
        this.file = file || null;
        this.dir = dir || "";
        this.callback = callback || null;
        this.init()
    }
    async init(){
        try{
            const { region, accessKeyId, accessKeySecret, stsToken, bucket } = await getOssSts()
            const client = new OSS({
                // Bucket所在地域
                region,
                // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）
                accessKeyId,
                accessKeySecret,
                // 从STS服务获取的安全令牌（SecurityToken）。
                stsToken,
                // Bucket名称
                bucket
            });
            const result = await client.put(`${this.dir}/${this.file.name}`, this.file);
            this.callback && this.callback(result.url)
        }catch(error){
            console.error(error);
        }
    }
}




