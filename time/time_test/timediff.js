(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.timeDiffFrom = factory();
    }
}(this, function () {
    'use strict';

    function pluralize(val, str) {
        return val + ' ' + ((val > 1) ? (str + '') : str);
    }

    var msMinute = 60 * 1000,
        msHour = msMinute * 60,
        msDay = msHour * 24,
        msMonth = msDay * 30,
        msYear = msDay * 365;

    var toChineseConf = {
        day: "天",
        hour: "小时",
        minute: "分钟",
        second: "秒"
    }

    return function (date, opts) {
        opts = opts || {};

        var milli = (new Date(date) - new Date()),
            ms = Math.abs(milli);

        if (ms < msMinute) return 'just now';

        var timeframes = {
            day: Math.floor(ms / msDay),
            hour: Math.floor((ms % msDay) / msHour),
            minute: Math.floor((ms % msHour) / msMinute),
            second: Math.floor((ms % msMinute) / 1000)
        };

        var chunks = [], period, val;
        for (period in timeframes) {
            val = timeframes[period];
            if (val)
                chunks.push(pluralize(val, toChineseConf[period] || period));
        }

        // Limit the returned array to return 'max' of non-null segments
        var compiled = [], i, len = chunks.length,
            limit = 0, max = opts.max || 10;
        for (i = 0; i < len; i++) {
            if (chunks[i] && limit < max) {
                limit++;
                compiled.push(chunks[i]);
            }
        }

        var sfx = (opts.ago && milli < 0) ? ' ago' : '';

        if (opts.and && limit > 1) {
            if (limit === 2) return compiled.join(' and ') + sfx;
            compiled[limit - 1] = 'and ' + compiled[limit - 1];
        }

        return compiled.join(', ') + sfx;
    };
}));