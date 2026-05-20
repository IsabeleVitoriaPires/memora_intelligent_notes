<?php

require_once '/var/www/html/connection.php';

class NoteController {

    private PDO $pdo;

    public function __construct() {
        $this->pdo = getConnection();
    }
    
    public function list() {
        $stmt = $this->pdo->query("SELECT * FROM NOTES ORDER BY CREATED_AT DESC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function findById(int $id) {
        $stmt = $this->pdo->prepare("SELECT * FROM NOTES WHERE ID = :id");
        $stmt->execute([":id" => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create(array $data): array {

        if(empty($data['title']) || empty($data['content'])) {
            http_response_code(400);
            return ['erro' => 'title e content são obrigatórios'];
        }

        $stmt = $this->pdo->prepare("INSERT INTO NOTES (TITLE, CONTENT, TAGS) VALUES (:title, :content, :tags)");
        $stmt->execute([
            ':title' => $data['title'],
            ':content' => $data['content'],
            ':tags' => is_array($data['tags']) ? '{' . implode(',', $data['tags']) . '}' : $data['tags']
        ]);
        http_response_code(201);
        return ['id' => $this->pdo->lastInsertId(), 'message' => 'Nota criada'];
    }
    
    public function update(int $id, array $data){
        $stmt = $this->pdo->prepare("UPDATE NOTES SET TITLE = :title, CONTENT = :content, TAGS = :tags WHERE ID = :id");
        $stmt->execute([
            ':id' => $id,
            ':title' => $data['title'],
            ':content' => $data['content'],
            ':tags' => is_array($data['tags']) ? '{' . implode(',', $data['tags']) . '}' : $data['tags']
        ]);
        return $stmt->rowCount();
    }

    public function delete(int $id){
        $stmt = $this->pdo->prepare("DELETE FROM NOTES WHERE ID = :id");
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount();
    }

}