<?php
include_once '../config/db.php';

$data = json_decode(file_get_contents("php://input"));

if(isset($data->name) && isset($data->email) && isset($data->password)) {
    // Check if email already exists
    $check_query = "SELECT id FROM users WHERE email = :email";
    $check_stmt = $pdo->prepare($check_query);
    $check_stmt->bindParam(':email', $data->email);
    $check_stmt->execute();

    if($check_stmt->rowCount() > 0) {
        http_response_code(400);
        echo json_encode(["message" => "Email already exists."]);
    } else {
        $query = "INSERT INTO users (name, email, password_hash, class_roll, section, class_year, institution, address, mobile) 
                  VALUES (:name, :email, :password, :class_roll, :section, :class_year, :institution, :address, :mobile)";
        $stmt = $pdo->prepare($query);

        $stmt->bindParam(':name', $data->name);
        $stmt->bindParam(':email', $data->email);
        $password_hash = password_hash($data->password, PASSWORD_BCRYPT);
        $stmt->bindParam(':password', $password_hash);
        
        // New Fields (with defaults if missing)
        $roll = $data->class_roll ?? '';
        $section = $data->section ?? '';
        $year = $data->class_year ?? '';
        $inst = $data->institution ?? 'BAF Shaheen College Kurmitola';
        $addr = $data->address ?? '';
        $mobile = $data->mobile ?? '';

        $stmt->bindParam(':class_roll', $roll);
        $stmt->bindParam(':section', $section);
        $stmt->bindParam(':class_year', $year);
        $stmt->bindParam(':institution', $inst);
        $stmt->bindParam(':address', $addr);
        $stmt->bindParam(':mobile', $mobile);

        if($stmt->execute()) {
            http_response_code(201);
            echo json_encode(["message" => "User registered successfully."]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Unable to register user."]);
        }
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data."]);
}
?>
