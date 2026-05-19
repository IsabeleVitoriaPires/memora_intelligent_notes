<?php

function getConnection(){
    $dns = 'pgsql:host=postgres;dbname=postgres';
    return new PDO($dns, 'postgres', 'teste25',[
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
}