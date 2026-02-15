<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once __DIR__ . '/../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

// GET - Fetch committee members
if ($method == 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM committee ORDER BY display_order ASC");
        $members = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($members);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Error fetching committee"]);
    }
}

// POST - Create committee member
elseif ($method == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->name) && !empty($data->role)) {
        try {
            $query = "INSERT INTO committee (name, role, bio, image_url, display_order) VALUES (?, ?, ?, ?, ?)";
            $stmt = $pdo->prepare($query);
            
            $bio = $data->bio ?? '';
            $image_url = $data->image_url ?? '';
            $display_order = $data->display_order ?? 0;
            
            if ($stmt->execute([$data->name, $data->role, $bio, $image_url, $display_order])) {
                http_response_code(201);
                echo json_encode(["message" => "Committee member added", "id" => $pdo->lastInsertId()]);
            } else {
                http_response_code(503);
                echo json_encode(["message" => "Unable to add member"]);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "Database error"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Name and role required"]);
    }
}

// PUT - Update committee member
elseif ($method == 'PUT') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->id)) {
        try {
            $query = "UPDATE committee SET name = ?, role = ?, bio = ?, image_url = ?, display_order = ? WHERE id = ?";
            $stmt = $pdo->prepare($query);
            
            if ($stmt->execute([$data->name, $data->role, $data->bio, $data->image_url, $data->display_order, $data->id])) {
                echo json_encode(["message" => "Committee member updated"]);
            } else {
                http_response_code(503);
                echo json_encode(["message" => "Unable to update member"]);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "Database error"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "ID required"]);
    }
}

// DELETE - Delete committee member
elseif ($method == 'DELETE') {
    if (isset($_GET['id'])) {
        try {
            $stmt = $pdo->prepare("DELETE FROM committee WHERE id = ?");
            if ($stmt->execute([$_GET['id']])) {
                echo json_encode(["message" => "Committee member deleted"]);
            } else {
                http_response_code(503);
                echo json_encode(["message" => "Unable to delete member"]);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "Database error"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "ID required"]);
    }
}
?>
