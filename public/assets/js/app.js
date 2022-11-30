import fastClick from 'fastclick';
import $ from 'jquery';

import childTabIndex from './utils/childTabIndex';
import skipLinks from './utils/skipLinks';
import iframer from './utils/iframer';
import mNav from './utils/mNav';
import showHide from './utils/showHide';
import initGmaps from './utils/gmaps';
import accordion from './utils/accordion';
import setupSharing from './utils/social';
import sectionSharing from './utils/sectionSharing';
import copyText from './utils/copyText';
import chapterNav from './utils/chapterNav';
import chapterNavSimple from './utils/chapterNavSimple';
import './libs/slick';
import './libs/jquery.responsiveTabs';
import modal from './utils/modal';
import countryNav from './utils/countryNav';
import countrySearch from './utils/countrySearch';
import spotlights from './utils/spotlights';
import simpleModal from './utils/simpleModal';
import setupNotices from './utils/setupNotices';

function globals () {

    // Notices
    setupNotices();

    // Spotlight countries menu
    countryNav(
        '#js-countries-menu-container',
        '#js-countries-menu',
        'countries-menu-list__item--open',
        '.countries-menu-list__item--parent-third',
        'countries-menu-list__countries',
        'countries-menu-list__countries--selected',
        'countries-menu-list--selected',
        '.js-countries-menu-trigger',
    );

    // Spotlight countries search
    countrySearch(
        '#js-profile-search-container',
        '#js-profile-search',
        '.js-search-item',
        '#js-profile-results',
        '#js-countries-menu',
        '#js-profile-nav',
        'countries__searched__highlight__typed'
    );

    // Spotlight comparison show/hide
    // trigger = the button that triggers
    // target = the thing to add a class to
    // targetActive = the class to add.
    // Optional - trigger should have data attributes of labelinactive and labelactive to swap the text around
    showHide(
        '#spotlight-comparison-trigger',
        '#spotlight-comparison__parts',
        'spotlight__interactive--max-height--active'
    );

    spotlights();

    // FastClick
    fastClick(document.body);

    // iframe video in body content
    iframer();

    // Small Screen Navigation
    mNav(
        '#navigation-primary-toggle',
        'navigation-primary-toggle--active',
        '#navigation-primary',
        'navigation-primary--active'
    );

    // Set child tab index for nav
    childTabIndex(
        '#navigation-primary-toggle',
        '#navigation-primary',
        'navigation-primary--active',
        960
    );

    // Chapter nav
    chapterNav();
    chapterNavSimple();

    // gmaps
    initGmaps('#map', 'AIzaSyAZAIjZtkBlsF0ZqvrlkvyLfVn6Bju6bJ4');

    // Accordion
    accordion(
        '.accordion__heading',
        '.accordion__list-item',
        'accordion__list-item--active',
        '.accordion__content',
        'accordion__content--active'
    );

    // social
    setupSharing();
    copyText(
        '.js-copy-field',
        '.js-copy-trigger'
    );
    sectionSharing();

    // Slick
    $('#timeline-slide').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: false,
        asNavFor: '#timeline-control',
        infinite: false,
    });
    $('#timeline-control').slick({
        slidesToShow: 10,
        slidesToScroll: 1,
        asNavFor: '#timeline-slide',
        dots: false,
        centerMode: false,
        focusOnSelect: true,
        infinite: false,
        mobileFirst: true,
        responsive: [
            {
                breakpoint: 300,
                settings: { slidesToShow: 3 }
            },
            {
                breakpoint: 400,
                settings: { slidesToShow: 4 }
            }
            ,
            {
                breakpoint: 500,
                settings: { slidesToShow: 5 }
            },
            {
                breakpoint: 600,
                settings: { slidesToShow: 6 }
            },
            {
                breakpoint: 700,
                settings: { slidesToShow: 7 }
            },
            {
                breakpoint: 800,
                settings: { slidesToShow: 8 }
            },
            {
                breakpoint: 900,
                settings: { slidesToShow: 9 }
            },
            {
                breakpoint: 1000,
                settings: { slidesToShow: 10 }
            },
            {
                breakpoint: 1100,
                settings: { slidesToShow: 11 }
            },
            {
                breakpoint: 1200,
                settings: { slidesToShow: 12 }
            }
        ]
    });

    // Tabs
    // https://github.com/jellekralt/Responsive-Tabs
    $('#responsive-tabs').responsiveTabs({
        startCollapsed: 'accordion',
        collapsible: 'accordion',
        scrollToAccordion: true,
        setHash: true
    });

    // Go go modal
    // function is modal(target, trigger, parentcontainer)
    // target = id of modal
    // trigger = class of item to open the modal
    // parentcontainer = id of <section> containing the trigger
    modal('download-modal','.modal-button-open', 'modal-container');

    simpleModal('.js-modal-trigger','.modal--share', 'modal--share-open');

}

$(function run () {
    console.log('ᕕ( ᐛ )ᕗ Running...');
    globals();
});
