<?php
echo "<h2>Debug da Conexão MySQL</h2>";

try {
    $host = getenv('DB_HOST');
    $port = getenv('DB_PORT');
    $dbname = getenv('DB_DATABASE');
    $username = getenv('DB_USERNAME');
    $password = getenv('DB_PASSWORD');
    
    echo "<p>Host: $host</p>";
    echo "<p>Port: $port</p>";
    echo "<p>Database: $dbname</p>";
    echo "<p>Username: $username</p>";
    echo "<p>Password: " . (strlen($password) > 0 ? "SET (" . strlen($password) . " chars)" : "NOT SET") . "</p>";
    
    echo "<hr>";
    
    $dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset=utf8mb4";
    echo "<p>DSN: $dsn</p>";
    
    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    
    echo "<p style='color: green;'>✅ SUCESSO! Conexão estabelecida!</p>";
    
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo "<p>Tabelas encontradas: " . count($tables) . "</p>";
    
} catch (PDOException $e) {
    echo "<p style='color: red;'>❌ ERRO PDO:</p>";
    echo "<p>Mensagem: " . $e->getMessage() . "</p>";
    echo "<p>Código: " . $e->getCode() . "</p>";
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ ERRO GERAL:</p>";
    echo "<p>Mensagem: " . $e->getMessage() . "</p>";
}
?>
