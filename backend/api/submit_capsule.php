<?php
// Headers CORS - PRIMEIRO, antes de qualquer coisa
header("Access-Control-Allow-Origin: https://soura-five.vercel.app");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=utf-8');

// Responder a requests OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Incluir arquivos necessários
require_once '../config/database.php';
require_once '../classes/Capsule.php';

// Função de debug
function logDebug($message, $data = null) {
    $timestamp = date('Y-m-d H:i:s');
    $logMessage = "[$timestamp] $message";
    if ($data) {
        $logMessage .= " - Data: " . json_encode($data);
    }
    error_log($logMessage);
}

try {
    // Verificar método HTTP
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode([
            'success' => false,
            'message' => 'Método não permitido. Use POST.'
        ]);
        exit();
    }

    // Ler dados do request
    $input = file_get_contents('php://input');
    logDebug("Request recebido", ['raw_input' => substr($input, 0, 200)]); // Log apenas primeiros 200 chars
    
    if (empty($input)) {
        throw new Exception('Dados não fornecidos');
    }

    // Decodificar JSON
    $data = json_decode($input, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('JSON inválido: ' . json_last_error_msg());
    }

    logDebug("Dados decodificados", array_keys($data)); // Log apenas as chaves

    // Validações básicas
    if (empty($data['user_email'])) {
        throw new Exception('Email é obrigatório');
    }

    if (!filter_var($data['user_email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Email inválido');
    }

    if (empty($data['delivery_date'])) {
        throw new Exception('Data de entrega é obrigatória');
    }

    // Validar data futura
    $deliveryDate = new DateTime($data['delivery_date']);
    $today = new DateTime();
    $today->setTime(0, 0, 0); // Zerar horas
    
    if ($deliveryDate <= $today) {
        throw new Exception('A data de entrega deve ser no futuro');
    }

    // Preparar dados da cápsula
    $capsuleData = [
        'user_email' => $data['user_email'],
        'user_name' => $data['user_name'] ?? '',
        'life_meaning' => $data['life_meaning'] ?? '',
        'emotional_state' => $data['emotional_state'] ?? '',
        'current_priorities' => $data['current_priorities'] ?? '',
        'future_vision' => $data['future_vision'] ?? '',
        'future_message' => $data['future_message'] ?? '',
        'future_message_2' => $data['future_message_2'] ?? '',
        'future_message_3' => $data['future_message_3'] ?? '',
        'future_message_4' => $data['future_message_4'] ?? '',
        'future_message_5' => $data['future_message_5'] ?? '',
        'future_message_6' => $data['future_message_6'] ?? '',
        'future_message_7' => $data['future_message_7'] ?? '',
        'future_message_8' => $data['future_message_8'] ?? '',
        'delivery_date' => $data['delivery_date']
    ];

    // Criar a cápsula
    $capsule = new Capsule();
    $capsuleId = $capsule->create($capsuleData);

    logDebug("Cápsula criada com sucesso", ['capsule_id' => $capsuleId]);

    // Resposta de sucesso
    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Soura criada com sucesso!',
        'capsule_id' => $capsuleId,
        'delivery_date' => $data['delivery_date']
    ]);

} catch (Exception $e) {
    // Garantir headers CORS mesmo com erro
    header("Access-Control-Allow-Origin: https://soura-five.vercel.app");
    header('Content-Type: application/json; charset=utf-8');
    
    logDebug("Erro ao processar cápsula", [
        'error' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ]);
    
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);

} catch (Error $e) {
    // Capturar erros fatais
    header("Access-Control-Allow-Origin: https://soura-five.vercel.app");
    header('Content-Type: application/json; charset=utf-8');
    
    logDebug("Erro fatal", [
        'error' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ]);
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erro interno do servidor'
    ]);
}
?>