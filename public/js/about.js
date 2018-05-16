$(function () {
    var language = {};
    $.get("https://api.github.com/users/Tosone/repos").then(function (data) {
        var lang_url = [];
        for (var i in data) {
            lang_url.push(data[i].languages_url);
        }
        return lang_url;
    }).then(function (lang_url) {
        var lang = [];
        new Promise(function (res, rej) {
            for (var i in lang_url) {
                new Promise(function (resolve, reject) {
                    $.get(lang_url[i]).then(function (data) {
                        resolve(data);
                    });
                }).then(function (data) {
                    lang.push(data);
                    if (lang_url.length == lang.length) res(lang);
                });
            };
        }).then(function (data) {
            $(".loading").hide();
            $(".container").css("opacity", "1");
            $("body").css("overflow", "auto");
            var language = {};
            var total_language = 0;
            var allow_language = {
                'C': '#555555',
                'C++': '#f34b7d',
                'C#': '#178600',
                'PHP': '#4F5D95',
                'JavaScript': '#f1e05a',
                'CSS': '#563d7c',
                'HTML': '#e44b23',
                'Lua': '#000080',
                'Python': '#3572A5',
                "Makefile": "#427819"
            };
            for (var i in data) {
                for (var j in data[i]) {
                    if (j == "C" || j == "Python") {

                    } else if (language[j]) {
                        language[j] += data[i][j];
                    } else {
                        language[j] = data[i][j];
                    }
                }
            }
            console.log(language)
            var temp_language = language;
            language = [];
            for (var i in allow_language) {
                if (temp_language[i]) {
                    language.push({
                        label: i,
                        value: temp_language[i],
                        color: allow_language[i]
                    });
                }
            }
            var referenceLanguageNum = 0;
            for (var i in language) {
                total_language += language[i]['value'];
            }
            for (var i in language) {
                language[i]['value'] = (language[i]['value'] / total_language * 100).toFixed(2);
            }
            var piechart = new Chart($("#pieChart")[0].getContext("2d")).Pie(language, {
                animateScale: true,
                legendTemplate: "<% for (var i=0; i<segments.length; i++){%><%if(segments[i].label){%><% if(i==0){ %><span style=\"background-color:<%=segments[i].fillColor%>\" class=\"legend-lang\"></span><%=segments[i].label%><%}else{%><%=', '%><span style=\"background-color:<%=segments[i].fillColor%>\" class=\"legend-lang\"></span><%=segments[i].label%><%}%><%}%><%}%>"
            });
            $("#language").html(piechart.generateLegend());
        });
    });
});
