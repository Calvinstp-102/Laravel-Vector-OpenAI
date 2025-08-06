<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\MainController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/vector-stores', [MainController::class, 'getVectorStores']);
Route::post('/vector-stores', [MainController::class, 'createVectorStore']);
Route::put('/vector-stores/{id}', [MainController::class, 'updateVectorStore']);
Route::delete('/vector-stores/{id}', [MainController::class, 'deleteVectorStore']);

# File Management
Route::get('/files', [MainController::class, 'listFiles']);
Route::post('/files/upload', [MainController::class, 'uploadFiles']);
Route::delete('/files/{id}', [MainController::class, 'deleteFile']);

# Assistant Management
Route::get('/assistants', [MainController::class, 'listAssistants']);
Route::post('/assistants', [MainController::class, 'createAssistant']);
Route::put('/assistants/{id}', [MainController::class, 'updateAssistant']);
Route::delete('/assistants/{id}', [MainController::class, 'deleteAssistant']);
Route::get('/assistants/linked', [MainController::class, 'getLinkedAssistants']);
Route::get('/assistants/{id}', [MainController::class, 'getAssistantDetail']);

# Modul Chat
Route::post('/chat/reset', [MainController::class, 'resetChat']);
Route::post('/chat/send', [MainController::class, 'sendMessage']);

Route::post('/chat/send-message/{assistant_id}', [MainController::class, 'sendMessage']);

# Chat History
Route::get('/chat/threads', [MainController::class, 'listThreads']);
Route::get('/chat/threads/{id}', [MainController::class, 'threadDetail']);

# Relasi File ↔ Vector Store
Route::get('/files/unassigned', [MainController::class, 'getUnassignedFiles']);
Route::get('/vector-stores/{id}/files', [MainController::class, 'getFilesByVectorStore']);
Route::post('/vector-stores/{id}/attach-files', [MainController::class, 'attachFilesToVectorStore']);
Route::post('/files/{id}/detach', [MainController::class, 'detachFile']);

# Relasi Assistant ↔ Vector Store
Route::get('/vector-stores/{id}/assistants', [MainController::class, 'getAssistantsByVectorStore']);
Route::get('/assistants/unassigned', [MainController::class, 'getUnassignedAssistants']);
Route::post('/vector-stores/{id}/attach-assistants', [MainController::class, 'attachAssistantsToVectorStore']);
Route::post('/assistants/{id}/detach', [MainController::class, 'detachAssistant']);

Route::post('/thread/create', [MainController::class, 'createThread']);
