<?php
require_once 'config.php';

// Auto-create today's file if it doesn't exist
createTodayFile();

// Get all available dates
$dates = getAvailableDates();
$today = date('Y-m-d');
$location = getUserLocation();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>📅 Daily JSON Backups - Selim Ahmed</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 3px solid #667eea;
            margin-bottom: 30px;
        }
        
        .header h1 {
            color: #333;
            font-size: 32px;
            margin-bottom: 5px;
        }
        
        .header .subtitle {
            color: #666;
            font-size: 14px;
        }
        
        .stats {
            display: flex;
            justify-content: space-around;
            background: #f8f9fa;
            border-radius: 12px;
            padding: 15px;
            margin-bottom: 25px;
        }
        
        .stat-item {
            text-align: center;
        }
        
        .stat-item .number {
            font-size: 24px;
            font-weight: bold;
            color: #667eea;
        }
        
        .stat-item .label {
            font-size: 12px;
            color: #888;
            margin-top: 3px;
        }
        
        .today-banner {
            background: linear-gradient(135deg, #4caf50, #45a049);
            color: white;
            padding: 15px 20px;
            border-radius: 12px;
            margin-bottom: 25px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
        }
        
        .today-banner .today-label {
            font-weight: bold;
            font-size: 18px;
        }
        
        .today-banner .today-date {
            font-size: 14px;
            opacity: 0.9;
        }
        
        .date-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        
        .date-item {
            background: #f8f9fa;
            border: 2px solid #e0e0e0;
            border-radius: 12px;
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.3s ease;
        }
        
        .date-item:hover {
            transform: translateX(5px);
            border-color: #667eea;
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.2);
        }
        
        .date-item.today {
            background: #e8f5e9;
            border-color: #4caf50;
            border-width: 3px;
        }
        
        .date-item .date-info {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .date-item .date-text {
            font-weight: 600;
            font-size: 16px;
            color: #333;
        }
        
        .date-item .day-name {
            font-size: 13px;
            color: #888;
        }
        
        .date-item .badge {
            background: #4caf50;
            color: white;
            padding: 3px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: bold;
        }
        
        .date-item .badge.old {
            background: #9e9e9e;
        }
        
        .date-item .badge.future {
            background: #2196f3;
        }
        
        .date-item .download-btn {
            background: #667eea;
            color: white;
            border: none;
            padding: 8px 20px;
            border-radius: 8px;
            cursor: pointer;
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            transition: background 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
        
        .date-item .download-btn:hover {
            background: #5a6fd6;
        }
        
        .date-item .download-btn:active {
            transform: scale(0.95);
        }
        
        .date-item .download-btn.disabled {
            background: #ccc;
            cursor: not-allowed;
            opacity: 0.6;
        }
        
        .date-item .file-size {
            font-size: 12px;
            color: #999;
            margin-left: 5px;
        }
        
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #f0f0f0;
            color: #999;
            font-size: 13px;
        }
        
        .footer a {
            color: #667eea;
            text-decoration: none;
        }
        
        .empty-state {
            text-align: center;
            padding: 40px 20px;
            color: #999;
        }
        
        .empty-state .emoji {
            font-size: 48px;
        }
        
        @media (max-width: 600px) {
            .container {
                padding: 15px;
            }
            
            .header h1 {
                font-size: 24px;
            }
            
            .date-item {
                flex-wrap: wrap;
                gap: 10px;
            }
            
            .date-item .date-info {
                width: 100%;
            }
            
            .date-item .download-btn {
                width: 100%;
                justify-content: center;
            }
            
            .stats {
                flex-direction: column;
                gap: 10px;
            }
            
            .today-banner {
                flex-direction: column;
                text-align: center;
                gap: 8px;
            }
        }
        
        .animate-in {
            animation: slideUp 0.5s ease forwards;
            opacity: 0;
        }
        
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .pulse {
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📁 Daily JSON Backups</h1>
            <p class="subtitle">Blockchain Data Tracker • Selim Ahmed</p>
        </div>
        
        <div class="stats">
            <div class="stat-item">
                <div class="number"><?php echo count($dates); ?></div>
                <div class="label">📄 Total Files</div>
            </div>
            <div class="stat-item">
                <div class="number"><?php echo date('F j, Y'); ?></div>
                <div class="label">📅 Today</div>
            </div>
            <div class="stat-item">
                <div class="number"><?php echo $location; ?></div>
                <div class="label">📍 Location</div>
            </div>
        </div>
        
        <div class="today-banner">
            <div>
                <span class="today-label">✅ Today's File Ready</span>
                <span class="today-date"><?php echo date('l, F j, Y'); ?></span>
            </div>
            <div>
                <a href="download.php?date=<?php echo $today; ?>" class="download-btn" style="background: white; color: #4caf50; padding: 8px 20px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                    ⬇️ Download Today
                </a>
            </div>
        </div>
        
        <div class="date-list">
            <?php if (empty($dates)): ?>
                <div class="empty-state">
                    <div class="emoji">📂</div>
                    <p>No backup files found yet.</p>
                    <p style="font-size: 14px; margin-top: 10px;">Today's file will be created automatically.</p>
                </div>
            <?php else: ?>
                <?php 
                $index = 0;
                foreach (array_reverse($dates) as $date): 
                    $isToday = isToday($date);
                    $displayDate = formatDisplayDate($date);
                    $dayName = date('D', strtotime($date));
                    $file = getFileForDate($date);
                    $fileExists = $file && file_exists(DATA_DIR . $file);
                    $fileSize = $fileExists ? round(filesize(DATA_DIR . $file) / 1024, 1) . ' KB' : 'N/A';
                    
                    // Determine badge
                    if ($isToday) {
                        $badge = '<span class="badge">🔥 TODAY</span>';
                    } elseif (strtotime($date) > strtotime('today')) {
                        $badge = '<span class="badge future">⏳ Future</span>';
                    } else {
                        $badge = '<span class="badge old">📁 Past</span>';
                    }
                ?>
                <div class="date-item <?php echo $isToday ? 'today' : ''; ?>" style="animation-delay: <?php echo $index * 0.05; ?>s">
                    <div class="date-info">
                        <span class="date-text"><?php echo $displayDate; ?></span>
                        <span class="day-name">(<?php echo $dayName; ?>)</span>
                        <?php echo $badge; ?>
                        <?php if ($fileExists): ?>
                            <span class="file-size">📦 <?php echo $fileSize; ?></span>
                        <?php endif; ?>
                    </div>
                    <?php if ($fileExists): ?>
                        <a href="download.php?date=<?php echo $date; ?>" class="download-btn">
                            ⬇️ Download
                        </a>
                    <?php else: ?>
                        <span class="download-btn disabled">❌ Missing</span>
                    <?php endif; ?>
                </div>
                <?php 
                $index++;
                endforeach; 
                ?>
            <?php endif; ?>
        </div>
        
        <div class="footer">
            <p>© 2026 Selim Ahmed • Patent Pending • Blockchain Data Tracker</p>
            <p style="margin-top: 5px; font-size: 12px;">
                Files auto-created daily at midnight • Location: <?php echo $location; ?>
            </p>
        </div>
    </div>
    
    <script>
        // Auto-refresh every 5 minutes
        setTimeout(function() {
            location.reload();
        }, 300000);
        
        // Add animation to items
        document.querySelectorAll('.date-item').forEach((item, i) => {
            item.style.opacity = '0';
            item.style.animation = 'slideUp 0.5s ease forwards';
            item.style.animationDelay = (i * 0.05) + 's';
        });
    </script>
</body>
</html>
