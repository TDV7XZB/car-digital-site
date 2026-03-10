/* global ajaxurl */
jQuery(function ($) {
    $(function () {
        // Dismiss notice
        $(document).on('click', '.total-notice-nux .notice-dismiss', function () {
            $.ajax({
                type: 'POST',
                url: ajaxurl,
                data: {
                    nonce: totalNUX.nonce,
                    action: 'total_dismiss_notice'
                },
                dataType: 'json'
            });
        });
    });
});