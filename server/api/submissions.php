<?php
include_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    if (isset($_GET['exam_id'])) {
        // Fetch all submissions for an exam (for admin)
        $stmt = $pdo->prepare("SELECT s.*, u.name as student_name, u.username 
                               FROM exam_submissions s 
                               JOIN users u ON s.user_id = u.id 
                               WHERE s.exam_id = :exam_id");
        $stmt->bindParam(':exam_id', $_GET['exam_id']);
        $stmt->execute();
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } elseif (isset($_GET['user_id'])) {
        // Fetch submissions for a user
        $stmt = $pdo->prepare("SELECT s.*, e.title as exam_title 
                               FROM exam_submissions s 
                               JOIN exams e ON s.exam_id = e.id 
                               WHERE s.user_id = :user_id");
        $stmt->bindParam(':user_id', $_GET['user_id']);
        $stmt->execute();
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Exam ID or User ID required."]);
    }
} elseif ($method == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (isset($data->exam_id) && isset($data->user_id)) {
        // Check if submission already exists (student might be resuming or restarting)
        // For simplicity, we create a new entry or update if it exists
        $stmt = $pdo->prepare("SELECT id FROM exam_submissions WHERE exam_id = :exam_id AND user_id = :user_id");
        $stmt->bindParam(':exam_id', $data->exam_id);
        $stmt->bindParam(':user_id', $data->user_id);
        $stmt->execute();
        $existing = $stmt->fetch();

        if ($existing) {
            // Update existing if submission info is provided
            $query = "UPDATE exam_submissions SET 
                      submission_file_url = :submission_file_url, 
                      submission_link = :submission_link,
                      tab_switches = :tab_switches,
                      is_terminated = :is_terminated 
                      WHERE id = :id";
            $stmt = $pdo->prepare($query);
            $stmt->bindParam(':submission_file_url', $data->submission_file_url);
            $stmt->bindParam(':submission_link', $data->submission_link);
            $stmt->bindParam(':tab_switches', $data->tab_switches);
            $stmt->bindParam(':is_terminated', $data->is_terminated);
            $stmt->bindParam(':id', $existing['id']);
        } else {
            // Create new entry
            $query = "INSERT INTO exam_submissions (exam_id, user_id, submission_file_url, submission_link, tab_switches, is_terminated) 
                      VALUES (:exam_id, :user_id, :submission_file_url, :submission_link, :tab_switches, :is_terminated)";
            $stmt = $pdo->prepare($query);
            $stmt->bindParam(':exam_id', $data->exam_id);
            $stmt->bindParam(':user_id', $data->user_id);
            $stmt->bindParam(':submission_file_url', $data->submission_file_url);
            $stmt->bindParam(':submission_link', $data->submission_link);
            $stmt->bindParam(':tab_switches', $data->tab_switches);
            $is_terminated = $data->is_terminated ?? 0;
            $stmt->bindParam(':is_terminated', $is_terminated);
        }

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(["message" => "Submission recorded successfully."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to record submission."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Incomplete data."]);
    }
} elseif ($method == 'PUT') {
    // Specifically for incrementing tab switches or marking as terminated
    $data = json_decode(file_get_contents("php://input"));
    if (isset($data->exam_id) && isset($data->user_id)) {
        $query = "UPDATE exam_submissions SET 
                  tab_switches = COALESCE(tab_switches, 0) + :inc_switches,
                  is_terminated = :is_terminated 
                  WHERE exam_id = :exam_id AND user_id = :user_id";
        $stmt = $pdo->prepare($query);
        $inc = $data->inc_switches ?? 0;
        $stmt->bindParam(':inc_switches', $inc);
        $stmt->bindParam(':is_terminated', $data->is_terminated);
        $stmt->bindParam(':exam_id', $data->exam_id);
        $stmt->bindParam(':user_id', $data->user_id);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Tracking updated successfully."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to update tracking."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Incomplete data."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed."]);
}
?>
