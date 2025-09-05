<?php
// setup.php - Configuração inicial do banco de dados
header('Content-Type: application/json');

require_once 'config/database.php';
require_once 'classes/Database.php';

try {
    echo "🚀 Iniciando configuração do banco de dados...<br><br>";
    
    $database = new Database();
    
    // Testar conexão
    echo "✅ Testando conexão com o banco...<br>";
    if (!$database->testConnection()) {
        throw new Exception("Falha na conexão com o banco de dados");
    }
    echo "✅ Conexão estabelecida com sucesso!<br><br>";
    
    // Inicializar tabelas
    echo "📋 Criando tabelas...<br>";
    if (!$database->initializeTables()) {
        throw new Exception("Falha ao criar tabelas");
    }
    echo "✅ Tabelas criadas/verificadas com sucesso!<br><br>";
    
    // Informações do banco
    echo "📊 <strong>Informações do Banco:</strong><br>";
    echo "Host: " . DB_HOST . "<br>";
    echo "Database: " . DB_NAME . "<br>";
    echo "User: " . DB_USER . "<br>";
    echo "Port: " . DB_PORT . "<br>";
    echo "Charset: " . DB_CHARSET . "<br><br>";
    
    echo "🎉 <strong style='color: green;'>Setup concluído com sucesso!</strong><br>";
    echo "🔗 Agora você pode testar: <a href='api/health.php'>/api/health.php</a><br>";
    
} catch (Exception $e) {
    http_response_code(500);
    echo "❌ <strong style='color: red;'>Erro durante setup:</strong><br>";
    echo $e->getMessage() . "<br><br>";
    
    echo "🔧 <strong>Verificações:</strong><br>";
    echo "1. Variáveis de ambiente configuradas no Railway?<br>";
    echo "2. Serviço MySQL ativo no Railway?<br>";
    echo "3. Permissões de conexão corretas?<br>";
}
?>