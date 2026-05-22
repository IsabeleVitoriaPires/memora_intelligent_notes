<?php

require_once '/var/www/html/connection.php';

class CategoriesController {

    private PDO $pdo;

    public function __construct()
    {
        $this->pdo = getConnection();
    }

    public function list(){
        $stmt = $this->pdo->query("SELECT * FROM CATEGORIES ORDER BY ID");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create(array $data){

        if(empty($data['name'])){
            http_response_code(400);
            return ['error' => 'name é obrigatório'];
        }

        $stmt = $this->pdo->prepare("INSERT INTO CATEGORIES (NAME, COLOR) VALUES (:name, :color)");
        $stmt->execute([
            ':name' => $data['name'],
            ':color' => $data['color'] ?? null,
        ]);
        http_response_code(201);
        return ['id' => $this->pdo->lastInsertId(), 'message' => 'Categoria criada'];

    }

    public function delete(int $id){
        $stmt = $this->pdo->prepare("DELETE FROM CATEGORIES WHERE ID = :id");
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount();
    }
}