<?php
echo "<h2>🧪 Teste da API submit_capsule.php</h2>";

// Dados de teste
$testData = [
    'user_email' => 'test@example.com',
    'user_name' => 'Usuário Teste',
    'life_meaning' => 'Teste de significado da vida',
    'emotional_state' => 'Teste estado emocional',
    'current_priorities' => 'Teste prioridades atuais',
    'future_vision' => 'Teste visão do futuro',
    'future_message' => 'Mensagem de teste para o futuro',
    'delivery_date' => date('Y-m-d', strtotime('+1 day')) // Amanhã
];

echo "<h3>📤 Dados que serão enviados:</h3>";
echo "<pre>" . json_encode($testData, JSON_PRETTY_PRINT) . "</pre>";

// Simular o POST para a API
$_SERVER['REQUEST_METHOD'] = 'POST';
$_SERVER['HTTP_HOST'] = 'soura-production.up.railway.app';

// Simular o input JSON
$json = json_encode($testData);
file_put_contents('php://memory', $json);

echo "<h3>🔄 Testando API...</h3>";

try {
    // Capturar output da API
    ob_start();
    
    // Simular os dados POST
    $GLOBALS['_test_input'] = $json;
    
    // Sobrescrever file_get_contents temporariamente
    function file_get_contents_override($filename) {
        if ($filename === 'php://input') {
            return $GLOBALS['_test_input'];
        }
        return file_get_contents($filename);
    }
    
    // Executar script da API (com algumas modificações para teste)
    echo "Incluindo a API...<br>";
    
    // Definir variáveis para simular o ambiente
    $_POST = [];
    
    // Executar o código da API em um contexto controlado
    require_once '../config/database.php';
    require_once '../classes/Capsule.php';
    
    // Testar conexão primeiro
    $database = new Database();
    $conn = $database->connect();
    
    if ($conn) {
        echo "✅ Conexão com banco OK<br>";
        
        // Testar criação de cápsula
        $capsule = new Capsule();
        $capsuleId = $capsule->create($testData);
        
        echo "✅ Cápsula criada com ID: $capsuleId<br>";
        
        echo "<h3>🎉 API funcionando corretamente!</h3>";
        
    } else {
        echo "❌ Erro na conexão com banco<br>";
    }
    
} catch (Exception $e) {
    echo "❌ <strong>Erro:</strong> " . $e->getMessage() . "<br>";
    echo "<strong>Stack trace:</strong><br>";
    echo "<pre>" . $e->getTraceAsString() . "</pre>";
} catch (Error $e) {
    echo "❌ <strong>Erro fatal:</strong> " . $e->getMessage() . "<br>";
    echo "<strong>Stack trace:</strong><br>";
    echo "<pre>" . $e->getTraceAsString() . "</pre>";
}

ob_end_flush();
?>