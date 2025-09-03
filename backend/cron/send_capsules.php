<?php
require_once '../config/database.php';
require_once '../classes/Capsule.php';
require_once '../classes/EmailScheduler.php';

function logCron($message) {
    $timestamp = date('Y-m-d H:i:s');
    error_log("[$timestamp] CRON: $message");
}

try {
    logCron("Iniciando verificação de cápsulas");
    
    $capsule = new Capsule();
    $emailScheduler = new EmailScheduler();
    
    $today = date('Y-m-d');
    $pendingCapsules = $capsule->getPendingCapsules($today);
    
    logCron("Encontradas " . count($pendingCapsules) . " cápsulas para envio");
    
    $successCount = 0;
    $failCount = 0;
    
    foreach ($pendingCapsules as $capsuleData) {
        try {
            logCron("Processando cápsula ID: " . $capsuleData['id']);
            
            $emailSent = $emailScheduler->sendCapsule($capsuleData);
            
            if ($emailSent) {
                $capsule->updateStatus($capsuleData['id'], 'sent');
                $successCount++;
                logCron("✓ Cápsula {$capsuleData['id']} enviada para {$capsuleData['user_email']}");
            } else {
                $capsule->updateStatus($capsuleData['id'], 'failed');
                $failCount++;
                logCron("✗ Falha ao enviar cápsula {$capsuleData['id']} para {$capsuleData['user_email']}");
            }
            
        } catch (Exception $e) {
            $capsule->updateStatus($capsuleData['id'], 'failed');
            $failCount++;
            logCron("✗ Erro ao processar cápsula {$capsuleData['id']}: " . $e->getMessage());
        }
        
        sleep(1);
    }
    
    logCron("Processamento concluído: {$successCount} enviadas, {$failCount} falharam");
    
    if ($failCount > 0) {
        logCron("⚠️ ATENÇÃO: {$failCount} cápsulas falharam no envio - verificar logs");
    }
    
} catch (Exception $e) {
    logCron("💥 ERRO CRÍTICO no processamento de cápsulas: " . $e->getMessage());
    logCron("Stack trace: " . $e->getTraceAsString());
}

logCron("Finalizado");
?>