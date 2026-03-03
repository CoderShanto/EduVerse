<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\University;
use App\Models\UniversityEmailDomain;

class UniversitySeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'name' => 'United International University',
                'short_name' => 'UIU',
                'domains' => ['bscse.uiu.ac.bd', 'uiu.ac.bd'],
            ],
            [
                'name' => 'University of Dhaka',
                'short_name' => 'DU',
                'domains' => ['du.ac.bd', 'cse.du.ac.bd'],
            ],
            [
                'name' => 'Bangladesh University of Engineering and Technology',
                'short_name' => 'BUET',
                'domains' => ['buet.ac.bd'],
            ],
            [
                'name' => 'BRAC University',
                'short_name' => 'BRACU',
                'domains' => ['bracu.ac.bd'],
            ],
            [
                'name' => 'North South University',
                'short_name' => 'NSU',
                'domains' => ['northsouth.edu','nsu.ac.bd'],
            ],
            [
                'name' => 'American International University-Bangladesh',
                'short_name' => 'AIUB',
                'domains' => ['aiub.edu'],
            ],
            [
                'name' => 'Daffodil International University',
                'short_name' => 'DIU',
                'domains' => ['diu.edu.bd'],
            ],
            [
                'name' => 'Ahsanullah University of Science and Technology',
                'short_name' => 'AUST',
                'domains' => ['aust.edu'],
            ],
            [
                'name' => 'Independent University, Bangladesh',
                'short_name' => 'IUB',
                'domains' => ['iub.edu.bd'],
            ],
            [
                'name' => 'Shahjalal University of Science and Technology',
                'short_name' => 'SUST',
                'domains' => ['sust.edu'],
            ],
        ];

        foreach ($data as $uni) {
            $university = University::firstOrCreate(
                ['short_name' => $uni['short_name']],
                ['name' => $uni['name'], 'is_active' => true]
            );

            foreach ($uni['domains'] as $domain) {
                UniversityEmailDomain::firstOrCreate(
                    ['university_id' => $university->id, 'domain' => $domain],
                    ['is_active' => true]
                );
            }
        }
    }
}