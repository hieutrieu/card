<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
    <head>
        <title>Flower Color Test</title>

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta http-equiv="X-UA-Compatible" content="IE=9" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

        <meta name="description" content="Flower Color Test" />
        <meta name="keywords" content="Flower Color Test" />


        <meta name="robots" content="index, follow" />
        <meta property="og:site_name" 	content="Flower Color Test" />
        <meta property="og:image" 		content="Flower Color Test"/>
        <meta property="og:title" 	  	content="Flower Color Test" />
        <meta property="og:description" content="Flower Color Test" />

        <link href="src/library/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
        <link href="src/library/bootstrap/css/bootstrap-theme.min.css" rel="stylesheet" type="text/css" />
        <link href="src/library/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
        <link href="src/library/jquery-growl/stylesheets/jquery.growl.css" rel="stylesheet" type="text/css" />
        <link href="src/css/app.css" rel="stylesheet" type="text/css" />
    </head>

    <body>
        <div id="fb-root"></div>

        <script type="text/javascript">
//            var appId  = '575193635968985'; // Jack local
            var appId  = '647102832096653'; // production
            var pageId = '1441148306133126'; // Megumi Page
            var accessToken;

            window.fbAsyncInit = function() {
                FB.init({
                    'appId'    : appId,
                    xfbml      : false,
                    version    : 'v2.5',
                    status     : true, // check login status
                    cookie     : true // enable cookies to allow the server to access the session
                });
            };

            (function(d, s, id){
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {return;}
                js = d.createElement(s); js.id = id;
                js.src = "//connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        </script>

        <div class="background-center visible-xs-block"></div>

        <div class="container">
            <div id="app-content">
                <div class="ajax-loading"></div>
            </div>
        </div>

        <script type="text/javascript" src="src/library/jquery/jquery-1.11.3.min.js"></script>
        <script type="text/javascript" src="src/library/bootstrap/js/bootstrap.min.js"></script>
        <script type="text/javascript" src="src/library/jquery-flip/dist/jquery.flip.min.js"></script>
        <script type="text/javascript" src="src/library/jquery-cookie/src/jquery.cookie.js"></script>
        <script type="text/javascript" src="src/library/jquery-growl/javascripts/jquery.growl.js"></script>
        <script type="text/javascript" src="src/js/appConfig.js"></script>
        <script type="text/javascript" src="src/js/app.js"></script>
        <script type="text/javascript">
            $(document).ready(function () {
                FlowerColorTest.start();
            });
        </script>
    </body>
</html>