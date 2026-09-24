<?php

use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\BanController;
use App\Http\Controllers\Api\CatecheseController;
use App\Http\Controllers\Api\ContactMessageController;
use App\Http\Controllers\Api\DailyReadingController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DonationController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\JournalController;
use App\Http\Controllers\Api\HomelieController;
use App\Http\Controllers\Api\IntentionMesseController;
use App\Http\Controllers\Api\MassScheduleController;
use App\Http\Controllers\Api\MediaController;
use App\Http\Controllers\Api\MouvementController;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\PrayerTimeController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProjetController;
use App\Http\Controllers\Api\RegistreController;
use App\Http\Controllers\Api\SacrementController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\Api\TeamMemberController;
use App\Http\Controllers\Api\UploadController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });
});

// ── Public read endpoints ──────────────────────────────────────────────
Route::get('/settings', [SettingsController::class, 'index']);

Route::get('/mass-schedule', [MassScheduleController::class, 'index']);
Route::get('/mass-schedule/next', [MassScheduleController::class, 'next']);
Route::get('/mass-schedule/today', [MassScheduleController::class, 'today']);

Route::get('/events', [EventController::class, 'index']);
Route::get('/event-categories', [EventController::class, 'categories']);

Route::get('/media', [MediaController::class, 'index']);
Route::get('/media-categories', [MediaController::class, 'categories']);

Route::get('/equipe', [TeamMemberController::class, 'index']);
Route::get('/equipe/{slug}', [TeamMemberController::class, 'show']);

Route::get('/lectures/jour', [DailyReadingController::class, 'show']);

Route::get('/news', [NewsController::class, 'index']);
Route::get('/news/{news}', [NewsController::class, 'show']);
Route::get('/news-categories', [NewsController::class, 'categories']);

Route::get('/sacrements', [SacrementController::class, 'index']);
Route::get('/sacrements/{slug}', [SacrementController::class, 'show']);

Route::get('/catechese/niveaux', [CatecheseController::class, 'niveaux']);
Route::post('/catechese/inscriptions', [CatecheseController::class, 'storeInscription']);

Route::get('/priere', [PrayerTimeController::class, 'index']);

Route::post('/intentions', [IntentionMesseController::class, 'store']);

Route::post('/contact', [ContactMessageController::class, 'store']);
Route::post('/bans', [BanController::class, 'store']);

Route::get('/homelies', [HomelieController::class, 'index']);
Route::get('/homelies/latest', [HomelieController::class, 'latest']);
Route::get('/homelies/{slug}', [HomelieController::class, 'show']);

Route::get('/mouvements', [MouvementController::class, 'index']);
Route::get('/mouvements/{slug}', [MouvementController::class, 'show']);

Route::get('/projets', [ProjetController::class, 'index']);
Route::get('/projets/{projet}', [ProjetController::class, 'show']);

Route::post('/registre', [RegistreController::class, 'store']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{slug}', [ProductController::class, 'show']);
Route::post('/orders', [OrderController::class, 'store']);
Route::get('/my-orders', [OrderController::class, 'myOrders'])->middleware('auth:sanctum');

Route::get('/payments/{reference}', [PaymentController::class, 'show'])->middleware('throttle:30,1');
Route::post('/payments/{reference}/retry', [PaymentController::class, 'retry'])->middleware('throttle:5,1');
Route::post('/payments/peex/callback', [PaymentController::class, 'peexCallback']);

Route::get('/journal/tarifs', [JournalController::class, 'tarifs']);
Route::get('/journal/issues', [JournalController::class, 'issues']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/donations', [DonationController::class, 'store']);
    Route::get('/my-donations', [DonationController::class, 'myDonations']);

    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/favorites/{homelie}', [FavoriteController::class, 'store']);
    Route::delete('/favorites/{homelie}', [FavoriteController::class, 'destroy']);

    Route::get('/journal/my-subscription', [JournalController::class, 'mySubscription']);
    Route::post('/journal/subscribe', [JournalController::class, 'subscribe']);
});

// ── Admin-only endpoints ───────────────────────────────────────────────
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::put('/settings', [SettingsController::class, 'update']);

    Route::get('/mass-schedule', [MassScheduleController::class, 'adminIndex']);
    Route::post('/mass-schedule', [MassScheduleController::class, 'store']);
    Route::put('/mass-schedule/{massSchedule}', [MassScheduleController::class, 'update']);
    Route::delete('/mass-schedule/{massSchedule}', [MassScheduleController::class, 'destroy']);

    Route::post('/uploads/image', [UploadController::class, 'image']);

    Route::get('/events', [EventController::class, 'adminIndex']);
    Route::post('/events', [EventController::class, 'store']);
    Route::put('/events/{event}', [EventController::class, 'update']);
    Route::delete('/events/{event}', [EventController::class, 'destroy']);
    Route::post('/event-categories', [EventController::class, 'storeCategory']);
    Route::put('/event-categories/{category}', [EventController::class, 'updateCategory']);
    Route::delete('/event-categories/{category}', [EventController::class, 'destroyCategory']);

    Route::get('/media', [MediaController::class, 'adminIndex']);
    Route::post('/media', [MediaController::class, 'store']);
    Route::put('/media/{media}', [MediaController::class, 'update']);
    Route::delete('/media/{media}', [MediaController::class, 'destroy']);
    Route::post('/media-categories', [MediaController::class, 'storeCategory']);
    Route::put('/media-categories/{category}', [MediaController::class, 'updateCategory']);
    Route::delete('/media-categories/{category}', [MediaController::class, 'destroyCategory']);

    Route::get('/equipe', [TeamMemberController::class, 'adminIndex']);
    Route::post('/equipe', [TeamMemberController::class, 'store']);
    Route::put('/equipe/{teamMember}', [TeamMemberController::class, 'update']);
    Route::delete('/equipe/{teamMember}', [TeamMemberController::class, 'destroy']);

    Route::get('/lectures', [DailyReadingController::class, 'adminIndex']);
    Route::post('/lectures', [DailyReadingController::class, 'store']);
    Route::put('/lectures/{dailyReading}', [DailyReadingController::class, 'update']);
    Route::delete('/lectures/{dailyReading}', [DailyReadingController::class, 'destroy']);

    Route::get('/news', [NewsController::class, 'adminIndex']);
    Route::post('/news', [NewsController::class, 'store']);
    Route::put('/news/{news}', [NewsController::class, 'update']);
    Route::delete('/news/{news}', [NewsController::class, 'destroy']);
    Route::post('/news-categories', [NewsController::class, 'storeCategory']);
    Route::put('/news-categories/{category}', [NewsController::class, 'updateCategory']);
    Route::delete('/news-categories/{category}', [NewsController::class, 'destroyCategory']);

    Route::get('/sacrements', [SacrementController::class, 'adminIndex']);
    Route::post('/sacrements', [SacrementController::class, 'store']);
    Route::put('/sacrements/{sacrement}', [SacrementController::class, 'update']);
    Route::delete('/sacrements/{sacrement}', [SacrementController::class, 'destroy']);

    Route::get('/catechese/niveaux', [CatecheseController::class, 'adminNiveaux']);
    Route::post('/catechese/niveaux', [CatecheseController::class, 'storeNiveau']);
    Route::put('/catechese/niveaux/{niveau}', [CatecheseController::class, 'updateNiveau']);
    Route::delete('/catechese/niveaux/{niveau}', [CatecheseController::class, 'destroyNiveau']);
    Route::get('/catechese/inscriptions', [CatecheseController::class, 'adminInscriptions']);
    Route::patch('/catechese/inscriptions/{inscription}', [CatecheseController::class, 'updateInscription']);

    Route::get('/priere', [PrayerTimeController::class, 'adminIndex']);
    Route::post('/priere', [PrayerTimeController::class, 'store']);
    Route::put('/priere/{prayerTime}', [PrayerTimeController::class, 'update']);
    Route::delete('/priere/{prayerTime}', [PrayerTimeController::class, 'destroy']);

    Route::get('/intentions', [IntentionMesseController::class, 'adminIndex']);
    Route::patch('/intentions/{intention}', [IntentionMesseController::class, 'update']);

    Route::get('/contact', [ContactMessageController::class, 'adminIndex']);
    Route::patch('/contact/{contactMessage}', [ContactMessageController::class, 'update']);
    Route::delete('/contact/{contactMessage}', [ContactMessageController::class, 'destroy']);

    Route::get('/bans', [BanController::class, 'adminIndex']);
    Route::patch('/bans/{ban}', [BanController::class, 'update']);
    Route::delete('/bans/{ban}', [BanController::class, 'destroy']);

    Route::get('/homelies', [HomelieController::class, 'adminIndex']);
    Route::post('/homelies', [HomelieController::class, 'store']);
    Route::put('/homelies/{homelie}', [HomelieController::class, 'update']);
    Route::delete('/homelies/{homelie}', [HomelieController::class, 'destroy']);

    Route::get('/mouvements', [MouvementController::class, 'adminIndex']);
    Route::post('/mouvements', [MouvementController::class, 'store']);
    Route::put('/mouvements/{mouvement}', [MouvementController::class, 'update']);
    Route::delete('/mouvements/{mouvement}', [MouvementController::class, 'destroy']);

    Route::get('/projets', [ProjetController::class, 'adminIndex']);
    Route::post('/projets', [ProjetController::class, 'store']);
    Route::put('/projets/{projet}', [ProjetController::class, 'update']);
    Route::delete('/projets/{projet}', [ProjetController::class, 'destroy']);
    Route::post('/projets/{projet}/photos', [ProjetController::class, 'uploadPhotos']);
    Route::delete('/projets/{projet}/photos/{photoId}', [ProjetController::class, 'destroyPhoto']);

    Route::get('/registre', [RegistreController::class, 'adminIndex']);
    Route::post('/registre', [RegistreController::class, 'adminStore']);
    Route::delete('/registre/{registreInscription}', [RegistreController::class, 'destroy']);

    Route::get('/products', [ProductController::class, 'adminIndex']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);

    Route::get('/orders', [OrderController::class, 'adminIndex']);
    Route::patch('/orders/{order}', [OrderController::class, 'update']);

    Route::get('/donations', [DonationController::class, 'adminIndex']);
    Route::patch('/donations/{donation}', [DonationController::class, 'update']);

    Route::get('/journal/tarifs', [JournalController::class, 'adminTarifs']);
    Route::post('/journal/tarifs', [JournalController::class, 'storeTarif']);
    Route::put('/journal/tarifs/{tarif}', [JournalController::class, 'updateTarif']);
    Route::delete('/journal/tarifs/{tarif}', [JournalController::class, 'destroyTarif']);

    Route::get('/journal/issues', [JournalController::class, 'adminIssues']);
    Route::post('/journal/issues', [JournalController::class, 'storeIssue']);
    Route::put('/journal/issues/{issue}', [JournalController::class, 'updateIssue']);
    Route::delete('/journal/issues/{issue}', [JournalController::class, 'destroyIssue']);

    Route::get('/journal/subscriptions', [JournalController::class, 'adminSubscriptions']);
    Route::patch('/journal/subscriptions/{subscription}', [JournalController::class, 'toggleSubscription']);
});
