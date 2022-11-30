import $ from 'jquery';

export default function copyText (textField, trigger, copiedText = 'URL copied to clipboard') {

    $(trigger).on('click', function() {

        const field = $(this).siblings(textField).first();
        const delay = 1000;

        if (!field) {
            return;
        }
        const originalText = field.val();

        if (field.val() == copiedText) {
            return;
        }

        const elem = field[0];

        if (isiOS()) {
            const range = document.createRange();

            elem.contentEditable = true;
            elem.readOnly = false;
            range.selectNodeContents(elem);

            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            elem.setSelectionRange(0, 999999);

            elem.contentEditable = false;
            elem.readOnly = true;
        }
        else {
            elem.focus();
            elem.select();
        }

        document.execCommand('copy');
        field.val(copiedText);

        setTimeout(() => {
            field.val(originalText);
        }, delay);
    });

    function isiOS() {
        return navigator.userAgent.match(/ipad|iphone/i);
    }
}
