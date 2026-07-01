<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'deadline' => 'required|date|after:now',
            'assigned_to' => [
                'required',
                'integer',
                Rule::exists('users', 'id')->where(function ($query) {
                    $query->where('is_active', true);
                })
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Task title is required',
            'title.max' => 'Task title cannot exceed 255 characters',
            'description.required' => 'Task description is required',
            'deadline.required' => 'Task deadline is required',
            'deadline.date' => 'Please provide a valid deadline date',
            'deadline.after' => 'Deadline must be in the future',
            'assigned_to.required' => 'Please select a user to assign this task to',
            'assigned_to.exists' => 'The selected user does not exist or is inactive',
        ];
    }
}