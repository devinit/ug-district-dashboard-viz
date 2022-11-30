import $ from 'jquery';
import Cookies from '../libs/js.cookie.mjs';

export default function modal (target, trigger, parentcontainer) {

	var modal			= document.getElementById(target),
		body			= document.getElementsByTagName("body"),
		container		= document.getElementById(parentcontainer),
		file_url 		= null;

	// Opening action
	$(trigger).on('click', function(event) {
		event.preventDefault();

		/* Capture the filename for later*/
		file_url = $(this).attr('href');

// Enable this to force the modal to always appear.
Cookies.set('download_modal', 'always show the modal');

		/* Act on the event */
		if(Cookies.get('download_modal') == 'used') { // download the file
			if (file_url != null) {
				window.open(file_url);
				return;
			}
		} else { // open the modal
			modal.className="modal is-visually-hidden",
				setTimeout(function(){
					container.className="modal-container is-blurred",
					modal.className="modal"
				},
			100),
			container.parentElement.className="modal-open";
			// Set the cookie to expire in 7 days
			Cookies.set('download_modal', 'used', { expires: 7 });
		};
	});

	// Closing action
	$('.modal-dismiss,#modal-button-close').on('click', function(event) {
		modal.className="modal is-hidden is-visually-hidden",
		body.className="",
		container.className="modal-container",
		container.parentElement.className="";
		if (file_url != null) {
			window.open(file_url);
			return;
		}
	});
}