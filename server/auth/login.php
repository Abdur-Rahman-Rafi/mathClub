<?php
include_once '../config/db.php';

$data = json_decode(file_get_contents("php://input"));

if(isset($data->email) && isset($data->password)) {
    $email = htmlspecialchars(strip_tags($data->email));
    $query = "SELECT id, name, email, password_hash, role FROM users WHERE email = :email LIMIT 1";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':email', $email);
    $stmt->execute();

    if($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if(password_verify($data->password, $row['password_hash'])) {
            // Prepare user data for response and email
            $user_data = [
                "id" => $row['id'],
                "name" => $row['name'],
                "email" => $row['email'],
                "role" => $row['role']
            ];
            
            // Send Login Notification Email
            $to = $user_data['email'];
            $subject = "Login Notification - BAFSKMC Math Club";
            $message = "Hello " . $user_data['name'] . ",\n\nYou have successfully logged in to your account on " . date("Y-m-d H:i:s") . ".\n\nIf this was not you, please contact support immediately.";
            $headers = "From: no-reply@bafskmcmathclub.com";
            
            // Attempt to send email (suppress errors as local env might not have mail server)
            @mail($to, $subject, $message, $headers);

            http_response_code(200);
            echo json_encode([
                "message" => "Login successful",
                "user" => $user_data,
                "token" => bin2hex(random_bytes(16)) // Mock token
            ]);
        } else {
            http_response_code(401);
            echo json_encode(["message" => "Invalid password."]);
        }
    } else {
        http_response_code(404);
        echo json_encode(["message" => "User not found."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data."]);
}
?>
