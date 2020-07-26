<?php
session_start();

function debuger($v) {
    var_dump($v);
    die;
}
class Controller {
    public $currentPath;
    public $registered_routes;
    public function __construct ($current_path) {
        $this->currentPath = $current_path;
    }
    /* mysql zone */
    private $host = "103.142.21.130";
    private $db_name = "wildanik_kuis";
    private $username = "wildanik_kuis";
    private $password = "jomblogabut123";
    public $conn;
    public function getConnection(){
        if ($this->conn !== null) {
            $status = $conn->getAttribute(PDO::ATTR_CONNECTION_STATUS);
            return $this->conn;
        } else {
            $this->conn = null;
            try {
                $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
                $this->conn->exec("set names utf8");
            } catch (PDOException $exception) {
                echo "Connection error: " . $exception->getMessage();
            }
            return $this->conn;
        }
    }
    /* end of mysql zone */
    /* response */
    private function sendResponse ($status = 200, $data) {
        header('Content-Type: application/json');
        $res = array('statusCode' => $status, 'message' => 'ok', 'data' => $data);
        print_r(json_encode($res));
    }
    /* handler center */
    public function handle ($path, $handler) {
        try {
            if ($this->currentPath == $path) {
                $context = array(
                    'path' => $path,
                    'queries' => $_GET,
                    'forms' => $_POST
                );
                $this->$handler($context);
            }
        } catch (Exception $e) {
            throw $e;
        }
    }
    /* end of handler center */
    /* handlers zone */
    private function startSession ($context) {
        try {
            $_SESSION['context'] = $context;
            $this->sendResponse(200, 'session started...');
        } catch (Exception $e) {
            $this->sendResponse(500, $e->getMessage());
        }
    }

    private function ambilSoalHewan ($ontext) {
        try {
            $db = $this->getConnection();
            $sql = "SELECT * FROM kuis WHERE kategori = 'hewan'";
            $query = $db->prepare($sql);
            $query->execute();
            $data = $query->fetchAll(PDO::FETCH_ASSOC);
            // debuger(json_encode($data));
            $this->sendResponse(200, $data);
        } catch (Exception $e) {
            $this->sendResponse(400, $e->getMessage());
        }
    }
    private function ambilSoalKendaraan ($ontext) {
        try {
            $db = $this->getConnection();
            $sql = "SELECT * FROM kuis WHERE kategori = 'kendaraan'";
            $query = $db->prepare($sql);
            $query->execute();
            $data = $query->fetchAll(PDO::FETCH_ASSOC);
            $this->sendResponse(200, $data);
        } catch (Exception $e) {
            // 
        }
    }
}