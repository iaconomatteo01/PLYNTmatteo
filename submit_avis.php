<?php
// ===========================
// PLYNT — submit_avis.php
// Reçoit le formulaire et insère en BDD
// ===========================
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
    exit;
}

$nom         = trim($_POST['nom']         ?? '');
$email       = trim($_POST['email']       ?? '');
$note        = intval($_POST['note']      ?? 0);
$produit     = trim($_POST['produit']     ?? '');
$commentaire = trim($_POST['commentaire'] ?? '');

$errors = [];

if (strlen($nom) < 2) {
    $errors[] = 'Prénom invalide';
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Email invalide';
}
if ($note < 1 || $note > 5) {
    $errors[] = 'Note invalide (1 à 5)';
}
if (empty($produit)) {
    $errors[] = 'Produit manquant';
}
if (strlen($commentaire) < 10) {
    $errors[] = 'Commentaire trop court (min. 10 caractères)';
}

if (!empty($errors)) {
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

try {
    $pdo = getDB();
    $stmt = $pdo->prepare(
        'INSERT INTO avis (nom, email, note, produit, commentaire)
         VALUES (:nom, :email, :note, :produit, :commentaire)'
    );
    $stmt->execute([
        ':nom'         => $nom,
        ':email'       => $email,
        ':note'        => $note,
        ':produit'     => $produit,
        ':commentaire' => $commentaire,
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Avis enregistré avec succès !',
        'id'      => $pdo->lastInsertId()
    ]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>