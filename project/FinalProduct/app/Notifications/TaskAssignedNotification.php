<?php

namespace App\Notifications;

use App\Models\Task;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TaskAssignedNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        protected Task $task
    ) {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $urgencyColor = $this->getUrgencyColor();
        $formattedDeadline = $this->task->deadline->format('l, M d, Y \a\t g:i A');
        $daysLeft = now()->diffInDays($this->task->deadline, false);
        
        return (new MailMessage)
            ->subject('New Task Assignment: ' . $this->task->title)
            ->greeting('Hello ' . $notifiable->name . '! 👋')
            ->line('You have been assigned a new task that requires your attention.')
            ->line('')
            ->line('**Task Details:**')
            ->line('**Title:** ' . $this->task->title)
            ->line('**Description:** ' . $this->task->description)
            ->line('**Deadline:** ' . $formattedDeadline)
            ->line('**Days Remaining:** ' . ($daysLeft > 0 ? $daysLeft . ' days' : 'Overdue!'))
            ->line('**Assigned by:** ' . $this->task->assignedBy->name)
            ->line('**Status:** ' . ucfirst(str_replace('_', ' ', $this->task->status)))
            ->line('')
            ->line('**⚡ Priority Level:** ' . $this->getPriorityText($daysLeft))
            ->line('')
            ->action('View Task Dashboard', $this->getDashboardUrl())
            ->line('')
            ->line('**Quick Tips:**')
            ->line('• Log in to your dashboard to update task status')
            ->line('• Mark as "In Progress" when you start working')
            ->line('• Set reminders for important deadlines')
            ->line('• Communicate with your team if you need assistance')
            ->line('')
            ->line('Thank you for being part of our productive team!')
            ->salutation('Best regards,  
**Cytonn Management System**  
amba@cytonnmanagement.com');
    }

    /**
     * Get urgency color based on deadline
     */
    private function getUrgencyColor(): string
    {
        $daysLeft = now()->diffInDays($this->task->deadline, false);
        
        if ($daysLeft <= 1) {
            return '#d13438'; // MS Danger - Urgent
        } elseif ($daysLeft <= 3) {
            return '#ff8c00'; // MS Warning - High
        } elseif ($daysLeft <= 7) {
            return '#0078d4'; // MS Primary - Medium
        } else {
            return '#107c10'; // MS Success - Low
        }
    }

    /**
     * Get priority text based on days left
     */
    private function getPriorityText(int $daysLeft): string
    {
        if ($daysLeft < 0) {
            return '🔴 Overdue - Immediate attention required!';
        } elseif ($daysLeft <= 1) {
            return '🔴 High - Due within 24 hours';
        } elseif ($daysLeft <= 3) {
            return '🟠 Medium - Due within 3 days';
        } elseif ($daysLeft <= 7) {
            return '🟡 Normal - Due within a week';
        } else {
            return '🟢 Low - Plenty of time available';
        }
    }

    /**
     * Get dashboard URL
     */
    private function getDashboardUrl(): string
    {
        return config('app.frontend_url', 'http://localhost:3000') . '/dashboard/tasks';
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'task_id' => $this->task->id,
            'task_title' => $this->task->title,
            'assigned_by' => $this->task->assignedBy->name,
            'deadline' => $this->task->deadline,
            'priority' => $this->getPriorityText(now()->diffInDays($this->task->deadline, false)),
        ];
    }
}