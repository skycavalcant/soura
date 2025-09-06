<?php
require_once __DIR__ . '/classes/Database.php';

echo "<h2>🔧 Teste de Conexão com o Banco de Dados</h2>";

try {
    $database = new Database();
    $conn = $database->connect();
    
    if ($conn) {
        echo "✅ <strong>Conexão estabelecida com sucesso!</strong><br>";
        echo "📊 <strong>Informações da conexão:</strong><br>";
        
        // Mostrar configurações (sem senhas)
        echo "• Host: " . DB_HOST . "<br>";
        echo "• Database: " . DB_NAME . "<br>";
        echo "• User: " . DB_USER . "<br>";
        echo "• Port: " . DB_PORT . "<br>";
        
        // Testar uma query simples
        $stmt = $conn->query("SELECT VERSION() as version");
        $version = $stmt->fetch(PDO::FETCH_ASSOC);
        echo "• MySQL Version: " . $version['version'] . "<br>";
        
        echo "<br>🎉 <strong>Banco configurado e funcionando!</strong>";
        
    } else {
        echo "❌ <strong>Falha na conexão</strong>";
    }
    
} catch (Exception $e) {
    echo "❌ <strong>Erro:</strong> " . $e->getMessage();
}
?>