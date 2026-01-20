import fs from 'fs';
import path from 'path';

interface Options {
    rootName?: string;
    output?: string;
    indent?: string;
}

/**
 * Capitalize first letter
 */
function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Deep merge two objects, keeping all keys (union for optional fields)
 */
function deepMerge(a: any, b: any): any {
    if (Array.isArray(a) && Array.isArray(b)) {
        return [...a, ...b]; // for arrays, just merge contents
    } else if (typeof a === 'object' && typeof b === 'object' && a && b) {
        const merged: any = { ...a };
        for (const key of Object.keys(b)) {
            if (merged.hasOwnProperty(key)) {
                merged[key] = deepMerge(merged[key], b[key]);
            } else {
                merged[key] = b[key];
            }
        }
        return merged;
    }
    return a !== undefined ? a : b;
}

/**
 * Recursively convert JSON object to TypeScript interfaces
 */
function jsonToTS(
    obj: any,
    name: string,
    indent = '  ',
    processed = new Set<string>()
): string {
    let ts = '';
    if (Array.isArray(obj)) {
        if (obj.length > 0 && typeof obj[0] === 'object' && obj[0] !== null) {
            return jsonToTS(obj[0], name, indent, processed);
        }
        return '';
    }

    if (typeof obj !== 'object' || obj === null) return '';

    if (processed.has(name)) return '';
    processed.add(name);

    let childInterfaces = '';
    let fields = '';

    for (const key of Object.keys(obj)) {
        // Skip keys that start with "room" or "dweller" and end with a number
        if (/^(room|dweller).*\d$/.test(key)) {
            console.log(`Skipping key ${key}`);
            continue;
        }
        const val = obj[key];
        const optional = val === null || val === undefined ? '?' : '';
        const propName = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key) ? key : `"${key}"`;

        if (Array.isArray(val)) {
            // determine base type and array depth
            let depth = 0;
            let cur: any = val;
            while (Array.isArray(cur)) {
                depth++;
                cur = cur.length > 0 ? cur[0] : undefined;
            }

            if (cur && typeof cur === 'object' && !Array.isArray(cur)) {
                // array of objects (possibly nested) -> create child interface for the object
                const childName = capitalize(key) + 'Item';
                // Skip interfaces that start with Room/Dweller and end with a number
                if (/^(Room|Dweller).*\d$/.test(childName)) {
                    console.log(`Skipping interface generation for ${childName}`);
                    fields += `${indent}${propName}${optional}: any${'[]'.repeat(depth)};\n`;
                } else {
                    childInterfaces += jsonToTS(cur, childName, indent, processed);
                    fields += `${indent}${propName}${optional}: ${childName}${'[]'.repeat(depth)};\n`;
                }
            } else {
                const baseType = cur === undefined || cur === null ? 'any' : typeof cur;
                fields += `${indent}${propName}${optional}: ${baseType}${'[]'.repeat(depth)};\n`;
            }
        } else if (typeof val === 'object' && val !== null) {
            const childName = capitalize(key);
            // Skip object keys that start with Room/Dweller
            if (/^(Room|Dweller)/.test(childName)) {
                fields += `${indent}${propName}${optional}: any;\n`;
            } else {
                childInterfaces += jsonToTS(val, childName, indent, processed);
                fields += `${indent}${propName}${optional}: ${childName};\n`;
            }
        } else {
            const typeName = val === null ? 'any' : typeof val;
            fields += `${indent}${propName}${optional}: ${typeName};\n`;
        }
    }

    ts += childInterfaces;
    ts += `export interface ${name} {\n`;
    ts += fields;
    ts += `}\n\n`;

    return ts;
}

/**
 * Load and merge multiple JSON saves
 */
function loadAndMergeSaves(saveFiles: string[]): any {
    let merged: any = {};
    for (const file of saveFiles) {
        const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
        merged = deepMerge(merged, data);
    }
    return merged;
}

/**
 * Generate TypeScript interfaces for multiple saves
 */
function generateMergedTypes(
    saveFiles: string[],
    options: Options = { rootName: 'SaveFile', output: 'saveTypes.ts', indent: '  ' }
) {
    const merged = loadAndMergeSaves(saveFiles);
    const ts = jsonToTS(merged, options.rootName || 'SaveFile', options.indent);
    fs.writeFileSync(options.output || 'saveTypes.ts', ts);
    // export type alias for top-level interface
    fs.appendFileSync(
        options.output || 'saveTypes.ts',
        `export type FalloutShelterSave = ${options.rootName || 'SaveFile'};\n`
    );
    console.log(`Merged TypeScript interfaces generated at ${options.output || 'saveTypes.ts'}`);
}

// Run: npx ts-node generateMergedSaveTypes.ts
const savesDir = path.resolve('./public/examples');
const saveFiles = fs.readdirSync(savesDir)
    .filter(f => f.endsWith('.json'))
    .map(f => path.join(savesDir, f));

generateMergedTypes(saveFiles, {
    rootName: 'maxBaseVault',
    output: 'src/types/saveFile.ts'
});
