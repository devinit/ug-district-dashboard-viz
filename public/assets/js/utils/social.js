import $ from 'jquery';

function windowPopup (url, width, height) {
    // Calculate the position of the popup so
    // it’s centered on the screen.
    const left = (screen.width / 2) - (width / 2);
    const top = (screen.height / 2) - (height / 2);

    window.open(
        url,
        '',
        `menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=${width},height=${height},top=${top},left=${left}`
    );
}

export default function setupSharing (selector='.js-social-share') {

    $(selector).on('click', function onClick (e) {
        e.preventDefault();
        windowPopup($(this).attr('href'), 500, 300);
    });

}
