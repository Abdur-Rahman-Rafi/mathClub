<?php
include_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    if (isset($_GET['all'])) {
        $query = "SELECT p.*, COALESCE(e.title, p.event_name) as event_display_name 
                  FROM payments p 
                  LEFT JOIN events e ON p.event_id = e.id 
                  ORDER BY p.created_at DESC";
        $stmt = $pdo->prepare($query);
        $stmt->execute();
        $payments = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($payments);
    } elseif (isset($_GET['user_id'])) {
        $user_id = $_GET['user_id'];
        $query = "SELECT p.*, COALESCE(e.title, p.event_name) as event_display_name 
                  FROM payments p 
                  LEFT JOIN events e ON p.event_id = e.id 
                  WHERE p.user_id = :user_id 
                  ORDER BY p.created_at DESC";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();
        $payments = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($payments);
    } else {
        http_response_code(400);
        echo json_encode(["message" => "User ID or 'all' parameter required."]);
    }
} elseif ($method == 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    // Validate required fields (including new ones)
    if (
        !empty($data->user_id) &&
        !empty($data->amount) &&
        !empty($data->transaction_id) &&
        !empty($data->network) &&
        !empty($data->event_name) && 
        !empty($data->student_name) &&
        !empty($data->roll)
    ) {
        $query = "INSERT INTO payments (
                    user_id, event_id, event_name, student_name, roll, membership_id, 
                    amount, payment_method, transaction_id, status
                  ) VALUES (
                    :user_id, :event_id, :event_name, :student_name, :roll, :membership_id, 
                    :amount, :payment_method, :transaction_id, 'pending'
                  )";
        
        $stmt = $pdo->prepare($query);

        $stmt->bindParam(':user_id', $data->user_id);
        // event_id can be null if it's a general payment or custom event
        $event_id = !empty($data->event_id) ? $data->event_id : null;
        $stmt->bindParam(':event_id', $event_id);
        
        $stmt->bindParam(':event_name', $data->event_name);
        $stmt->bindParam(':student_name', $data->student_name);
        $stmt->bindParam(':roll', $data->roll);
        $membership_id = $data->membership_id ?? ''; // Optional
        $stmt->bindParam(':membership_id', $membership_id);
        
        $stmt->bindParam(':amount', $data->amount);
        $stmt->bindParam(':payment_method', $data->network);
        $stmt->bindParam(':transaction_id', $data->transaction_id);

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(["message" => "Payment submitted successfully."]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Unable to submit payment."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Incomplete data. Name, Roll, Event, Amount, and Trx ID are required."]);
    }
} elseif ($method == 'PUT') {
    $data = json_decode(file_get_contents("php://input"));

    if (!empty($data->id) && !empty($data->status)) {
        $query = "UPDATE payments SET status = :status WHERE id = :id";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':status', $data->status);
        $stmt->bindParam(':id', $data->id);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Payment status updated successfully."]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Unable to update payment status."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Incomplete data. ID and status are required."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed."]);
}
?>
