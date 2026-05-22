<?php

require_once '/var/www/html/connection.php';

class SettingsController {

    private PDO $pdo;

    public function __construct()
    {
        $this->pdo = getConnection();
    }

    public function get(){
        $stmt = $this->pdo->query("SELECT * FROM SETTINGS");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function update(array $data){
        $value = $this->pdo->query("SELECT VALUE FROM SETTINGS");

        if($value === true){
            $stmt = $this->pdo->prepare("UPDATE SETTINGS SET VALUE = 'false' WHERE KEY = :key");
            $stmt->execute([':key' => $data['key']]);
            return $stmt->
        }else{

        }
        
    }
}