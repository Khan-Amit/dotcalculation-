<?php
// ============================================
// MEDUSA - Daily Backup System
// ============================================

// Configuration
define('DATA_DIR', 'medusa_backups/');
define('FILE_PREFIX', '1000019890_');
date_default_timezone_set('Asia/Dhaka');

// Create directory
if (!file_exists(DATA_DIR)) {
    mkdir(DATA_DIR, 0777, true);
}

// Get location
function getLocation() {
    try {
        $ip = $_SERVER['REMOTE_ADDR'];
        if ($ip == '127.0.0.1' || $ip == '::1') {
            return 'Dhaka_BD';
        }
        $url = "http://ip-api.com/json/{$ip}?fields=city,countryCode";
        $data = json_decode(file_get_contents($url), true);
        if (isset($data['city'])) {
            return $data['city'] . '_' . $data['countryCode'];
        }
    } catch (Exception $e) {}
    return 'Dhaka_BD';
}

// Get all dates
function getDates() {
    $files = glob(DATA_DIR . '*.json');
    $dates = [];
    foreach ($files as $file) {
        if (preg_match('/' . FILE_PREFIX . '(\d{4}-\d{2}-\d{2})_/', basename($file), $m)) {
            $dates[] = $m[1];
        }
    }
    sort($dates);
    return $dates;
}

// Create today's file
function createToday() {
    $today = date('Y-m-d');
    $loc = getLocation();
    $file = DATA_DIR . FILE_PREFIX . $today . '_' . $loc . '.json';
    
    if (file_exists($file)) return $file;
    
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
    return $file;
}

// Create today
createToday();

// Get data
$dates = getDates();
$today = date('Y-m-d');
$loc = getLocation();
$total = count($dates);
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MEDUSA - Daily Backups</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: Arial, sans-serif;
            background: #0a0a0a;
            min-height: 100vh;
            padding: 20px;
            color: #fff;
        }
        .container {
            max-width: 700px;
            margin: 0 auto;
            background: #141414;
            border-radius: 16px;
            padding: 30px;
            border: 1px solid #2a2a2a;
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #2a2a2a;
            margin-bottom: 25px;
        }
        .header h1 {
            font-size: 42px;
            font-weight: 900;
            color: #00d4ff;
            letter-spacing: 2px;
        }
        .header p {
            color: #666;
            font-size: 13px;
            margin-top: 5px;
        }
        .stats {
            display: flex;
            justify-content: space-around;
            background: #1a1a1a;
            border-radius: 12px;
            padding: 15px;
            margin-bottom: 20px;
            border: 1px solid #2a2a2a;
        }
        .stats div { text-align: center; }
        .stats .num { font-size: 24px; font-weight: bold; color: #00d4ff; }
        .stats .lbl { font-size: 11px; color: #555; margin-top: 3px; text-transform: uppercase; }
        .today-box {
            background: linear-gradient(135deg, #00d4ff22, #00d4ff11);
            border: 1px solid #00d4ff44;
            border-radius: 12px;
            padding: 18px 22px;
            margin-bottom: 25px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
        }
        .today-box .label { font-weight: bold; color: #00d4ff; font-size: 17px; }
        .today-box .date { color: #888; font-size: 14px; }
        .btn {
            background: #00d4ff;
            color: #000;
            padding: 10px 24px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
            font-size: 14px;
            transition: 0.3s;
            display: inline-block;
        }
        .btn:hover { transform: scale(1.05); background: #00bbee; }
        .date-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .date-item {
            background: #1a1a1a;
            border: 1px solid #2a2a2a;
            border-radius: 10px;
            padding: 14px 18px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: 0.3s;
        }
        .date-item:hover { border-color: #00d4ff44; }
        .date-item.today { border-color: #00d4ff88; background: #00d4ff11; }
        .date-item .info { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .date-item .info .d { font-weight: 600; color: #fff; }
        .date-item .info .day { color: #555; font-size: 13px; }
        .date-item .badge {
            padding: 2px 12px;
            border-radius: 20px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .badge.today { background: #00d4ff; color: #000; }
        .badge.past { background: #2a2a2a; color: #555; }
        .badge.future { background: #ff444422; color: #ff4444; }
        .date-item .size { color: #444; font-size: 11px; }
        .btn-sm {
            background: #00d4ff22;
            color: #00d4ff;
            border: 1px solid #00d4ff44;
            padding: 6px 16px;
            border-radius: 6px;
            text-decoration: none;
            font-size: 13px;
            transition: 0.3s;
        }
        .btn-sm:hover { background: #00d4ff; color: #000; }
        .btn-sm.disabled { opacity: 0.3; cursor: not-allowed; }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #2a2a2a;
            color: #333;
            font-size: 12px;
        }
        .footer span { color: #00d4ff44; font-weight: bold; }
        @media (max-width: 600px) {
            .container { padding: 16px; }
            .header h1 { font-size: 30px; }
            .stats { flex-direction: column; gap: 10px; }
            .today-box { flex-direction: column; text-align: center; gap: 12px; }
            .date-item { flex-wrap: wrap; gap: 8px; }
            .date-item .info { width: 100%; }
            .btn-sm { width: 100%; text-align: center; padding: 10px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⚡ MEDUSA</h1>
            <p>Daily Backup System • Selim Ahmed</p>
        </div>
        
        <div class="stats">
            <div><div class="num"><?php echo $total; ?></div><div class="lbl">📄 Files</div></div>
            <div><div class="num"><?php echo date('M j'); ?></div><div class="lbl">📅 Today</div></div>
            <div><div class="num"><?php echo $loc; ?></div><div class="lbl">📍 Location</div></div>
        </div>
        
        <div class="today-box">
            <div>
                <div class="label">✅ Today's File</div>
                <div class="date"><?php echo date('l, F j, Y'); ?></div>
            </div>
            <a href="download.php?date=<?php echo $today; ?>" class="btn">⬇ Download</a>
        </div>
        
        <div class="date-list">
            <?php if (empty($dates)): ?>
                <div style="text-align:center;padding:40px;color:#444;">
                    <div style="font-size:40px;">📂</div>
                    <p style="margin-top:10px;">No files yet</p>
                </div>
            <?php else: ?>
                <?php foreach (array_reverse($dates) as $date):
                    $isToday = ($date == $today);
                    $display = date('F j, Y', strtotime($date));
                    $day = date('D', strtotime($date));
                    $file = DATA_DIR . FILE_PREFIX . $date . '_' . $loc . '.json';
                    if (!file_exists($file)) {
                        $files = glob(DATA_DIR . FILE_PREFIX . $date . '_*.json');
                        $file = !empty($files) ? $files[0] : null;
                    }
                    $exists = $file && file_exists($file);
                    $size = $exists ? round(filesize($file) / 1024, 1) . ' KB' : 'N/A';
                    $badge = $isToday ? '<span class="badge today">🔥 Today</span>' : 
                             (strtotime($date) > strtotime('today') ? '<span class="badge future">⏳ Future</span>' : 
                             '<span class="badge past">📁 Past</span>');
                ?>
                <div class="date-item <?php echo $isToday ? 'today' : ''; ?>">
                    <div class="info">
                        <span class="d"><?php echo $display; ?></span>
                        <span class="day">(<?php echo $day; ?>)</span>
                        <?php echo $badge; ?>
                        <span class="size">📦 <?php echo $size; ?></span>
                    </div>
                    <?php if ($exists): ?>
                        <a href="download.php?date=<?php echo $date; ?>" class="btn-sm">⬇ Download</a>
                    <?php else: ?>
                        <span class="btn-sm disabled">❌ Missing</span>
                    <?php endif; ?>
                </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
        
        <div class="footer">
            <span>⚡ MEDUSA</span> • © 2026 Selim Ahmed • Patent Pending
        </div>
    </div>
</body>
</html>
