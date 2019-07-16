<template>
    <ul class="picture-table">
        <li class="folder" v-for="(object, index) in prefixList" :key="'folder_'+index" @click="select('prefixsIndex', index)" :id="'fol_'+index" :class="{ 'selected': selecteds.prefixsIndex.indexOf(index) > -1 }">
            <div class="icon-bar" :style="{'width':tableSize+'px', 'height':tableSize+'px'}">
                <i class="PSicon icon-icon_folder" @dblclick="openFolder(index)" :style="{'line-height':tableSize+'px'}"></i>
            </div>
            <div class="object-name">{{ object.name == "" ? "/" : object.name }}</div>
        </li>
        <li class="file" v-for="(object, index) in objectList" :key="'object_'+index" @click="select('objectsIndex', index)" :id="'obj_'+index" :class="{ 'selected': selecteds.objectsIndex.indexOf(index) > -1 }">
            <div class="icon-bar" :style="{'width':tableSize+'px', 'height':tableSize+'px'}">
                <div class="img-preview" v-lazy:background-image="object.url" v-if="imgContentType.indexOf(object.contentType)>-1"></div>
                <div class="img-preview" v-if="imgContentType.indexOf(object.contentType)==-1">{{ object.contentType }}</div>
            </div>
            <div class="object-name">{{ object.name }}</div>
        </li>
    </ul>
</template>
<script type="text/javascript">

export default {
    name: 'picture-table',
    data() {
        return {
            prefixList: [],
            objectList: [],
            imgContentType: ['image/bmp', 'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
        }
    },
    props: ['list', 'selecteds', 'tableSize'],
    mounted() {
        this.prefixList = this.list.data.prefixList;
        this.objectList = this.list.data.objectList;
    },
    methods: {
        openFolder(index) {
            let node = this.list.childNodes[index];
            if (node.loaded === true) {
                this.$emit("dblclickNode", node);
            } else {
                this.$emit("getData", node);
            }
        },
        select(c, i) {
            this.$emit("selected", c, i);
        }
    },
    watch: {
        list: function(a) {
        	this.prefixList = a.data.prefixList;
            this.objectList = a.data.objectList;
        }
    },
    uploaded() {
    	let _this = this;
        this.$nextTick(function() {
            console.log(_this.objectList)
        })
    }
}
</script>
<style>
/*此处用到一个文件夹的ICON在阿里图标字体上*/
@import url(//at.alicdn.com/t/font_400853_xm25jqms1wp.css);

.picture-table li {
    display: inline-block;
    margin-right: 20px;
    margin-bottom: 20px;
}

.picture-table li.file.selected .icon-bar {
    border-color: #67C23A;
}

.picture-table li.folder.selected .icon-bar {
    border-color: #15a2e5;
}

.picture-table .icon-bar {
    width: 180px;
    height: 180px;
    border: 1px solid #dedede;
    padding: 10px;
    text-align: center;
}

.picture-table .icon-bar i {
    font-size: 70px;
    color: #f4ca13;
    margin: auto;
}

.picture-table .object-name {
    line-height: 30px;
    font-size: 12px;
    text-align: center;
    color: #666;
}

.picture-table .img-preview {
    height: 100%;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    font-size: 12px;
    color: #999;
}


.picture-table .img-preview[lazy=loading] {
    position: relative;
    width: 2.5em;
    height: 2.5em;
    transform: rotate(165deg);
}

.picture-table .img-preview[lazy=loading]:before,
.picture-table .img-preview[lazy=loading]:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    width: 0.5em;
    height: 0.5em;
    border-radius: 0.25em;
    transform: translate(-50%, -50%);
}

.picture-table .img-preview[lazy=loading]:before {
    animation: before 2s infinite;
}

.picture-table .img-preview[lazy=loading]:after {
    animation: after 2s infinite;
}

@keyframes before {
    0% {
        width: 0.5em;
        box-shadow: 1em -0.5em rgba(225, 20, 98, 0.75), -1em 0.5em rgba(111, 202, 220, 0.75);
    }

    35% {
        width: 2.5em;
        box-shadow: 0 -0.5em rgba(225, 20, 98, 0.75), 0 0.5em rgba(111, 202, 220, 0.75);
    }

    70% {
        width: 0.5em;
        box-shadow: -1em -0.5em rgba(225, 20, 98, 0.75), 1em 0.5em rgba(111, 202, 220, 0.75);
    }

    100% {
        box-shadow: 1em -0.5em rgba(225, 20, 98, 0.75), -1em 0.5em rgba(111, 202, 220, 0.75);
    }
}

@keyframes after {
    0% {
        height: 0.5em;
        box-shadow: 0.5em 1em rgba(61, 184, 143, 0.75), -0.5em -1em rgba(233, 169, 32, 0.75);
    }

    35% {
        height: 2.5em;
        box-shadow: 0.5em 0 rgba(61, 184, 143, 0.75), -0.5em 0 rgba(233, 169, 32, 0.75);
    }

    70% {
        height: 0.5em;
        box-shadow: 0.5em -1em rgba(61, 184, 143, 0.75), -0.5em 1em rgba(233, 169, 32, 0.75);
    }

    100% {
        box-shadow: 0.5em 1em rgba(61, 184, 143, 0.75), -0.5em -1em rgba(233, 169, 32, 0.75);
    }
}

.picture-table .img-preview[lazy=loading] {
    /*position: absolute;*/
    top: calc(50% - 1.25em);
    left: calc(50% - 1.25em);
}
</style>