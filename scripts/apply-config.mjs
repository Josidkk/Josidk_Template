// 🚀 Josidk Template — apply-config.mjs
// Aplica automáticamente una configuración personalizada al proyecto.
//
// Uso:
//   1. Coloca josidk-config.json en la raíz del proyecto
//   2. Ejecuta: node scripts/apply-config.mjs
//   3. Ejecuta: npm install (si se eliminaron dependencias)

import { readFileSync, writeFileSync, existsSync, rmSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const CONFIG_PATH = join(PROJECT_ROOT, 'josidk-config.json');

// ─── Lectura de configuración ───

if (!existsSync(CONFIG_PATH)) {
  console.error('❌ No se encuentra josidk-config.json en la raíz del proyecto.');
  console.error('   Ejecuta este script desde la raíz del proyecto.');
  process.exit(1);
}

const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));

console.log('🚀 Aplicando configuración de Josidk Template...\n');

// ─── 1. Colores / Tema ───

console.log('🎨 Aplicando paleta de colores...');

const stylesPath = join(PROJECT_ROOT, 'src', 'styles.scss');

function replaceCSSVar(content, varName, newValue) {
  const regex = new RegExp('(' + varName + ':\\s*)[^;]+(;)', 'g');
  return content.replace(regex, '$1' + newValue + '$2');
}

if (existsSync(stylesPath)) {
  let styles = readFileSync(stylesPath, 'utf-8');

  // Colores modo claro (dentro de :root)
  for (const [key, value] of Object.entries(config.theme.colors || {})) {
    styles = replaceCSSVar(styles, key, value);
  }

  // Colores modo oscuro (dentro de body.dark-theme)
  const darkColors = config.theme.darkColors || {};
  // Extraer bloque dark-theme
  const darkBlockMatch = styles.match(/body\s*\.dark-theme\s*\{([^}]*)\}/);
  if (darkBlockMatch && Object.keys(darkColors).length > 0) {
    let darkBlock = darkBlockMatch[1];
    for (const [key, value] of Object.entries(darkColors)) {
      const regex = new RegExp('(' + key + ':\\s*)[^;]+(;)', 'g');
      darkBlock = darkBlock.replace(regex, '$1' + value + '$2');
    }
    styles = styles.replace(darkBlockMatch[0], 'body.dark-theme {' + darkBlock + '}');
    console.log('  ✅ Colores modo oscuro aplicados en body.dark-theme');
  }

  writeFileSync(stylesPath, styles, 'utf-8');
  console.log('  ✅ Colores (claro + oscuro) aplicados en src/styles.scss');
} 
else {
  console.warn('  ⚠️ No se encontró src/styles.scss');
}

// ─── 2. Modo oscuro por defecto ───

if (config.theme.defaultDarkMode === 'dark') {
  console.log('🌙 Modo oscuro como predeterminado — ajusta manualmente en ThemeService si es necesario');
}

// ─── 3. Eliminar páginas excluidas ───

const excludedPages = config.modules.excluded || [];

if (excludedPages.length > 0) {
  console.log('📄 Eliminando ' + excludedPages.length + ' página(s) no seleccionadas...');

  const pagesDir = join(PROJECT_ROOT, 'src', 'app', 'pages');
  if (existsSync(pagesDir)) {
    const entries = readdirSync(pagesDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && excludedPages.includes(entry.name)) {
        const pagePath = join(pagesDir, entry.name);
        rmSync(pagePath, { recursive: true, force: true });
        console.log('  🗑️  Eliminado: src/app/pages/' + entry.name);
      }
    }
  }
} else {
  console.log('📄 Todas las páginas están incluidas. Saltando eliminación.');
}

// ─── 4. Actualizar rutas ───

console.log('🗺️  Actualizando rutas...');

function removeRouteBlocks(content, pageIds) {
  let result = content;
  for (const pageId of pageIds) {
    // Buscar el bloque de ruta que contiene path: 'pageId'
    const regex = new RegExp(
      '\\s*\\{\\s*\\n?\\s*path:\\s*[\'"]' + pageId + '[\'"].*?\\}(\\n?\\s*,)?',
      'gs'
    );
    result = result.replace(regex, '');
  }
  return result;
}

const routesPath = join(PROJECT_ROOT, 'src', 'app', 'app.routes.ts');
if (existsSync(routesPath)) {
  let routes = readFileSync(routesPath, 'utf-8');
  routes = removeRouteBlocks(routes, excludedPages);
  writeFileSync(routesPath, routes, 'utf-8');
  console.log('  ✅ Rutas actualizadas en app.routes.ts');
}

// ─── 5. Actualizar sidebar ───

console.log('📌 Actualizando menú lateral...');

function removeSidebarItems(content, pageIds) {
  let result = content;
  for (const pageId of pageIds) {
    // Buscar objetos del menú: { id: 'pageId', ... }
    const regex = new RegExp(
      '\\s*\\{\\s*id:\\s*[\'"]' + pageId + '[\'"].*?\\}\\n?\\s*,?',
      'gs'
    );
    result = result.replace(regex, '');
  }
  return result;
}

const sidebarPath = join(PROJECT_ROOT, 'src', 'app', 'shared', 'sidebar', 'sidebar.component.ts');
if (existsSync(sidebarPath)) {
  let sidebar = readFileSync(sidebarPath, 'utf-8');
  sidebar = removeSidebarItems(sidebar, excludedPages);
  writeFileSync(sidebarPath, sidebar, 'utf-8');
  console.log('  ✅ Sidebar actualizado');
}

// ─── 6. Layout ───

console.log('📐 Aplicando configuración de layout...');

if (existsSync(stylesPath)) {
  let styles = readFileSync(stylesPath, 'utf-8');

  const layoutChanges = {
    '--sidebar-width': config.layout.sidebarWidth + 'px',
    '--sidebar-collapsed-width': config.layout.sidebarCollapsedWidth + 'px',
    '--content-radius': config.layout.contentRadius + 'px',
    '--transition-speed': config.layout.transitionSpeed + 's',
    '--font-family': config.layout.font,
  };

  // Solo reemplazar dentro de :root, no en body.dark-theme
  const rootEnd = styles.indexOf('body.dark-theme');
  const rootSection = rootEnd > -1 ? styles.substring(0, rootEnd) : styles;
  const darkSection = rootEnd > -1 ? styles.substring(rootEnd) : '';

  for (const [key, value] of Object.entries(layoutChanges)) {
    const regex = new RegExp('(' + key + ':\\s*)[^;]+(;)', 'g');
    // Solo en la sección :root
    const updated = rootSection.replace(regex, '$1' + value + '$2');
    styles = updated + darkSection;
  }
  styles = replaceCSSVar(styles, key, value);
}

writeFileSync(stylesPath, styles, 'utf-8');
console.log('  ✅ Layout aplicado en styles.scss');


// ─── 7. package.json (limpiar dependencias) ───

console.log('📦 Limpiando dependencias...');

const pkgPath = join(PROJECT_ROOT, 'package.json');
if (existsSync(pkgPath)) {
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));

  const depsToRemove = [];
  if (config.dependencies && config.dependencies['chart.js'] === false) {
    depsToRemove.push('chart.js', 'ng2-charts');
  }

  for (const dep of depsToRemove) {
    if (pkg.dependencies && pkg.dependencies[dep]) {
      delete pkg.dependencies[dep];
      console.log('  🗑️  Eliminada dependencia: ' + dep);
    }
  }

  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf-8');
  console.log('  ✅ package.json actualizado');
}

// ─── Resumen ───

console.log('\n✅ ¡Configuración aplicada correctamente!');
console.log('📦 Ejecuta "npm install" para sincronizar dependencias.');
console.log('🚀 Corre "npm start" para iniciar el servidor de desarrollo.\n');

if (excludedPages.length > 0) {
  console.log('⚠️  Páginas eliminadas: ' + excludedPages.join(', '));
  console.log('   Si ves errores de importación, verifica que no haya referencias');
  console.log('   a estas páginas en otros archivos (ej. navbar, breadcrumbs).');
}
