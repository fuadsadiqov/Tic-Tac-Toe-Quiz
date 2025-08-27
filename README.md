# Tic Tac Toe – Backend (NestJS)
🎯 Layihə haqqında

Bu layihə Tic Tac Toe oyununun backend hissəsidir. Oyun fərqlidir: X və O-lar real məşhur şəxslərin adlarıdır və oyunda hər oyun üçün random attribute/category-lər seçilir, hansı ki həmin meyarlara əsasən məşhur şəxslər (Person) seçilir.

Backend NestJS + TypeORM + PostgreSQL üzərində qurulub və aşağıdakı əsas funksionallıqları təmin edir:

İstifadəçi qeydiyyatı və login (JWT authentication)

Oyun sessiyalarının yaradılması (Game)

Oyunda hərəkətlərin əlavə olunması (Move)

Person və Attribute məlumatlarının idarəsi

Hər oyun üçün random seçilmiş category-lərin saxlanması

📦 Texnologiyalar

Node.js v20+
NestJS
TypeORM
PostgreSQL
bcrypt (şifrə hash-ləmə)

JWT (token-based authentication)

🗂 Database Structure (ERD)

Əsas cədvəllər:
User – oyunçular, autentifikasiya üçün
Game – oyun sessiyası
Move – oyunda hərəkətlər
Person – məşhur şəxslər
Attribute – oyun category-ləri (məsələn: "Nationality", "Club")
PlayerAttribute – hansı person hansı attribute-a malikdir

Əlaqələr:

User ↔ Game (X və O oyunçuları)

Game ↔ Move

Move ↔ Person (seçilmiş məşhur şəxs)

Person ↔ Attribute (N:M)

⚙️ Quraşdırma

1. Repository-ni klonla:

## bash
git clone https://github.com/fuadsadiqov/tic-tac-toe-quiz.git
cd tic-tac-toe-quiz

npm install
###

2. .env faylı yarat və konfiqurasiya et:

## env
DATABASE_HOST=
DATABASE_PORT=
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_NAME=
JWT_SECRET=
##

3. PostgreSQL-də verilənlər bazasını yarat:
CREATE DATABASE database;

4. Serveri işə sal:
##
npm run start:dev
##

🚀 API Endpoints
Auth

POST /auth/register – istifadəçi qeydiyyatı

POST /auth/login – istifadəçi login

Users

GET /users – bütün istifadəçiləri gətirir (admin üçün)

Games

POST /games – yeni oyun yaratmaq

GET /games/:id – oyun vəziyyətini gətirir

Moves

POST /games/:id/move – oyuna hərəkət əlavə etmək

Persons & Attributes

GET /persons – məşhur şəxsləri gətirir

GET /attributes – oyun üçün category-ləri gətirir

🔐 Autentifikasiya

JWT token əsasında.

Authorization: Bearer <token> header ilə qorunan route-lara daxil olmaq mümkündür.

📝 Qeydlər

Hər oyun üçün category-lər random seçilir və GameCategory cədvəlində saxlanılır.

Oyunun gedişində eyni category-lər istifadə olunur.

synchronize: true TypeORM parametri MVP üçün aktivdir; production üçün migration-lar tövsiyə olunur.

📚 Gələcək İstiqamətlər

Online multiplayer dəstəyi

Bot ilə oyun

Admin panel – person və attribute əlavə etmək üçün

Leaderboard və ELO sistemi
