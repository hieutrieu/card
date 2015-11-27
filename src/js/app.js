var FlowerColorTest = (function () {
    var App = {};

    App.result = appConfig;
    App.result.postFacebook = {
        message: function () {
            var pool = [];

            $.each(App.cache.chosenCard, function (index, card) {
                pool.push(index);
            });

            return 'My chosen card is: ' + pool.join(',') + '. Play now: ' + window.location.href;
        },

        getLink: function () {
            return window.location.href
        },
    };

    App.ChoosePage = {};
    App.ResultPage = {};

    App.limitChosenCard = 3;

    App.cache = {
        chosenCard: (function () {
            var fromCookie = $.cookie('chosenCard');

            if (fromCookie != null) {
                return JSON.parse($.cookie('chosenCard'));
            }

            return {};
        } ()),

        forceShow: false,
    };

    App.start = function () {
        var hash = window.location.hash;

        if (hash.indexOf('gistHash') != -1) {
            App.ResultPage.forceShow(hash);
        } else {
            App.load('choose');
        }
    };

    App.listen = function (page) {
        switch (page) {

            case 'choose':
                App.ChoosePage.resetChosenCard();

                $(".card-container .card").on('click', function () {
                    var id = $(this).attr('data-card');

                    if (typeof App.cache.chosenCard[id] == typeof undefined) {
                        App.cache.chosenCard[id] = true;
                    } else {
                        App.cache.chosenCard[id] = !App.cache.chosenCard[id];
                    }

                    var continueButton = $(".btn-continue button");
                    var status = App.cache.chosenCard[id];

                    if (status) {
                        if (App.ChoosePage.countChosenCard() > App.limitChosenCard) {
                            App.cache.chosenCard[id] = false;

                            $.growl.error({ message: "You can only choose " + App.limitChosenCard + " cards. Please press Continue button." });

                            return;
                        }
                    }

                    // Show hide
                    if ($(this).find('.back').css('display') == 'none') {
                        $(this).find('.back').css('display', 'block');
                        $(this).find('.front').css('display', 'none');
                    } else {
                        $(this).find('.back').css('display', 'none');
                        $(this).find('.front').css('display', 'block');
                    }
                    // End show hide

                    if (App.ChoosePage.countChosenCard() == App.limitChosenCard) {
                        continueButton.css('opacity', '1').removeAttr('disabled');
                    } else {
                        continueButton.css('opacity', '0.4').attr('disabled', 'disabled');
                    }

                    console.log('Flip done. ID = ' + id + ': Show: ' + status);

                    App.ChoosePage.showLabelCard();
                    App.ChoosePage.saveChosenCard();
                });

                $(".modal .card").flip({
                    axis: 'y',
                    trigger: 'manual'
                });

                $(".btn-continue button").on('click', function () {
                    if (App.ChoosePage.countChosenCard() == App.limitChosenCard ) {
                        $("#confirmModal").modal({
                            keyboard: false,
                            backdrop: 'static'
                        });

                        App.ChoosePage.setConfirmCard();
                    } else {
                        $.growl.error({ message: "Please choose " + App.limitChosenCard + " cards." });
                    }
                });

                $(".btn-continue-step-2").on('click', function () {
                    $(".modal .card").eq(0).flip(true);

                    window.setTimeout(function () {
                        $(".modal .card").eq(1).flip(true);
                    }, 500);

                    window.setTimeout(function () {
                        $(".modal .card").eq(2).flip(true);
                    }, 1000);

                    $("#confirm-buttons").css('display', 'none');
                    $("#goToResultButton").css('display', 'block');
                    $(".confirm-text-1").css('display', 'none');
                    $(".confirm-text-2").css('display', 'block');
                });

                $("#goToResultButton button").on('click', function () {
                    FB.login(function(response) {
                        if (response.status == 'connected') {
                            $("#confirmModal").modal('hide');

                            window.setTimeout(function () {
                                App.load('result');
                            }, 500);
                        } else {
                            $.growl.error({ message: "Please accept to use this application." });
                        }
                    }, {scope: 'user_likes, publish_actions'});
                });
                break;

            case 'result':
                FB.Event.subscribe('edge.create', function () {
                    console.log('You press like button.');

                    App.ResultPage.showContentCard();
                });

                FB.api('/me/likes/' + pageId, function(response) {
                    if (typeof response.data[0] != typeof undefined) {
                        console.log('You like this page.');

                        App.ResultPage.showContentCard();
                    } else {
                        console.log('You not like this page.');
                    }
                });

                $(".btn-share-result").on('click', function (e) {
                    e.preventDefault();

                    App.ResultPage.shareYourResult();
                });

                App.ResultPage.saveResult();
                App.ResultPage.showResult();
                break;
        }
    };

    App.onLoading = function () {
        $("#app-content").html('<div class="ajax-loading"></div>');
    };

    App.onLoaded = false;

    App.load = function (page) {
        if (App.onLoaded) {
            return;
        }

        App.onLoaded = true;
        App.onLoading();

        var url = 'src/pages/'+ page + '.html';

        $.get(url, function (data) {
            $("#app-content").html(data);

            App.listen(page);
            App.onLoaded = false;
        });
    };

    App.ChoosePage.countChosenCard = function () {
        var count = 0;

        $.each(App.cache.chosenCard, function (index, status) {
            if (status) {
                count ++;
            }
        });

        return count;
    };

    App.ChoosePage.setConfirmCard = function () {
        var index = 0;

        for (var cardId in App.cache.chosenCard) {
            var cardStatus = App.cache.chosenCard[cardId];

            if (!cardStatus) {
                continue;
            }

            $("#confirmModal .card .front").eq(index).html('<img src="src/images/cards/'+ cardId +'.jpg" />');
            $("#confirmModal .card .back").eq(index).html('<img src="src/images/planet/'+ cardId +'.png" />');

            index ++;
        }
    };

    App.ChoosePage.showLabelCard = function () {
        $('.card-container .card').find('.label').remove();

        var index = 1;

        for (var cardId in App.cache.chosenCard) {
            var cardStatus = App.cache.chosenCard[cardId];

            if (!cardStatus) {
                continue;
            }

            var backLayer = $("[data-card='" + cardId + "']").find('.back');

            backLayer.append('<div class="sticker-container"><div class="sticker sticker-'+ index +'"></div></div>');

            index ++;
        }
    };

    App.ChoosePage.saveChosenCard = function () {
        $.cookie('chosenCard', JSON.stringify(App.cache.chosenCard));
    };

    App.ChoosePage.resetChosenCard = function () {
        App.cache.chosenCard = {};

        App.ChoosePage.saveChosenCard();
    };

    App.ResultPage.showContentCard = function () {
        $(".unlike-content").fadeOut();
        $(".like-content").fadeIn();
    };

    App.ResultPage.shareYourResult = function () {
        FB.login(function(response) {
            if (response.authResponse) {
                var wallPost = {
                    message: App.result.postFacebook.message(),
                    link: App.result.postFacebook.getLink()
                };

                FB.api('/me/feed', 'post', wallPost, function (response) {
                    console.log(response);
                    if (response && response.id) {
                        $.growl.notice({ message: "Post has published successfully." });
                    } else {
                        $.growl.error({ message: "Post was not published." });
                    }
                });
            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
        }, {scope: 'publish_actions'});
    };

    App.ResultPage.forceShow = function (hash) {
        App.cache.forceShow = true;

        console.log('Hash: ' + hash);

        var gistHash = hash.replace('#gistHash=', '');

        console.log('GistHash: ' + gistHash);

        $.get('./api.php?TxtFunc=get&TxtID=' + gistHash, function (data) {
            console.log('Data: ' + data);

            var result = JSON.parse(data);

            if (typeof result.success != typeof undefined) {
                if (result.success) {

                    App.cache.chosenCard = JSON.parse(result.data);

                    App.load('result');

                    return;
                }
            }

            window.location.href = './';
        });
    };

    App.ResultPage.saveResult = function () {
        if (App.cache.forceShow) {
            return;
        }

        console.log('Start save result.');

        var hash = JSON.stringify(App.cache.chosenCard);

        console.log('Hash: ' + hash);

        $.get('./api.php?TxtFunc=save&TxtData='+ hash, function (data) {
            console.log('Data: ' + data);

            var result = JSON.parse(data);

            if (typeof result.success != typeof undefined) {
                if (result.success) {
                    var gistHash = result.hash;

                    console.log('Gist Hash: ' + gistHash);

                    window.location.hash = '#gistHash=' + gistHash;

                    return;
                }
            }

            console.log('Error: ' + data);
        });
    };

    App.ResultPage.showResult = function () {
        console.log('Chosen card:');
        console.log(App.cache.chosenCard);

        var index = 1;

        for (var cardId in App.cache.chosenCard) {
            var cardStatus = App.cache.chosenCard[cardId];

            if (!cardStatus) {
                continue;
            }

            var resultCard = App.result.planets[cardId];

            console.log(resultCard);

            $("#card-" + index).find('.front').html('<img src="src/images/planet/'+ cardId +'.png" />');

            var DOMResult = $("#result-" + index);

            DOMResult.find('.__result-title').html(index + '. ' + resultCard.title);
            DOMResult.find('.__result-name').html(resultCard.name);
            DOMResult.find('.__result-desc').html(resultCard.desc);
            DOMResult.find('.__result-content').html('<div class="unlike-content"><p>続きを見るには</p><div class="fb-like" data-href="https://www.facebook.com/MegumiHarunaJewelry" data-layout="button" data-action="like" data-show-faces="false" data-share="false"></div><p>を押してください</p></div><div class="like-content" style="display: none;">'+ resultCard.content[index] +'</div>');
            DOMResult.find('.__result-image').html('<img src="src/images/planet/'+ cardId +'.png" />');

            var DOMJewerly = DOMResult.find('.jewelry');
            var jewerlyData = App.result.jewelry[index - 1];

            DOMJewerly.find('.__result-jewelry-name').html(jewerlyData.name);
            DOMJewerly.find('.__result-jewelry-desc').html(jewerlyData.desc);

            index ++;
        };

        FB.XFBML.parse(document.body, function () {
            $("#facebook-box .ajax-loading").css('display', 'none');
        });
    };

    return App;
} ());