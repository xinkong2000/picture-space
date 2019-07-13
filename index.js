/*
* @Author: xinkong2000
* @Date:   2019-07-03 09:27:05
* @Last Modified by:   xinkong2000
* @Last Modified time: 2019-07-13 11:32:24
*/
import PictureSpace from './src/picture-space.vue';

const install = (Vue, option) => {
	Vue.component(PictureSpace.name, PictureSpace);
}
export default { install };
export { PictureSpace }