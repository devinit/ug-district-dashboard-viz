import $ from 'jquery';

export default function chapterNavSimple () {

    const nav = $('.js-chapter-nav-simple');
    if (!nav.length) return;

    console.log('chapterNavSimple');

    const menu = $('.page__action__menu');
    const toggle_active = $('.burger, .chapter-nav-wrapper');
    const toggle_hidden = $('body');
    const toggle_bottom = $('.page__action');
    const nav_trigger = $('.js-chapter-trigger');
    const nav_wrapper = $('.chapter-nav-wrapper');
    const nav_links = $('.js-chapter-link');
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

    // chapter sections
    nav_links.on('click keypress', function(e) {
        if (isValidAction(e)) {
            e.stopPropagation();
            toggleActive();
            exit();
            updateHash(e.currentTarget);
        }
    });

    // update hash from selected link
    function updateHash(elem) {
        if (elem.href) {
            const hash = elem.href.split('#');
            if (hash.length > 1) {
                window.location.hash = hash[1];
            }
        }
    }

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
        $(document).on('click', onClickOutside);
        $(element).on('keydown', onFocus);
    }

    // tear down on exit
    function exit() {
        setNavInactive();
        $(document).off('keydown', onEscape);
        $(document).off('click', onClickOutside);
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

    // click outside handler
    function onClickOutside(e) {
        if (!$(e.target).closest(nav).length) {
            toggleActive();
            exit();
        }
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

    // deactivate the nav
    function setNavInactive() {
        nav_links.attr('tabindex', '-1');
    }
}
