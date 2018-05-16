var singlePage = 15;
var winhash = window.location.hash;
var animationTime = 400;
paceOptions = {
    elements: false,
    restartOnRequestAfter: false
}
Pace.start();

function timestamp($timestamp) {
    var date = new Date(parseInt($timestamp));
    var date_year = date.getFullYear().toString();
    var date_month = ((date.getMonth() + 1).toString().length == 1) ? ("0" + (date.getMonth() + 1).toString()) : (date.getMonth() + 1).toString();
    var date_day = (date.getDate().toString().length == 1) ? ("0" + date.getDate().toString()) : date.getDate().toString();
    var date_hour = (date.getHours().toString().length == 1) ? ("0" + date.getHours().toString()) : date.getHours().toString();
    var date_minute = (date.getMinutes().toString().length == 1) ? ("0" + date.getMinutes().toString()) : date.getMinutes().toString();
    var date_second = (date.getSeconds().toString().length == 1) ? ("0" + date.getSeconds().toString()) : date.getSeconds().toString();
    return date_year + "/" + date_month + "/" + date_day + " " + date_hour + ":" + date_minute + ":" + date_second;
}

$.get('config.json', function (data) {
    $("title").text(data.BlogTitle);
    $(".usr-name").text(data.BlogName);
    $("#headface").attr("src", data.BlogHeadFace);
    _.map(data.contactMe, function (n) {
        $(".usr-icon").append('<a href="' + n.href + '" target="_blank"><img src="' + n.img + '" alt="' + n.alt + '" /></a>')
    });
    _.map(data.extraLinks, function (n) {
        $('.content-list').append('<p><a href="' + n.href + '" target="_blank">' + n.text + '</a></p>');
    });
});
$.get("data.json", function (data) {
    $(".container").show();
    Pace.stop();
    var totalPage = Math.ceil(data.length / singlePage);
    $("#totalPage").text(totalPage);

    function indexRoute(thisPage) {
        function dataInsert(currPage) {
            var articalData = _.slice(_.orderBy(data, 'time', 'desc'), (currPage - 1) * singlePage, currPage * singlePage);
            _.map(articalData, function (n) {
                var title = n.title.length > 30 ? (n.title.slice(0, 30) + "...") : n.title;
                $('.artical-list').append('<li class="list" data-hash="' + n.hash + '"><span class="title">' + title + '</span>&nbsp;<span class="timestamp">' + timestamp(n.time) + '</span></li>');
                $(".artical-list").slideDown(animationTime);
            });
            $(".artical-list li").click(function () {
                window.location.hash = "c=" + $(this).data("hash");
            });
        }

        function articalListAdd(currPage) {
            if ($(".artical-list").html() == "") {
                dataInsert(currPage);
            } else {
                $(".artical-list").slideUp(animationTime, function () {
                    $(this).html("");
                    dataInsert(currPage)
                });
            }
        }
        if ($(".artical_content").is(":visible")) {
            $(".artical_content").removeClass('frameOut frameIn').addClass('frameOut').hide().siblings().show().removeClass('frameOut frameIn').addClass('frameIn');
        }
        var currPage = thisPage;
        currPage == 1 && $("#f_home,#f_pre").addClass("f_ban");
        currPage == totalPage && $("#f_next,#f_last").addClass("f_ban");
        articalListAdd(currPage);
        $("#currentPage").text(currPage);
        $("#f_home").click(function () {
            if (currPage == 1) return;
            else {
                currPage = 1;
                $("#currentPage").text(currPage);
                $("#f_home,#f_pre").addClass("f_ban");
                $("#f_next,#f_last").removeClass("f_ban");
                articalListAdd(currPage);
                window.location.hash = "p=" + currPage;
            }
        });
        $("#f_pre").click(function () {
            if (currPage == 1) return;
            else {
                currPage--;
                $("#currentPage").text(currPage);
                $("#f_next,#f_last").removeClass("f_ban");
                currPage == 1 && $("#f_home,#f_pre").addClass("f_ban");
                articalListAdd(currPage);
                window.location.hash = "p=" + currPage;
            }
        });
        $("#f_next").click(function () {
            if (currPage == totalPage) return;
            else {
                currPage++;
                $("#currentPage").text(currPage);
                $("#f_home,#f_pre").removeClass("f_ban");
                currPage == totalPage && $("#f_next,#f_last").addClass("f_ban");
                articalListAdd(currPage);
                window.location.hash = "p=" + currPage;
            }
        });
        $("#f_last").click(function () {
            if (currPage == totalPage) return;
            else {
                currPage = totalPage;
                $("#currentPage").text(currPage);
                $("#f_home,#f_pre").removeClass("f_ban");
                $("#f_next,#f_last").addClass("f_ban");
                articalListAdd(currPage);
                window.location.hash = "p=" + currPage;
            }
        });
    }

    function hashChange() {
        var currHash = window.location.hash;
        var type = currHash.slice(1, 2);;
        var con = currHash.slice(3);
        if (currHash == "") {
            indexRoute(1);
        } else if (type == "p") {
            var thispage = 1;
            if (isNaN(parseInt(con))) {
                window.location.hash = "p=1";
            } else {
                if (parseInt(con) > totalPage) {
                    window.location.hash = "p=1";
                } else {
                    thispage = parseInt(con);
                }
            }
            indexRoute(thispage);
        } else if (type == "c") {
            var artdata = _.filter(data, {
                'hash': con
            })[0];
            Pace.restart();
            $(".toc").show();
            var path = artdata.path;
            $(".artical_home").removeClass('frameOut frameIn').addClass('frameOut').hide().siblings().show().removeClass('frameOut frameIn').addClass('frameIn');
            var temp = window.setInterval(function () {
                if (!$(".artical_home").is(":animated")) {
                    window.clearInterval(temp);
                    $(".artical_home").hide();
                }
            }, 300);
            var hash = artdata.hash;
            var title = artdata.title;
            $("#articalTitle").text(title);
            $("#timestamp").text(timestamp(artdata.time));
            $.get(path, function (data) {
                Pace.stop();
                var temp = data.split('\n');
                temp.shift();
                $("#markdownContent").html(marked(temp.join('\n'), {
                    langPrefix: ""
                }));
            }).then(function () {
                $('pre code').each(function (i, block) {
                    hljs.highlightBlock(block);
                });
            });
        }
    }
    window.addEventListener("hashchange", hashChange, false);
    hashChange();
    $("#blogToc,.toc").click(function () {
        $(".toc").hide();
        $(".artical_content").removeClass('frameOut frameIn').addClass('frameOut').siblings().show().removeClass('frameOut frameIn').addClass('frameIn');
        window.location.hash = "p=1";
        var temp = window.setInterval(function () {
            if (!$(".artical_content").is(":animated")) {
                window.clearInterval(temp);
                $(".artical_content").hide();
            }
        }, 300);
    });
});

$(".backtop").css("display", $('body').scrollTop() == 0 ? "none" : 'block');
window.onscroll = function () {
    $(".backtop").css("display", $('body').scrollTop() == 0 ? "none" : 'block');
}

$(".backtop").click(function () {
    $('body').animate({
        scrollTop: 0
    }, animationTime);
});
