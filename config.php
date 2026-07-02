<?php
// ============================================
// MEDUSSA - Configuration File
// ============================================

// Directory Settings
define('DATA_DIR', 'medussa_backups/');
define('FILE_PREFIX', '1000019890_');
define('TIMEZONE', 'Asia/Dhaka');

// Set timezone
date_default_timezone_set(TIMEZONE);

// Create directory if not exists
if (!file_exists(DATA_DIR)) {
    mkdir(DATA_DIR, 0777, true);
}

// ============================================
// Get User Location from IP
// ============================================
function getUserLocation() {
    try {
        $ip = $_SERVER['REMOTE_ADDR'];
        
        // Check if localhost
        if ($ip == '127.0.0.1' || $ip == '::1') {
            return 'Dhaka_BD';
        }
        
        $url = "http://ip-api.com/json/{$ip}?fields=city,countryCode";
        $response = file_get_contents($url);
        $data = json_decode($response, true);
        
        if (isset($data['city']) && isset($data['countryCode'])) {
            return $data['city'] . '_' . $data['countryCode'];
        }
    } catch (Exception $e) {
        // Fallback
    }
    return 'Dhaka_BD';
}

// ============================================
// Get All Available Dates
// ============================================
function getAvailableDates() {
    $files = glob(DATA_DIR . FILE_PREFIX . '*.json');
    $dates = [];
    
    foreach ($files as $file) {
        $filename = basename($file);
        if (preg_match('/' . FILE_PREFIX . '(\d{4}-\d{2}-\d{2})_/', $filename, $matches)) {
            $dates[] = $matches[1];
        }
    }
    
    sort($dates);
    return $dates;
}

// ============================================
// Create Today's MEDUSSA File
// ============================================
function createTodayFile() {
    $today = date('Y-m-d');
    $location = getUserLocation();
    $filename = DATA_DIR . FILE_PREFIX . $today . '_' . $location . '.json';
    
    // Check if file already exists
    if (file_exists($filename)) {
        return $filename;
    }
    
    // ============================================
    // MEDUSSA Data Structure
    // ============================================
    $data = [
        "owner" => "Selim Ahmed",
        "email" => "amit.khanna.1082@gmail.com",
        "copyright" => "© 2026 Selim Ahmed",
        "patent" => "Pending",
        "system" => "MEDUSSA",
        "date" => $today,
        "location" => $location,
        "timestamp" => round(microtime(true) * 1000),
        
        // ========================================
        // MEDUSSA Blockchain Data
        // ========================================
        "blockchain" => [
            // ---------- ALPHA NODE ----------
            [
                "index" => 0,
                "timestamp" => round(microtime(true) * 1000),
                "pulseCount" => 0,
                "decision" => false,
                "prevResult" => "0000000000000000",
                "hash" => "0000000000000000",
                "segment" => 1,
                "node" => 0,
                "nodeName" => "Alpha",
                "owner" => "Selim Ahmed",
                "email" => "amit.khanna.1082@gmail.com",
                "data" => [
                    "values" => [0,0,0,0,0,0,0,1,0,0,0,0,0,0],
                    "winners" => [false,false,false,false,false,false,false,true,false,false,false,false,false,false,1]
                ]
            ],
            
            // ---------- IOTA NODE ----------
            [
                "index" => 1,
                "timestamp" => round(microtime(true) * 1000),
                "pulseCount" => rand(200000, 250000),
                "decision" => false,
                "prevResult" => "0000000000000000",
                "hash" => "0000000000000000",
                "segment" => 1,
                "node" => 0,
                "nodeName" => "Iota",
                "owner" => "Selim Ahmed",
                "email" => "amit.khanna.1082@gmail.com",
                "data" => [
                    "values" => [
                        rand(900, 3500), rand(900, 3500), rand(900, 3500),
                        rand(900, 3500), rand(900, 3500), rand(900, 3500),
                        rand(900, 3500), rand(900, 3500), rand(900, 3500),
                        rand(900, 3500), rand(900, 3500), rand(900, 3500)
                    ],
                    "winners" => [
                        true, true, false, true, true, true,
                        false, true, false, true, false, true, false, 1
                    ]
                ]
            ],
            
            // ---------- BETA NODE ----------
            [
                "index" => 2,
                "timestamp" => round(microtime(true) * 1000),
                "pulseCount" => rand(200000, 250000),
                "decision" => false,
                "prevResult" => "0000000000000000",
                "hash" => "0000000000000000",
                "segment" => 1,
                "node" => 0,
                "nodeName" => "Beta",
                "owner" => "Selim Ahmed",
                "email" => "amit.khanna.1082@gmail.com",
                "data" => [
                    "values" => [
                        rand(900, 3500), rand(900, 3500), rand(900, 3500),
                        rand(900, 3500), rand(900, 3500), rand(900, 3500),
                        rand(900, 3500), rand(900, 3500), rand(900, 3500),
                        rand(900, 3500), rand(900, 3500), rand(900, 3500)
                    ]
                ]
            ]
        ]
    ];
    
    // Save file
    file_put_contents($filename, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
    
    return $filename;
}

// ============================================
// Helper Functions
// ============================================
function formatDisplayDate($date) {
    return date('F j, Y', strtotime($date));
}

function isToday($date) {
    return $date == date('Y-m-d');
}

function getFileForDate($date) {
    $location = getUserLocation();
    $filename = DATA_DIR . FILE_PREFIX . $date . '_' . $location . '.json';
    
    if (!file_exists($filename)) {
        $files = glob(DATA_DIR . FILE_PREFIX . $date . '_*.json');
        if (!empty($files)) {
            return basename($files[0]);
        }
        return null;
    }
    
    return basename($filename);
}
?>
