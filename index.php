<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: *");

include_once './app/config.php';

/**
 * Processing
 */


/**
 * Template
 */
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML+RDFa 1.0//EN" "http://www.w3.org/MarkUp/DTD/xhtml-rdfa-1.dtd">
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="">
        <meta name="author" content="">
        <title>Remote Challenge</title>
        <meta name="title" content="Remote Challenge"/>

        <link href="/skin/css/bootstrap.min.css" rel="stylesheet"/>
        <link href="/skin/css/styles.css" rel="stylesheet"/>

        <script type="text/javascript" src="/skin/js/jquery.min.js"></script>
        <script type="text/javascript" src="/skin/js/jquery.cookie.min.js"></script>
        <script type="text/javascript" src="/skin/js/bootstrap.min.js"></script>
        <script type="text/javascript" src="/skin/js/scripts.js"></script>
    </head>
    <body>
        <div class="alert alert-success">Transaction was created successful</div>
        <div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
            <div class="container">
                <div class="navbar-header">
                    <a class="navbar-brand" href="/">Expensify</a>
                </div>
                <div class="navbar-collapse collapse">
                    <?php include_once("./template/navbar.php");?>
                </div><!--/.navbar-collapse -->
            </div>
        </div>

        <div class="container">
            <?php include_once("./template/content.php");?>
        </div>

        <!-- Bootstrap JS loads after all -->
        <!--<script type="text/javascript" src="/skin/js/bootstrap.min.js"></script>-->

    </body>
</html>
