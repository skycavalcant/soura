<?php
// Debug básico - sem dependências
echo "<h2>🔧 Debug do Servidor Railway</h2>";

echo "<h3>📋 Informações do PHP:</h3>";
echo "• Versão PHP: " . PHP_VERSION . "<br>";
echo "• Sistema: " . PHP_OS . "<br>";
echo "• Servidor: " . ($_SERVER['SERVER_SOFTWARE'] ?? 'N/A') . "<br>";

echo "<h3>🌍 Variáveis de Ambiente:</h3>";
$envVars = [
    'RAILWAY_PRIVATE_DOMAIN',
    'MYSQLHOST', 
    'MYSQLPORT',
    'MYSQLUSER',
    'MYSQLDATABASE',
    'MYSQL_ROOT_PASSWORD'
];

foreach ($envVars as $var) {
    $value = $_ENV[$var] ?? getenv($var) ?? 'NÃO DEFINIDO';
    if ($var === 'MYSQL_ROOT_PASSWORD' && $value !== 'NÃO DEFINIDO') {
        $value = '***DEFINIDO***';
    }
    echo "• $var: $value<br>";
}

echo "<h3>📁 Estrutura de Arquivos:</h3>";
$files = [
    '../config/database.php',
    '../classes/Database.php',
    '../classes/Capsule.php'
];

foreach ($files as $file) {
    if (file_exists(__DIR__ . '/' . $file)) {
        echo "✅ $file existe<br>";
    } else {
        echo "❌ $file NÃO encontrado<br>";
    }
}

echo "<h3>🔗 Teste de Conexão Básico:</h3>";
try {
    // Tentar incluir arquivo de configuração
    if (file_exists(__DIR__ . '/../config/database.php')) {
        include_once __DIR__ . '/../config/database.php';
        echo "✅ Arquivo database.php incluído<br>";
        
        // Mostrar constantes definidas
        if (defined('DB_HOST')) {
            echo "• DB_HOST: " . DB_HOST . "<br>";
            echo "• DB_NAME: " . DB_NAME . "<br>";  
            echo "• DB_USER: " . DB_USER . "<br>";
            echo "• DB_PORT: " . DB_PORT . "<br>";
        } else {
            echo "❌ Constantes de banco não definidas<br>";
        }
        
    } else {
        echo "❌ Arquivo database.php não encontrado<br>";
    }
    
} catch (Exception $e) {
    echo "❌ Erro: " . $e->getMessage() . "<br>";
} catch (Error $e) {
    echo "❌ Erro fatal: " . $e->getMessage() . "<br>";
}

echo "<h3>📝 Informações do Servidor:</h3>";
echo "• Document Root: " . ($_SERVER['DOCUMENT_ROOT'] ?? 'N/A') . "<br>";
echo "• Script Name: " . ($_SERVER['SCRIPT_NAME'] ?? 'N/A') . "<br>";
echo "• Current Dir: " . __DIR__ . "<br>";
?>