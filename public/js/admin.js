// $(function() {
// 	$('.del').click(function(e) {
// 		console.log(e);
// 		var target = $(e.target);
// 		var id = target.data('id');
// 		var tr = $('#tr-' + id);

// 		$.ajax({
// 				url: '/admin/list?id=' + id,
// 				type: 'DELETE'
// 			})
// 			.done(function(res) {
// 				console.log("success");
// 				if (res.success === 1) {
// 					if (tr.length > 0) {
// 						tr.remove();
// 					}
// 				}
// 			});
// 	})
// })

function del(type, e) {
	var id = $(e).attr('data-id');
	var tr = $('#tr-' + id);

	console.log(e, id, tr);

	if (type == 1) {
		var delUrl = '/admin/movie/del?id=' + id
	} else {
		var delUrl = '/admin/user/del?id=' + id
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