<?php
    require_once '/var/www/html/vendor/autoload.php';
    require_once '/var/www/html/Router.php';
    require_once '/var/www/html/controllers/NoteController.php';
    require_once '/var/www/html/controllers/ChatController.php';
    require_once '/var/www/html/controllers/CategoriesController.php';
    require_once '/var/www/html/controllers/SettingsController.php';

    header("Access-Control-Allow-Origin:*");
    header("Access-Control-Allow-Methods:GET, POST, PUT, DELETE, OPTIONS");
    header("Content-Type: application/json");

    $dotenv = Dotenv\Dotenv::createImmutable('/var/www/html');
    $dotenv->load();

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        header("Access-Control-Allow-Headers: Content-Type");
        http_response_code(200);
        exit();
    }

    $noteController = new NoteController();
    $chatController = new ChatController();
    $categoriesController = new CategoriesController();
    $settingsController = new SettingsController();

    $router = new Router();
    $data = json_decode(file_get_contents('php://input'), true);

    // Notes
    $router->get('notes', fn() => $noteController->list());
    $router->get('notes/:id', fn($id) => $noteController->findById($id));
    $router->post('notes', fn() => $noteController->create($data));
    $router->put('notes/:id', fn($id) => $noteController->update($id, $data));
    $router->delete('notes/:id', fn($id) => $noteController->delete($id));

    // Chat
    $router->get('chat', fn() => $chatController->getHistory());
    $router->post('chat', fn() => $chatController->sendMessage($data));
    $router->delete('chat', fn() => $chatController->clearHistory());

    // Categories
    $router->get('categories', fn() => $categoriesController->list());
    $router->post('categories', fn() => $categoriesController->create($data));
    $router->delete('categories/:id', fn($id) => $categoriesController->delete($id));

    // Settings
    $router->get('settings', fn() => $settingsController->get());
    $router->put('settings', fn() => $settingsController->update($data));

    $result = $router->resolve($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);
    echo json_encode($result);