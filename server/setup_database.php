<?php
$host = '127.0.0.1';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = file_get_contents(__DIR__ . '/../database/schema.sql');

    $pdo->exec($sql);

    echo "Database and tables created successfully!\n";
} catch (PDOException $e) {
    echo "Error creating database: " . $e->getMessage() . "\n";
    // Check if it's a connection issue vs content issue
    if (strpos($e->getMessage(), 'Connection refused') !== false) { 
        echo "Make sure MySQL is running (e.g. XAMPP).\n";
    }
}
?>
