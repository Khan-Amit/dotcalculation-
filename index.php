<?php
// ============================================
// MEDUSSA - Main Dashboard
// ============================================
require_once 'config.php';

// Auto-create today's file
createTodayFile();

// Get data
$dates = getAvailableDates();
$today = date('Y-m-d');
$location = getUserLocation();
$totalFiles = count($dates);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MEDUSSA - Daily Backups</title>
    <style>
        /* ===== RESET & BASE ===== */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
            min-height: 100vh;
            padding: 20px;
        }
        
        /* ===== CONTAINER ===== */
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: rgba(255,255,255,0.05);
            backdrop-filter: blur(20px);
            border-radius: 24px;
            padding: 30px;
            border: 1px solid rgba(255,255,255,0.1);
            box-shadow: 0 30px 80px rgba(0,0,0,0.5);
        }
        
        /* ===== HEADER ===== */
        .header {
            text-align: center;
            padding-bottom: 25px;
            border-bottom: 2px solid rgba(255,255,255,0.1);
            margin-bottom: 30px;
        }
        
        .header .logo {
            font-size: 48px;
            font-weight: 900;
            background: linear-gradient(135deg, #f093fb, #f5576c, #4facfe);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: 3px;
        }
        
        .header .subtitle {
            color: rgba(255,255,255,0.6);
            font-size: 14px;
            margin-top: 5px;
            letter-spacing: 2px;
        }
        
        /* ===== STATS ===== */
        .stats {
            display: flex;
            justify-content: space-around;
            background: rgba(255,255,255,0.05);
            border-radius: 16px;
            padding: 18px;
            margin-bottom: 25px;
            border: 1px solid rgba(255,255,255,0.05);
        }
        
        .stat-item {
            text-align: center;
        }
        
        .stat-item .number {
            font-size: 26px;
            font-weight: bold;
            color: #4facfe;
        }
        
        .stat-item .label {
            font-size: 11px;
            color: rgba(255,255,255,0.4);
            margin-top: 3px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        /* ===== TODAY BANNER ===== */
        .today-banner {
            background: linear-gradient(135deg, rgba(79,172,254,0.2), rgba(245,87,108,0.2));
            border: 1px solid rgba(79,172,254,0.3);
            color: white;
            padding: 18px 22px;
            border-radius: 14px;
            margin-bottom: 25px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
        }
        
        .today-banner .today-label {
            font-weight: bold;
            font-size: 18px;
            color: #4facfe;
        }
        
        .today-banner .today-date {
            font-size: 14px;
            color: rgba(255,255,255,0.6);
        }
        
        .today-banner .btn-download {
            background: linear-gradient(135deg, #4facfe, #00f2fe);
            color: #0f0c29;
            padding: 10px 24px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: bold;
            font-size: 14px;
            transition: transform 0.2s;
            display: inline-block;
        }
        
        .today-banner .btn-download:hover {
            transform: scale(1.05);
        }
        
        /* ===== DATE LIST ===== */
        .date-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .date-item {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 12px;
            padding: 14px 18px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.3s ease;
        }
        
        .date-item:hover {
            background: rgba(255,255,255,0.08);
            border-color: rgba(79,172,254,0.3);
            transform: translateX(5px);
        }
        
        .date-item.today {
            background: rgba(79,172,254,0.1);
            border-color: rgba(79,172,254,0.4);
            border-width: 2px;
        }
        
        .date-item .date-info {
            display: flex;
            align-items: center;
            gap: 12px;
            flex-wrap: wrap;
        }
        
        .date-item .date-text {
            font-weight: 600;
            font-size: 15px;
            color: white;
        }
        
        .date-item .day-name {
            font-size: 13px;
            color: rgba(255,255,255,0.3);
        }
        
        .date-item .badge {
            padding: 3px 12px;
            border-radius: 20px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .date-item .badge.today {
            background: #4facfe;
            color: #0f0c29;
        }
        
        .date-item .badge.past {
            background: rgba(255,255,255,0.1);
            color: rgba(255,255,255,0.4);
        }
        
        .date-item .badge.future {
            background: rgba(245,87,108,0.2);
            color: #f5576c;
        }
        
        .date-item .file-size {
            font-size: 11px;
            color: rgba(255,255,255,0.25);
        }
        
        .date-item .btn-download {
            background: rgba(79,172,254,0.15);
            color: #4facfe;
            border: 1px solid rgba(79,172,254,0.2);
            padding: 7px 18px;
            border-radius: 8px;
            text-decoration: none;
            font-size: 13px;
            font-weight: 500;
            transition: all 0.3s ease;
        }
        
        .date-item .btn-download:hover {
            background: #4facfe;
            color: #0f0c29;
        }
        
        .date-item .btn-download.disabled {
            background: rgba(255,255,255,0.05);
            color: rgba(255,255,255,0.2);
            border-color: rgba(255,255,255,0.05);
            cursor: not-allowed;
        }
        
        /* ===== FOOTER ===== */
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid rgba(255,255,255,0.05);
            color: rgba(255,255,255,0.2);
            font-size: 12px;
            letter-spacing: 1px;
        }
        
        .footer .medussa {
            color: rgba(79,172,254,0.3);
            font-weight: bold;
        }
        
        /* ===== EMPTY STATE ===== */
        .empty-state {
            text-align: center;
            padding: 50px 20px;
            color: rgba(255,255,255,0.3);
        }
        
        .empty-state .emoji {
            font-size: 48px;
            margin-bottom: 15px;
        }
        
        /* ===== RESPONSIVE ===== */
        @media (max-width: 600px) {
            .container {
                padding: 16px;
            }
            
            .header .logo {
                font-size: 32px;
            }
            
            .date-item {
                flex-wrap: wrap;
                gap: 8px;
            }
            
            .date-item .date-info {
                width: 100%;
            }
            
            .date-item .btn-download {
                width: 100%;
                text-align: center;
                padding: 10px;
            }
            
            .stats {
                flex-direction: column;
                gap: 10px;
            }
            
            .today-banner {
                flex-direction: column;
                text-align: center;
                gap: 12px;
            }
        }
        
        /* ===== ANIMATIONS ===== */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .date-item {
            animation: fadeInUp 0.4s ease forwards;
            opacity: 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- HEADER -->
        <div class="header">
            <div class="logo">⚡ MEDUSSA</div>
            <div class="subtitle">Daily Blockchain Backups • Selim Ahmed</div>
        </div>
        
        <!-- STATS -->
        <div class="stats">
            <div class="stat-item">
                <div class="number"><?php echo $totalFiles; ?></div>
                <div class="label">📄 Total Files</div>
            </div>
            <div class="stat-item">
                <div class="number"><?php echo date('M j, Y'); ?></div>
                <div class="label">📅 Today</div>
            </div>
            <div class="stat-item">
                <div class="number"><?php echo $location; ?></div>
                <div class="label">📍 Location</div>
            </div>
        </div>
        
        <!-- TODAY BANNER -->
        <div class="today-banner">
            <div>
                <div class="today-label">✅ Today's File Ready</div>
                <div class="today-date"><?php echo date('l, F j, Y'); ?></div>
            </div>
            <a href="download.php?date=<?php echo $today; ?>" class="btn-download">
                ⬇️ Download Today
            </a>
        </div>
        
        <!-- DATE LIST -->
        <div class="date-list">
            <?php if (empty($dates)): ?>
                <div class="empty-state">
                    <div class="emoji">📂</div>
                    <p>No backup files found yet.</p>
                    <p style="font-size: 13px; margin-top: 8px; opacity: 0.6;">Today's file will be created automatically.</p>
                </div>
            <?php else: ?>
                <?php 
                $delay = 0;
                foreach (array_reverse($dates) as $date): 
                    $isToday = isToday($date);
                    $displayDate = formatDisplayDate($date);
                    $dayName = date('D', strtotime($date));
                    $file = getFileForDate($date);
                    $fileExists = $file && file_exists(DATA_DIR . $file);
                    $fileSize = $fileExists ? round(filesize(DATA_DIR . $file) / 1024, 1) . ' KB' : 'N/A';
                    
                    // Badge
                    if ($isToday) {
                        $badge = '<span class="badge today">🔥 Today</span>';
                    } elseif (strtotime($date) > strtotime('today')) {
                        $badge = '<span class="badge future">⏳ Future</span>';
                    } else {
                        $badge = '<span class="badge past">📁 Past</span>';
                    }
                ?>
                <div class="date-item <?php echo $isToday ? 'today' : ''; ?>" style="animation-delay: <?php echo $delay; ?>s;">
                    <div class="date-info">
                        <span class="date-text"><?php echo $displayDate; ?></span>
                        <span class="day-name">(<?php echo $dayName; ?>)</span>
                        <?php echo $badge; ?>
                        <?php if ($fileExists): ?>
                            <span class="file-size">📦 <?php echo $fileSize; ?></span>
                        <?php endif; ?>
                    </div>
                    <?php if ($fileExists): ?>
                        <a href="download.php?date=<?php echo $date; ?>" class="btn-download">
                            ⬇️ Download
                        </a>
                    <?php else: ?>
                        <span class="btn-download disabled">❌ Missing</span>
                    <?php endif; ?>
                </div>
                <?php 
                $delay += 0.05;
                endforeach; 
                ?>
            <?php endif; ?>
        </div>
        
        <!-- FOOTER -->
        <div class="footer">
            <span class="medussa">⚡ MEDUSSA</span> • © 2026 Selim Ahmed • Patent Pending
            <br>
            <span style="font-size: 10px; opacity: 0.5;">Auto-created daily • Location: <?php echo $location; ?></span>
        </div>
    </div>
    
    <script>
        // Auto-refresh every 5 minutes
        setTimeout(() => location.reload(), 300000);
    </script>
</body>
</html>
