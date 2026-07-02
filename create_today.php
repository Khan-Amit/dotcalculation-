#!/usr/bin/php
<?php
// ============================================
// MEDUSSA - Auto-Create Today's File
// Run this daily at midnight via cron
// ============================================
require_once 'config.php';

$today = date('Y-m-d');
$location = getUserLocation();
$filename = DATA_DIR . FILE_PREFIX . $today . '_' . $location . '.json';

// Check if exists
if (file_exists($filename)) {
    echo "✅ MEDUSSA: File already exists - " . basename($filename) . "\n";
    exit;
}

// Create file
$result = createTodayFile();

if ($result) {
    echo "✅ MEDUSSA: Created - " . basename($result) . "\n";
    echo "📅 Date: $today\n";
    echo "📍 Location: $location\n";
    echo "📁 Path: " . realpath($result) . "\n";
} else {
    echo "❌ MEDUSSA: Failed to create file\n";
    exit(1);
}
?>
