import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import { copyFileSync, mkdirSync, existsSync } from 'fs';

// Custom plugin to copy components during build
const copyComponents = () => ({
  name: 'copy-components',
  apply: 'build',
  closeBundle() {
    const srcDir = path.resolve(__dirname, 'src/components');
    const destDir = path.resolve(__dirname, 'dist/src/components');
    
    if (!existsSync(destDir)) {
      mkdirSync(destDir, { recursive: true });
    }
    
    const components = [
      'clients.html',
      'contact.html',
      'footer.html',
      'hero.html',
      'services.html',
      'values.html',
      'work.html'
    ];
    
    components.forEach(component => {
      const srcPath = path.join(srcDir, component);
      const destPath = path.join(destDir, component);
      copyFileSync(srcPath, destPath);
    });
  }
});

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      plugins: [
        legacy({
          targets: ['defaults', 'not IE 11'],
        }),
        copyComponents()
      ],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});