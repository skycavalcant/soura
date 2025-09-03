<?php
require_once '../config/database.php';
require_once 'Database.php';

class Capsule {
    private $pdo;
    
    public function __construct() {
        $database = new Database();
        $this->pdo = $database->connect();
    }
    
    public function create($data) {
        $query = "INSERT INTO capsules 
                  (user_email, user_name, life_meaning, emotional_state, 
                   current_priorities, future_vision, future_message,
                   future_message_2, future_message_3, future_message_4,
                   future_message_5, future_message_6, future_message_7,
                   future_message_8, delivery_date) 
                  VALUES 
                  (:user_email, :user_name, :life_meaning, :emotional_state, 
                   :current_priorities, :future_vision, :future_message,
                   :future_message_2, :future_message_3, :future_message_4,
                   :future_message_5, :future_message_6, :future_message_7,
                   :future_message_8, :delivery_date)";
        
        try {
            $stmt = $this->pdo->prepare($query);
            
            $cleanData = [
                'user_email' => filter_var(trim($data['user_email']), FILTER_SANITIZE_EMAIL),
                'user_name' => htmlspecialchars(trim($data['user_name'] ?? ''), ENT_QUOTES, 'UTF-8'),
                'life_meaning' => htmlspecialchars(trim($data['life_meaning'] ?? ''), ENT_QUOTES, 'UTF-8'),
                'emotional_state' => htmlspecialchars(trim($data['emotional_state'] ?? ''), ENT_QUOTES, 'UTF-8'),
                'current_priorities' => htmlspecialchars(trim($data['current_priorities'] ?? ''), ENT_QUOTES, 'UTF-8'),
                'future_vision' => htmlspecialchars(trim($data['future_vision'] ?? ''), ENT_QUOTES, 'UTF-8'),
                'future_message' => htmlspecialchars(trim($data['future_message'] ?? ''), ENT_QUOTES, 'UTF-8'),
                'future_message_2' => htmlspecialchars(trim($data['future_message_2'] ?? ''), ENT_QUOTES, 'UTF-8'),
                'future_message_3' => htmlspecialchars(trim($data['future_message_3'] ?? ''), ENT_QUOTES, 'UTF-8'),
                'future_message_4' => htmlspecialchars(trim($data['future_message_4'] ?? ''), ENT_QUOTES, 'UTF-8'),
                'future_message_5' => htmlspecialchars(trim($data['future_message_5'] ?? ''), ENT_QUOTES, 'UTF-8'),
                'future_message_6' => htmlspecialchars(trim($data['future_message_6'] ?? ''), ENT_QUOTES, 'UTF-8'),
                'future_message_7' => htmlspecialchars(trim($data['future_message_7'] ?? ''), ENT_QUOTES, 'UTF-8'),
                'future_message_8' => htmlspecialchars(trim($data['future_message_8'] ?? ''), ENT_QUOTES, 'UTF-8'),
                'delivery_date' => $data['delivery_date']
            ];

            // validar email
            if (!filter_var($cleanData['user_email'], FILTER_VALIDATE_EMAIL)) {
                throw new Exception("Email inválido");
            }

            // validar data
            $deliveryDate = new DateTime($cleanData['delivery_date']);
            $today = new DateTime();
            if ($deliveryDate <= $today) {
                throw new Exception("Data de entrega deve ser no futuro");
            }

            $stmt->execute($cleanData);
            return $this->pdo->lastInsertId();
            
        } catch(PDOException $e) {
            error_log("Erro ao criar cápsula: " . $e->getMessage());
            throw new Exception("Erro ao salvar cápsula: " . $e->getMessage());
        }
    }
    
    public function getPendingCapsules($date = null) {
        $date = $date ?: date('Y-m-d');
        
        $query = "SELECT * FROM capsules 
                  WHERE delivery_date <= :date 
                  AND status = 'pending' 
                  ORDER BY created_at ASC";
                  
        try {
            $stmt = $this->pdo->prepare($query);
            $stmt->execute(['date' => $date]);
            return $stmt->fetchAll();
            
        } catch(PDOException $e) {
            error_log("Erro ao buscar cápsulas: " . $e->getMessage());
            return [];
        }
    }
    
    public function updateStatus($id, $status) {
        $query = "UPDATE capsules 
                  SET status = :status, sent_at = CURRENT_TIMESTAMP 
                  WHERE id = :id";
        
        try {
            $stmt = $this->pdo->prepare($query);
            return $stmt->execute([
                'status' => $status,
                'id' => $id
            ]);
            
        } catch(PDOException $e) {
            error_log("Erro ao atualizar status: " . $e->getMessage());
            return false;
        }
    }

    public function getStats() {
        try {
            $query = "SELECT 
                        COUNT(*) as total,
                        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
                        COUNT(CASE WHEN status = 'sent' THEN 1 END) as sent,
                        COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed
                      FROM capsules";
            
            $stmt = $this->pdo->prepare($query);
            $stmt->execute();
            return $stmt->fetch();
            
        } catch(PDOException $e) {
            error_log("Erro ao buscar estatísticas: " . $e->getMessage());
            return ['total' => 0, 'pending' => 0, 'sent' => 0, 'failed' => 0];
        }
    }
}
?>