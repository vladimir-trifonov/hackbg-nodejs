/* global require, console, alert */

require.config({
    paths: {
        "jquery": "../bower_components/jquery/dist/jquery",
        "handlebars": "../bower_components/handlebars/handlebars",
        "bootstrap": "../bower_components/bootstrap/dist/js/bootstrap"
    },
    shim: {
        "handlebars": {
            exports: "Handlebars"
        },
        "bootstrap": {
            "deps": ["jquery"]
        }
    }
});


require(["jquery", "handlebars", "bootstrap"], function($, Handlebars) {
    "use strict";

    var Page = (function() {
        function Page(page) {
            this.getPage = function() {
                return page;
            };

            this.incPage = function() {
                page += 1;
            };

            this.decPage = function() {
                page -= 1;
                if (page < 0) {
                    page = 0;
                }
            };
        }

        return Page;
    }());

    var page = new Page(1);

    function reloadUI(data) {
        var templateString = $("#table-template").html(),
            compiledTemplate = Handlebars.compile(templateString),
            html = compiledTemplate({
                data: data.keywords
            });

        $("body").html(html);

        var $prevButton = $("#prev"),
            $nextButton = $("#next");

        if (data.hasPrevious === true) {
            $prevButton.removeAttr("disabled");
        } else {
            $prevButton.attr("disabled", true);
        }

        if (data.hasNext === true) {
            $nextButton.removeAttr("disabled");
        } else {
            $nextButton.attr("disabled", true);
        }
    }

    function fetchKeywords(direction, page, cb) {
        if (direction === "prev") {
            page.decPage();
        } else if (direction === "next") {
            page.incPage();
        }

        $.ajax({
            type: "GET",
            url: "http://localhost:8020/keywords/?page=" + page.getPage()
        })
            .done(function(data) {
                cb(data);
            })
            .fail(function(error) {
                console.log(error);
            });
    }

    ["#next", "#prev"].forEach(function(buttonId) {
        $(document).on("click", buttonId, function() {
            fetchKeywords($(this).attr("id"), page, reloadUI);
        });
    });

    $(function() {
        fetchKeywords(null, page, reloadUI);
    })
});