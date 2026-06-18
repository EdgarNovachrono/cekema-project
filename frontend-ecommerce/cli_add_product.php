<?php
// cli_add_product.php

// On simule un environnement minimal
require_once __DIR__ . '/config.php';

// Données du produit à ajouter (Exemple)
$vendeur_id = 1; // ID d'un vendeur existant dans votre BDD
$nom = "Produit Test CLI";
$description = "Ajouté depuis l'invite de commandes";
$prix_unitaire = 2500;
$stock = 10;
$adresse = "Douala, Cameroun";
$image_principale = "products/default.png"; // Clé MinIO par défaut
$statut = "actif";

try {
    $sql = "INSERT INTO produits (vendeur_id, nom, description, prix_unitaire, stock, adresse, image_principale, statut) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            
    $stmt = $pdo->prepare($sql);
    $success = $stmt->execute([
        $vendeur_id,
        $nom,
        $description,
        $prix_unitaire,
        $stock,
        $adresse,
        $image_principale,
        $statut
    ]);

    if ($success) {
        echo "\n[SUCCÈS] Le produit '$nom' a bien été ajouté via la CMD !\n";
    } else {
        echo "\n[ERREUR] Impossible d'ajouter le produit.\n";
    }
} catch (PDOException $e) {
    echo "\n[ERREUR BDD] : " . $e->getMessage() . "\n";
}