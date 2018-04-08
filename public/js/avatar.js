$("#imgBtn").change(function(e) {
	console.log(e);
	// $('.cropper-container.cropper-bg').html("");
	// $('#thum').html("");
	var file = $("#imgBtn").get(0).files[0];
	var reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onload = function(e) {
		console.log('asd')
		// alert('文件读取完成');
		$("#previewyulan").attr("src", e.target.result);
		$('.box > img').cropper({
			aspectRatio: 1 / 1,
			crop: function(data) {
				//转换为base64
				// var $imgData=$img.cropper('getCroppedCanvas')
				//   var dataurl = $imgData.toDataURL('image/png');
				//  $("#previewyulan").attr("src",dataurl)

				// 清空裁剪预览区
				$('#thum').html("");
				//获取裁剪后的canvas对象
				var result = $('.box > img').cropper("getCroppedCanvas");
				//将canvas对象转换为base64
				var dataurl = result.toDataURL('image/png');
				// document.body.appendChild(result);
				document.getElementById('thum').appendChild(result);
			}
		});
	}

})

function imgSubmit() {
	//获取裁剪后的canvas对象
	var result = $('.box > img').cropper("getCroppedCanvas");
	//将canvas对象转换为base64
	var dataurl = result.toDataURL('image/png');
	document.body.appendChild(result);
	//发起post请求
	var data = "img=" + dataurl + "";
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(event) {
		if (xhr.readyState == 4) { //4:解析完毕
			if (xhr.status == 200) { //200:正常返回
				console.log(xhr)
			}
		}
	};
	xhr.open('POST', 'imgCut', true); //true为异步
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.send(data);
}