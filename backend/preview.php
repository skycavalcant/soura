<?php
require_once 'EmailScheduler.php'; // ajuste o caminho se necessário

// Simula dados para ver como o e-mail vai ficar
$capsuleData = [
    'user_name' => 'Kaysa',
    'user_email' => 'teste@exemplo.com',
    'delivery_date' => '2025-09-10',
    'created_at' => '2025-08-01 15:30:00',
    'life_meaning' => "A vida é feita de conexões e aprendizados.",
    'emotional_state' => "Animada e confiante!",
    'current_priorities' => "Estudos, projetos e saúde.",
    'future_vision' => "Construir algo que ajude muitas pessoas.",
    'future_message' => "Continue acreditando em você. O futuro é brilhante! 🚀"
];

// Cria instância mas sem enviar email
$emailScheduler = new EmailScheduler();
$template = (new ReflectionClass($emailScheduler))
    ->getMethod('generateEmailTemplate')
    ->invoke($emailScheduler, $capsuleData);

// Mostra no navegador
echo $template;
