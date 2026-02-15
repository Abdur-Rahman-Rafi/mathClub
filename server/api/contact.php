<?php
include_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if(isset($data->name) && isset($data->email) && isset($data->message)) {
        $name = htmlspecialchars(strip_tags($data->name));
        $email = htmlspecialchars(strip_tags($data->email));
        $subject = isset($data->subject) ? htmlspecialchars(strip_tags($data->subject)) : 'New Message';
        $message = htmlspecialchars(strip_tags($data->message));

        $query = "INSERT INTO messages (name, email, subject, message) VALUES (:name, :email, :subject, :message)";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':subject', $subject);
        $stmt->bindParam(':message', $message);

        if($stmt->execute()) {
            http_response_code(201);
            echo json_encode(["message" => "Message sent successfully."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to send message."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Incomplete data."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed."]);
}
?>
