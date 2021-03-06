$(function() {
	$('.comment').click(function(e) {
		var target = $(this);
		var toId = target.data('tid');
		var commentId = target.data('cid');

		if ($('#toId').length > 0) {
			$('#toId').val(toId);
		} else {
			$('<input>').attr({
				type: 'hidden',
				id: 'toId',
				name: 'comment[tid]',
				value: toId
			}).appendTo('#inputHidden');
		}

		if ($('#commentId').length > 0) {
			$('#commentId').val(commentId);
		} else {
			$('<input>').attr({
				type: 'hidden',
				id: 'commentId',
				name: 'comment[cid]',
				value: commentId
			}).appendTo('#inputHidden');
		}

		focus();

	});
});

var focus = function() {
	setTimeout(function() {
		var activeElement = document.activeElement;
		if (activeElement.type !== 'text') {
			$('#inputTextArea').focus();
		}
		focus();
	}, 60);
};

