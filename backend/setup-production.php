<?php
/**
 * Setup completo do banco de dados para Railway
 * Acesse via: https://sua-url-railway.com/backend/setup-production.php
 */

header('Content-Type: text/html; charset=utf-8');
header("Access-Control-Allow-Origin: *");

require_once __DIR__ . '/classes/Database.php';

echo "<!DOCTYPE html>";
echo "<html><head><title>Setup Railway - Soura</title>";
echo "<style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
    .success { color: #28a745; }
    .error { color: #dc3545; }
    .info { color: #17a2b8; }
    .warning { color: #ffc107; }
    table { border-collapse: collapse; width: 100%; margin: 20px 0; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
    code { background: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
</style>";
echo "</head><body>";

echo "<h1>🚀 Setup Banco de Dados - Railway</h1>";

try {
    echo "<div class='info'>📋 Iniciando setup do banco de dados...</div><br>";
    
    // Mostrar configurações (sem senha)
    echo "<h2>🔧 Configurações Detectadas</h2>";
    echo "<table>";
    echo "<tr><th>Variável</th><th>Valor</th></tr>";
    echo "<tr><td>DB_HOST</td><td>" . (defined('DB_HOST') ? DB_HOST : 'NÃO DEFINIDO') . "</td></tr>";
    echo "<tr><td>DB_NAME</td><td>" . (defined('DB_NAME') ? DB_NAME : 'NÃO DEFINIDO') . "</td></tr>";
    echo "<tr><td>DB_USER</td><td>" . (defined('DB_USER') ? DB_USER : 'NÃO DEFINIDO') . "</td></tr>";
    echo "<tr><td>DB_PORT</td><td>" . (defined('DB_PORT') ? DB_PORT : 'NÃO DEFINIDO') . "</td></tr>";
    echo "</table>";
    
    // Tentar conectar
    echo "<h2>🔌 Testando Conexão</h2>";
    $database = new Database();
    $conn = $database->connect();
    
    if (!$conn) {
        throw new Exception("Falha na conexão com o banco de dados");
    }
    
    echo "<div class='success'>✅ Conexão estabelecida com sucesso!</div><br>";
    
    // Verificar se as tabelas existem
    echo "<h2>📋 Verificando Tabelas Existentes</h2>";
    
    $stmt = $conn->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    if (empty($tables)) {
        echo "<div class='warning'>⚠️ Nenhuma tabela encontrada. Criando estrutura...</div><br>";
        
        // Criar tabela capsules
        $createCapsules = "
        CREATE TABLE IF NOT EXISTS capsules (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_email VARCHAR(150) NOT NULL,
            user_name VARCHAR(100) DEFAULT '',
            life_meaning TEXT DEFAULT '',
            emotional_state TEXT DEFAULT '',
            current_priorities TEXT DEFAULT '',
            future_vision TEXT DEFAULT '',
            future_message TEXT DEFAULT '',
            future_message_2 TEXT DEFAULT '',
            future_message_3 TEXT DEFAULT '',
            future_message_4 TEXT DEFAULT '',
            future_message_5 TEXT DEFAULT '',
            future_message_6 TEXT DEFAULT '',
            future_message_7 TEXT DEFAULT '',
            future_message_8 TEXT DEFAULT '',
            delivery_date DATE NOT NULL,
            status ENUM('pending', 'sent', 'failed') DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            sent_at TIMESTAMP NULL,
            INDEX idx_delivery_date (delivery_date),
            INDEX idx_status (status),
            INDEX idx_email (user_email),
            INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ";
        
        $conn->exec($createCapsules);
        echo "<div class='success'>✅ Tabela 'capsules' criada com sucesso!</div><br>";
        
        // Criar tabela activity_logs
        $createLogs = "
        CREATE TABLE IF NOT EXISTS activity_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            capsule_id INT,
            action VARCHAR(50) NOT NULL,
            details TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (capsule_id) REFERENCES capsules(id) ON DELETE CASCADE,
            INDEX idx_action (action),
            INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ";
        
        $conn->exec($createLogs);
        echo "<div class='success'>✅ Tabela 'activity_logs' criada com sucesso!</div><br>";
        
    } else {
        echo "<div class='info'>📋 Tabelas existentes:</div>";
        echo "<ul>";
        foreach ($tables as $table) {
            echo "<li>$table</li>";
        }
        echo "</ul>";
    }
    
    // Verificar estrutura da tabela capsules
    echo "<h2>🔍 Estrutura da Tabela 'capsules'</h2>";
    
    try {
        $stmt = $conn->query("DESCRIBE capsules");
        $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo "<table>";
        echo "<tr><th>Campo</th><th>Tipo</th><th>Null</th><th>Key</th><th>Default</th></tr>";
        
        $expectedFields = [
            'user_email', 'user_name', 'life_meaning', 'emotional_state', 
            'current_priorities', 'future_vision', 'future_message',
            'future_message_2', 'future_message_3', 'future_message_4',
            'future_message_5', 'future_message_6', 'future_message_7',
            'future_message_8', 'delivery_date', 'status'
        ];
        
        $existingFields = array_column($columns, 'Field');
        
        foreach ($columns as $column) {
            $fieldName = $column['Field'];
            $isRequired = in_array($fieldName, $expectedFields);
            $rowClass = $isRequired ? "style='background-color: #d4edda;'" : "";
            
            echo "<tr $rowClass>";
            echo "<td>" . $column['Field'] . "</td>";
            echo "<td>" . $column['Type'] . "</td>";
            echo "<td>" . $column['Null'] . "</td>";
            echo "<td>" . $column['Key'] . "</td>";
            echo "<td>" . ($column['Default'] ?? 'NULL') . "</td>";
            echo "</tr>";
        }
        echo "</table>";
        
        // Verificar se todos os campos necessários existem
        $missingFields = array_diff($expectedFields, $existingFields);
        
        if (!empty($missingFields)) {
            echo "<div class='error'>❌ Campos faltando: " . implode(', ', $missingFields) . "</div>";
            
            // Tentar adicionar campos faltando
            foreach ($missingFields as $field) {
                if (strpos($field, 'future_message') === 0 && $field !== 'future_message') {
                    $sql = "ALTER TABLE capsules ADD COLUMN $field TEXT DEFAULT ''";
                    try {
                        $conn->exec($sql);
                        echo "<div class='success'>✅ Campo '$field' adicionado!</div>";
                    } catch (Exception $e) {
                        echo "<div class='error'>❌ Erro ao adicionar '$field': " . $e->getMessage() . "</div>";
                    }
                }
            }
        } else {
            echo "<div class='success'>✅ Todos os campos necessários estão presentes!</div><br>";
        }
        
    } catch (Exception $e) {
        echo "<div class='error'>❌ Erro ao verificar estrutura: " . $e->getMessage() . "</div>";
    }
    
    // Contar registros
    $stmt = $conn->query("SELECT COUNT(*) as total FROM capsules");
    $count = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "<h2>📊 Estatísticas</h2>";
    echo "<p><strong>Total de cápsulas:</strong> " . $count['total'] . "</p>";
    
    // Testar inserção
    echo "<h2>🧪 Teste de Funcionalidade</h2>";
    
    $testData = [
        'user_email' => 'teste@setup.com',
        'user_name' => 'Teste Setup',
        'life_meaning' => 'Teste de setup',
        'delivery_date' => date('Y-m-d', strtotime('+30 days'))
    ];
    
    // Verificar se já existe um registro de teste
    $stmt = $conn->prepare("SELECT id FROM capsules WHERE user_email = ?");
    $stmt->execute([$testData['user_email']]);
    
    if ($stmt->fetch()) {
        echo "<div class='info'>ℹ️ Registro de teste já existe no banco</div>";
    } else {
        // Tentar inserir registro de teste
        $stmt = $conn->prepare("INSERT INTO capsules (user_email, user_name, life_meaning, delivery_date) VALUES (?, ?, ?, ?)");
        
        if ($stmt->execute([$testData['user_email'], $testData['user_name'], $testData['life_meaning'], $testData['delivery_date']])) {
            $testId = $conn->lastInsertId();
            echo "<div class='success'>✅ Registro de teste criado (ID: $testId)</div>";
            
            // Remover registro de teste
            $stmt = $conn->prepare("DELETE FROM capsules WHERE id = ?");
            $stmt->execute([$testId]);
            echo "<div class='info'>🧹 Registro de teste removido</div>";
        } else {
            echo "<div class='error'>❌ Falha ao criar registro de teste</div>";
        }
    }
    
    echo "<br><div class='success'><h2>🎉 Setup concluído com sucesso!</h2></div>";
    echo "<p><strong>Próximos passos:</strong></p>";
    echo "<ul>";
    echo "<li>✅ Banco de dados configurado</li>";
    echo "<li>✅ Tabelas criadas</li>";
    echo "<li>🔗 Teste a API: <code>/backend/api/submit_capsule.php</code></li>";
    echo "<li>🔍 Debug: <code>/backend/api/health.php</code></li>";
    echo "</ul>";
    
} catch (Exception $e) {
    echo "<div class='error'>";
    echo "<h2>❌ Erro durante setup</h2>";
    echo "<p><strong>Erro:</strong> " . $e->getMessage() . "</p>";
    echo "<p><strong>Verificações necessárias:</strong></p>";
    echo "<ul>";
    echo "<li>Variáveis de ambiente configuradas no Railway?</li>";
    echo "<li>Serviço MySQL ativo e acessível?</li>";
    echo "<li>Credenciais corretas?</li>";
    echo "</ul>";
    echo "</div>";
}

echo "</body></html>";
?>