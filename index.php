<?php
header("Access-Control-Allow-Origin: *");
include 'controller.php';

define('API_PATH', $_GET['path']);

$controller = new Controller(API_PATH);
$controller->handle('/api/session_start', 'startSession');
$controller->handle('/api/quiz/kategori/hewan', 'ambilSoalHewan');
$controller->handle('/api/quiz/kategori/kendaraan', 'ambilSoalKendaraan');
