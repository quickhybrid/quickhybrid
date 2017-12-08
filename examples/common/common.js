(function() {
    if (!quick.os.h5) {
        document.querySelector('.mui-content').style.paddingTop = 0;
    } else {
        var html = ' \
        <header id="header" class="mui-bar mui-bar-nav ">\
            <a class="mui-action-back mui-icon mui-icon-left-nav  mui-pull-left"></a>\
            <h1 id="title" class="mui-title">{{TITLE}}</h1>\
            <a id="info" class="mui-icon mui-icon-more icon-white mui-pull-right hidden"></a>\
        </header>\
        ';

        var fileName = window.location.href.match(/([^/]+).html/)[1];

        if (!fileName || fileName === 'index') {
            fileName = 'Quick Hybrid API';
        }

        html = html.replace('{{TITLE}}', fileName);

        var div = document.createElement('div');

        div.innerHTML = html;

        document.body.insertBefore(div, document.body.children[0]);
        document.querySelector('.mui-content').style.paddingTop = '45px';
    }

    mui('.mui-table-view').on('tap', '.api-class', function() {
        window.runApi && runApi(this.id);
    });

    window.showTips = function(msg, isAlert) {
        if (isAlert) {
            quick.ui.alert(msg, '提示');
        } else {
            quick.ui.toast(msg);
        }
    };
})();