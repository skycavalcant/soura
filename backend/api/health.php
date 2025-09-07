<?php
require_once '../config/cors.php';
require_once '../config/database.php';
require_once '../classes/Database.php';
require_once '../classes/Capsule.php';

try {
    $database = new Database();
    $conn = $database->connect();
    
    $capsule = new Capsule();
    $stats = $capsule->getStats();
    
    $stmt = $conn->query("SELECT VERSION() as mysql_version");
    $version = $stmt->fetch();

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'status' => 'healthy',
        'timestamp' => date('Y-m-d H:i:s'),
        'database' => [
            'connected' => true,
            'host' => DB_HOST,
            'name' => DB_NAME,
            'version' => $version['mysql_version']
        ],
        'stats' => $stats,
        'environment' => [
            'is_railway' => isset($_ENV['RAILWAY_PRIVATE_DOMAIN']),
            'php_version' => PHP_VERSION
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'status' => 'unhealthy',
        'message' => $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}
?>