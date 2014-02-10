<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: *");

include_once './app/config.php';

class AjaxView{
    public function __construct(){
    }
    
    public function contentBlock(){
        file_get_contents("./template/content.php");
    }
}

/* Initiate Ajax controller */
$ajax = new AjaxView();
if (isset($_POST['view']) && !empty($_POST['view'])) {
    $ajax->{$_POST['view']}();
}

if (isset($_GET['view']) && !empty($_GET['view'])) {
    $ajax->{$_GET['view']}();
}

?>

<?php if(isset($_COOKIE['authToken'])): // User is connected ?>
    <?php // print_r($_COOKIE); ?>
<h1><span class="title">Transaction</span><a id="refresh-transactions-btn" title="Refresh transaction list" href="#"><i class="glyphicon glyphicon-refresh"></i></a></h1>
    <div class="panel panel-default">
        <!-- Table -->
        <table class="table transaction-list">
            <thead>
                <tr>
                    <th>Card ID</th>
                    <th>Transaction ID</th>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Comment</th>
                    <th>Amount</th>
                    <th>State</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    </div>
    <button href="#" class="btn btn-primary btn-default" data-toggle="modal" data-target="#addTransaction">New transaction</button>

    <div id="addTransaction" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">New transaction</h4>
                </div>
                <form class="form-horizontal" role="form" id="formAddTransaction">
                    <div class="modal-body">

                        <div class="form-group">
                                <label for="inputCreated" class="col-sm-3 control-label">Date</label>
                                <div class="col-sm-4">
                                    <input type="date" class="form-control datepicker" id="inputCreated">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="inputAmount" class="col-sm-3 control-label">Amount</label>
                                <div class="col-sm-3">
                                    <input type="text" class="form-control text-right" id="inputAmount" placeholder="100.00">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="inputMerchant" class="col-sm-3 control-label">Merchant</label>
                                <div class="col-sm-8">
                                    <input type="text" class="form-control" id="inputMerchant" placeholder="Amazon">
                                </div>
                            </div>
                        <div class="form-group">
                                <label for="inputComment" class="col-sm-3 control-label">Comment</label>
                                <div class="col-sm-8">
                                    <textarea type="text" class="form-control" id="inputComment" placeholder="Comment for transaction"></textarea>
                                </div>
                            </div>

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary btn-save">Save</button>
                    </div>
                </form>
            </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->

<?php else: // Anonymous user ?>
<form id="form-signin" class="form-signin" role="form" method="post">
    <h2 class="form-signin-heading">Sign in</h2>
    <input type="email" name="username" id="username" class="form-control" placeholder="Email address" required="requỉred" autofocus>
    <input type="password" name="password" id="password" class="form-control" placeholder="Password" required="requỉred">
    <button type="submit" class="submit btn btn-lg btn-primary btn-block">Sign in</button>
</form>
<?php endif;?>