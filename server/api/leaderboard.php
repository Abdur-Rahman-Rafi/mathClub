<?php
include_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    // Fetch leaderboard with user details
    $query = "SELECT l.*, u.name, u.username, u.role 
              FROM leaderboard l 
              JOIN users u ON l.user_id = u.id 
              ORDER BY l.points DESC";
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $leaderboard = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($leaderboard);
} elseif ($method == 'POST' || $method == 'PUT') {
    // Update or insert student points (Admin only ideally, but we'll enforce in frontend first)
    $data = json_decode(file_get_contents("php://input"));
    
    if (isset($data->user_id) && isset($data->points)) {
        // Use UPSERT logic
        $query = "INSERT INTO leaderboard (user_id, points, rank_title) 
                  VALUES (:user_id, :points, :rank_title) 
                  ON DUPLICATE KEY UPDATE points = :points_up, rank_title = :rank_title_up";
        
        // Determine rank title based on points
        $points = (int)$data->points;
        $rank_title = 'Novice';
        if ($points >= 1000) $rank_title = 'Grandmaster';
        else if ($points >= 500) $rank_title = 'Expert';
        else if ($points >= 200) $rank_title = 'Intermediate';
        else if ($points >= 100) $rank_title = 'Apprentice';

        if (isset($data->rank_title)) $rank_title = $data->rank_title;

        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':user_id', $data->user_id);
        $stmt->bindParam(':points', $points);
        $stmt->bindParam(':rank_title', $rank_title);
        $stmt->bindParam(':points_up', $points);
        $stmt->bindParam(':rank_title_up', $rank_title);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Leaderboard updated successfully.", "rank_title" => $rank_title]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to update leaderboard."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Missing user_id or points."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed."]);
}
?>
