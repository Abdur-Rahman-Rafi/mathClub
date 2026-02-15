<?php
include_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    $query = "SELECT * FROM events ORDER BY event_date DESC";
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $events = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($events);
} elseif ($method == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    // Basic Admin Check (In real app, verify token/session)
    // For now, assuming anyone hitting this endpoint with valid data is authorized or we handle auth validation elsewhere
    
    if(isset($data->title) && isset($data->event_date)) {
        $title = htmlspecialchars(strip_tags($data->title));
        $description = isset($data->description) ? htmlspecialchars(strip_tags($data->description)) : '';
        $event_date = $data->event_date;
        $fee = isset($data->fee) ? $data->fee : 0.00;

        $query = "INSERT INTO events (title, description, event_date, fee) VALUES (:title, :description, :event_date, :fee)";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':title', $title);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':event_date', $event_date);
        $stmt->bindParam(':fee', $fee);

        if($stmt->execute()) {
            http_response_code(201);
            echo json_encode(["message" => "Event created successfully."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to create event."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Incomplete data."]);
    }
} elseif ($method == 'PUT') {
    $data = json_decode(file_get_contents("php://input"));
    if (isset($data->id) && isset($data->title) && isset($data->event_date)) {
        $title = htmlspecialchars(strip_tags($data->title));
        $description = isset($data->description) ? htmlspecialchars(strip_tags($data->description)) : '';
        $event_date = $data->event_date;
        $fee = isset($data->fee) ? $data->fee : 0.00;

        $query = "UPDATE events SET title = :title, description = :description, event_date = :event_date, fee = :fee WHERE id = :id";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':title', $title);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':event_date', $event_date);
        $stmt->bindParam(':fee', $fee);
        $stmt->bindParam(':id', $data->id);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Event updated successfully."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to update event."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Incomplete data."]);
    }
} elseif ($method == 'DELETE') {
    if (isset($_GET['id'])) {
        $query = "DELETE FROM events WHERE id = :id";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':id', $_GET['id']);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Event deleted successfully."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to delete event."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Event ID required."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed."]);
}
?>
