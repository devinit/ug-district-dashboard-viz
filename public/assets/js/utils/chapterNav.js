import $ from 'jquery';

export default function chapterNav () {

    const nav = $('.js-chapter-nav');
    if (!nav.length) return;

    const menu = $('.page__action__menu');
    const toggle_active = $('.burger, .chapter-nav-wrapper');
    const toggle_hidden = $('body');
    const toggle_bottom = $('.page__action');
    const nav_trigger = $('.js-chapter-trigger');
    const nav_wrapper = $('.chapter-nav-wrapper');
    const nav_links = $('.chapter-nav-link');
    const nav_triggers = $('.chapter-nav-link[data-has-sections], .js-chapter-toggle');
    const nav_items = $('.chapter-nav__item');
    const sub_items = $('.js-chapter-link');
    const element = $('.js-chapter-nav').first();
    const focusable = 'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, .js-chapter-trigger';
    const KEYCODE_TAB = 9;

    // main menu
    menu.on('click keypress', (e) => {
        if (isValidAction(e)) {
            toggleActive();

            if (nav_wrapper.hasClass('active')) {
                enter();
            }
            else {
                exit();
            }
        }
    });

    // chapter items
    nav_triggers.on('click keypress', function(e) {
        if (isValidAction(e)) {
            e.preventDefault();

            const parent = $(this).closest('.chapter-nav__item');
            const isActive = parent.hasClass('active');

            setSubNavInactive();

            if (!isActive) {
                parent
                    .addClass('active')
                    .find('*')
                    .toggleClass('active');

                parent
                    .find('.js-chapter-link')
                    .removeAttr('tabindex');

                nav_wrapper.addClass('sub-active');
            }
        }
    });

    // chapter sections
    sub_items.on('click keypress', function(e) {
        if (isValidAction(e)) {
            const chapter_link = $(this).closest('.chapter-nav__item').find('.chapter-nav-link');
            if (chapter_link.data('current-chapter')) {
                toggleActive();
                exit();
            }
        }
    });

    // toggle main menu state
    function toggleActive() {
        toggle_active.toggleClass('active');
        toggle_hidden.toggleClass('hidden');
        toggle_bottom.toggleClass('bottom');
    }

    // set up on entry
    function enter() {
        nav_links.removeAttr('tabindex');
        $(document).on('keydown', onEscape);
        $(element).on('keydown', onFocus);
        activateCurrentChapter();
    }

    // tear down on exit
    function exit() {
        setMainNavInactive();
        setSubNavInactive();
        $(document).off('keydown', onEscape);
        $(element).off('keydown', onFocus);
    }

    // allow escape button to exit
    function onEscape(e) {
        const isEscapePressed = (e.key === 'Escape');

        if (!isEscapePressed) {
            return;
        }
        nav_trigger.focus();
        toggleActive();
        exit();
    }

    // trap focus for keyboard when active
    function onFocus(e) {
        const isTabPressed = (e.key === 'Tab' || e.keyCode === KEYCODE_TAB);

        if (!isTabPressed) {
            return;
        }

        const focusableEls = $(element).find(focusable).not('[tabindex="-1"]');
        const firstFocusableEl = focusableEls[0];
        const lastFocusableEl = focusableEls[focusableEls.length - 1];

        if (e.shiftKey) /* shift + tab */ {
            if (document.activeElement === firstFocusableEl) {
                lastFocusableEl.focus();
                e.preventDefault();
            }
        } else /* tab */ {
            if (document.activeElement === lastFocusableEl) {
                firstFocusableEl.focus();
                e.preventDefault();
            }
        }
    }

    // test for valid click or enter key press
    function isValidAction(e) {
        return e.key === 'Enter' || e.type === 'click';
    }

    // activate the current chapter
    function activateCurrentChapter() {
        nav_links.each((i, elem) => {
            if ($(elem).data('current-chapter')) {
                $(elem).trigger('click');
            }
        });
    }

    // deactivate the main nav
    function setMainNavInactive() {
        nav_links.attr('tabindex', '-1');
    }

    // deactivate the sub nav
    function setSubNavInactive() {
        nav_items
            .removeClass('active')
            .find('*')
            .removeClass('active');
        sub_items.attr('tabindex', '-1');
    }
}
