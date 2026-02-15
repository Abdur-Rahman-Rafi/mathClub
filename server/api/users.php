<?php
include_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    // Only admins can see the full user list
    $query = "SELECT id, name, username, email, role, created_at FROM users ORDER BY created_at DESC";
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($users);
} elseif ($method == 'PUT') {
    $data = json_decode(file_get_contents("php://input"));
    if (isset($data->id) && isset($data->role)) {
        $query = "UPDATE users SET role = :role WHERE id = :id";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':role', $data->role);
        $stmt->bindParam(':id', $data->id);

        if ($stmt->execute()) {
            echo json_encode(["message" => "User role updated successfully."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to update user role."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Incomplete data."]);
    }
} elseif ($method == 'DELETE') {
    if (isset($_GET['id'])) {
        $query = "DELETE FROM users WHERE id = :id";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':id', $_GET['id']);

        if ($stmt->execute()) {
            echo json_encode(["message" => "User deleted successfully."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to delete user."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "User ID required."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed."]);
}
?>
