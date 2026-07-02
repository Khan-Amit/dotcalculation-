<?php
// ============================================
// MEDUSSA - Download Handler
// ============================================
require_once 'config.php';

// Get date
$date = isset($_GET['date']) ? $_GET['date'] : '';
if (empty($date)) {
    die('❌ Error: No date specified.');
}

// Validate date
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
    die('❌ Error: Invalid date format.');
}

// Find file
$location = getUserLocation();
$filename = DATA_DIR . FILE_PREFIX . $date . '_' . $location . '.json';

// Try other locations
if (!file_exists($filename)) {
    $files = glob(DATA_DIR . FILE_PREFIX . $date . '_*.json');
    if (!empty($files)) {
        $filename = $files[0];
    } else {
        if (isToday($date)) {
            createTodayFile();
            $filename = DATA_DIR . FILE_PREFIX . $date . '_' . $location . '.json';
        } else {
            die('❌ Error: File not found for this date.');
        }
    }
}

// Check again
if (!file_exists($filename)) {
    die('❌ Error: File not found.');
}

// Force download
header('Content-Type: application/json');
header('Content-Disposition: attachment; filename="' . basename($filename) . '"');
header('Content-Length: ' . filesize($filename));
header('Cache-Control: no-cache, must-revalidate');
header('Pragma: no-cache');

readfile($filename);
exit;
?>
