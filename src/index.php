<?php 
require_once '/var/www/html/vendor/autoload.php';
require_once '/var/www/html/controllers/NoteController.php';
require_once '/var/www/html/controllers/ChatController.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json");

$dotenv = Dotenv\Dotenv::createImmutable('/var/www/html');
$dotenv->load();

if($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    http_response_code(200);
    exit();
}

$noteController = new NoteController();
$chatController = new ChatController();

$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];
$parts = explode('/', $uri);
$rote = isset($parts[1]) ? trim($parts[1]) : null;
$id = isset($parts[2]) ? (int)$parts[2] : null;

if ($rote === 'notes'){
    if ($method === 'GET' && $id === null) {
        $result = $noteController->list();
    } 
    elseif ($method === 'GET' && $id !== null) {
        $result = $noteController->findById($id);
    } 
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        $result = $noteController->create($data);
    } 
    elseif ($method === 'PUT' && $id !== null) {
        $data = json_decode(file_get_contents('php://input'), true);
        $result = $noteController->update($id, $data);
    } 
    elseif ($method === 'DELETE' && $id !== null) {
        $result = $noteController->delete($id);
    }   
    else {
        $result = ['error' => 'Rota não encontrada'];
    }
}

if ($rote === 'chat') {
    if($method === 'POST'){
        $data = json_decode(file_get_contents('php://input'), true);
        $result = $chatController->sendMessage($data);
    } elseif ($method === 'GET') {
        $result = $chatController->getHistory();
    } else {
        $result = ['error' => 'Rota não encontrada'];
    }
}

echo json_encode($result);
