// optimize-svgs.ts
import { optimize, type Config } from 'svgo';
import { promises as fs } from 'fs';
import path from 'path';

const SVG_DIRECTORY = 'src/lib/components/core/icons/icons';

const config: Config = {
  multipass: true,
  plugins: ['preset-default'],
};

const optimizeSvgs = async (): Promise<void> => {
  try {
    const files: string[] = await fs.readdir(SVG_DIRECTORY);
    const svgFiles: string[] = files.filter((file) => {
      return path.extname(file).toLowerCase() === '.svg';
    });

    console.log(`found ${svgFiles.length} svg files to optimize`);

    for (const file of svgFiles) {
      const filePath: string = path.join(SVG_DIRECTORY, file);
      const svg: string = await fs.readFile(filePath, 'utf8');

      const result = optimize(svg, {
        path: filePath,
        ...config,
      });

      if ('data' in result) {
        await fs.writeFile(filePath, result.data);
      } else {
        console.error(`failed to optimize ${file}`);
      }
    }

    console.log('svg optimization complete');
  } catch (error) {
    console.error('error optimizing svgs:', error instanceof Error ? error.message : error);
  }
};

optimizeSvgs();
