<?php
require_once __DIR__ . '/../config/database.php';

class Database {
    private $conn;

    public function connect() {
        return $this->getConnection();
    }

    public function getConnection() {
        $this->conn = null;
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";port=" . DB_PORT . ";charset=" . DB_CHARSET;
            $this->conn = new PDO($dsn, DB_USER, DB_PASS);
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
                // Testar com uma query simples
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
