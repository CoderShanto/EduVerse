<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\University;
use App\Models\UniversityEmailDomain;

class UniversitySeeder extends Seeder
{
    public function run(): void
    {
        $uiu = University::create([
            'name' => 'United International University',
            'short_name' => 'UIU',
            'is_active' => true,
        ]);

        UniversityEmailDomain::create([
            'university_id' => $uiu->id,
            'domain' => 'bscse.uiu.ac.bd',
            'is_active' => true,
        ]);
    }
}
