<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create default admin
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@fucursa.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Create default teacher
        User::create([
            'name' => 'John Teacher',
            'email' => 'teacher@fucursa.com',
            'password' => Hash::make('teacher123'),
            'role' => 'teacher',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Create 10 random teachers for testing
        User::factory(10)->create();
    }
}