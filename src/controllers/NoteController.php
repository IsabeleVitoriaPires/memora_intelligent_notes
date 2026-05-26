<?php

require_once '/var/www/html/connection.php';
require_once '/var/www/html/services/AIService.php';

class NoteController {

    private PDO $pdo;

    public function __construct() {
        $this->pdo = getConnection();
    }
    
    public function list() {
        $stmt = $this->pdo->query("SELECT N.*, C.NAME AS category_name FROM NOTES N LEFT JOIN CATEGORIES C ON C.ID = N.CATEGORY_ID ORDER BY CREATED_AT DESC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function findById(int $id) {
        $stmt = $this->pdo->prepare("SELECT N.*, C.NAME AS category_name FROM NOTES N LEFT JOIN CATEGORIES C ON C.ID = N.CATEGORY_ID WHERE N.ID = :id");
        $stmt->execute([":id" => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create(array $data): array {

        if(empty($data['title']) || empty($data['content'])) {
            http_response_code(400);
            return ['erro' => 'title e content são obrigatórios'];
        }

        $stmt = $this->pdo->query("SELECT VALUE FROM SETTINGS WHERE KEY = 'auto_classify'");
        $autoClassify = $stmt->fetchColumn() === 'true';

        $classifyWarning = null;

        if($autoClassify){
            try {
                $stmt = $this->pdo->query("SELECT ID, NAME FROM CATEGORIES");
                $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);

                if (empty($categories)) {
                    $classifyWarning = 'Nenhuma categoria cadastrada. Crie categorias para a IA conseguir classificar suas notas.';
                    goto insert;
                }

                $categoryNames = array_column($categories, 'name');
                $ai = new AIService();
                $aiResponse = $ai->classify([
                    'title'      => $data['title'],
                    'content'    => $data['content'],
                    'categories' => $categoryNames
                ]);

                $cleanResponse = strtolower(trim(preg_replace('/[^a-zA-Z0-9À-ÿ\s]/', '', $aiResponse)));
                $matched = false;
                foreach ($categories as $cat) {
                    if ($cleanResponse === strtolower(trim($cat['name']))) {
                        $data['category_id'] = $cat['id'];
                        $matched = true;
                        break;
                    }
                }

                if (!$matched) {
                    $classifyWarning = "A IA não conseguiu identificar a categoria. Resposta recebida: \"{$aiResponse}\"";
                }

            } catch (\Exception $e) {
                $classifyWarning = 'Falha ao comunicar com a IA: ' . $e->getMessage();
            }
        }

        insert:
        $stmt = $this->pdo->prepare("INSERT INTO NOTES (TITLE, CONTENT, TAGS, CATEGORY_ID) VALUES (:title, :content, :tags, :category_id)");
        $stmt->execute([
            ':title' => $data['title'],
            ':content' => $data['content'],
            ':tags' => is_array($data['tags']) ? '{' . implode(',', $data['tags']) . '}' : $data['tags'],
            ':category_id' => !empty($data['category_id']) ? (int)$data['category_id'] : null
        ]);
        http_response_code(201);
        $response = ['id' => $this->pdo->lastInsertId(), 'message' => 'Nota criada'];
        if ($classifyWarning) {
            $response['warning'] = $classifyWarning;
        }
        return $response;
    }
    
    public function update(int $id, array $data){
        $stmt = $this->pdo->prepare("UPDATE NOTES SET TITLE = :title, CONTENT = :content, TAGS = :tags, CATEGORY_ID = :category_id WHERE ID = :id");
        $stmt->execute([
            ':id' => $id,
            ':title' => $data['title'],
            ':content' => $data['content'],
            ':tags' => is_array($data['tags']) ? '{' . implode(',', $data['tags']) . '}' : $data['tags'],
            ':category_id' => !empty($data['category_id']) ? (int)$data['category_id'] : null
        ]);
        return $stmt->rowCount();
    }

    public function delete(int $id){
        $stmt = $this->pdo->prepare("DELETE FROM NOTES WHERE ID = :id");
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount();
    }

}