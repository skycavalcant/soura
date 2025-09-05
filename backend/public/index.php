<?php
header('Content-Type: application/json');
echo json_encode([
    'message' => 'Soura API funcionando!',
    'version' => '1.0.0',
    'status' => 'online'
]);
?>