import { PatternConfig } from '@/Components/African/PatternCustomizer';
import { EnhancedPatternConfig } from '@/Pages/PatternCustomizer';

/**
 * Generates an SVG string for a pattern based on the pattern type
 * @param config The pattern configuration
 * @returns SVG string representation of the pattern
 */
export function generatePatternSVG(config: PatternConfig | EnhancedPatternConfig): string {
  const { pattern, primaryColor, secondaryColor, size } = config;

  // Base SVG wrapper
  const svgStart = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;
  const svgEnd = '</svg>';

  let svgContent = '';

  // Check if this is an enhanced pattern with layers
  const isEnhanced = 'layers' in config && config.layers && config.layers.length > 0;

  // If it's an enhanced pattern with layers, we need to create a more complex SVG
  if (isEnhanced) {
    // Add a background if specified
    if (config.backgroundColor && config.backgroundColor !== 'transparent') {
      svgContent += `<rect width="${size}" height="${size}" fill="${config.backgroundColor}" />`;
    }

    // Add the base pattern with transformations
    const baseTransform = getTransformString(config);
    svgContent += `<g transform="${baseTransform}">`;
    svgContent += generatePatternContent(pattern, size, primaryColor, secondaryColor);
    svgContent += `</g>`;

    // Add each layer
    (config as EnhancedPatternConfig).layers?.forEach(layer => {
      const layerTransform = getTransformString(layer);
      svgContent += `<g transform="${layerTransform}" style="mix-blend-mode: ${layer.blendMode || 'normal'}">`;
      svgContent += generatePatternContent(
        layer.pattern,
        layer.size || size,
        layer.primaryColor,
        layer.secondaryColor || secondaryColor
      );
      svgContent += `</g>`;
    });

    return svgStart + svgContent + svgEnd;
  }

  // For simple patterns, just generate the pattern content
  svgContent = generatePatternContent(pattern, size, primaryColor, secondaryColor);
  return svgStart + svgContent + svgEnd;
}

/**
 * Generates a transform string for a pattern based on its transformation properties
 */
function getTransformString(config: PatternConfig | EnhancedPatternConfig): string {
  let transform = '';

  // Add rotation if specified
  if ('rotation' in config && config.rotation) {
    transform += `rotate(${config.rotation}, ${config.size/2}, ${config.size/2}) `;
  }

  // Add scale if specified
  if ('scale' in config && config.scale && config.scale !== 1) {
    transform += `scale(${config.scale}) `;
  }

  // Add flip transformations if specified
  if ('flipX' in config && config.flipX) {
    transform += `scale(-1, 1) translate(-${config.size}, 0) `;
  }

  if ('flipY' in config && config.flipY) {
    transform += `scale(1, -1) translate(0, -${config.size}) `;
  }

  // Add position transformations if specified
  if ('positionX' in config && config.positionX) {
    transform += `translate(${config.positionX * config.size / 100}, 0) `;
  }

  if ('positionY' in config && config.positionY) {
    transform += `translate(0, ${config.positionY * config.size / 100}) `;
  }

  return transform.trim();
}

/**
 * Generates pattern-specific SVG content
 */
function generatePatternContent(pattern: string, size: number, primaryColor: string, secondaryColor: string): string {
  // Generate pattern-specific SVG content
  switch (pattern) {
    case 'kente':
      svgContent = generateKentePattern(size, primaryColor, secondaryColor);
      break;
    case 'zigzag':
      svgContent = generateZigzagPattern(size, primaryColor, secondaryColor);
      break;
    case 'adire':
      svgContent = generateAdirePattern(size, primaryColor, secondaryColor);
      break;
    case 'mudcloth':
      svgContent = generateMudclothPattern(size, primaryColor, secondaryColor);
      break;
    case 'adinkra':
      svgContent = generateAdinkraPattern(size, primaryColor, secondaryColor);
      break;
    case 'tribal':
      svgContent = generateTribalPattern(size, primaryColor, secondaryColor);
      break;
    case 'chitenge-geometric':
      svgContent = generateChitengeGeometricPattern(size, primaryColor, secondaryColor);
      break;
    case 'chitenge-floral':
      svgContent = generateChitengeFloralPattern(size, primaryColor, secondaryColor);
      break;
    case 'chitenge-wave':
      svgContent = generateChitengeWavePattern(size, primaryColor, secondaryColor);
      break;
    case 'chitenge-spiral':
      svgContent = generateChitengeSpiralPattern(size, primaryColor, secondaryColor);
      break;
    case 'ndebele-geometric':
      svgContent = generateNdebeleGeometricPattern(size, primaryColor, secondaryColor);
      break;
    case 'ndebele-zigzag':
      svgContent = generateNdebeleZigzagPattern(size, primaryColor, secondaryColor);
      break;
    case 'ndebele-triangular':
      svgContent = generateNdebeleTriangularPattern(size, primaryColor, secondaryColor);
      break;
    case 'ndebele-step':
      svgContent = generateNdebeleStepPattern(size, primaryColor, secondaryColor);
      break;
    default:
      svgContent = `<rect width="${size}" height="${size}" fill="${primaryColor}" opacity="0.1" />`;
  }

  return svgStart + svgContent + svgEnd;
}

/**
 * Exports a pattern as an SVG file
 * @param config The pattern configuration
 */
export function exportPatternAsSVG(config: PatternConfig | EnhancedPatternConfig): void {
  const svg = generatePatternSVG(config);
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);

  // Generate a filename based on pattern name or pattern type
  let filename = '';
  if ('name' in config && config.name && config.name !== 'Untitled Pattern') {
    // Convert name to kebab-case for filename
    filename = config.name.toLowerCase().replace(/\s+/g, '-');
  } else {
    filename = `${config.pattern}`;
  }

  // Add -layered suffix if it has layers
  if ('layers' in config && config.layers && config.layers.length > 0) {
    filename += '-layered';
  }

  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}-pattern.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Pattern generator functions
function generateKentePattern(size: number, primaryColor: string, secondaryColor: string): string {
  return `
    <rect width="${size/2}" height="${size/2}" fill="${primaryColor}" />
    <rect x="${size/2}" y="0" width="${size/2}" height="${size/2}" fill="${secondaryColor}" />
    <rect x="0" y="${size/2}" width="${size/2}" height="${size/2}" fill="${secondaryColor}" />
    <rect x="${size/2}" y="${size/2}" width="${size/2}" height="${size/2}" fill="${primaryColor}" />
  `;
}

function generateZigzagPattern(size: number, primaryColor: string, secondaryColor: string): string {
  return `
    <path d="M0,${size/4} L${size/4},0 L${size/2},${size/4} L${size*3/4},0 L${size},${size/4} L${size},${size*3/4} L${size*3/4},${size} L${size/2},${size*3/4} L${size/4},${size} L0,${size*3/4} Z" fill="${primaryColor}" />
  `;
}

function generateAdirePattern(size: number, primaryColor: string, secondaryColor: string): string {
  return `
    <circle cx="${size/2}" cy="${size/2}" r="${size/4}" fill="${primaryColor}" />
    <circle cx="${size/2}" cy="${size/2}" r="${size/8}" fill="${secondaryColor}" />
  `;
}

function generateMudclothPattern(size: number, primaryColor: string, secondaryColor: string): string {
  return `
    <rect width="${size}" height="${size}" fill="${primaryColor}" opacity="0.1" />
    <line x1="0" y1="${size/3}" x2="${size}" y2="${size/3}" stroke="${secondaryColor}" stroke-width="2" />
    <line x1="0" y1="${size*2/3}" x2="${size}" y2="${size*2/3}" stroke="${secondaryColor}" stroke-width="2" />
    <line x1="${size/3}" y1="0" x2="${size/3}" y2="${size}" stroke="${secondaryColor}" stroke-width="2" />
    <line x1="${size*2/3}" y1="0" x2="${size*2/3}" y2="${size}" stroke="${secondaryColor}" stroke-width="2" />
  `;
}

function generateAdinkraPattern(size: number, primaryColor: string, secondaryColor: string): string {
  return `
    <circle cx="${size/2}" cy="${size/2}" r="${size/3}" stroke="${primaryColor}" stroke-width="2" fill="none" />
    <path d="M${size/2},${size/6} L${size/3},${size/2} L${size/2},${size*5/6} L${size*2/3},${size/2} Z" stroke="${secondaryColor}" stroke-width="2" fill="none" />
  `;
}

function generateTribalPattern(size: number, primaryColor: string, secondaryColor: string): string {
  return `
    <rect width="${size}" height="${size}" fill="${primaryColor}" opacity="0.1" />
    <path d="M${size/4},${size/4} L${size*3/4},${size/4} L${size*3/4},${size*3/4} L${size/4},${size*3/4} Z" stroke="${secondaryColor}" stroke-width="2" fill="none" />
    <line x1="${size/2}" y1="${size/4}" x2="${size/2}" y2="${size*3/4}" stroke="${secondaryColor}" stroke-width="2" />
    <line x1="${size/4}" y1="${size/2}" x2="${size*3/4}" y2="${size/2}" stroke="${secondaryColor}" stroke-width="2" />
  `;
}

function generateChitengeGeometricPattern(size: number, primaryColor: string, secondaryColor: string): string {
  return `
    <rect width="${size}" height="${size}" fill="${primaryColor}" opacity="0.1" />
    <rect x="${size/6}" y="${size/6}" width="${size*2/3}" height="${size*2/3}" stroke="${secondaryColor}" stroke-width="2" fill="none" />
    <rect x="${size/3}" y="${size/3}" width="${size/3}" height="${size/3}" stroke="${secondaryColor}" stroke-width="2" fill="none" />
  `;
}

function generateChitengeFloralPattern(size: number, primaryColor: string, secondaryColor: string): string {
  return `
    <circle cx="${size/2}" cy="${size/2}" r="${size/4}" fill="${primaryColor}" opacity="0.3" />
    <circle cx="${size/2}" cy="${size/2}" r="${size/6}" fill="${secondaryColor}" opacity="0.5" />
    <circle cx="${size/2}" cy="${size/6}" r="${size/12}" fill="${secondaryColor}" />
    <circle cx="${size/2}" cy="${size*5/6}" r="${size/12}" fill="${secondaryColor}" />
    <circle cx="${size/6}" cy="${size/2}" r="${size/12}" fill="${secondaryColor}" />
    <circle cx="${size*5/6}" cy="${size/2}" r="${size/12}" fill="${secondaryColor}" />
  `;
}

function generateChitengeWavePattern(size: number, primaryColor: string, secondaryColor: string): string {
  return `
    <path d="M0,${size/2} Q${size/4},${size/4} ${size/2},${size/2} T${size},${size/2}" stroke="${primaryColor}" stroke-width="2" fill="none" />
    <path d="M0,${size*3/4} Q${size/4},${size/2} ${size/2},${size*3/4} T${size},${size*3/4}" stroke="${secondaryColor}" stroke-width="2" fill="none" />
    <path d="M0,${size/4} Q${size/4},0 ${size/2},${size/4} T${size},${size/4}" stroke="${secondaryColor}" stroke-width="2" fill="none" />
  `;
}

function generateChitengeSpiralPattern(size: number, primaryColor: string, secondaryColor: string): string {
  return `
    <path d="M${size/2},${size/2} m0,${-size/6} a${size/6},${size/6} 0 1,1 ${-size/8},${size/8} a${size/4},${size/4} 0 1,0 ${size/4},${size/4} a${size/3},${size/3} 0 1,1 ${-size/3},${size/3} a${size/2.5},${size/2.5} 0 1,0 ${size/2.5},${-size/5}" stroke="${primaryColor}" stroke-width="1.5" fill="none" />
    <circle cx="${size/6}" cy="${size/6}" r="${size/12}" stroke="${secondaryColor}" stroke-width="1" fill="none" />
    <circle cx="${size*5/6}" cy="${size/6}" r="${size/12}" stroke="${secondaryColor}" stroke-width="1" fill="none" />
    <circle cx="${size/6}" cy="${size*5/6}" r="${size/12}" stroke="${secondaryColor}" stroke-width="1" fill="none" />
    <circle cx="${size*5/6}" cy="${size*5/6}" r="${size/12}" stroke="${secondaryColor}" stroke-width="1" fill="none" />
    <circle cx="${size/2}" cy="${size/2}" r="${size/15}" fill="${primaryColor}" />
  `;
}

function generateNdebeleGeometricPattern(size: number, primaryColor: string, secondaryColor: string): string {
  return `
    <rect x="${size/10}" y="${size/10}" width="${size*8/10}" height="${size*8/10}" stroke="${primaryColor}" stroke-width="2" fill="none" />
    <rect x="${size/4}" y="${size/4}" width="${size/2}" height="${size/2}" stroke="${secondaryColor}" stroke-width="2" fill="none" />
    <line x1="${size/10}" y1="${size/10}" x2="${size/4}" y2="${size/4}" stroke="${primaryColor}" stroke-width="1.5" />
    <line x1="${size*9/10}" y1="${size/10}" x2="${size*3/4}" y2="${size/4}" stroke="${primaryColor}" stroke-width="1.5" />
    <line x1="${size/10}" y1="${size*9/10}" x2="${size/4}" y2="${size*3/4}" stroke="${primaryColor}" stroke-width="1.5" />
    <line x1="${size*9/10}" y1="${size*9/10}" x2="${size*3/4}" y2="${size*3/4}" stroke="${primaryColor}" stroke-width="1.5" />
  `;
}

function generateNdebeleZigzagPattern(size: number, primaryColor: string, secondaryColor: string): string {
  return `
    <polyline points="0,${size/4} ${size/5},${size/8} ${size*2/5},${size/4} ${size*3/5},${size/8} ${size*4/5},${size/4} ${size},${size/8}" stroke="${primaryColor}" stroke-width="2" fill="none" />
    <polyline points="0,${size*3/4} ${size/5},${size*5/8} ${size*2/5},${size*3/4} ${size*3/5},${size*5/8} ${size*4/5},${size*3/4} ${size},${size*5/8}" stroke="${primaryColor}" stroke-width="2" fill="none" />
    <polyline points="${size/4},0 ${size/8},${size/5} ${size/4},${size*2/5} ${size/8},${size*3/5} ${size/4},${size*4/5} ${size/8},${size}" stroke="${secondaryColor}" stroke-width="2" fill="none" />
    <polyline points="${size*3/4},0 ${size*5/8},${size/5} ${size*3/4},${size*2/5} ${size*5/8},${size*3/5} ${size*3/4},${size*4/5} ${size*5/8},${size}" stroke="${secondaryColor}" stroke-width="2" fill="none" />
  `;
}

function generateNdebeleTriangularPattern(size: number, primaryColor: string, secondaryColor: string): string {
  return `
    <path d="M${size/2},${size/10} L${size/10},${size*9/10} L${size*9/10},${size*9/10} Z" stroke="${primaryColor}" stroke-width="2" fill="none" />
    <path d="M${size/2},${size/4} L${size/4},${size*3/4} L${size*3/4},${size*3/4} Z" stroke="${secondaryColor}" stroke-width="1.5" fill="none" />
    <line x1="${size/5}" y1="${size/2}" x2="${size*4/5}" y2="${size/2}" stroke="${primaryColor}" stroke-width="1.5" />
    <line x1="${size/3}" y1="${size*2/3}" x2="${size*2/3}" y2="${size*2/3}" stroke="${secondaryColor}" stroke-width="1.5" />
  `;
}

function generateNdebeleStepPattern(size: number, primaryColor: string, secondaryColor: string): string {
  return `
    <path d="M${size/10},${size/10} H${size*3/10} V${size*3/10} H${size*5/10} V${size*5/10} H${size*7/10} V${size*7/10} H${size*9/10} V${size*9/10}" stroke="${primaryColor}" stroke-width="2" fill="none" />
    <path d="M${size*9/10},${size/10} V${size*3/10} H${size*7/10} V${size*5/10} H${size*5/10} V${size*7/10} H${size*3/10} V${size*9/10} H${size/10}" stroke="${secondaryColor}" stroke-width="2" fill="none" />
  `;
}

/**
 * Generates CSS for a pattern
 * @param config The pattern configuration
 * @returns CSS string for the pattern
 */
export function generatePatternCSS(config: PatternConfig | EnhancedPatternConfig): string {
  const { backgroundColor, opacity, size } = config;

  // Convert SVG to a data URL
  const svg = generatePatternSVG(config);
  const encodedSVG = encodeURIComponent(svg);
  const dataUrl = `url("data:image/svg+xml,${encodedSVG}")`;

  // Check if this is an enhanced pattern
  const isEnhanced = 'layers' in config && config.layers && config.layers.length > 0;

  let css = `
.custom-pattern {
  background-color: ${backgroundColor};
  background-image: ${dataUrl};
  background-size: ${size}px;
  background-repeat: repeat;
  opacity: ${opacity};
`;

  // Add transformations for enhanced patterns
  if (isEnhanced) {
    const transforms = [];

    if ((config as EnhancedPatternConfig).rotation) {
      transforms.push(`rotate(${(config as EnhancedPatternConfig).rotation}deg)`);
    }

    if ((config as EnhancedPatternConfig).scale && (config as EnhancedPatternConfig).scale !== 1) {
      transforms.push(`scale(${(config as EnhancedPatternConfig).scale})`);
    }

    if ((config as EnhancedPatternConfig).flipX) {
      transforms.push('scaleX(-1)');
    }

    if ((config as EnhancedPatternConfig).flipY) {
      transforms.push('scaleY(-1)');
    }

    if (transforms.length > 0) {
      css += `  transform: ${transforms.join(' ')};\n`;
      css += `  transform-origin: center;\n`;
    }

    // Add position adjustments
    if ((config as EnhancedPatternConfig).positionX || (config as EnhancedPatternConfig).positionY) {
      css += `  background-position: ${(config as EnhancedPatternConfig).positionX || 0}% ${(config as EnhancedPatternConfig).positionY || 0}%;\n`;
    }

    // Add blend mode
    if ((config as EnhancedPatternConfig).blendMode) {
      css += `  mix-blend-mode: ${(config as EnhancedPatternConfig).blendMode};\n`;
    }
  }

  css += `}`;

  // Add CSS for layers if this is an enhanced pattern with layers
  if (isEnhanced && (config as EnhancedPatternConfig).layers) {
    css += `\n\n/* Layer styles */\n`;

    (config as EnhancedPatternConfig).layers?.forEach((layer, index) => {
      const layerSvg = generatePatternSVG({
        ...layer,
        backgroundColor: 'transparent'
      });
      const layerEncodedSVG = encodeURIComponent(layerSvg);
      const layerDataUrl = `url("data:image/svg+xml,${layerEncodedSVG}")`;

      css += `
.custom-pattern-layer-${index + 1} {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: ${layerDataUrl};
  background-size: ${layer.size || size}px;
  background-repeat: repeat;
  opacity: ${layer.opacity};
`;

      // Add transformations for the layer
      const layerTransforms = [];

      if (layer.rotation) {
        layerTransforms.push(`rotate(${layer.rotation}deg)`);
      }

      if (layer.scale && layer.scale !== 1) {
        layerTransforms.push(`scale(${layer.scale})`);
      }

      if (layer.flipX) {
        layerTransforms.push('scaleX(-1)');
      }

      if (layer.flipY) {
        layerTransforms.push('scaleY(-1)');
      }

      if (layerTransforms.length > 0) {
        css += `  transform: ${layerTransforms.join(' ')};\n`;
        css += `  transform-origin: center;\n`;
      }

      // Add position adjustments
      if (layer.positionX || layer.positionY) {
        css += `  background-position: ${layer.positionX || 0}% ${layer.positionY || 0}%;\n`;
      }

      // Add blend mode
      if (layer.blendMode) {
        css += `  mix-blend-mode: ${layer.blendMode};\n`;
      }

      css += `}\n`;
    });

    // Add usage example
    css += `
/* Usage example with layers */
.pattern-container {
  position: relative;
  background-color: ${backgroundColor};
}

.pattern-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: ${dataUrl};
  background-size: ${size}px;
  background-repeat: repeat;
  opacity: ${opacity};
}

/* Add each layer as a pseudo-element or child div */
`;
  }

  return css.trim();
}
