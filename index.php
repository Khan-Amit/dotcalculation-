<?php
// ============================================
// SIMPLE DOWNLOAD INDEX
// ============================================

$dir = 'backups/';
$prefix = 'file_';

if (!file_exists($dir)) mkdir($dir, 0777, true);

// Get today's date
$today = date('Y-m-d');

// Create today's file if it doesn't exist
$todayFile = $dir . $prefix . $today . '.json';
if (!file_exists($todayFile)) {
    file_put_contents($todayFile, json_encode([
        'date' => $today,
        'created' => time()
    ]));
}

// Get all files
$files = glob($dir . $prefix . '*.json');
$dates = [];
foreach ($files as $f) {
    $name = basename($f);
    $date = str_replace($prefix, '', str_replace('.json', '', $name));
    if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
        $dates[] = $date;
    }
}
rsort($dates);
?>
<!DOCTYPE html>
<html>
<head>
    <title>Downloads</title>
    <style>
        body { font-family: Arial; max-width: 600px; margin: 40px auto; padding: 20px; }
        .item { 
            padding: 15px; 
            border: 1px solid #ddd; 
            margin: 5px 0; 
            display: flex; 
            justify-content: space-between;
            align-items: center;
        }
        .item.today { background: #e8f5e9; border-color: #4caf50; }
        .btn { 
            background: #2196f3; 
            color: white; 
            padding: 8px 20px; 
            text-decoration: none; 
            border-radius: 4px;
        }
        .btn:hover { background: #1976d2; }
        h1 { color: #333; }
    </style>
</head>
<body>
    <h1>📁 Downloads</h1>
    <p>Total: <?php echo count($dates); ?> files</p>
    
    <?php foreach ($dates as $date): ?>
    <?php $isToday = ($date == $today); ?>
    <div class="item <?php echo $isToday ? 'today' : ''; ?>">
        <span><?php echo $date; ?> <?php echo $isToday ? '⬅ TODAY' : ''; ?></span>
        <a href="download.php?date=<?php echo $date; ?>" class="btn">Download</a>
    </div>
    <?php endforeach; ?>
</body>
</html>
