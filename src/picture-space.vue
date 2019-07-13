<template>
    <div class="picture-space" :class="{ 'window-mode' : isWindow }" v-drag="isWindow" :style="{'width':w, 'height':h}">
        <el-container style="height:100%">
            <el-aside width="200px" style="background-color: #fff;border-right: solid 1px #e6e6e6;">
                <el-tree lazy :load="getData" ref="tree" node-key="prefix" :props="defaultProps" highlight-current @node-click="handleNodeClick" style="margin-top: 10px;" :default-expanded-keys="default_expanded_keys">
                </el-tree>
            </el-aside>
            <el-container>
                <el-header>
                    <div class="control-bar">
                        <ul class="picture-crumb">
                            <li v-for="(node, index) in currentNodes" @click="handleNodeClick(node.data, node)">{{ node.data.name }}</li>
                        </ul>
                        <el-progress v-if="percentage!==undefined" :percentage="percentage" :color="customColors"></el-progress>
                        <div class="picture-control" v-if="currentNodes.length>0">
                            <el-button-group>
                                <!-- 上传 -->
                                <el-button type="primary" v-if="isUpload" icon="el-icon-upload2" @click="hanleUploadClick" title="上传文件"></el-button>
                                <!-- 新建 -->
                                <el-button type="primary" v-if="isAddFolder" icon="el-icon-folder-add" @click="hanleAddFolder" title="新建文件夹"></el-button>
                                <!-- 删除 -->
                                <el-button type="primary" v-if="isDelete" icon="el-icon-delete" title="删除" :disabled="isSelectedEmpty" @click="handleDelete"></el-button>
                                <!-- 关闭 -->
                                <el-button type="primary" icon="el-icon-close" v-if="close != undefined" title="关闭" @click="close"></el-button>
                                <!-- 选择 -->
                                <el-button type="primary" v-if="selected!=undefined && !isInstantCallback" icon="el-icon-check" title="选择完成" :disabled="selecteds.objectsIndex.length==0" @click="handleCallback"></el-button>
                            </el-button-group>
                        </div>
                    </div>
                </el-header>
                <el-main>
                    <!-- table -->
                    <picture-table v-if="currentNodes.length > 0" @dblclickNode="dblclickNode" @getData="getData" :list="currentNodes[currentNodes.length - 1]" :selecteds="selecteds" @selected="handleNodeSelected" :tableSize="tableSize"></picture-table>
                </el-main>
            </el-container>
        </el-container>
        <!-- 新建文件夹 -->
        <add-folder v-if="currentNodes.length>0" :addFolder="addFolder" @addFolderEvent="addFolderEvent" :prefix="currentNodes[currentNodes.length-1].data.prefix" />
        <!-- 上传文件 -->
        <upload v-if="currentNodes.length>0 && isUpload" :upload.sync="upload" @uploadEvent="uploadEvent" :prefix="currentNodes[currentNodes.length-1].data.prefix" :uploadUrl="apiUrl" />
    </div>
</template>
<script type="text/javascript">
import pictureTable from './table';
import addFolder from './add-folder';
import upload from './upload';
import axios from 'axios';
import config from '../config';
import mime from '../lib/mime.js';

export default {
    name: 'picture-space',
    components: {
        pictureTable,
        addFolder,
        upload
    },
    data() {
        return {
            defaultProps: {
                children: 'prefixList',
                label: 'name',
            },
            currentNodes: [],
            selecteds: {
                objectsIndex: [],
                prefixsIndex: []
            },
            addFolder: false,
            upload: false,
            apiUrl: config.apiUrl,
            headers: config.headers,
            prefixName: config.prefixName,
            w: "100%",
            h: "100%",
            isSelectedEmpty: true,
            tableSize: 160,
            percentage: undefined,
            customColors: [
                { color: '#67c23a', percentage: 80 },
                { color: '#e6a23c', percentage: 90 },
                { color: '#f56c6c', percentage: 100 }
            ],
            default_expanded_keys: []
        }
    },
    props: {
        // 选择后回调
        selected: {
            type: Function
        },
        // 关闭按钮点击回调
        close: {
            type: Function
        },
        // 是否允许多选
        multiple: {
            type: Boolean,
            default: true
        },
        // 是否瞬间瞬间回调
        isInstantCallback: {
            type: Boolean,
            default: false
        },
        // 是否允许上传
        isUpload: {
            type: Boolean,
            default: true
        },
        // 是否允许新建文件夹
        isAddFolder: {
            type: Boolean,
            default: true
        },
        // 是否允许删除
        isDelete: {
            type: Boolean,
            default: true
        },
        // 窗口模式
        isWindow: {
            type: Boolean,
            default: false
        },
        iconType: {
            type: String,
            default: 'normal'
        }
    },
    mounted() {
        if (this.isWindow) {
            this.w = document.documentElement.clientWidth * 70 / 100 + 'px';
            this.h = document.documentElement.clientHeight * 70 / 100 + 'px';
            window.onresize = () => {
                this.w = document.documentElement.clientWidth * 70 / 100 + 'px';
                this.h = document.documentElement.clientHeight * 70 / 100 + 'px';
            }
        };
        switch (this.iconType) {
            case 'big':
                this.tableSize = 180;
                break;
            case 'small':
                this.tableSize = 140;
                break;
            default:
                this.tableSize = 160;
                break;
        };
    },
    methods: {
        // 节点被点击
        handleNodeClick(data, node) {
            if (!node.loaded) {
                return false;
            }

            let nodes = new Array(node);
            this.getParentNodes(node, nodes);
            // 清空之前所有选择
            this.selecteds.objectsIndex = [];
            this.selecteds.prefixsIndex = [];
            this.isSelectedEmpty = true;
            // 指定当前选择节点
            this.currentNodes = nodes;
            // 高亮当前选择节点
            this.$refs.tree.store.nodesMap[node.key].expanded = true;
            this.$refs.tree.setCurrentKey(node.key);
        },
        // 查找节点的父节点直到最顶端
        getParentNodes(node, nodes) {
            if (node.parent) {
                if (node.parent.level > 0) {
                    nodes.unshift(node.parent);
                }

                this.getParentNodes(node.parent, nodes);
            }
        },
        // 处理objectList数据
        handleObjectList(objectList) {
            for (let i = 0; i < objectList.length; i++) {
                if (!objectList[i].contentType) {
                    let t = objectList[i].key.split(".");
                    let tp = t[t.length - 1];
                    objectList[i].contentType = mime['.' + tp];
                }
            }
            return objectList;
        },
        // 加载数据
        getData(node, resolve) {
            let url = node.level == 0 ? "" : '?' + this.prefixName + '=' + node.data.prefix;
            let _this = this;
            node.loading = true;
            axios.get(this.apiUrl + url).then(function(response) {
                    let r = response.data;
                    r.objectList = _this.handleObjectList(r.objectList);

                    let newChildNodes;
                    if (node.level == 0) {
                        node.data = r;
                        newChildNodes = [r];
                        _this.default_expanded_keys.push(r.prefix);
                    } else {
                        node.data.prefixList = r.prefixList
                        node.data.objectList = r.objectList;
                        newChildNodes = r.prefixList;
                    }

                    if (resolve) resolve(newChildNodes);
                    else {
                        node.loaded = true;
                        node.loading = false;
                        node.childNodes = [];
                        node.data.objectList = r.objectList;

                        node.doCreateChildren(newChildNodes);
                    }

                    if (r.percentage) {
                        let percentage = parseInt(r.percentage);
                        if (percentage >= 0 && percentage <= 100) {
                            this.percentage = percentage;
                        }
                    }

                    _this.handleNodeClick(r, node);
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        // 处理table中的文件夹双击事件
        dblclickNode(node) {
            this.handleNodeClick(node.data, node);
        },
        // 处理选择table的文件及文件夹被选中事件
        handleNodeSelected(c, i) {
            let index = this.selecteds[c].indexOf(i);

            if (index > -1) {
                this.selecteds[c].splice(index, 1);
            } else {
                if (!this.multiple) {
                    this.selecteds.objectsIndex = [];
                    this.selecteds.prefixsIndex = [];
                }
                this.selecteds[c].push(i);
            }

            if (this.isInstantCallback) {
                this.handleCallback();
            }

            if (this.selecteds.objectsIndex.length == 0 && this.selecteds.prefixsIndex.length == 0) {
                this.isSelectedEmpty = true;
            } else {
                this.isSelectedEmpty = false;
            }
        },
        // 右键点击未实现
        rightShow() {
            alert(1)
        },
        // 上传按钮被点击
        hanleUploadClick() {
            this.upload = true;
        },
        // 上传组件事件回调
        uploadEvent(op) {

            const node = this.currentNodes[this.currentNodes.length - 1];
            const data = node.data;
            const newobj = this.handleObjectList([op]);

            data.objectList.push(newobj[0]);
        },
        // 新建文件夹按钮被点击
        hanleAddFolder() {
            this.addFolder = true;
        },
        // 新建文件夹组件事件回调
        addFolderEvent(ev, op) {
            let _this = this;
            switch (ev) {
                case 'cancelAddFolder':
                    _this.addFolder = false;
                    break;

                case 'addFolder':
                    {
                        axios.post(_this.apiUrl, { prefix: op.prefix }).then(function(response) {
                            const node = _this.currentNodes[_this.currentNodes.length - 1];
                            const data = node.data;
                            const newChild = { name: op.name, prefix: op.prefix };

                            data.prefixList.push(newChild);
                            node.doCreateChildren([newChild]);

                            _this.addFolder = false;
                        });
                        break;
                    }
            }
        },
        // 处理回调
        handleCallback() {
            let d = this.getSelectedData();
            if (d.objectList.length > 0) {
                if (this.isInstantCallback) {
                    this.selected(d.objectList[d.objectList.length - 1]);
                } else {
                    this.selected(d.objectList);
                }
            }
        },
        // 处理删除
        handleDelete() {
            let objs = this.getSelectedData();
            if (objs.prefixList.length == 0 && objs.objectList.length == 0) {
                return false;
            }
            const _this = this;

            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let d = {
                    key: [],
                    prefix: []
                }
                for (let i = 0; i < objs.objectList.length; i++) {
                    d.key.push(objs.objectList[i].key);
                }
                for (let i = 0; i < objs.prefixList.length; i++) {
                    d.prefix.push(objs.prefixList[i].prefix);
                }
                axios.delete(this.apiUrl, { data: d }).then(function(response) {
                    for (let i = 0; i < objs.prefixList.length; i++) {
                        _this.$refs.tree.remove(objs.prefixList[i]);
                    }

                    let nodeData = _this.currentNodes[_this.currentNodes.length - 1].data.objectList;
                    for (let i = 0; i < response.data.key.length; i++) {
                        for (let a = 0; a < nodeData.length; a++) {
                            if (nodeData[a].key == response.data.key[i]) {
                                nodeData.splice(a, 1);
                            }
                        }
                    }
                    // 清空之前所有选择
                    _this.selecteds.objectsIndex = [];
                    _this.selecteds.prefixsIndex = [];

                    _this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                });

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });

        },
        getSelectedData() {
            let d = {
                objectList: [],
                prefixList: []
            };
            let node = this.currentNodes[this.currentNodes.length - 1];
            for (let i = 0; i < this.selecteds.objectsIndex.length; i++) {
                d.objectList[i] = node.data.objectList[this.selecteds.objectsIndex[i]];
            }
            for (let i = 0; i < this.selecteds.prefixsIndex.length; i++) {
                d.prefixList[i] = node.data.prefixList[this.selecteds.prefixsIndex[i]];
            }
            return d;
        }
    }
}
</script>
<style type="text/css">
.picture-space {
    width: 100%;
    height: 100%;
    background-color: #fff;
    overflow: hidden;
}

.picture-space.window-mode {
    top: 15%;
    left: 15%;
    position: fixed;
    background-color: #fff;
    border: 1px solid #eee;
    z-index: 1;
    box-shadow: 0 0 5px #ccc;
    border-radius: 10px;
}

.picture-space .control-bar {
    display: flex;
}

.picture-space .control-bar .picture-crumb {
    flex: 1;
}

.picture-space .control-bar .picture-crumb li {
    display: inline-block;
    cursor: pointer;
}

.picture-space .control-bar .picture-crumb li::before {
    content: " - ";
    display: inline-block;
    margin: 0 3px;
    color: #bbb;
    cursor: text;
}

.picture-space .control-bar .picture-crumb li:first-child::before {
    content: "";
    margin: 0;
}

.picture-space .el-main {
    background-color: #fff;
}

.picture-space .control-bar .el-progress {
    width: 200px;
    margin-top: 21px;
}
</style>