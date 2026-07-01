<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Task Assignment</title>
    <style>
        :root {
            --ms-primary: #0078d4;
            --ms-secondary: #106ebe;
            --ms-success: #107c10;
            --ms-warning: #ff8c00;
            --ms-danger: #d13438;
            --ms-light: #fafafa;
            --ms-dark: #323130;
            --ms-border: #e1e1e1;
            --ms-text: #323130;
            --ms-text-secondary: #605e5c;
        }

        * {
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
            line-height: 1.5;
            color: var(--ms-text);
            margin: 0;
            padding: 20px;
            background-color: var(--ms-light);
            font-size: 10px;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border: 1px solid var(--ms-border);
            border-radius: 4px;
            overflow: hidden;
        }

        .header {
            background: var(--ms-primary);
            color: white;
            padding: 24px;
            text-align: left;
        }

        .header h1 {
            margin: 0;
            font-size: 15px;
            font-weight: 600;
            letter-spacing: -0.02em;
        }

        .header p {
            margin: 4px 0 0 0;
            font-size: 10px;
            opacity: 0.9;
            font-weight: 400;
        }

        .content {
            padding: 32px;
        }

        .greeting {
            font-size: 15px;
            color: var(--ms-text);
            margin-bottom: 16px;
            font-weight: 400;
        }

        .intro {
            color: var(--ms-text-secondary);
            margin-bottom: 24px;
            font-size: 10px;
        }

        .task-card {
            border: 1px solid var(--ms-border);
            border-radius: 4px;
            margin: 24px 0;
            overflow: hidden;
        }

        .task-header {
            background: var(--ms-light);
            padding: 16px 20px;
            border-bottom: 1px solid var(--ms-border);
        }

        .task-title {
            font-size: 12px;
            font-weight: 600;
            color: var(--ms-text);
            margin: 0 0 8px 0;
            letter-spacing: -0.01em;
        }

        .task-description {
            color: var(--ms-text-secondary);
            margin: 0;
            font-size: 10px;
            line-height: 1.4;
        }

        .task-details {
            padding: 20px;
            background: white;
        }

        .details-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: 16px;
            margin-bottom: 20px;
        }

        .detail-item {
            min-height: 48px;
        }

        .detail-label {
            font-size: 10px;
            font-weight: 600;
            color: var(--ms-text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }

        .detail-value {
            font-size: 10px;
            color: var(--ms-text);
            font-weight: 400;
        }

        .priority-section {
            border-top: 1px solid var(--ms-border);
            padding-top: 16px;
            margin-top: 16px;
        }

        .priority-badge {
            display: inline-flex;
            align-items: center;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 600;
            color: white;
            background-color: {{ $urgencyColor }};
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .deadline-alert {
            background: {{ $daysLeft <= 1 ? 'rgba(209, 52, 56, 0.1)' : ($daysLeft <= 3 ? 'rgba(255, 140, 0, 0.1)' : 'rgba(1, 120, 212, 0.1)') }};
            border: 1px solid {{ $daysLeft <= 1 ? 'var(--ms-danger)' : ($daysLeft <= 3 ? 'var(--ms-warning)' : 'var(--ms-primary)') }};
            border-radius: 4px;
            padding: 16px;
            margin: 24px 0;
            text-align: center;
        }

        .deadline-text {
            font-size: 10px;
            color: var(--ms-text);
            margin: 0;
            font-weight: 600;
        }

        .cta-section {
            text-align: center;
            margin: 32px 0;
        }

        .cta-button {
            display: inline-block;
            background: var(--ms-primary);
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 4px;
            font-weight: 600;
            font-size: 10px;
            transition: background-color 0.2s ease;
            border: none;
            cursor: pointer;
        }

        .cta-button:hover {
            background: var(--ms-secondary);
            color: white;
        }

        .tips-section {
            background: var(--ms-light);
            border: 1px solid var(--ms-border);
            border-radius: 4px;
            padding: 20px;
            margin: 24px 0;
        }

        .tips-title {
            color: var(--ms-text);
            margin: 0 0 12px 0;
            font-size: 10px;
            font-weight: 600;
        }

        .tips-list {
            margin: 0;
            padding-left: 16px;
            color: var(--ms-text-secondary);
        }

        .tips-list li {
            margin-bottom: 6px;
            font-size: 10px;
            line-height: 1.4;
        }

        .footer {
            background: var(--ms-dark);
            color: white;
            padding: 20px 32px;
            text-align: center;
            font-size: 9px;
        }

        .footer-title {
            margin: 0 0 8px 0;
            font-weight: 600;
            font-size: 10px;
        }

        .footer-text {
            margin: 4px 0;
            opacity: 0.8;
        }

        .footer a {
            color: #4cc2ff;
            text-decoration: none;
        }

        .footer a:hover {
            text-decoration: underline;
        }

        .divider {
            height: 1px;
            background: var(--ms-border);
            margin: 24px 0;
        }

        @media (max-width: 600px) {
            body {
                padding: 10px;
            }
            
            .content {
                padding: 20px;
            }
            
            .details-grid {
                grid-template-columns: 1fr;
                gap: 12px;
            }
            
            .footer {
                padding: 16px 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>New Task Assignment</h1>
            <p>Cytonn Management System</p>
        </div>

        <div class="content">
            <div class="greeting">
                Hi {{ $user->name }},
            </div>

            <div class="intro">
                You have been assigned to a new task that requires your attention.
            </div>

            <div class="task-card">
                <div class="task-header">
                    <h2 class="task-title">{{ $task->title }}</h2>
                    <p class="task-description">{{ $task->description }}</p>
                </div>
                
                <div class="task-details">
                    <div class="details-grid">
                        <div class="detail-item">
                            <div class="detail-label">Deadline</div>
                            <div class="detail-value">{{ $formattedDeadline }}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Time Remaining</div>
                            <div class="detail-value">
                                {{ $daysLeft > 0 ? $daysLeft . ' days' : 'Overdue' }}
                            </div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Assigned By</div>
                            <div class="detail-value">{{ $task->assignedBy->name }}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Current Status</div>
                            <div class="detail-value">{{ ucfirst(str_replace('_', ' ', $task->status)) }}</div>
                        </div>
                    </div>

                    <div class="priority-section">
                        <div class="detail-label">Priority Level</div>
                        <div class="priority-badge">{{ $priorityText }}</div>
                    </div>
                </div>
            </div>

            @if($daysLeft <= 3)
            <div class="deadline-alert">
                <p class="deadline-text">
                    {{ $daysLeft <= 1 ? '⚠️ This task is due soon' : 'Upcoming deadline' }}
                </p>
            </div>
            @endif

            <div class="cta-section">
                <a href="{{ $dashboardUrl }}" class="cta-button">
                    Open Dashboard
                </a>
            </div>

            <div class="tips-section">
                <h3 class="tips-title">Getting Started</h3>
                <ul class="tips-list">
                    <li>Log in to your dashboard to update task status</li>
                    <li>Mark as "In Progress" when you start working</li>
                    <li>Set reminders for important deadlines</li>
                    <li>Contact your team if you need assistance</li>
                </ul>
            </div>

            <div class="divider"></div>

            <p style="color: var(--ms-text-secondary); font-size: 12px; margin: 0;">
                Thank you for using Cytonn Management System.
            </p>
        </div>

        <div class="footer">
            <p class="footer-title">Cytonn Management System</p>
            <p class="footer-text">
                <a href="mailto:support@taskmanagement.com">amba@cytonnmanagement.com</a>
            </p>
            <p class="footer-text">Need help? Contact our support team.</p>
        </div>
    </div>
</body>
</html>