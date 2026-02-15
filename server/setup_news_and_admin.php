<?php
require_once __DIR__ . '/config/db.php';

try {
    // Add news table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS news (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            excerpt VARCHAR(500),
            image_url VARCHAR(255),
            author_id INT,
            status ENUM('draft', 'published') DEFAULT 'draft',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
        )
    ");
    echo "News table created successfully.\n";

    // Create admin user
    $adminEmail = 'admin@bafskmc.edu.bd';
    $adminPassword = password_hash('Admin@123', PASSWORD_BCRYPT);
    $adminName = 'Admin User';

    // Check if admin already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$adminEmail]);
    
    if ($stmt->rowCount() == 0) {
        $pdo->prepare("
            INSERT INTO users (name, email, password_hash, role, institution) 
            VALUES (?, ?, ?, 'admin', 'BAF Shaheen College Kurmitola')
        ")->execute([$adminName, $adminEmail, $adminPassword]);
        echo "Admin user created successfully.\n";
        echo "Email: $adminEmail\n";
        echo "Password: Admin@123\n";
    } else {
        echo "Admin user already exists.\n";
    }

    // Insert sample news
    $sampleNews = [
        [
            'title' => 'BAFSKMC Math Club Registration Now Open!',
            'content' => 'We are excited to announce that registration for the BAFSKMC Math Club is now open for all students. Join us to explore the fascinating world of mathematics through workshops, competitions, and collaborative problem-solving sessions.',
            'excerpt' => 'Registration for BAFSKMC Math Club is now open for all students!',
            'status' => 'published'
        ],
        [
            'title' => 'National Math Olympiad 2024 - May 20',
            'content' => 'Mark your calendars! The National Math Olympiad 2024 will be held on May 20th. Our club is organizing intensive preparation sessions every weekend. All registered members are encouraged to participate.',
            'excerpt' => 'National Math Olympiad 2024 scheduled for May 20. Preparation sessions starting soon!',
            'status' => 'published'
        ],
        [
            'title' => 'Exclusive Workshops and Resources Available',
            'content' => 'Club members now have access to exclusive workshops on advanced mathematics topics, including Number Theory, Combinatorics, and Geometry. Additionally, our resource library has been updated with new problem sets and study materials.',
            'excerpt' => 'Join the club to unlock exclusive resources and workshops!',
            'status' => 'published'
        ]
    ];

    foreach ($sampleNews as $news) {
        $stmt = $pdo->prepare("
            INSERT INTO news (title, content, excerpt, status, author_id) 
            VALUES (?, ?, ?, ?, (SELECT id FROM users WHERE role = 'admin' LIMIT 1))
        ");
        $stmt->execute([$news['title'], $news['content'], $news['excerpt'], $news['status']]);
    }
    echo "Sample news inserted successfully.\n";

    echo "\n=== Setup Complete ===\n";
    echo "Admin Credentials:\n";
    echo "Email: admin@bafskmc.edu.bd\n";
    echo "Password: Admin@123\n";

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
