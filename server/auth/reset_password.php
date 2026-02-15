<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once '../config/db.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->token) && !empty($data->new_password)) {
    $token = $data->token;
    $new_password = password_hash($data->new_password, PASSWORD_BCRYPT);
    $now = date("Y-m-d H:i:s");

    // Verify Token
    $query = "SELECT id FROM users WHERE reset_token = :token AND reset_token_expiry > :now";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':token', $token);
    $stmt->bindParam(':now', $now);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // Update Password and Clear Token
        $updateQuery = "UPDATE users SET password_hash = :password, reset_token = NULL, reset_token_expiry = NULL WHERE id = :id";
        $updateStmt = $pdo->prepare($updateQuery);
        $updateStmt->bindParam(':password', $new_password);
        $updateStmt->bindParam(':id', $user['id']);

        if ($updateStmt->execute()) {
            http_response_code(200);
            echo json_encode(["message" => "Password has been successfully reset."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to update password."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Invalid or expired token."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data."]);
}
?>
