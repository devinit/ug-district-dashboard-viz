import $ from 'jquery';

export default function showHide (trigger, target, targetActive) {
    $(trigger).on('click', function(e) {
		e.preventDefault();
		var labelinactive = $(this).data('labelinactive'),
			labelactive = $(this).data('labelactive');
		$(target).toggleClass(targetActive);
		if (labelinactive != null && labelactive != null) {
			$(trigger).text( $(trigger).text() == labelinactive ? labelactive : labelinactive);
		}
	});
}
