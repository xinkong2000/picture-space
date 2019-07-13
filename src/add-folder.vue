<template>
    <el-dialog title="新建文件夹" :visible.sync="addFolder" :before-close="handleCancelAddFolder" append-to-body>
        <el-form :model="addFolderData" :rules="addFolderRules" ref="addFolderData">
            <el-form-item label="文件夹名称" :label-width="formLabelWidth" prop="folderName">
                <el-input v-model="addFolderData.folderName" autocomplete="off" style="width: 300px;" placeholder="文件夹名称" />
            </el-form-item>
            <el-form-item label="注" :label-width="formLabelWidth">
                <ol style="line-height: 2;margin-top: 7px;">
                    <li>推荐使用中文、字母、数字和下划线</li>
                    <li>不允许使用的符号： /?"^.\:<>|</li>
                    <li>不允许使用表情符</li>
                    <li>总长度在1-100个字符以内</li>
                </ol>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleCancelAddFolder">取 消</el-button>
            <el-button type="primary" @click="submitForm('addFolderData')">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script type="text/javascript">
export default {
    name: "add-folder",
    data() {
        return {
            addFolderData: {
                folderName: ''
            },
            formLabelWidth: '120px',
            addFolderRules: {
                folderName: [
                    { required: true, message: '请输入文件夹名称', trigger: 'blur' },
                    { min: 1, max: 100, message: '长度在 1-100 个字符', trigger: 'blur' },
                    { pattern: /^[^\\.^/:\*\?""<>|]+$/, message: '有非法字符' }
                ]
            }
        }
    },
    props: {
        addFolder: {
            type: Boolean,
            default: false
        },
        prefix: {
        	type: String,
        	default: ''
        }
    },
    methods: {
        handleAddFolder() {
        	const prefix = this.prefix == "/" ? "" : this.prefix;
            const formData = {
            	'name' : this.addFolderData.folderName,
            	'prefix' : prefix + this.addFolderData.folderName + "/"
            }
            
            this.$emit('addFolderEvent', 'addFolder', formData);
        },
        handleCancelAddFolder(){
        	this.$emit('addFolderEvent', 'cancelAddFolder');
        },
        submitForm(formName){
        	let _this = this;
        	this.$refs[formName].validate((valid) => {
                if (valid) {
                    _this.handleAddFolder();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    }
}
</script>