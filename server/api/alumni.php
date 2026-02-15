<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once __DIR__ . '/../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

// GET - Fetch alumni
if ($method == 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM alumni_committee ORDER BY display_order ASC");
        $alumni = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($alumni);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Error fetching alumni"]);
    }
}

// POST - Create alumni
elseif ($method == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->name) && !empty($data->role)) {
        try {
            $query = "INSERT INTO alumni_committee (name, role, batch, current_position, institution, bio, image_url, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $pdo->prepare($query);
            
            $batch = $data->batch ?? '';
            $current_position = $data->current_position ?? '';
            $institution = $data->institution ?? '';
            $bio = $data->bio ?? '';
            $image_url = $data->image_url ?? '';
            $display_order = $data->display_order ?? 0;
            
            if ($stmt->execute([$data->name, $data->role, $batch, $current_position, $institution, $bio, $image_url, $display_order])) {
                http_response_code(201);
                echo json_encode(["message" => "Alumni added", "id" => $pdo->lastInsertId()]);
            } else {
                http_response_code(503);
                echo json_encode(["message" => "Unable to add alumni"]);
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

// PUT - Update alumni
elseif ($method == 'PUT') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->id)) {
        try {
            $query = "UPDATE alumni_committee SET name = ?, role = ?, batch = ?, current_position = ?, institution = ?, bio = ?, image_url = ?, display_order = ? WHERE id = ?";
            $stmt = $pdo->prepare($query);
            
            if ($stmt->execute([$data->name, $data->role, $data->batch, $data->current_position, $data->institution, $data->bio, $data->image_url, $data->display_order, $data->id])) {
                echo json_encode(["message" => "Alumni updated"]);
            } else {
                http_response_code(503);
                echo json_encode(["message" => "Unable to update alumni"]);
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

// DELETE - Delete alumni
elseif ($method == 'DELETE') {
    if (isset($_GET['id'])) {
        try {
            $stmt = $pdo->prepare("DELETE FROM alumni_committee WHERE id = ?");
            if ($stmt->execute([$_GET['id']])) {
                echo json_encode(["message" => "Alumni deleted"]);
            } else {
                http_response_code(503);
                echo json_encode(["message" => "Unable to delete alumni"]);
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
