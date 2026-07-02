#!/usr/bin/php
<?php
// ============================================
// MEDUSA - Auto-Create Daily File
// ============================================
define('DATA_DIR', 'medusa_backups/');
define('FILE_PREFIX', '1000019890_');
date_default_timezone_set('Asia/Dhaka');

if (!file_exists(DATA_DIR)) mkdir(DATA_DIR, 0777, true);

function getLocation() {
    try {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        if ($ip == '127.0.0.1' || $ip == '::1') return 'Dhaka_BD';
        $url = "http://ip-api.com/json/{$ip}?fields=city,countryCode";
        $data = json_decode(file_get_contents($url), true);
        if (isset($data['city'])) return $data['city'] . '_' . $data['countryCode'];
    } catch (Exception $e) {}
    return 'Dhaka_BD';
}

$today = date('Y-m-d');
$loc = getLocation();
$file = DATA_DIR . FILE_PREFIX . $today . '_' . $loc . '.json';

if (file_exists($file)) {
    echo "✅ Already exists: " . basename($file) . "\n";
    exit;
}

$data = [
    "owner" => "Selim Ahmed",
    "email" => "amit.khanna.1082@gmail.com",
    "copyright" => "© 2026 Selim Ahmed",
    "patent" => "Pending",
    "system" => "MEDUSA",
    "date" => $today,
    "location" => $loc,
    "timestamp" => round(microtime(true) * 1000),
    "data" => [
        "values" => [0,0,0,0,0,0,0,1,0,0,0,0,0,0],
        "winners" => [false,false,false,false,false,false,false,true,false,false,false,false,false,false,1]
    ]
];

file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));
echo "✅ Created: " . basename($file) . "\n";
echo "📅 Date: $today\n";
echo "📍 Location: $loc\n";
?>
