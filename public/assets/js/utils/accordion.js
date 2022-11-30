import $ from 'jquery';

export default function accordion (trigger, item, itemActive, target, targetActive) {
    $(trigger).on('click', function(e) {
		e.preventDefault();
        const el = $(this).closest(item);
		$(el).toggleClass(itemActive);
		$(el).find(target).toggleClass(targetActive);
	});
}
