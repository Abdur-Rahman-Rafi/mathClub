<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Create uploads directory if it doesn't exist
$uploadDir = __DIR__ . '/../uploads/';
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['file'])) {
        $file = $_FILES['file'];
        $fileName = $file['name'];
        $fileTmpName = $file['tmp_name'];
        $fileSize = $file['size'];
        $fileError = $file['error'];
        $fileType = $file['type'];

        // Get file extension
        $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        
        // Allowed extensions
        $allowedImages = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        $allowedDocs = ['pdf', 'doc', 'docx'];
        $allowed = array_merge($allowedImages, $allowedDocs);

        if (in_array($fileExt, $allowed)) {
            if ($fileError === 0) {
                if ($fileSize < 10000000) { // 10MB limit
                    // Generate unique filename
                    $fileNameNew = uniqid('', true) . "." . $fileExt;
                    $fileDestination = $uploadDir . $fileNameNew;

                    if (move_uploaded_file($fileTmpName, $fileDestination)) {
                        // Return the URL path
                        $fileUrl = 'http://127.0.0.1:8000/uploads/' . $fileNameNew;
                        
                        http_response_code(200);
                        echo json_encode([
                            "success" => true,
                            "message" => "File uploaded successfully",
                            "url" => $fileUrl,
                            "filename" => $fileNameNew,
                            "type" => in_array($fileExt, $allowedImages) ? 'image' : 'document'
                        ]);
                    } else {
                        http_response_code(500);
                        echo json_encode(["success" => false, "message" => "Failed to move uploaded file"]);
                    }
                } else {
                    http_response_code(400);
                    echo json_encode(["success" => false, "message" => "File is too large (max 10MB)"]);
                }
            } else {
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "Error uploading file"]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Invalid file type. Allowed: " . implode(', ', $allowed)]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "No file uploaded"]);
    }
} else {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
}
?>
