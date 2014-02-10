/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


jQuery(document).ready(function($) {
    /*** Begin Binding mouse events ***/    
    
    /* When submiting login form */
    $(document).on("submit", "#form-signin", function(event) {
        /* stop form from submitting normally */
        event.preventDefault();
        callAjax({
            type: "POST",
            data: {
                action: "login",
                username: $("#username").val(),
                password: $("#password").val()
            }
        },
        function(data){ // on $.done
            // Set cookie
            updateCookie(data);
            updateContentBlock("content", "body > div.container", function(){
                getTransactionList(function(data){
                    renderTransactionList(data.value.transactionList);
                })
            });
            updateContentBlock("navbar", "div.navbar-collapse");
            notif('Login is successful.');
        },
        function(data){ // on $.fail
            notif("Login is failed.");
        });
        
        /* TODO: After ajax driavent logout */
    });
    
    /* When click on the transaction list button from the toolbar */
    $(document).on("click", "#list-transactions-btn", function(){
        getTransactionList(function(data){
            renderTransactionList(data.value.transactionList);
        });
    });
    
    /* When click on the transaction refresh icon next to the page title */
    $(document).on("click", "#refresh-transactions-btn", function(){
        getTransactionList(function(data){
            renderTransactionList(data.value.transactionList, true);
        });
    });
                    
    /* When click on the transaction Add button from the toolbar below the transaction list table */
    $(document).on("click", "#formAddTransaction button.btn-save", function(){
        saveTransaction(function(data){
            $("#addTransaction").modal("hide");
            notif('New transaction has been created.');
            getTransactionList(function(data){
                renderTransactionList(data.value.transactionList, true);
            });
        });
    });
    
    /* When click on the Logout button from the toolbar */
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
    /*** End Binding mouse events ***/

    
    /*** Once document is completely loaded ***/
    isUserconnected(function(){
        getTransactionList(function(data){
            renderTransactionList(data.value.transactionList);
        });
    });
});



/********* Common functions *********/

/**
 * Get list of all transactions.
 * @param Callback function _callback
 */
function getTransactionList(_callback){
    callAjax({
        data: {
            action: "getTransactionList",
        }
    },
    function(data){ // on $.done
        updateCookie(data);
        _callback(data);
    });

}

/**
 * Print out the transaction table in content block
 * @param Boolean cleanupFlag
 */
function renderTransactionList(data, cleanupFlag){
    // Clear the transaction list if neccessary
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
 * @param Callback function _callback
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
 * Cleanup Cookies
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
 * Display the notification on the top of screen.
 * Message disappear after 5s.
 * @param String message
 * @param Boolean success
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
 * Verify if current user's session is available.
 * - Update cookies with new one if success.
 * - Or cleanup cookies, then reload page to login form if they are expired.
 * @param Callback function _callback
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
                // Cleanup cookie if they are expired. Then reload the page.
                if(data.value.jsonCode == 408 || data.value.jsonCode == 407){
                    removeCookie();
                    location.reload();
                }
                // Else update cookies with the latest
                else{
                    updateCookie(data);
                }
                if(_callback) _callback(data);

            });
    }
}


/**
 * Update content in the given block.
 * @param String block_name
 * @param String container
 * @param Callback function _callback
 */
function updateContentBlock(block_name, container, _callback){
    $.ajax({
        type: "GET",
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


function callAjax(params, _done_callbak, _fail_callback, _always_callback){
    start_busy();
    $.ajax({
        type: (typeof params.type !== 'undefined') ? params.type : "GET",
        url: (typeof params.url !== 'undefined') ? params.url : "/ajax.php",
        data: (typeof params.data !== 'undefined') ? params.data : {},
        dataType: (typeof params.dataType !== 'undefined') ? params.dataType : "json",
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        statusCode: {
            401: function() {
                notif('Username or password is not correct.', false);
            },
            500: function() {
                notif('Unknown error.', false);
            }
        }
    })
        .done(function(data) {
            if(_done_callbak) _done_callbak(data);
        })
        .fail(function(data) {
            if(_fail_callback) _fail_callback(data);
        })
        .always(function(data){
            stop_busy();
            if(_always_callback) _always_callback(data);
        });
}
/********* End Common functions *********/