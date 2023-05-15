<?php
// для БД
require_once "./db/dataBase.php";
// для отправки письма
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';
require 'phpmailer/Exception.php';
//Для писем
require_once "mail.php";


// Получение текущей даты
$date = new DateTime('now');
$formattedDate = $date->format('Y-m-d H:i:s');

// Данные от клиента
$name = $_POST['name'] ? $_POST['name'] : 'noname';
$phone = $_POST['phone'];

// Запись в базу данных
try {
    $sql = 'INSERT INTO `request`(`name`, `phone`, `date`) VALUES (:name, :phone, :date)';
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':name' => $name,
        ':phone' => $phone,
        ':date' => $formattedDate
    ]);

    if($stmt->rowCount()) echo "success";
    else echo false;
} catch (PDOException $e) {
    echo(false);
//     print "Error!: " . $e->getMessage() . "<br/>";
    die();
}

$file = 'log.txt';
$text = <<<TEXT
$formattedDate Имя: $name, тел.: $phone

TEXT;
// запись в файл
file_put_contents($file, $text, FILE_APPEND | LOCK_EX);


// письмо
$title = "Заявка";
$body = "
<h2>Новая заявка</h2>
<b>Имя:</b> $name<br>
<b>Тел.:</b> $phone<br><br>
";

// Настройки PHPMailer
$mail = new PHPMailer\PHPMailer\PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->CharSet = "UTF-8";
    $mail->SMTPAuth   = true;
    //$mail->SMTPDebug = 2;
    $mail->Debugoutput = function($str, $level) {$GLOBALS['status'][] = $str;};

    // Настройки вашей почты
    $mail->Host       = $yourHost; // SMTP сервера вашей почты
    $mail->Username   = $yourMail; // Логин на почте
    $mail->Password   = $yourPass; // Пароль на почте
    $mail->SMTPSecure = 'TSL';
    $mail->Port       = 465;
    $mail->setFrom($yourMail, 'Заявка!'); // Адрес самой почты и имя отправителя

    // Получатель письма
    $mail->addAddress($sendTo, $sendTo);

    // Отправка сообщения
    $mail->isHTML(true);
    $mail->Subject = $title;
    $mail->Body = $body;

    // Проверяем отравленность сообщения
    // if ($mail->send()) {$result = "success";} 
    // else {$result = "error";}
    // $mail_result = [
    //     "result" => $result, 
    //     "status" => $status
    // ];

    } catch (Exception $e) {
        $result = "error";
        $status = "Сообщение не было отправлено. Причина ошибки: {$mail->ErrorInfo}";
    }

