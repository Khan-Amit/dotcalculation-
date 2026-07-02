<?php
// ============================================
// MEDUSA - Download Handler
// ============================================
define('DATA_DIR', 'medusa_backups/');
define('FILE_PREFIX', '1000019890_');
date_default_timezone_set('Asia/Dhaka');

function getLocation() {
    try {
        $ip = $_SERVER['REMOTE_ADDR'];
        if ($ip == '127.0.0.1' || $ip == '::1') return 'Dhaka_BD';
        $url = "http://ip-api.com/json/{$ip}?fields=city,countryCode";
        $data = json_decode(file_get_contents($url), true);
        if (isset($data['city'])) return $data['city'] . '_' . $data['countryCode'];
    } catch (Exception $e) {}
    return 'Dhaka_BD';
}

$date = isset($_GET['date']) ? $_GET['date'] : '';
if (!$date || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
    die('❌ Invalid date');
}

$loc = getLocation();
$file = DATA_DIR . FILE_PREFIX . $date . '_' . $loc . '.json';

if (!file_exists($file)) {
    $files = glob(DATA_DIR . FILE_PREFIX . $date . '_*.json');
    if (!empty($files)) {
        $file = $files[0];
    } else {
        die('❌ File not found');
    }
}

header('Content-Type: application/json');
header('Content-Disposition: attachment; filename="' . basename($file) . '"');
header('Content-Length: ' . filesize($file));
header('Cache-Control: no-cache');
readfile($file);
exit;
?>
