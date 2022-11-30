import $ from 'jquery';

export default function childTabIndex (trigger, target, targetActive, maxWidth) {
    const links = $(target).find('a');
    let resizeTimeout = 0;

    $(trigger).on('click', function(e) {
        e.preventDefault();
        toggleTabIndex();
    });

    function toggleTabIndex() {
        const width = $(window).width();
        if (width >= maxWidth || $(target).hasClass(targetActive) ) {
            links.removeAttr('tabindex');
        }
        else {
            links.attr('tabindex', '-1');
        }
    }

    $(window).on('resize', function(e) {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            toggleTabIndex();
        }, 250);
    });

    toggleTabIndex();
}
