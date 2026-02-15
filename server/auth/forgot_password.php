<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once '../config/db.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email)) {
    $email = $data->email;

    // Check if user exists
    $query = "SELECT id, name FROM users WHERE email = :email";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':email', $email);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Generate Token
        $token = bin2hex(random_bytes(32));
        $expiry = date("Y-m-d H:i:s", strtotime('+1 hour'));

        // Save Token to DB
        $updateQuery = "UPDATE users SET reset_token = :token, reset_token_expiry = :expiry WHERE email = :email";
        $updateStmt = $pdo->prepare($updateQuery);
        $updateStmt->bindParam(':token', $token);
        $updateStmt->bindParam(':expiry', $expiry);
        $updateStmt->bindParam(':email', $email);
        
        if ($updateStmt->execute()) {
            // Send Email (Simulated)
            $resetLink = "http://localhost:5173/reset-password?token=" . $token;
            $to = $email;
            $subject = "Password Reset Request";
            $message = "Hello " . $user['name'] . ",\n\nClick the link below to reset your password:\n" . $resetLink . "\n\nThis link expires in 1 hour.";
            $headers = "From: no-reply@bafskmcmathclub.com";

            if (@mail($to, $subject, $message, $headers)) {
                http_response_code(200);
                echo json_encode(["message" => "Password reset link sent to your email."]);
            } else {
                // For Development: Return token in response since mail() might fail locally
                http_response_code(200);
                echo json_encode([
                    "message" => "Email failed (Local Env). Use this link to reset:",
                    "dev_link" => $resetLink
                ]);
            }
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Unable to generate reset token."]);
        }
    } else {
        http_response_code(404);
        echo json_encode(["message" => "Email not found."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data."]);
}
?>
