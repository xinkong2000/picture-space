# picture-space 图片空间VUE组件

V1.0

## 组件依赖
axios、element-ui、vue-lazyload

##快速使用
>在config.js中配置与服务器交互的数据接口

```javascript
// picture-space/config.js
export default {
	// 获取数据的接口地址
	getDataUrl: 'http://www.xdw.test/api/all'
}
```
>在项目mian.js引入依赖

```javascript
// main.js
// 饿了么UI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// 图片懒加载
import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload);
```

>在项目main.js引入picture-space

```javascript
// main.js
// 图片空间
import Picturespace from './components/lib/picture-space';
Vue.use(Picturespace);
```

>在使用的地方插入标签

```html
<picture-space />
```

##config.js配置项说明
####apiUrl 获取数据例表的接口地址
>图片空间会以prefix为前辍字段名在url中传参给接口地址，以获取该前辍下的数据
**该项为必设项*
*该数据接口需按照RESTful规范编写
例：http://www.xdw.test/api/oss

####获取数据，方法GET
* **提交参数**

|参数|说明|类型|可选值|默认|
|:-----|:-----|:-----|:------|:-----|
|prefix|对象前辍，用以模拟文件夹|String| |||
* **返回**

```json
// 返回数据必须是JSON格式：
 {
	"name" : "",		// [string][文件夹名称][必须]
	"prefix" : "",		// [string][对象前辍名][必须]
	"objectList" : {
		"name" : "",	// [string][文件名][必须]
		"url" : "",		// [string][访问地址][必须]
		"key" : ""		// [string][对象的唯一识别码][必须]
		...				// [其它项][非必须]
	},
	"prefixList" : {
		"name" : ""		// [string][前辍名][必须]
		"prefix" : "" 	// [string][前辍][必须]
	},
	"percentage" : ""	// [integer][空间占用百分比][非必须]
}
```

####上传文件，方法POST
>目前发前饿了么的上传UI为批量选择，逐个上传；
*需注意的是，有可能上传的FILE对象为空，有一个prefix的数据，此时为类似新建文件夹处理

* **提交参数**

|参数|说明|类型|可选值|默认|
|:-----|:-----|:-----|:------|:-----|
|prefix|对象前辍，用以模拟文件夹|String| ||
|file|文件对象|Object| |||
* **返回**

```json
// 返回数据必须是JSON格式：
{
	"object" : {			// [object][上传的文件属性][非必须，只有在上传文件时返回]
		"name" : "",	   // [string][文件名][必须]
		"url" : "",		   // [string][访问地址][必须]
		"key" : ""		   // [string][对象的唯一识别码][必须]
		...					// [其它项][非必须]
	},
	"percentage" : ""	// [integer][空间占用百分比][非必须]
	"prefix" : {			 // [object][上传的prefix，模拟新建文件夹][非必须，只有在新建文件夹时返回]
		"prefix" : "",		// [string][对象前辍][必须]
	}
 }
```

####删除对象，方法DELETE

* **提交参数**

|参数|说明|类型|可选值|默认|
|:-----|:-----|:-----|:------|:-----|
|prefix|按前辍名删除|Array| ||
|key|按对象属性key删除|Array| |||
* **返回**

```json
// 删除是一个批量的操作，会向接口提交两个字段：
 {
	"prefix" : [],		// [array][与提交参数相同]
	"key" : [], 		// [array][与提交参数相同]
 }
```

####headers 数据请求时头部信息
>接收一个JSON对象

##属性

|参数|说明|类型|可选值|默认|
|:-----|:-----|:-----|:------|:-----|
|selected|选择后回调，如开启即时回调，返回最后选择的对象json格式，如未开启即时回调，返回一个数组|Function| | |
|close|点击关闭按钮后回调，无此参数不显示关闭按钮|Function|||
|multiple|是否允许多选|Boolean|true/false|true|
|isInstantCallback|是否允许在点选后直接返回点选的对象，为true时将不显示确认按钮|Boolean|true/false|false|
|isUpload|是否显示上传按钮|Boolean|true/false|true|
|isAddFolder|是否显示新建文件夹按钮|Boolean|true/false|true|
|isDelete|是否显示删除按钮|Boolean|true/false|true|
|isWindow|是否窗口模式|Boolean|true/false|false|
|isDrag|是否允许拖拽，只有窗口模式才可拖拽|Boolean|true/false|true|
|iconType|Table中图标显示的大小|String|big/normal/small|normal|
----

