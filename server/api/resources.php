<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/db.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    $query = "SELECT * FROM resources ORDER BY created_at DESC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $resources = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($resources);
}

if ($method == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if(!empty($data->title) && !empty($data->file_url)) {
        $query = "INSERT INTO resources (title, file_url, file_type) VALUES (:title, :file_url, :file_type)";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':title', $data->title);
        $stmt->bindParam(':file_url', $data->file_url);
        $stmt->bindParam(':file_type', $data->file_type);
        
        if($stmt->execute()) {
            http_response_code(201);
            echo json_encode(["message" => "Resource added successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Unable to add resource"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Incomplete data"]);
    }
}

if ($method == 'DELETE') {
    $id = $_GET['id'];
    $query = "DELETE FROM resources WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    
    if($stmt->execute()) {
        echo json_encode(["message" => "Resource deleted"]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Unable to delete resource"]);
    }
}
?>
