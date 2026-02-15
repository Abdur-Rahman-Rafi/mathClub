<?php
$host = '127.0.0.1';
$username = 'root';
$password = '';
$dbname = 'math_club_db';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Initial check to see if data exists
    $stmt = $pdo->query("SELECT count(*) FROM events");
    $eventCount = $stmt->fetchColumn();

    if ($eventCount == 0) {
        $pdo->exec("
            INSERT INTO events (title, description, event_date, fee) VALUES
            ('Math Olympiad 2024', 'The biggest intra-college math competition of the year. Join to test your skills!', '2024-05-20', 100.00),
            ('Pi Day Celebration', 'A day filled with fun math games, quizzes, and pie eating!', '2024-03-14', 50.00),
            ('Workshop on Graph Theory', 'Learn the basics of graph theory from expert guest lecturers.', '2024-06-10', 0.00);
        ");
        echo "Inserted Events.\n";
    }

    $stmt = $pdo->query("SELECT count(*) FROM committee");
    $committeeCount = $stmt->fetchColumn();

    if ($committeeCount == 0) {
        $pdo->exec("
            INSERT INTO committee (name, role, bio, display_order) VALUES
            ('Taimur Shahriar', 'President', 'National Math Olympiad Silver Medalist. Loves Number Theory.', 1),
            ('Sadia Islam', 'General Secretary', 'Passionate organizer and geometry enthusiast.', 2),
            ('Rahim Khan', 'Treasurer', 'Expert in combinatorics and financial management of the club.', 3);
        ");
        echo "Inserted Committee Members.\n";
    }

    $stmt = $pdo->query("SELECT count(*) FROM achievements");
    $achievementCount = $stmt->fetchColumn();

    if ($achievementCount == 0) {
        $pdo->exec("
            INSERT INTO achievements (title, description, achievement_date) VALUES
            ('National Champion 2023', 'Our team secured the 1st position in the National High School Math Olympiad.', '2023-12-15'),
            ('Best Club Award', 'Recognized as the most active science club in the Dhaka Cantonment area.', '2023-11-20');
        ");
        echo "Inserted Achievements.\n";
    }

    echo "Database seeded successfully!\n";

} catch (PDOException $e) {
    echo "Error seeding database: " . $e->getMessage() . "\n";
}
?>
