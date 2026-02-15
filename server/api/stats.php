<?php
include_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    try {
        // Count Users
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM users");
        $usersCount = $stmt->fetch()['total'];

        // Count News
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM news");
        $newsCount = $stmt->fetch()['total'];

        // Count Events
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM events");
        $eventsCount = $stmt->fetch()['total'];

        // Count Payments (Total and Pending)
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM payments");
        $paymentsCount = $stmt->fetch()['total'];
        
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM payments WHERE status = 'pending'");
        $pendingPaymentsCount = $stmt->fetch()['total'];

        // Count Exams
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM exams");
        $examsCount = $stmt->fetch()['total'];

        echo json_encode([
            "users" => $usersCount,
            "news" => $newsCount,
            "events" => $eventsCount,
            "payments" => $paymentsCount,
            "pending_payments" => $pendingPaymentsCount,
            "exams" => $examsCount
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["message" => "Error fetching stats: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed."]);
}
?>
