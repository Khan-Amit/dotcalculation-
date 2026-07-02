#!/usr/bin/php
<?php
// This file runs automatically at midnight via cron job
// Path: /usr/bin/php /path/to/create_today.php

require_once 'config.php';

$today = date('Y-m-d');
$location = getUserLocation();
$filename = DATA_DIR . FILE_PREFIX . $today . '_' . $location . '.json';

// Check if today's file already exists
if (file_exists($filename)) {
    echo "✅ File already exists: " . basename($filename) . "\n";
    exit;
}

// Create today's file
$result = createTodayFile();

if ($result) {
    echo "✅ Created: " . basename($result) . "\n";
    echo "📅 Date: $today\n";
    echo "📍 Location: $location\n";
    echo "📁 Path: " . realpath($result) . "\n";
} else {
    echo "❌ Failed to create today's file\n";
    exit(1);
}
?>
