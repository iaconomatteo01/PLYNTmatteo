<?php
define('DB_HOST', 'localhost');
define('DB_NAME', 'ebffxjtetw_plynt');
define('DB_USER', 'ebffxjtetw_matteo');
define('DB_PASS', 'Matteo1301!');
define('DB_CHARSET', 'utf8mb4');

function getDB() {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ];
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Erreur de connexion BDD']);
            exit;
        }
    }
    return $pdo;
}
?>