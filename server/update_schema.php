<?php
$host = '127.0.0.1';
$username = 'root';
$password = '';
$dbname = 'math_club_db';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Update Users Table (New Fields)
    $userCols = [
        "section VARCHAR(50)", "class_year VARCHAR(50)", 
        "institution VARCHAR(150) DEFAULT 'BAF Shaheen College Kurmitola'", 
        "address TEXT", "mobile VARCHAR(20)"
    ];
    foreach($userCols as $col) {
        try {
            $pdo->exec("ALTER TABLE users ADD COLUMN $col");
            echo "Added column to users.\n";
        } catch (Exception $e) { }
    }

    // Update Payments Table (New Fields)
    $paymentCols = [
        "event_name VARCHAR(255) NOT NULL DEFAULT 'Unknown'", 
        "student_name VARCHAR(100) NOT NULL DEFAULT 'Unknown'", 
        "roll VARCHAR(50) NOT NULL DEFAULT '0'", 
        "membership_id VARCHAR(50)"
    ];
    foreach($paymentCols as $col) {
        try {
            $pdo->exec("ALTER TABLE payments ADD COLUMN $col");
            echo "Added column to payments.\n";
        } catch (Exception $e) { }
    }
    
    // Modify event_id to be nullable in payments
    try {
        $pdo->exec("ALTER TABLE payments MODIFY COLUMN event_id INT NULL");
        echo "Modified event_id to be nullable.\n";
    } catch (Exception $e) { }

    // Create Gallery Table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS gallery (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255),
            image_url VARCHAR(255) NOT NULL,
            category VARCHAR(50) DEFAULT 'General',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");
    echo "Created/Verified Gallery table.\n";

    echo "Database schema updated successfully!\n";

} catch (PDOException $e) {
    echo "Error updating database: " . $e->getMessage() . "\n";
}
?>
