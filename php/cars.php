<?php
// для БД
require_once "./db/dataBase.php";

// получение данных из БД
try {
	$sql = 'SELECT * FROM cars' ;				
	$stmt = $pdo->query($sql);
	$row = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
	print "Error!: " . $e->getMessage() . "<br/>";
	die();
}

echo json_encode($row, JSON_PRETTY_PRINT);