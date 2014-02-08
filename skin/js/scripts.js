/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


jQuery(document).ready(function($) {
    /** Binding mouse events **/
    
    /* When submit from login form */
    $(document).on("click", "#form-signin .submit", function() {
        start_busy();
        $.ajax({
            type: "POST",
            url: "/ajax.php",
            data: {
                action: "login",
                username: "expensifytest@mailinator.com",
                password: "hire_me"
            },
            dataType: "json",
            statusCode: {
                401: function() {
                    displayError('Username or password is not correct.');
                },
                500: function() {
                    displayError('Unknown error.');
                }
            }
        })
            .done(function(data) {
                // Set cookie
                updateCookie(data);
                updateContentBlock("content", "body > div.container", function(){
                    getTransactionList(function(data){
                        renderTransactionList(data.value.transactionList);
                    })
                });
                updateContentBlock("navbar", "div.navbar-collapse");
                notif('Login is successful.');
            })
            .fail(function(data) {
                alert("fail");
            })
            .always(function(data){
                stop_busy();
            });
    });
    
    $(document).on("click", "#list-transactions-btn", function(){
        getTransactionList(function(data){
            renderTransactionList(data.value.transactionList);
        });
    });
    
    $(document).on("click", "#refresh-transactions-btn", function(){
        getTransactionList(function(data){
            renderTransactionList(data.value.transactionList, true);
        });
    });
    
    $(document).on("click", "#formAddTransaction button.btn-save", function(){
        saveTransaction(function(data){
            $("#addTransaction").modal("hide");
            notif('Logout is successful.');
        });
    });
    
    $(document).on("click", "#logout-btn", function(){
        if(removeCookie()){
            updateContentBlock("content", "body > div.container");
            updateContentBlock("navbar", "div.navbar-collapse");
            notif('You have been logged out successfully.');
        }
        else{
            notif('Fail to log you out :(', false);
        }
    });
    
    /** End Binding mouse events **/

    
    /* Run after document is loaded */
    isUserconnected(function(){
        getTransactionList(function(data){
            renderTransactionList(data.value.transactionList);
        });
    });
});

/**
     * Get Transaction List
     */
    function getTransactionList(_callback){
        start_busy();
        $.ajax({
            type: "GET",
            url: "/ajax.php",
            data: {
                action: "getTransactionList",
            },
            dataType: "json",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        })
            .done(function(data){
                updateCookie(data);
                stop_busy();
                _callback(data);
        })
    }
    
    /**
     * Print out the transaction table
     */
    function renderTransactionList(data, cleanupFlag){
        if(cleanupFlag){
            $("table.transaction-list tbody").html("");
        }
        for(var i=0; i<data.length; i++){
            $("table.transaction-list tbody").append("<tr>\n\
                <td>" + data[i].cardID + "</td>\n\
                <td>" + data[i].transactionID + "</td>\n\
                <td>" + data[i].created + "</td>\n\
                <td>" + data[i].category + "</td>\n\
                <td>" + data[i].comment + "</td>\n\
                <td>" + data[i].amount + "</td>\n\
                <td>" + data[i].receiptState + "</td>\n\
            </tr>");
        }
        $("h1 span.title").html("Transactions (" + data.length + ")");
    }
    
    /**
     * Save new transaction
     */
    function saveTransaction(_callback){
        start_busy();
        $.ajax({
            type: "GET",
            url: "/ajax.php",
            data: {
                action: "createTransaction",
                transaction: {
                    created: $("#inputCreated").val(),
                    amount: parseFloat($("#inputAmount").val()),
                    merchant: $("#inputMerchant").val(),
                    comment: $("#inputComment").val(),
                }
            },
            dataType: "json",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        })
            .done(function(data){
                updateCookie(data);
                stop_busy();
                _callback(data);
        })
    }
    
    /**
     * Turn on busy indication
     */
    function start_busy(){
        $("body").append(
            '<div class="busy-indicator">\n\
                <div class="busy-overlay"></div>\n\
                <div class="busy-icon">\n\
                    <img src="/skin/img/busy.gif" height="84" width="84"/>\n\
                </div>\n\
            </div>');
        $("body").addClass("loading");
    }
    
    /**
     * Turn off busy indication
     */
    function stop_busy(){
        $("body").removeClass("loading");
        $("body .busy-indicator").remove();
    }
    
    /**
     * Update Cookie
     */
    function updateCookie(data){
        $.cookie('authToken', data.value.authToken);
        $.cookie('accountID', data.value.accountID);
        $.cookie('email', data.value.email);
    }
    
    /**
     * 
     */
    function notif(message, success){
        success = (typeof success !== 'undefined') ? success : true;
        $('<div class="alert alert-' + ((success)?'success':'danger') +'">' + message + '</div>')
            .prependTo("body")
            .fadeIn('fast')
            .delay(5000)
            .fadeOut('fast')
            .queue(function(){$(this).remove()});
    }
    
    /**
     * Remove Cookie
     */
    function removeCookie(){
        $.removeCookie('authToken');
        $.removeCookie('accountID');
        $.removeCookie('email');
        if(!$.cookie('authToken'))
            return true;
        else
            return false;
    }
    
    /**
     * Verify if current user's session is available
     */
    function isUserconnected(_callback){
        if($.cookie('authToken')){
            $.ajax({
                type: "GET",
                url: "/ajax.php",
                data: {
                    action: "verifyLogin",
                },
                dataType: "json",
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                }
            })
                .done(function(data){
                    if(data.value.jsonCode == 408 || data.value.jsonCode == 407){
                        console.log(data.value);
                        // Session is expired. Clear cookie, reload the page
                        removeCookie();
                        $.removeCookie('authToken');
                        $.removeCookie('accountID');
                        $.removeCookie('email');
                        location.reload();
                    }
                    else{
                        updateCookie(data);
                    }
                    if(_callback) _callback(data);
                    
                });
        }
    }
    

    /**
     * Update content block with data being retrieved via Ajax
     * @param String block_name
     * @param String container
     * @param {type} _callback
     */
    function updateContentBlock(block_name, container, _callback){
        $.ajax({
            type: "get",
            url: "/ajax.php",
            data: {
                action: "view",
                block_name: block_name
            }
        })
            .done(function(data) {
                $(container).html(data);
                if(_callback)
                    _callback();
            });
    }