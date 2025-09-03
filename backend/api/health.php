<?php
require_once '../config/cors.php';
require_once '../config/database.php';
require_once '../classes/Database.php';
require_once '../classes/Capsule.php';

try {
    $database = new Database();
    $isConnected = $database->testConnection();
    
    if (!$isConnected) {
        throw new Exception('Falha na conexão com banco de dados');
    }

    $capsule = new Capsule();
    $stats = $capsule->getStats();

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'status' => 'healthy',
        'timestamp' => date('Y-m-d H:i:s'),
        'database' => 'connected',
        'stats' => $stats
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