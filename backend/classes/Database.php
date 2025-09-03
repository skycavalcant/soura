<?php
class Database {
    private $host = DB_HOST;
    private $db_name = DB_NAME;
    private $username = DB_USER;
    private $password = DB_PASS;
    private $charset = DB_CHARSET;
    private $pdo;

    public function connect() {
        $this->pdo = null;
        
        try {
            $dsn = "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=" . $this->charset;
            
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
            ];
            
            $this->pdo = new PDO($dsn, $this->username, $this->password, $options);
            
        } catch(PDOException $e) {
            error_log("Erro de conexão com banco: " . $e->getMessage());
            throw new Exception("Falha na conexão com o banco de dados");
        }
        
        return $this->pdo;
    }

    public function testConnection() {
        try {
            $pdo = $this->connect();
            return $pdo !== null;
        } catch (Exception $e) {
            return false;
        }
    }
}
?>