<?php

namespace App\Http\Requests\Admin;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isAdmin();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $userId = $this->route('id');
        
        return [
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                'min:2',
                'regex:/^[a-zA-Z\s]+$/' // Only letters and spaces
            ],
            'email' => [
                'sometimes',
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($userId),
                'regex:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/'
            ],
            'role' => [
                'sometimes',
                'required',
                'string',
                Rule::in(User::getRoles())
            ],
            'is_active' => [
                'sometimes',
                'required',
                'boolean'
            ]
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Name is required',
            'name.string' => 'Name must be a string',
            'name.max' => 'Name must not exceed 255 characters',
            'name.min' => 'Name must be at least 2 characters',
            'name.regex' => 'Name must contain only letters and spaces',
            
            'email.required' => 'Email is required',
            'email.string' => 'Email must be a string',
            'email.email' => 'Please provide a valid email address',
            'email.max' => 'Email must not exceed 255 characters',
            'email.unique' => 'This email is already registered',
            'email.regex' => 'Please provide a valid email format',
            
            'role.required' => 'Role is required',
            'role.string' => 'Role must be a string',
            'role.in' => 'Invalid role selected. Valid roles are: ' . implode(', ', User::getRoles()),
            
            'is_active.required' => 'Active status is required',
            'is_active.boolean' => 'Active status must be true or false'
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $data = [];
        
        if ($this->has('name')) {
            $data['name'] = trim($this->name);
        }
        
        if ($this->has('email')) {
            $data['email'] = strtolower(trim($this->email));
        }
        
        if ($this->has('role')) {
            $data['role'] = strtolower(trim($this->role));
        }
        
        if ($this->has('is_active')) {
            $data['is_active'] = filter_var($this->is_active, FILTER_VALIDATE_BOOLEAN);
        }
        
        $this->merge($data);
    }
}