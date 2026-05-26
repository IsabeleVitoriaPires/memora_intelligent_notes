<?php

require_once '/var/www/html/connection.php';
require_once '/var/www/html/services/AIService.php';

class ChatController {

    private PDO $pdo;

    public function __construct(){

        $this->pdo = getConnection();

    }

    public function getHistory(){
        $stmt = $this->pdo->query("SELECT * FROM CONVERSATIONS ORDER BY CREATED_AT ASC");
        return $stmt->fetchAll();
    }

    public function sendMessage(array $data){

        $words = array_filter(explode(' ', $data['message']), fn($w) => strlen($w) > 3);
        $words = array_slice($words, 0, 5);
        $words = array_filter(array_map(fn($w) => preg_replace('/[^a-zA-Z0-9À-ÿ]/', '', $w), $words));

        $conditions = array_map(fn($w) => "N.TITLE ILIKE '%{$w}%' OR N.CONTENT ILIKE '%{$w}%' OR C.NAME ILIKE '%{$w}%'", $words);
        $where = !empty($conditions) ? 'WHERE ' . implode(' OR ', $conditions) : '';

        $notes = $this->pdo->query("SELECT N.TITLE, N.CONTENT FROM NOTES N LEFT JOIN CATEGORIES C ON C.ID = N.CATEGORY_ID {$where} LIMIT 5")->fetchAll();

        if (empty($notes)) {
            $notes = $this->pdo->query(
                "SELECT N.TITLE, N.CONTENT FROM NOTES N ORDER BY N.CREATED_AT DESC LIMIT 5"
            )->fetchAll();
        }

        if (empty($notes)) {
            $context = "Você é um assistente pessoal. O usuário não possui notas cadastradas no momento. Responda apenas com base no que ele perguntar diretamente.";
        } else {
            $context = "Você é um assistente pessoal. As notas ATUAIS do usuário são APENAS as listadas abaixo. Ignore qualquer referência a notas que não estejam nessa lista, mesmo que apareçam no histórico da conversa:\n";
            foreach ($notes as $note){
                $context .= "- {$note['title']}: {$note['content']}\n";
            }
        }

        $history = $this->pdo->query("SELECT USER_MESSAGE, AI_RESPONSE FROM CONVERSATIONS ORDER BY CREATED_AT ASC LIMIT 5")->fetchAll();

        $messages = [['role' => 'system', 'content' => $context]];
        
        foreach ($history as $conv){
            $messages[] = ['role' => 'user', 'content' => $conv['user_message']];
            $messages[] = ['role' => 'assistant', 'content' => $conv['ai_response']];
        }

        $messages[] = ['role' => 'user', 'content' => $data['message']];

        $ai = new AIService();
        try{
        $response = $ai->ask($messages);
        } catch (\Exception $e){
            http_response_code(502);
            return ['error' => 'Falha ao comunicar com a IA'];
        };

        $stmt = $this->pdo->prepare("INSERT INTO CONVERSATIONS (USER_MESSAGE, AI_RESPONSE) VALUES (:user_message, :ai_response)");
        $stmt->execute([':user_message' => $data['message'], ':ai_response' => $response]);

        return $response;
    }

}