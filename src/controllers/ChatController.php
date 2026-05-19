<?php

require_once '/var/www/html/connection.php';
require_once '/var/www/html/services/AIService.php';

class ChatController {

    private PDO $pdo;

    public function __construct(){

        $this->pdo = getConnection();

    }

    public function getHistory(){
        $stmt = $this->pdo->query("SELECT * FROM CONVERSATIONS ORDER BY CREATED_AT DESC");
        return $stmt->fetchAll();
    }

    public function sendMessage(array $data){
        $stmt = $this->pdo->query("SELECT TITLE, CONTENT FROM NOTES");
        $notes = $stmt->fetchAll();

        $context = "Você é um assitente pessoal. As notas do usuário são: \n";
        foreach ($notes as $note){
            $context .= "- {$note['title']}: {$note['content']}\n";
        }

        $ai = new AIService();
        $response = $ai->ask([
            ['role' => 'system', 'content' => $context],
            ['role' => 'user', 'content' => $data['message']]
        ]);

        $stmt = $this->pdo->prepare("INSERT INTO CONVERSATIONS (USER_MESSAGE, AI_RESPONSE) VALUES (:user_message, :ai_response)");
        $stmt->execute([':user_message' => $data['message'], ':ai_response' => $response]);

        return $response;
    }

}