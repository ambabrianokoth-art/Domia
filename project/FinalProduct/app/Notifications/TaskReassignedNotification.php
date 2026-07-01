<?php

namespace App\Notifications;

use App\Models\Task;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TaskReassignedNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        protected Task $task,
        protected string $message
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
        return (new MailMessage)
            ->subject('Task Update: ' . $this->task->title)
            ->greeting('Hello ' . $notifiable->name . '! 👋')
            ->line($this->message)
            ->line('')
            ->line('**📋 Task Details:**')
            ->line('**Title:** ' . $this->task->title)
            ->line('**Description:** ' . $this->task->description)
            ->line('**⏰ Deadline:** ' . $this->task->deadline->format('l, M d, Y \a\t g:i A'))
            ->line('**🔄 Status:** ' . ucfirst(str_replace('_', ' ', $this->task->status)))
            ->line('')
            ->action('📱 View Task Dashboard', $this->getDashboardUrl())
            ->line('')
            ->line('Thank you for being part of our productive team! 🚀')
            ->salutation('Best regards,  
**Task Management System**  
📧 support@taskmanagement.com');
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
            'message' => $this->message,
            'deadline' => $this->task->deadline,
        ];
    }
}