<?php
include_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    // Fetch all exams or a specific one
    if (isset($_GET['id'])) {
        $stmt = $pdo->prepare("SELECT * FROM exams WHERE id = :id");
        $stmt->bindParam(':id', $_GET['id']);
        $stmt->execute();
        echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
    } else {
        $stmt = $pdo->query("SELECT * FROM exams ORDER BY created_at DESC");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }
} elseif ($method == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    if (isset($data->title) && isset($data->duration_minutes)) {
        $query = "INSERT INTO exams (title, description, question_file_url, question_link, duration_minutes, start_time, end_time, status) 
                  VALUES (:title, :description, :question_file_url, :question_link, :duration_minutes, :start_time, :end_time, :status)";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':title', $data->title);
        $stmt->bindParam(':description', $data->description);
        $stmt->bindParam(':question_file_url', $data->question_file_url);
        $stmt->bindParam(':question_link', $data->question_link);
        $stmt->bindParam(':duration_minutes', $data->duration_minutes);
        $stmt->bindParam(':start_time', $data->start_time);
        $stmt->bindParam(':end_time', $data->end_time);
        $status = $data->status ?? 'upcoming';
        $stmt->bindParam(':status', $status);

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(["message" => "Exam created successfully.", "id" => $pdo->lastInsertId()]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to create exam."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Incomplete data."]);
    }
} elseif ($method == 'PUT') {
    $data = json_decode(file_get_contents("php://input"));
    if (isset($data->id) && isset($data->title)) {
        $query = "UPDATE exams SET title = :title, description = :description, question_file_url = :question_file_url, 
                  question_link = :question_link, duration_minutes = :duration_minutes, start_time = :start_time, 
                  end_time = :end_time, status = :status WHERE id = :id";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':title', $data->title);
        $stmt->bindParam(':description', $data->description);
        $stmt->bindParam(':question_file_url', $data->question_file_url);
        $stmt->bindParam(':question_link', $data->question_link);
        $stmt->bindParam(':duration_minutes', $data->duration_minutes);
        $stmt->bindParam(':start_time', $data->start_time);
        $stmt->bindParam(':end_time', $data->end_time);
        $stmt->bindParam(':status', $data->status);
        $stmt->bindParam(':id', $data->id);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Exam updated successfully."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to update exam."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Incomplete data."]);
    }
} elseif ($method == 'DELETE') {
    if (isset($_GET['id'])) {
        $stmt = $pdo->prepare("DELETE FROM exams WHERE id = :id");
        $stmt->bindParam(':id', $_GET['id']);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Exam deleted successfully."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to delete exam."]);
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
