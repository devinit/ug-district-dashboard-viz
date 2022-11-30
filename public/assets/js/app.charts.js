import $ from 'jquery';
import entry from './charts/entry';

function globals () {
    entry();
}

$(function run () {
    console.log('ᕕ( ᐛ )ᕗ Running...');
    globals();
});
