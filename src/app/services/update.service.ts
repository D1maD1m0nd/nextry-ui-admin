import { Injectable } from '@angular/core';
import { check } from '@tauri-apps/plugin-updater';
import { BehaviorSubject } from 'rxjs';

interface UpdateEvent {
  event: 'Started' | 'Progress' | 'Finished' | 'Error';
  data?: {
    contentLength?: number;
    chunkLength?: number;
  };
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UpdateService {
  private updateStatusSubject = new BehaviorSubject<string>('');
  updateStatus$ = this.updateStatusSubject.asObservable();

  async checkForUpdates(): Promise<void> {
    try {
      this.updateStatusSubject.next('Проверка обновлений...');
      console.log('Начинаем проверку обновлений');

      const update = await check();
      console.log(update);
      if (update) {
        console.log('Найдено обновление:', {
          version: update.version,
          date: update.date,
          body: update.body
        });

        this.updateStatusSubject.next(`Найдено обновление: ${update.version}`);

        let downloaded = 0;
        let contentLength = 0;

        await update.downloadAndInstall((event: UpdateEvent) => {
          switch (event.event) {
            case 'Started':
              if (event.data?.contentLength) {
                contentLength = event.data.contentLength;
                console.log(`Начало загрузки: ${contentLength} байт`);
                this.updateStatusSubject.next('Начало загрузки обновления...');
              }
              break;

            case 'Progress':
              if (event.data?.chunkLength) {
                downloaded += event.data.chunkLength;
                const progress = Math.round((downloaded / contentLength) * 100);
                console.log(`Загружено: ${downloaded} из ${contentLength} байт (${progress}%)`);
                this.updateStatusSubject.next(`Загрузка: ${progress}%`);
              }
              break;

            case 'Error':
              const errorMessage = event.error || 'Неизвестная ошибка';
              console.error('Ошибка при загрузке:', errorMessage);
              this.updateStatusSubject.next(`Ошибка загрузки: ${errorMessage}`);
              break;

            case 'Finished':
              console.log('Загрузка завершена');
              this.updateStatusSubject.next('Загрузка завершена');
              break;
          }
        });

        console.log('Обновление установлено');
        this.updateStatusSubject.next('Обновление установлено. Перезапуск...');
        
        // Даем время для отображения сообщения перед перезапуском
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Используем window.__TAURI__.process.relaunch() вместо импорта
        await (window as any).__TAURI__.process.relaunch();
      } else {
        console.log('Обновлений не найдено');
        this.updateStatusSubject.next('Обновлений не найдено');
      }
    } catch (error: unknown) {
      console.error('Ошибка при проверке обновлений:', error);
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      this.updateStatusSubject.next(`Ошибка: ${errorMessage}`);
    }
  }
} 