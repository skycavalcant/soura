<?php
// Carregar variáveis de ambiente se existir arquivo .env
if (file_exists(__DIR__ . '/../../.env')) {
    $lines = file(__DIR__ . '/../../.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
            list($key, $value) = explode('=', $line, 2);
            $_ENV[trim($key)] = trim($value);
        }
    }
}

// Detectar ambiente
$isLocal = !isset($_ENV['RAILWAY_PRIVATE_DOMAIN']) && 
           (php_sapi_name() === 'cli-server' || 
            (isset($_SERVER['HTTP_HOST']) && 
             (strpos($_SERVER['HTTP_HOST'], 'localhost') !== false || 
              strpos($_SERVER['HTTP_HOST'], '127.0.0.1') !== false)));

if ($isLocal) {
    // ===== DESENVOLVIMENTO LOCAL =====
    define('DB_HOST', $_ENV['DB_HOST'] ?? 'localhost');
    define('DB_NAME', $_ENV['DB_NAME'] ?? 'soura_dev');
    define('DB_USER', $_ENV['DB_USER'] ?? 'soura_user');
    define('DB_PASS', $_ENV['DB_PASS'] ?? 'soura_password');
    define('DB_PORT', $_ENV['DB_PORT'] ?? 3306);
    define('DB_CHARSET', 'utf8mb4');
    
    error_log("🟢 Ambiente: DESENVOLVIMENTO LOCAL");
    
} else {
    // ===== PRODUÇÃO RAILWAY =====
    define('DB_HOST', $_ENV['MYSQLHOST'] ?? $_ENV['RAILWAY_PRIVATE_DOMAIN'] ?? 'localhost');
    define('DB_NAME', $_ENV['MYSQL_DATABASE'] ?? $_ENV['MYSQLDATABASE'] ?? 'railway');
    define('DB_USER', $_ENV['MYSQLUSER'] ?? 'root');
    define('DB_PASS', $_ENV['MYSQL_ROOT_PASSWORD'] ?? $_ENV['MYSQLPASSWORD'] ?? '');
    define('DB_PORT', $_ENV['MYSQLPORT'] ?? 3306);
    define('DB_CHARSET', 'utf8mb4');
    
    error_log("🔵 Ambiente: PRODUÇÃO RAILWAY");
}

// Configurações do email usando variáveis de ambiente
define('SMTP_HOST', $_ENV['SMTP_HOST'] ?? 'smtp.gmail.com');
define('SMTP_PORT', $_ENV['SMTP_PORT'] ?? 587);
define('SMTP_USER', $_ENV['SMTP_USER'] ?? '');
define('SMTP_PASS', $_ENV['SMTP_PASS'] ?? '');
define('FROM_EMAIL', $_ENV['FROM_EMAIL'] ?? '');
define('FROM_NAME', $_ENV['FROM_NAME'] ?? 'Soura - Cápsula do Tempo');

// Debug apenas em desenvolvimento
if ($isLocal && isset($_GET['debug']) && $_GET['debug'] == 'db') {
    echo "<h2>🔧 Debug - Configurações do Banco</h2>";
    echo "<strong>Ambiente:</strong> " . ($isLocal ? "Local" : "Railway") . "<br>";
    echo "<strong>DB_HOST:</strong> " . DB_HOST . "<br>";
    echo "<strong>DB_NAME:</strong> " . DB_NAME . "<br>";
    echo "<strong>DB_USER:</strong> " . DB_USER . "<br>";
    echo "<strong>DB_PORT:</strong> " . DB_PORT . "<br>";
    exit;
}
?>