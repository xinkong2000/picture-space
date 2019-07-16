/*
 * @Author: xinkong2000
 * @Date:   2019-07-03 09:27:05
 * @Last Modified by:   xinkong2000
 * @Last Modified time: 2019-07-15 16:42:20
 */
import PictureSpace from './src/picture-space.vue';

PictureSpace.install = (Vue, option) => {

    Vue.prototype.$pictureSpanceOption = Object.assign({
		"apiUrl" : "",
		"headers" : "",
		"prefix" : "prefix"
	}, option);

    /**
     * [全局拖拽指令]
     * ---------------------------------------
     * 调用方法：标签上v-drag
     */
    Vue.directive('drag', {
        bind: function(el) {
            el.onmousedown = (e) => {
                let elX = e.clientX - el.offsetLeft;
                let exY = e.clientY - el.offsetTop;

                document.onmousemove = function(e) {
                    let left = e.clientX - elX;
                    let top = e.clientY - exY;

                    this.positionX = top;
                    this.positionY = left;

                    el.style.left = left + 'px';
                    el.style.top = top + 'px';
                };
                document.onmouseup = () => {
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
            };
        }
    });

    Vue.component(PictureSpace.name, PictureSpace);
}

// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

export { PictureSpace }
export default PictureSpace;