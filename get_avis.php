<?php
// ===========================
// PLYNT — get_avis.php
// Récupère les avis depuis la BDD et les affiche
// ===========================
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/config.php';

try {
    $pdo = getDB();
    $stmt = $pdo->query(
        'SELECT id, nom, note, produit, commentaire, date_avis
         FROM avis
         ORDER BY date_avis DESC
         LIMIT 20'
    );
    $avis = $stmt->fetchAll();
    echo json_encode(['success' => true, 'avis' => $avis]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>