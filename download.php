<?php
// ============================================
// MEDUSA - Download
// ============================================

$dir = 'medusa_backups/';
$prefix = '1000019890_';
$date = $_GET['date'] ?? '';

if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
    die('Invalid date');
}

$loc = 'Dhaka_BD';
$file = $dir . $prefix . $date . '_' . $loc . '.json';

if (!file_exists($file)) {
    $files = glob($dir . $prefix . $date . '_*.json');
    $file = !empty($files) ? $files[0] : null;
}

if (!$file || !file_exists($file)) {
    die('File not found');
}

header('Content-Type: application/json');
header('Content-Disposition: attachment; filename="' . basename($file) . '"');
header('Content-Length: ' . filesize($file));
readfile($file);
exit;
