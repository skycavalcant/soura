<?php
require_once __DIR__ . '/classes/Database.php';

echo "<h2>🗄️ Setup do Banco de Dados</h2>";

try {
    $database = new Database();
    $conn = $database->connect();
    
    echo "✅ Conexão estabelecida<br><br>";
    
    // SQL para criar a tabela de cápsulas se não existir
    $createTableSQL = "
    CREATE TABLE IF NOT EXISTS capsules (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sender_name VARCHAR(100) NOT NULL,
        sender_email VARCHAR(150) NOT NULL,
        recipient_name VARCHAR(100) NOT NULL,
        recipient_email VARCHAR(150) NOT NULL,
        message TEXT NOT NULL,
        delivery_date DATE NOT NULL,
        status ENUM('pending', 'sent', 'failed') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        sent_at TIMESTAMP NULL,
        INDEX idx_delivery_date (delivery_date),
        INDEX idx_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ";
    
    $conn->exec($createTableSQL);
    echo "✅ Tabela 'capsules' criada/verificada<br>";
    
    // Verificar se a tabela foi criada
    $stmt = $conn->query("DESCRIBE capsules");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "<br>📋 <strong>Estrutura da tabela 'capsules':</strong><br>";
    echo "<table border='1' style='border-collapse: collapse; margin-top: 10px;'>";
    echo "<tr><th>Campo</th><th>Tipo</th><th>Null</th><th>Key</th><th>Default</th></tr>";
    
    foreach ($columns as $column) {
        echo "<tr>";
        echo "<td>" . $column['Field'] . "</td>";
        echo "<td>" . $column['Type'] . "</td>";
        echo "<td>" . $column['Null'] . "</td>";
        echo "<td>" . $column['Key'] . "</td>";
        echo "<td>" . $column['Default'] . "</td>";
        echo "</tr>";
    }
    echo "</table>";
    
    // Contar registros
    $stmt = $conn->query("SELECT COUNT(*) as total FROM capsules");
    $count = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "<br>📊 <strong>Total de cápsulas:</strong> " . $count['total'] . "<br>";
    
    echo "<br>🎉 <strong>Setup do banco concluído com sucesso!</strong>";
    
} catch (Exception $e) {
    echo "❌ <strong>Erro:</strong> " . $e->getMessage();
}
?>