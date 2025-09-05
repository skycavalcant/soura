<?php
// Detectar ambiente
$isLocal = php_sapi_name() === 'cli-server' ||
    (isset($_SERVER['HTTP_HOST']) &&
    (strpos($_SERVER['HTTP_HOST'], 'localhost') !== false ||
    strpos($_SERVER['HTTP_HOST'], '127.0.0.1') !== false));

if ($isLocal) {
    // Desenvolvimento local
    header('Access-Control-Allow-Origin: http://localhost:3000');
} else {
    // Produção do Vercel 
    $allowedOrigins = [
        'https://soura-five.vercel.app', 
        'https://soura-five.vercel.app/', 
    ];
    
    $origin = $_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_HOST'] ?? 'localhost';
    
    // Log para debug
    error_log("Origin recebido: " . $origin);
    error_log("Origens permitidas: " . json_encode($allowedOrigins));
    
    if (in_array($origin, $allowedOrigins)) {
        header('Access-Control-Allow-Origin: ' . $origin);
    } else {
        // para debug
        error_log("Origin não permitido: " . $origin);
    }
}

header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');

// Responder a requests OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Definir content type padrão
header('Content-Type: application/json; charset=utf-8');
?>