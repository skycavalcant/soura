<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require_once '../vendor/autoload.php';
require_once '../config/database.php';

class EmailScheduler {
    private $mailer;
    
    public function __construct() {
        $this->mailer = new PHPMailer(true);
        $this->setupSMTP();
    }
    
    private function setupSMTP() {
        try {
            $this->mailer->isSMTP();
            $this->mailer->Host = SMTP_HOST;
            $this->mailer->SMTPAuth = true;
            $this->mailer->Username = SMTP_USER;
            $this->mailer->Password = SMTP_PASS;
            $this->mailer->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $this->mailer->Port = SMTP_PORT;
            $this->mailer->CharSet = 'UTF-8';
            
        } catch (Exception $e) {
            error_log("Erro ao configurar SMTP: " . $e->getMessage());
            throw new Exception("Falha na configuração do email");
        }
    }
    
    public function sendCapsule($capsuleData) {
        try {
            $this->mailer->setFrom(FROM_EMAIL, FROM_NAME);
            $this->mailer->addAddress($capsuleData['user_email'], $capsuleData['user_name'] ?: 'Usuário');
            
            $this->mailer->isHTML(true);
            $this->mailer->Subject = 'Sua Soura Chegou!';
            
            $emailBody = $this->generateEmailTemplate($capsuleData);
            $this->mailer->Body = $emailBody;
            
            $this->mailer->send();
            return true;
            
        } catch (Exception $e) {
            error_log("Erro ao enviar email: " . $this->mailer->ErrorInfo);
            return false;
        }
    }
    
    private function generateEmailTemplate($data) {
        $deliveryDate = date('d/m/Y', strtotime($data['delivery_date']));
        $createdDate = date('d/m/Y H:i', strtotime($data['created_at']));
        
        return "
        <!DOCTYPE html>
        <html lang='pt-BR'>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>Sua Soura Chegou!</title>
            <style>
                body { 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    margin: 0; 
                    padding: 20px; 
                    background: linear-gradient(135deg, #BFB584, #0B3140);
                    min-height: 100vh;
                }
                .container { 
                    max-width: 600px; 
                    margin: 0 auto; 
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(20px);
                    border-radius: 8px; 
                    overflow: hidden; 
                    box-shadow: 0 25px 50px rgba(0,0,0,0.25);
                    border: 1px solid rgba(255, 255, 255, 0.7);
                }
                .header { 
                    background: linear-gradient(135deg, #0B3140, #40131B); 
                    color: white; 
                    padding: 40px 30px; 
                    text-align: center; 
                }
                .content { 
                    padding: 40px 30px; 
                    line-height: 1.6;
                }
                .question-block { 
                    margin: 25px 0; 
                    padding: 20px; 
                    background: #f8f6f4; 
                    border-radius: 12px; 
                    border-left: 4px solid #fbbf24; 
                }
                .question-title { 
                    font-weight: 600; 
                    color: #92400e; 
                    margin-bottom: 8px; 
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                }
                .question-text {
                    font-weight: 200;
                    color: #1c1917;
                    font-size: 16px;
                    margin-bottom: 12px;
                    line-height: 1.5;
                }
                .answer { 
                    color: #374151; 
                    line-height: 1.5; 
                    font-weight: 300;
                }
                .footer { 
                    background: linear-gradient(135deg, #0B3140, #40131B); 
                    color: white; 
                    text-align: center; 
                    padding: 30px 20px; 
                    font-size: 14px; 
                }
                .date-info {
                    background: rgba(255,255,255,0.1);
                    color: rgba(255,255,255,0.8);
                    padding: 15px;
                    border-radius: 8px;
                    margin: 20px 0;
                    text-align: center;
                    font-size: 14px;
                }
                .soura-title {
                    font-size: 42px;
                    font-weight: 200;
                    letter-spacing: 0.3em;
                    margin: 0 0 12px 0;
                }
                .title-divider {
                    width: 40px;
                    height: 1px;
                    background-color: #fbbf24;
                    margin: 0 auto 20px;
                }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1 class='soura-title'>SOURA</h1>
                    <div class='title-divider'></div>
                    <div class='date-info'>
                        Criada em {$createdDate} • Entregue em {$deliveryDate}
                    </div>
                </div>
                
                <div class='content'>
                    <p style='font-size: 18px; color: #374151; margin-bottom: 30px; font-weight: 300;'>
                        Olá" . ($data['user_name'] ? ', ' . htmlspecialchars($data['user_name']) : '') . "! 
                    </p>
                    
                    <p style='margin-bottom: 30px; color: #6b7280; font-weight: 300; line-height: 1.6;'>
                        Sua cápsula do tempo finalmente chegou! Estas são as reflexões que você guardou 
                        para este momento especial:
                    </p>";

        if (!empty($data['life_meaning'])) {
            $return .= "
                    <div class='question-block'>
                        <div class='question-title'>SOBRE VOCÊ</div>
                        <div class='question-text'>Qual parte de si você gostaria que os outros enxergassem primeiro?</div>
                        <div class='answer'>" . nl2br(htmlspecialchars($data['life_meaning'])) . "</div>
                    </div>";
        }

        if (!empty($data['emotional_state'])) {
            $return .= "
                    <div class='question-block'>
                        <div class='question-title'>PERSONALIDADE</div>
                        <div class='question-text'>O que acha que mais faz parte da sua personalidade das opções abaixo?</div>
                        <div class='answer'>" . htmlspecialchars($data['emotional_state']) . "</div>
                    </div>";
        }

        if (!empty($data['current_priorities'])) {
            $return .= "
                    <div class='question-block'>
                        <div class='question-title'>SOBRE ALGO QUE DOEU</div>
                        <div class='question-text'>Se pudesse apagar uma única frase que já ouviu, qual seria?</div>
                        <div class='answer'>" . nl2br(htmlspecialchars($data['current_priorities'])) . "</div>
                    </div>";
        }

        if (!empty($data['future_vision'])) {
            $return .= "
                    <div class='question-block'>
                        <div class='question-title'>E SE...?</div>
                        <div class='question-text'>Qual é a decisão que você nunca tomou, mas ainda pensa como seria se tivesse tomado?</div>
                        <div class='answer'>" . nl2br(htmlspecialchars($data['future_vision'])) . "</div>
                    </div>";
        }

        if (!empty($data['future_message'])) {
            $return .= "
                    <div class='question-block'>
                        <div class='question-title'>ALGUÉM ESPECIAL</div>
                        <div class='question-text'>Qual é a pergunta que você gostaria de fazer a alguém que já se foi?</div>
                        <div class='answer'>" . nl2br(htmlspecialchars($data['future_message'])) . "</div>
                    </div>";
        }

        if (!empty($data['future_message_2'])) {
            $return .= "
                    <div class='question-block'>
                        <div class='question-title'>PROMESSAS...</div>
                        <div class='question-text'>Qual foi a promessa que você gostaria que alguém tivesse cumprido com você?</div>
                        <div class='answer'>" . nl2br(htmlspecialchars($data['future_message_2'])) . "</div>
                    </div>";
        }

        if (!empty($data['future_message_3'])) {
            $return .= "
                    <div class='question-block'>
                        <div class='question-title'>SOBRE MEDO...</div>
                        <div class='question-text'>Qual é o medo que você já aprendeu a conviver, mas nunca superou?</div>
                        <div class='answer'>" . nl2br(htmlspecialchars($data['future_message_3'])) . "</div>
                    </div>";
        }

        if (!empty($data['future_message_4'])) {
            $return .= "
                    <div class='question-block'>
                        <div class='question-title'>MEDO...</div>
                        <div class='question-text'>Qual parte de si você tem medo que as pessoas interpretem errado?</div>
                        <div class='answer'>" . nl2br(htmlspecialchars($data['future_message_4'])) . "</div>
                    </div>";
        }

        if (!empty($data['future_message_5'])) {
            $return .= "
                    <div class='question-block'>
                        <div class='question-title'>SOBRE SONHOS...</div>
                        <div class='question-text'>Qual é o sonho que você mantém em segredo porque ele parece \"grande demais\"?</div>
                        <div class='answer'>" . nl2br(htmlspecialchars($data['future_message_5'])) . "</div>
                    </div>";
        }

        if (!empty($data['future_message_6'])) {
            $return .= "
                    <div class='question-block'>
                        <div class='question-title'>REVISITAR...</div>
                        <div class='question-text'>Se sua vida tivesse uma pausa, o que você gostaria de revisitar com calma?</div>
                        <div class='answer'>" . nl2br(htmlspecialchars($data['future_message_6'])) . "</div>
                    </div>";
        }

        if (!empty($data['future_message_7'])) {
            $return .= "
                    <div class='question-block'>
                        <div class='question-title'>SOBRE MOMENTOS DIFÍCEIS...</div>
                        <div class='question-text'>O que você gostaria que tivesse sido dito a você no momento em que mais precisou?</div>
                        <div class='answer'>" . nl2br(htmlspecialchars($data['future_message_7'])) . "</div>
                    </div>";
        }

        if (!empty($data['future_message_8'])) {
            $return .= "
                    <div class='question-block'>
                        <div class='question-title'>ALGO PARA VOCÊ...</div>
                        <div class='question-text'>Diga algo para seu eu do futuro, que você acha que talvez precise ouvir - seja gentil</div>
                        <div class='answer'>" . nl2br(htmlspecialchars($data['future_message_8'])) . "</div>
                    </div>";
        }

        $return .= "
                    <div style='margin-top: 40px; padding: 20px; background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 12px; text-align: center;'>
                        <p style='margin: 0; font-style: italic; color: #92400e; font-size: 16px; font-weight: 300;'>
                            Que bom rever suas reflexões! Esperamos que esta Soura traga boas memórias e inspiração.
                        </p>
                    </div>
                </div>
                
                <div class='footer'>
                    <p style='margin: 0 0 10px 0; font-size: 16px; font-weight: 300;'>Com carinho, sua Soura</p>
                    <p style='margin: 0; opacity: 0.8; font-weight: 300;'>
                        Este email foi enviado automaticamente conforme sua solicitação.
                    </p>
                </div>
            </div>
        </body>
        </html>";

        return $return;
    }
}
?>