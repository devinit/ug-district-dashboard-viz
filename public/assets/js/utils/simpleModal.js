import $ from 'jquery';

export default function simpleModal (trigger, target, targetActive) {
    $(trigger).on('click', function(e) {
		e.preventDefault();
		$(target).toggleClass(targetActive);
	});
}
