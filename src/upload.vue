<template>
    <el-dialog title="上传文件" class="picture-upload" :visible.sync="upload" :before-close="handleCancelUpload" append-to-body>
        <el-upload :action="uploadUrl" list-type="picture-card" :auto-upload="false" multiple ref="upload" :on-success="handleUploadSuccess" :data="uploadData" :on-change="handleChange" :on-error="handleUploadError">
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{file}">
                <span class="picture-space-uploading" v-if="file.percentage>0&&file.percentage<100">
                    <el-progress type="circle" :percentage="parseInt(file.percentage)" :width="80" :color="customColors" :stroke-width="3" />
                </span>
                <i class="el-icon-check uploadSuccess" v-if="file.percentage==100"></i>
                <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" v-if="imgContentType.indexOf(file.raw.type)>-1">
                <div class="noImg" v-if="imgContentType.indexOf(file.raw.type)==-1">{{ file.raw.type }}</div>
                <span class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                        <i class="el-icon-zoom-in"></i>
                    </span>
                    <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                        <i class="el-icon-delete"></i>
                    </span>
                </span>
            </div>
        </el-upload>
        <span slot="footer" class="dialog-footer">
            <i v-if="waitUpload>0&&waitUpload<=max">等待上传的文件总数：{{waitUpload}}</i>
            <i v-if="waitUpload>max" style="color:red;">等待上传的文件总数：{{waitUpload}}，已超出最大值{{max}}</i>
            <el-button type="primary" @click="submitUpload" :disabled="waitUpload==0||waitUpload>max">上传文件</el-button>
        </span>
        <el-dialog :visible.sync="dialogVisible" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </el-dialog>
</template>
<script type="text/javascript">
export default {
    name: 'upload',
    data() {
        return {
            dialogImageUrl: '',
            dialogVisible: false,
            disabled: false,
            uploadData: {},
            uploadIndex: 0,
            customColors: [
                { color: '#67c23a', percentage: 100 }
            ],
            imgContentType: ['image/bmp', 'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
            waitUpload: 0,
            max: 10
        }
    },
    props: {
        upload: {
            type: Boolean,
            default: false
        },
        uploadUrl: {
            type: String
        },
        prefix: {
            type: String
        }
    },
    mounted() {
        this.uploadData = { "prefix": this.prefix };
    },
    methods: {
        handleCancelUpload() {
            this.$emit('update:upload', false)
        },
        handleRemove(file) {
            let objs = this.$refs.upload.uploadFiles;
            for (let i = 0; i < objs.length; i++) {
                if (file.uid == objs[i].uid) {
                    objs.splice(i, 1);
                }
            }
            this.handleChange(file, objs);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        submitUpload() {
            this.$refs.upload.submit();
        },
        handleUploadSuccess(a, b, c) {

            // a.url = c[this.uploadIndex].url;

            this.$emit('uploadEvent', a);
            this.uploadIndex++;
        },
        handleChange(a, fileList) {
            this.waitUpload = 0;
            for (let i = 0; i < fileList.length; i++) {
                if (fileList[i].percentage == 0) {
                    this.waitUpload += 1;
                }
            }
        },
        handleUploadError(err, file, fileList) {
            this.$message({
                showClose: true,
                message: '[' + file.name + ']上传错误！',
                type: 'error'
            });
        },
        on_exceed() {
            this.$message({
                showClose: true,
                message: '最多同时可以上传[' + this.limit + ']个文件！',
                type: 'error'
            });
        }
    }
}
</script>
<style type="text/css">
.picture-space-uploading {
    display: inline-block;
    background-color: rgba(0, 0, 0, .5);
    position: absolute;
    width: 100%;
    height: 100%;
    color: #fff;
}

.picture-upload .el-progress-circle {
    margin: auto;
}

.picture-upload .el-progress__text {
    color: #fff;
}

.picture-upload .el-progress {
    margin: 0;
}

.picture-upload .uploadSuccess {
    position: absolute;
    margin: 5px 0 0 5px;
    color: #67c23a;
    font-size: 18px;
    width: 20px;
    height: 20px;
    background-color: rgba(146, 146, 146, 0.5);
    border-radius: 50%;
}

.picture-upload .dialog-footer i {
    font-size: 12px;
    color: #999;
    margin-right: 20px;
}

.picture-upload .noImg {
    text-align: center;
    height: 140px;
    padding: 4px;
    overflow: hidden;
    display: table-cell;
    vertical-align: middle;
    width: 140px;
    color: #999;
}
</style>