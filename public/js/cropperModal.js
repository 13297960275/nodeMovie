var initCropperInModal = function(img, input, modal) {
	var $image = img;
	var $inputImage = input;
	var $modal = modal;
	var options = {
		aspectRatio: 1, // 纵横比
		viewMode: 2,
		preview: '.img-preview' // 预览图的class名
	};
	// 模态框隐藏后需要保存的数据对象
	var saveData = {};
	var URL = window.URL || window.webkitURL;
	var blobURL;
	$modal.on('show.bs.modal', function() {
		// 如果打开模态框时没有选择文件就点击“打开图片”按钮
		// if (!$inputImage.val()) {
		// 	$inputImage.click();
		// }
	}).on('shown.bs.modal', function() {
		// 重新创建
		$image.cropper($.extend(options, {
			ready: function() {
				// 当剪切界面就绪后，恢复数据
				if (saveData.canvasData) {
					$image.cropper('setCanvasData', saveData.canvasData);
					$image.cropper('setCropBoxData', saveData.cropBoxData);
				}
			}
		}));
	}).on('hidden.bs.modal', function() {
		// 保存相关数据
		saveData.cropBoxData = $image.cropper('getCropBoxData');
		saveData.canvasData = $image.cropper('getCanvasData');
		// 销毁并将图片保存在img标签
		$image.cropper('destroy').attr('src', blobURL);
	});
	if (URL) {
		$inputImage.change(function() {
			var files = this.files;
			var file;
			if (!$image.data('cropper')) {
				return;
			}
			if (files && files.length) {
				file = files[0];
				if (/^image\/\w+$/.test(file.type)) {

					if (blobURL) {
						URL.revokeObjectURL(blobURL);
					}
					blobURL = URL.createObjectURL(file);

					// 重置cropper，将图像替换
					$image.cropper('reset').cropper('replace', blobURL);

					// 选择文件后，显示和隐藏相关内容
					$('.img-container').removeClass('hidden');
					$('.img-preview-box').removeClass('hidden');
					$('#changeModal .disabled').removeAttr('disabled').removeClass('disabled');
					$('#changeModal .tip-info').addClass('hidden');

				} else {
					window.alert('请选择一个图像文件！');
				}
			}
		});
	} else {
		$inputImage.prop('disabled', true).addClass('disabled');
	}
};

var sendPhoto = function() {
	$('.user-photo-box').removeClass('hidden');
	$('#photo').cropper('getCroppedCanvas', {
		width: 300,
		height: 300
	}).toBlob(function(blob) {
		// 转化为blob后更改src属性，隐藏模态框
		$('#user-photo').attr('src', URL.createObjectURL(blob));
		$('#changeModal').modal('hide');
	});
};

var sendPhoto = function() {
	// 得到PNG格式的dataURL
	var photo = $('#photo').cropper('getCroppedCanvas', {
		width: 183,
		height: 185
	}).toDataURL('image/png');

	$.ajax({
		url: '/admin/user/upload', // 要上传的地址
		type: 'post',
		data: {
			'imgData': photo
		},
		dataType: 'json',
		success: function(data) {
			if (data.success == 1) {
				// 将上传的头像的地址填入，为保证不载入缓存加个随机数
				$('.user-photo').attr('src', '头像地址?t=' + Math.random());
				$('#changeModal').modal('hide');
				$('#signupAvatar').val(data.avatar);
			} else {
				alert(data.info);
			}
		}
	});
};

$(function() {
	initCropperInModal($('#photo'), $('#photoInput'), $('#changeModal'));
});