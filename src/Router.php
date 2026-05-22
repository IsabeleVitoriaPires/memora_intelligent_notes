<?php

class Router {

      private array $routes = [];

      public function get(string $path, callable $handler) {
          $this->routes['GET'][$path] = $handler;
      }

      public function post(string $path, callable $handler) {
          $this->routes['POST'][$path] = $handler;
      }

      public function put(string $path, callable $handler) {
          $this->routes['PUT'][$path] = $handler;
      }

      public function delete(string $path, callable $handler) {
          $this->routes['DELETE'][$path] = $handler;
      }

      public function resolve(string $method, string $uri) {
          $parts = explode('/', trim($uri, '/'));
          $route = $parts[0] ?? '';
          $id = isset($parts[1]) ? (int)$parts[1] : null;

          // Tenta rota com ID (ex: "notes/:id")
          if ($id !== null && isset($this->routes[$method]["$route/:id"])) {
              return ($this->routes[$method]["$route/:id"])($id);
          }

          // Tenta rota sem ID (ex: "notes")
          if (isset($this->routes[$method][$route])) {
              return ($this->routes[$method][$route])();
          }

          http_response_code(404);
          return ['error' => 'Rota não encontrada'];
      }
  }