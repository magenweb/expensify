<?php

include_once './app/config.php';

class Ajax
{
    public function __construct(){
    }
    
    /**
     * Send the API request
     * @param String $param
     * @return mixed
     */
    public function sendRequest($url){
        if(!isset($url)) return false;
        
        $opt = array();
        
        // Insert cookie authenToken in to the request's header
        if(isset($_COOKIE['accountID']) && isset($_COOKIE['accountID']) && isset($_COOKIE['accountID'])){
            $cookies = array(
                'accountID' => $_COOKIE['accountID'],
                'authToken' => $_COOKIE['authToken'],
                'email' => $_COOKIE['email']
            );
            $opt['http']['header'] = "Cookie: ";
            foreach($cookies as $k => $v){
                $opt['http']['header'] .= $k . "=" . $v . ";";
            }
        }
        
        $context = stream_context_create($opt);        
        $result = file_get_contents($url, false, $context);
        
        return (is_string($result)) ? $result : FALSE;
    }
    
    /**
     * Processing and converting Expensify API response into local app's response type.
     * @param String $str_res
     * @return array
     */
    public function buildResponse($str_res){
        $res = array("status" => FALSE, "message" => "", "value" => NULL); // Forming properly response's structure
        
        if(!is_string($str_res)){ //Incorrect type response
            $res['message'] = "Response is not a string";
            return $res;
        }
        
        $json_obj = json_decode($str_res);                      
        if(!$json_obj){ // JSON decode fails
            $res['message'] = "Response is not in Json type";
            return $res;
        }
        
        assert(is_int($json_obj->jsonCode) /* jsonCode must be HTTP status code */);
        $res['value'] = $json_obj;
        
        switch($json_obj->jsonCode){
            case 200:
                $res['status'] = TRUE;
                $res['message'] = "OK";
                break;
            case 400:
                $res['message'] = "Unrecognized command";
                break;
            case 402:
                $res['message'] = "Missing argument";
                break;
            case 408:
                $res['message'] = "Session expired";
                break;
            default:
                $res['message'] = $json_obj->jsonCode . " - error";
                break;
        }
        return $res;
    }
    
    /**
     * Login action
     * @return boolean
     */
    public function login(){
        /* REMOVE: */
        $_POST['username'] = "expensifytest@mailinator.com";
        $_POST['password'] = "hire_me";
        /* End REMOVE */
        
        if(!isset($_POST['username']) || !isset($_POST['password'])) return false; // Stop if username or password is not set.
        
        $request = "https://api.expensify.com?"
                        ."command=Authenticate"
                        ."&partnerName=applicant"
                        ."&partnerPassword=d7c3119c6cdab02d68d9"
                        ."&partnerUserID=" . rawurlencode($_POST['username'])
                        ."&partnerUserSecret=" . $_POST['password'];
        $response = $this->sendRequest($request);
        echo json_encode($this->buildResponse($response));
    }
    
    public function verifyLogin(){
        $request = "https://api.expensify.com?"
                        ."command=Get"
                        ."&authenToken=" . $_COOKIE['authToken'];
        echo json_encode($this->buildResponse($this->sendRequest($request)));
    }
    
    public function getTransactionList(){
        $request = "https://api.expensify.com?"
                        ."command=Get"
                        ."&authenToken=" . $_COOKIE['authToken']
                        ."&returnValueList=transactionList";
        echo json_encode($this->buildResponse($this->sendRequest($request)));
    }
    
    public function createTransaction(){
        $request = "https://api.expensify.com?"
                        ."command=CreateTransaction"
                        ."&authenToken=" . $_COOKIE['authToken']
                        ."&created=" . rawurlencode($_GET['transaction']['created'])
                        ."&amount=" . rawurlencode($_GET['transaction']['amount'])
                        ."&merchant=" . rawurlencode($_GET['transaction']['merchant'])
                        ."&comment=" . rawurlencode($_GET['transaction']['comment']);
//        echo $request;
        echo json_encode($this->buildResponse($this->sendRequest($request)));
    }
    
    public function view(){
        if(file_exists("./template/" . $_GET['block_name'] . ".php"))
            include_once("./template/" . $_GET['block_name'] . ".php");
    }
            
            
}

/* Initiate Ajax controller */
$ajax = new Ajax();
if (isset($_POST['action']) && !empty($_POST['action'])) {
    $ajax->{$_POST['action']}();
}

if (isset($_GET['action']) && !empty($_GET['action'])) {
    $ajax->{$_GET['action']}();
}