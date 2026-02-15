<?php
include_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    $userId = isset($_GET['user_id']) ? $_GET['user_id'] : null;
    $query = "SELECT a.*, u.name as student_name, u.username 
              FROM achievements a 
              LEFT JOIN users u ON a.user_id = u.id";
    
    if ($userId) {
        $query .= " WHERE a.user_id = :user_id";
    }
    
    $query .= " ORDER BY a.achievement_date DESC";
    $stmt = $pdo->prepare($query);
    
    if ($userId) {
        $stmt->bindParam(':user_id', $userId);
    }
    
    $stmt->execute();
    $achievements = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($achievements);
} elseif ($method == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    if (isset($data->title) && isset($data->achievement_date)) {
        $query = "INSERT INTO achievements (user_id, title, description, achievement_date, award_type, file_url) 
                  VALUES (:user_id, :title, :description, :achievement_date, :award_type, :file_url)";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':user_id', $data->user_id);
        $stmt->bindParam(':title', $data->title);
        $stmt->bindParam(':description', $data->description);
        $stmt->bindParam(':achievement_date', $data->achievement_date);
        $stmt->bindParam(':award_type', $data->award_type);
        $stmt->bindParam(':file_url', $data->file_url);

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(["message" => "Achievement awarded successfully."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to award achievement."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Incomplete data."]);
    }
} elseif ($method == 'PUT') {
    $data = json_decode(file_get_contents("php://input"));
    if (isset($data->id) && isset($data->title) && isset($data->achievement_date)) {
        $query = "UPDATE achievements SET 
                  user_id = :user_id, 
                  title = :title, 
                  description = :description, 
                  achievement_date = :achievement_date, 
                  award_type = :award_type, 
                  file_url = :file_url 
                  WHERE id = :id";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':user_id', $data->user_id);
        $stmt->bindParam(':title', $data->title);
        $stmt->bindParam(':description', $data->description);
        $stmt->bindParam(':achievement_date', $data->achievement_date);
        $stmt->bindParam(':award_type', $data->award_type);
        $stmt->bindParam(':file_url', $data->file_url);
        $stmt->bindParam(':id', $data->id);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Achievement updated successfully."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to update achievement."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Incomplete data."]);
    }
}
 elseif ($method == 'DELETE') {
    if (isset($_GET['id'])) {
        $query = "DELETE FROM achievements WHERE id = :id";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':id', $_GET['id']);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Achievement deleted successfully."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to delete achievement."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "ID required."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed."]);
}
?>
