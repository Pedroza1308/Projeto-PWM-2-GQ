// my-app/polyfills.ts

import { Buffer } from 'buffer';

// 1. Garante o Buffer
if (typeof global.Buffer === 'undefined') {
  global.Buffer = Buffer;
}

// 2. Garante o process
if (typeof global.process === 'undefined') {
  global.process = require('process');
}

// 3. Garante process.version (A CORREÇÃO DO ERRO SLICE É AQUI)
if (!global.process.version) {
  global.process.version = 'v18.0.0'; // Valor fictício para enganar as libs
}

// 4. Garante process.nextTick
if (!global.process.nextTick) {
  const processPolyfill = require('process');
  global.process.nextTick = processPolyfill.nextTick;
}

// 5. Garante crypto
import 'react-native-get-random-values';