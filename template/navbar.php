<?php if(isset($_COOKIE['authToken'])): // User is connected ?>
    <ul class="nav navbar-nav">
        <li><a id="list-transactions-btn" href="#">Transaction List</a></li>
        <li><a id="new-transaction-btn" href="#" data-toggle="modal" data-target="#addTransaction">Add Transaction</a></li>
        <li><a id="logout-btn" href="#" data-toggle="modal" data-target="#logout">Log out</a></li>
    </ul>
<?php endif;?>