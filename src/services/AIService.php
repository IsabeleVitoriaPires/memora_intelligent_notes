<?php

require_once '/var/www/html/vendor/autoload.php';

class AIService {

    public function ask(array $messages){
    $client = new \GuzzleHttp\Client();

    $response = $client->post('https://chatgpt-42.p.rapidapi.com/gpt4', [
        'headers' => [
            'Content-Type' => 'application/json',
            'x-rapidapi-host' => 'chatgpt-42.p.rapidapi.com',
            'x-rapidapi-key' => $_ENV['APIKEY']
        ],
        'json' => [
            'messages' => $messages,
            'web_access' => false
        ]
        ]);

        $data = json_decode($response->getBody(), true);

        return $data['result'] ?? 'Sem resposta';
    }
}