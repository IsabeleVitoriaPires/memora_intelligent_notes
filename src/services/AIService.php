<?php

require_once '/var/www/html/vendor/autoload.php';

class AIService {

    public function ask(array $messages){
        $apiKey = $_ENV['APIKEY'] ?? null;
        if (!$apiKey) {
            throw new \RuntimeException('APIKEY não configurada');
        }

        $client = new \GuzzleHttp\Client();
        $response = $client->post('https://api.groq.com/openai/v1/chat/completions', [
            'headers' => [
                  'Content-Type'  => 'application/json',
                  'Authorization' => 'Bearer ' . $apiKey
            ],
            'json' => [
                  'model'    => 'llama-3.1-8b-instant',
                  'messages' => $messages
            ]
        ]);

          $data = json_decode($response->getBody(), true);
          return $data['choices'][0]['message']['content'] ?? 'Sem resposta';
    }

    public function classify(array $data){
        $title = $data['title'];
        $content = $data['content'];
        $categories = $data['categories'];
        $categoriesList = implode(', ', $categories);

        $prompt = "Classifique a nota abaixo em UMA das categorias: {$categoriesList}. \n
        Responda APENAS o nome exato da categoria, nada mais. \n
        Titulo: {$title} \n
        Conteudo: {$content}
        ";

        return $this->ask([
            ['role' => 'user', 'content' => $prompt]
        ]);
    }
}