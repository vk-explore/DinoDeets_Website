import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/DinoDeets_Website/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        fossilDig: resolve(__dirname, 'games/fossil-dig.html'),
        dinoQuiz: resolve(__dirname, 'games/dino-quiz.html'),
        dinoCreator: resolve(__dirname, 'games/dino-creator.html'),
        dinoMap: resolve(__dirname, 'explore/dino-map.html'),
        dinoTimeline: resolve(__dirname, 'explore/dino-timeline.html'),
        dinoMeter: resolve(__dirname, 'explore/dino-meter.html'),
        encyclopedia: resolve(__dirname, 'explore/encyclopedia.html'),
        dinoDetail: resolve(__dirname, 'explore/dino-detail.html'),
        origins: resolve(__dirname, 'explore/origins.html'),
        extinction: resolve(__dirname, 'explore/extinction.html'),
        paleoGuide: resolve(__dirname, 'explore/paleo-guide.html'),
        art: resolve(__dirname, 'art/index.html'),
      }
    }
  }
});
