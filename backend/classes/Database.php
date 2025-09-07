<?php
class Database {
    private $conn;
    
    public function connect() {
        return $this->getConnection();
    }
    
    public function getConnection() {
        $this->conn = null;
        
        try {
            // Usar variáveis de ambiente do Railway
            $host = getenv('DB_HOST');
            $dbname = getenv('DB_DATABASE');
            $port = getenv('DB_PORT');
            $username = getenv('DB_USERNAME');
            $password = getenv('DB_PASSWORD');
            $charset = 'utf8mb4';
            
            $dsn = "mysql:host={$host};dbname={$dbname};port={$port};charset={$charset}";
            $this->conn = new PDO($dsn, $username, $password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
        } catch (PDOException $e) {
            error_log("❌ Erro de conexão: " . $e->getMessage());
            die("Erro ao conectar ao banco de dados.");
        }
        
        return $this->conn;
    }
    
    public function testConnection() {
        try {
            $connection = $this->getConnection();
            if ($connection) {
                $stmt = $connection->query("SELECT 1");
                return $stmt !== false;
            }
            return false;
        } catch (Exception $e) {
            error_log("❌ Teste de conexão falhou: " . $e->getMessage());
            return false;
        }
    }
}
