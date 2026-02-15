<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once __DIR__ . '/../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

// GET - Fetch news
if ($method == 'GET') {
    if (isset($_GET['id'])) {
        // Get single news item
        $stmt = $pdo->prepare("SELECT n.*, u.name as author_name FROM news n LEFT JOIN users u ON n.author_id = u.id WHERE n.id = ?");
        $stmt->execute([$_GET['id']]);
        $news = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($news) {
            echo json_encode($news);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "News not found"]);
        }
    } else {
        // Get all published news (or all if admin)
        $query = "SELECT n.*, u.name as author_name FROM news n LEFT JOIN users u ON n.author_id = u.id";
        
        // Filter by status if not admin
        if (!isset($_GET['admin']) || $_GET['admin'] != 'true') {
            $query .= " WHERE n.status = 'published'";
        }
        
        $query .= " ORDER BY n.created_at DESC";
        
        if (isset($_GET['limit'])) {
            $query .= " LIMIT " . intval($_GET['limit']);
        }
        
        $stmt = $pdo->query($query);
        $news = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($news);
    }
}

// POST - Create news (admin only)
elseif ($method == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->title) && !empty($data->content)) {
        $query = "INSERT INTO news (title, content, excerpt, image_url, author_id, status) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $pdo->prepare($query);
        
        $excerpt = $data->excerpt ?? substr(strip_tags($data->content), 0, 200);
        $image_url = $data->image_url ?? null;
        $author_id = $data->author_id ?? null;
        $status = $data->status ?? 'draft';
        
        if ($stmt->execute([$data->title, $data->content, $excerpt, $image_url, $author_id, $status])) {
            $newsId = $pdo->lastInsertId();
            http_response_code(201);
            echo json_encode(["message" => "News created successfully", "id" => $newsId]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Unable to create news"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Incomplete data"]);
    }
}

// PUT - Update news (admin only)
elseif ($method == 'PUT') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->id)) {
        $query = "UPDATE news SET title = ?, content = ?, excerpt = ?, image_url = ?, status = ? WHERE id = ?";
        $stmt = $pdo->prepare($query);
        
        $excerpt = $data->excerpt ?? substr(strip_tags($data->content), 0, 200);
        
        if ($stmt->execute([$data->title, $data->content, $excerpt, $data->image_url, $data->status, $data->id])) {
            echo json_encode(["message" => "News updated successfully"]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Unable to update news"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "News ID required"]);
    }
}

// DELETE - Delete news (admin only)
elseif ($method == 'DELETE') {
    if (isset($_GET['id'])) {
        $stmt = $pdo->prepare("DELETE FROM news WHERE id = ?");
        if ($stmt->execute([$_GET['id']])) {
            echo json_encode(["message" => "News deleted successfully"]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Unable to delete news"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "News ID required"]);
    }
}

?>
