-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS soura_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE soura_db;

-- Tabela principal das cápsulas
CREATE TABLE capsules (
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
    
    -- Índices para performance
    INDEX idx_delivery_date (delivery_date),
    INDEX idx_status (status),
    INDEX idx_email (user_email),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tabela de logs 
CREATE TABLE activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    capsule_id INT,
    action VARCHAR(50) NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (capsule_id) REFERENCES capsules(id) ON DELETE CASCADE,
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Inserir dados de exemplo 
INSERT INTO capsules (user_email, user_name, life_meaning, delivery_date) 
VALUES ('teste@exemplo.com', 'Usuário Teste', 'Viver com propósito e ajudar outros', '2024-12-25');