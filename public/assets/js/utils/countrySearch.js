import $ from 'jquery';

export default function countrySearch (container, input, items, results, nav, navElems, highlightClass, matchClass='match') {
    const search        = $(input);
    const regionItem    = '.js-profile-region-item';
    const subRegionList = '.js-profile-subregion-list';
    const subRegionItem = '.js-profile-subregion-item';
    const countryList   = '.js-profile-country-list';
    const countryItem   = '.js-profile-country-item';

    if (!search.length) {
        return;
    }

    // Handler for search input
    search.on('keyup click input', e => {
        const isEscapePressed = (e.key === 'Escape');
        if (isEscapePressed) {
            return;
        }

        clear();
        if (search.val().trim().length > 1) {
            enter();
            $(items)
                .removeClass(matchClass)
                .filter(function () {
                    const text = $(this).text();
                    const match = text.toLowerCase().indexOf(search.val().trim().toLowerCase()) != -1;
                    return match;
                })
                .addClass(matchClass);
            cloneNav();
            emptyMessage();
        }
        else {
            exit();
        }
    });

    // Catch click events off target to exit
    $(document).on('click', e => {
        if (!$(e.target).closest(container).length) {
            exit();
        }
    });

    // Clone nav tree
    function cloneNav() {
        const list = $(results);

        $(navElems)
            .children()
            .clone()
            .appendTo(list);

        list
            .find('.js-profile-item')
            .remove();

        list
            .find(regionItem)
            .each(function() {
                createRegion($(this));
            });
    }

    // Clear results tree
    function clear(item, text) {
        $(results).empty()
    }

    // Enter search mode
    function enter() {
        $(results).parent().addClass('active');
        $(document).on('keydown', onEscape);
        $(document).on('click', onClickOutside);
    }

    // Exit search mode
    function exit() {
        $(results).parent().removeClass('active');
        $(document).off('keydown', onEscape);
        $(document).off('click', onClickOutside);
        $(items).removeClass(matchClass);
    }

    // allow escape button to exit
    function onEscape(e) {
        const isEscapePressed = (e.key === 'Escape');
        if (!isEscapePressed) {
            return;
        }
        exit();
        e.stopPropagation();
    }

    // Catch click events off target to exit
    function onClickOutside(e) {
        if (!$(e.target).closest(container).length) {
            exit();
        }
    }

    // Empty message if no results
    function emptyMessage() {
        const list = $(results);
        if (!list.children().length) {
            list.append(`<li class="countries__searched__item">No results for "${search.val().trim()}"</li>`);
        }
    }

    // Create region levels, who then create subregions
    function createRegion(item) {
        if (!hasDescendants(item, subRegionList)) {
            return;
        }

        item
            .removeClass()
            .addClass('countries__searched__item')
            .children('a')
            .each(function() {
                const row = createRow($(this), 'countries__searched__item countries__searched__parent--first');
                $(this).replaceWith(row);
                row
                    .parent()
                    .find(subRegionList)
                    .each(function() {
                        createSub($(this));
                    });
            });
    }

    // Create sub-region levels, who then create countries
    function createSub(item) {

        if (!hasDescendants(item, subRegionItem)) {
            return;
        }

        item
            .removeClass()
            .addClass('countries__searched__children')
            .find(subRegionItem)
            .each(function() {
                if (!hasDescendants($(this), countryList)) {
                    return;
                }
                $(this)
                    .removeClass()
                    .addClass('countries__searched__item')
                    .children(items)
                    .each(function() {
                        const row = createRow($(this), 'countries__searched__parent--second');
                        $(this).replaceWith(row);
                        row
                            .parent()
                            .find(countryList)
                            .each(function() {
                                createCountry($(this));
                            });
                    });
            });
    }

    // Create countries
    function createCountry(item) {

        if (!hasDescendants(item, countryItem)) {
            return;
        }

        item
            .removeClass()
            .addClass('countries__searched__item countries__searched__children__sub')
            .find(countryItem)
            .each(function() {
                const countryRow = $(this);
                countryRow
                    .removeClass()
                    .addClass('countries__searched__item countries__searched__country')
                    .children(items)
                    .each(function() {
                        if (hasMatch($(this))) {
                            const row = createRow($(this), '');
                            $(this).replaceWith(row);
                        }
                        else {
                            countryRow.remove();
                        }
                    });
            });
    }

    // Create replacement rows, highlighted if matching
    function createRow(item, itemClass) {
        let text = highlightText(item);
        if (item.hasClass(matchClass)) {
            text = createWrapper(item, text);
        }
        const row = $(`<span class="${itemClass}">${text}</span>`);
        return row;
    }

    // Check for matching descedants, removing if not matched
    function hasDescendants(item, type) {
        if (!item.find(`.${matchClass}`).length) {
            item
                .find(type)
                .remove();

            return hasMatch(item);
        }
        return true;
    }

    // Check for matching item, removing if not matched
    function hasMatch(item) {
        if (!item.hasClass(matchClass)) {
            item.remove();
            return false;
        }
        return true;
    }

    // Create and return a wrapper for matching items
    function createWrapper(item, text) {
        return  `<a href="${item.attr('href')}#profile"><span class="countries__searched__highlight">${text}</span></a>`;
    }

    // Highlight or return plain text
    function highlightText(item) {
        if (item.hasClass(matchClass)) {
            return highlight(item.text());
        }
        else {
            return item.text();
        }
    }

    // Highlight matching text
    function highlight(text) {
        const matchStart    = text.toLowerCase().indexOf('' + search.val().trim().toLowerCase() + '');
        const matchEnd      = matchStart + search.val().trim().length - 1;
        const beforeMatch   = text.slice(0, matchStart);
        const matchText     = text.slice(matchStart, matchEnd + 1);
        const afterMatch    = text.slice(matchEnd + 1);
        const result        = `${beforeMatch}<span class="${highlightClass}">${matchText}</span>${afterMatch}`;
        return result;
    };
}

