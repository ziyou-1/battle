function photoCompress  (file, obj, callback) {
	var that = this;
	var ready = new FileReader();
	/*开始读取指定File对象中的内容. 读取操作完成时,返回一个URL格式的字符串.*/
	ready.readAsDataURL(file);
	ready.onload = function () {
		var re = this.result;
		that.canvasDataURL(re, obj, callback, file.name)  //开始压缩
	}
}
/*利用canvas数据化图片进行压缩*/
/*图片转base64*/
function canvasDataURL (path, obj, callback, name) {

	var img = new Image();
	img.src = path;
	img.onload = function () {
		var that = this;   //指到img
		// 默认按比例压缩
		var w = that.width,
			h = that.height,
			scale = w / h;
		w = obj.width || w;
		h = obj.height || (w / scale);
		var quality = 0.7;  // 默认图片质量为0.7
		//生成canvas
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		// 创建属性节点
		var anw = document.createAttribute("width");
		anw.nodeValue = w;
		var anh = document.createAttribute("height");
		anh.nodeValue = h;
		canvas.setAttributeNode(anw);
		canvas.setAttributeNode(anh);
		ctx.drawImage(that, 0, 0, w, h);
		// 图像质量
		if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
			quality = obj.quality;
		}
		// quality值越小，所绘制出的图像越模糊
		var base64 = canvas.toDataURL('image/jpeg', quality);
		// 回调函数返回base64的值
		callback(base64, name);
	}
}
function base64ToFile  (base64, filename) {

	const arr = base64.split(',')
	const type = arr[0].match(/:(.*?);/)[1]
	const bstr = atob(arr[1])
	let n = bstr.length
	const u8arr = new Uint8Array(n)
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n)
	}
	return new File([u8arr], filename, { type: type })

}

// this.photoCompress(file, {   
// 	quality: 0.5,
// 	// width:1920,
// 	// height:1080
// }, function (base64Codes, name) {
// 	var file = this.base64ToFile(base64Codes, name);
// })