<?php

// Detectar ambiente baseado no host
$isDevelopment = isset($_SERVER['HTTP_HOST']) && 
    (strpos($_SERVER['HTTP_HOST'], 'localhost') !== false || 
     strpos($_SERVER['HTTP_HOST'], '127.0.0.1') !== false);

if ($isDevelopment) {
    // Desenvolvimento local
    header('Access-Control-Allow-Origin: http://localhost:3000');
} else {
    // Produção - sempre permitir o Vercel
    header('Access-Control-Allow-Origin: https://soura-five.vercel.app');
}

// Headers necessários
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=utf-8');

// Responder a preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>