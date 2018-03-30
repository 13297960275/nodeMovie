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
			})
		} else {}
	})
})

function del(type, e) {
	var id = $(e).attr('data-id');
	var tr = $('#tr-' + id);

	console.log(e, id, tr);

	if (type == 1) {
		var delUrl = '/admin/movie/del?id=' + id
	} else if (type == 2) {
		var delUrl = '/admin/user/del?id=' + id
	} else if (type == 3) {
		var delUrl = '/admin/category/del?id=' + id
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

function getMovies() {
	$('#douban')
}