import $ from 'jquery';

export default function spotlights () {
    $('.spotlight__location').on('click', function(e) {
        e.preventDefault();
		$(this).removeClass('spotlight__location--active');
		$('.spotlight__countries').addClass('spotlight__countries--active');
	});

    $('.countries__searched-cancel').on('click', function(e) {
        e.preventDefault();
		$('.spotlight__countries').removeClass('spotlight__countries--active');
        $('.spotlight__location').addClass('spotlight__location--active');
	});
}
