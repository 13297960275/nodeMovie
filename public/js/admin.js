$(function() {
	/*	$('.del').click(function(e) {
			console.log(e);
			var target = $(e.target);
			var id = target.data('id');
			var tr = $('#tr-' + id);

			$.ajax({
					url: '/admin/list?id=' + id,
					type: 'DELETE'
				})
				.done(function(res) {
					console.log("success");
					if (res.success === 1) {
						if (tr.length > 0) {
							tr.remove();
						}
					}
				});
		})*/

	// 豆瓣录入电影
	$('#douban').blur(function() {
		var douban = $(this);
		var id = douban.val();

		if (id) {
			$.ajax({
				url: 'https://api.douban.com/v2/movie/subject/' + id,
				catch: true,
				type: 'get',
				dataType: 'jsonp',
				crossDomain: true,
				jsonp: 'callback',
				success: function(data) {
					$('#title').val(data.title),
					$('#doctor').val(data.directors[0].name),
					$('#country').val(data.countries[0]),
					// $('#language').val(data.languages[0]),
					$('#poster').val(data.images.large),
					// $('#flash').val(),
					$('#year').val(data.year),
					$('#summary').val(data.summary)
				}
			});
		}
	});

	// 电影分类是否自定义添加
	$('#catSelext').change(function() {
		if ($(this).is(":checked")) {// 选中自定义则认为输入分类信息，否则就从分类列表中选择
			$('#inputCategory').show();
			$('#selectCategory').hide();
			// attr方法主要处理自定义的DOM属性。
			// prop方法主要处理本身就带有的固有属性。
			// $('input:radio[name="catRadio"]').removeAttr('checked');
			// $('input:radio[name="catRadio"]').attr("checked",false); 
			$('input:radio[name="catRadio"]').prop("checked", false);
		} else {
			$('#inputCategory').hide();
			$('#selectCategory').show();
			$('#catIntro').val('');
			$('#catName').val('');
		}
	});
});

function del(type, e) {
	var id = $(e).attr('data-id');
	var tr = $('#tr-' + id);
	var delUrl = '';

	console.log(e, id, tr);

	if (type == 1) {
		delUrl = '/admin/movie/del?id=' + id;
	} else if (type == 2) {
		delUrl = '/admin/user/del?id=' + id;
	} else if (type == 3) {
		delUrl = '/admin/category/del?id=' + id;
	}

	$.ajax({
			url: delUrl,
			type: 'DELETE'
		})
		.done(function(res) {
			console.log("success");
			if (res.success === 1) {
				if (tr.length > 0) {
					tr.remove();
				}
			}
		});
}