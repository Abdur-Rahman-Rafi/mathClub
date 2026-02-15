<?php
require_once __DIR__ . '/config/db.php';

try {
    // Create alumni_committee table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS alumni_committee (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            role VARCHAR(100) NOT NULL,
            batch VARCHAR(20),
            current_position VARCHAR(255),
            institution VARCHAR(255),
            bio TEXT,
            image_url VARCHAR(255),
            display_order INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");
    echo "Alumni committee table created successfully.\n";

    // Insert sample alumni data
    $alumni = [
        ['Rafsan Jani', 'Ex-President', '2018', 'Software Engineer', 'BUET (CSE)', 'Led the club to national recognition', 'https://placehold.co/200x200?text=Rafsan'],
        ['Nusrat Jahan', 'Ex-General Secretary', '2019', 'Medical Student', 'Dhaka Medical College', 'Organized multiple successful events', 'https://placehold.co/200x200?text=Nusrat'],
        ['Abrar Yasir', 'Ex-Vice President', '2020', 'Business Analyst', 'IBA, DU', 'Pioneered the mentorship program', 'https://placehold.co/200x200?text=Abrar']
    ];

    foreach ($alumni as $idx => $member) {
        $stmt = $pdo->prepare("INSERT INTO alumni_committee (name, role, batch, current_position, institution, bio, image_url, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([...$member, $idx + 1]);
    }
    echo "Sample alumni data inserted.\n";

    echo "\n=== Alumni Committee Setup Complete ===\n";

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
