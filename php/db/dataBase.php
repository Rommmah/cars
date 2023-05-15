<?php 
    $pdo_host = '127.0.0.1';
    $pdo_db   = 'proContext';
    $pdo_login = 'root';
    $pdo_pass = '';

    
    $pdo_charset = 'utf8';

    $dsn = "mysql:host=$pdo_host;dbname=$pdo_db;charset=$pdo_charset";
    $opt = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_LAZY,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    try{
        $pdo = new PDO($dsn, $pdo_login, $pdo_pass);
    } catch (PDOException $e) {
        print "Error!: " . $e->getMessage() . "<br/>";
        die();
    }

    //CORS:
    header('Access-Control-Allow-Origin: *');
//     header('Access-Control-Allow-Origin: http://localhost:3000', false);

?>