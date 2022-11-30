import $ from 'jquery';

export default function sectionSharing (block='[data-js="share-section"]', trigger='[data-js="share-section-trigger"]') {

    const id_attr = 'id';

    $(block).each(function(i, e) {
        $(e).attr('aria-hidden', true);
    });

    $(trigger).on('click keypress', function(e) {
        const target = $(e.target);
        const id = target.data(id_attr);
        if (!id) {
            return;
        }

        const filter = `[data-${id_attr}="${id}"]`;

        if (isValidAction(e)) {
            e.preventDefault();
            const item = $(block).filter(filter);
            const items = $(block).not(item);
            if (items.is(':visible')) {
                items.slideUp(0);
                items.attr('aria-hidden', true);
            }
            if (item.is(':visible')) {
                item.slideUp();
                item.attr('aria-hidden', true);
            }
            else {
                item.slideDown();
                item.removeAttr('aria-hidden');
            }
            $('html, body').animate(
                {
                    scrollTop: $(`#${id}`).offset().top - 20,
                },
                400
            );
        }
    });

    // test for valid click or enter key press
    function isValidAction(e) {
        return e.key === 'Enter' || e.type === 'click';
    }
}
