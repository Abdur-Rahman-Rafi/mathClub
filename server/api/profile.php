<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, PUT");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

// GET Profile
if ($method == 'GET') {
    if (isset($_GET['id'])) {
        $id = $_GET['id'];
        $stmt = $pdo->prepare("SELECT id, name, email, role, class_roll, section, class_year, institution, address, mobile FROM users WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            echo json_encode($user);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "User not found"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "User ID required"]);
    }
}

// UPDATE Profile
elseif ($method == 'PUT') {
    $data = json_decode(file_get_contents("php://input"));

    if (!empty($data->id)) {
        $query = "UPDATE users SET 
                    name = :name, 
                    class_roll = :class_roll, 
                    section = :section, 
                    class_year = :class_year, 
                    institution = :institution, 
                    address = :address, 
                    mobile = :mobile 
                  WHERE id = :id";
        
        $stmt = $pdo->prepare($query);
        
        // Bind parameters (use strict types or defaults if needed)
        $stmt->bindValue(':name', $data->name ?? '');
        $stmt->bindValue(':class_roll', $data->class_roll ?? '');
        $stmt->bindValue(':section', $data->section ?? '');
        $stmt->bindValue(':class_year', $data->class_year ?? '');
        $stmt->bindValue(':institution', $data->institution ?? '');
        $stmt->bindValue(':address', $data->address ?? '');
        $stmt->bindValue(':mobile', $data->mobile ?? '');
        $stmt->bindValue(':id', $data->id);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Profile updated successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Unable to update profile"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "User ID is required"]);
    }
}
?>
