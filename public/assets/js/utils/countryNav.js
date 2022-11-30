import $ from 'jquery';

export default function countryNav (container, selector, regionActive, countryItem, countryParent, countryActive, listActive, triggerClass) {
    const nav = $(selector);
    if (!nav.length) {
        return;
    }

    const trigger = $(triggerClass);
    trigger.on('click', e => {
        e.preventDefault();
        nav.toggleClass('inactive');
        trigger.toggleClass('inactive');
    });

    // Catch click events off target to exit
    $(document).on('click', e => {
        if (!$(e.target).closest(container).length) {
            if (trigger.hasClass('inactive')) {
                nav.toggleClass('inactive');
                trigger.toggleClass('inactive');
            }
        }
    });

    nav.on('click', '.js-menu-item', function(e) {
        const item = $(this);
        const isCountry = item.hasClass(countryItem);
        const isRegion = !isCountry;

        e.preventDefault();

        nav
            .find('a')
            .removeClass('active');

        if (isRegion) {
            if (item.hasClass(regionActive)) {
                item
                    .removeClass(regionActive)
                    .blur();

                if (item.data('has-children')) {
                    item
                        .nextAll('ul')
                        .first()
                        .removeClass(listActive)
                        .slideUp(200);
                }
            }
            else {
                item
                    .addClass(regionActive)
                    .addClass('active');

                if (item.data('has-children')) {
                    item
                        .nextAll('ul')
                        .first()
                        .addClass(listActive)
                        .slideUp(0)
                        .slideDown(200);
                }
            }
        }
    });
}
